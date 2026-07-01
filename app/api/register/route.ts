import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import type { Member } from '@/types'

interface RegisterPayload {
  teamName: string
  members:  Member[]
}

const trim = (v: unknown, max = 255): string =>
  typeof v === 'string' ? v.trim().slice(0, max) : ''

export async function POST(req: NextRequest) {
  let payload: RegisterPayload
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const teamName = trim(payload.teamName)
  const members  = Array.isArray(payload.members) ? payload.members : []

  if (!teamName) {
    return NextResponse.json({ error: 'Team name is required' }, { status: 400 })
  }
  if (members.length < 1 || members.length > 5) {
    return NextResponse.json({ error: 'Team must have 1–5 members' }, { status: 400 })
  }

  for (const m of members) {
    if (!trim(m.fullName) || !trim(m.studentId) || !trim(m.contactNumber)) {
      return NextResponse.json({ error: 'fullName, studentId and contactNumber are required for every member' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trim(m.email))) {
      return NextResponse.json({ error: `Invalid email: ${trim(m.email)}` }, { status: 400 })
    }
  }

  try {
    const db = getDb()

    const insertTeam = db.prepare(
      'INSERT INTO registrations (teamName, memberCount) VALUES (?, ?)'
    )
    const insertMember = db.prepare(`
      INSERT INTO members
        (registrationId, fullName, studentId, email, contactNumber, whatsappNumber, isLeader)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)

    const run = db.transaction(() => {
      const { lastInsertRowid } = insertTeam.run(teamName, members.length)
      members.forEach((m, i) => {
        insertMember.run(
          lastInsertRowid,
          trim(m.fullName),
          trim(m.studentId),
          trim(m.email).toLowerCase(),
          trim(m.contactNumber),
          trim(m.whatsappNumber ?? ''),
          i === 0 ? 1 : 0  // first member is the team leader
        )
      })
      return lastInsertRowid
    })

    const registrationId = run()
    return NextResponse.json({ success: true, registrationId }, { status: 201 })
  } catch (err) {
    console.error('[/api/register]', err)
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 })
  }
}
