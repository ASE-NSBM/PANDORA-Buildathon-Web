import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Registration from '@/models/Registration'
import { appendRegistrationToSheet } from '@/lib/googleSheets'

interface MemberInput {
  fullName?: string;
  studentId?: string;
  email?: string;
  contactNumber?: string;
  whatsappNumber?: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneRegex = /^(\+94|0)\d{9}$/

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function fail(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status })
}

export async function POST(req: Request) {
  try {
    await connectDB()

    const body = await req.json()
    const { teamName, memberCount, members } = body

    // ── Basic shape validation ──────────────────────────────────────────
    if (!teamName?.trim()) return fail('Team name is required.')

    if (!Array.isArray(members) || members.length === 0)
      return fail('At least one member is required.')

    if (memberCount !== members.length)
      return fail('Member count does not match the number of members provided.')

    // ── Intra-team duplicate check ──────────────────────────────────────
    const submittedEmails    = members.map((m: MemberInput) => m.email?.toLowerCase?.() ?? '')
    const submittedStudentIds = members.map((m: MemberInput) => m.studentId?.trim?.() ?? '')

    const uniqueEmails     = new Set(submittedEmails)
    const uniqueStudentIds = new Set(submittedStudentIds)

    if (uniqueEmails.size !== submittedEmails.length)
      return fail('Two or more members share the same email address.')

    if (uniqueStudentIds.size !== submittedStudentIds.length)
      return fail('Two or more members share the same student ID.')

    // ── Per-member field validation ─────────────────────────────────────
    for (const member of members) {
      if (!member.fullName?.trim())
        return fail('Full name is required for every member.')

      if (!member.studentId?.trim())
        return fail('Student ID is required for every member.')

      if (!emailRegex.test(member.email))
        return fail(`Invalid email: ${member.email}`)

      if (!phoneRegex.test(member.contactNumber))
        return fail(`Invalid contact number for ${member.fullName}`)

      if (!phoneRegex.test(member.whatsappNumber))
        return fail(`Invalid WhatsApp number for ${member.fullName}`)
    }

    // ── Duplicate team name check (case-insensitive) ────────────────────
    const existingTeam = await Registration.findOne({
      teamName: { $regex: `^${escapeRegex(teamName.trim())}$`, $options: 'i' },
    })
    if (existingTeam) return fail('Team name is already taken. Choose a different name.')

    // ── Cross-team duplicate email check ───────────────────────────────
    const existingEmail = await Registration.findOne({
      'members.email': { $in: submittedEmails },
    })
    if (existingEmail)
      return fail('One or more email addresses are already registered in another team.')

    // ── Cross-team duplicate student ID check ──────────────────────────
    const existingStudentId = await Registration.findOne({
      'members.studentId': { $in: submittedStudentIds },
    })
    if (existingStudentId)
      return fail('One or more student IDs are already registered in another team.')

    // ── Save ───────────────────────────────────────────────────────────
    const registration = await Registration.create(body)

    // Mirror to Google Sheets (best-effort — never blocks the response).
    await appendRegistrationToSheet({ teamName, memberCount, members })

    return NextResponse.json({ success: true, registration })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, message: 'Registration failed.' }, { status: 500 })
  }
}
