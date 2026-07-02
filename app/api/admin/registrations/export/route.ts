import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Registration from '@/models/Registration'

function csv(value: unknown): string {
  const str = String(value ?? '')
  return str.includes(',') || str.includes('"') || str.includes('\n')
    ? `"${str.replace(/"/g, '""')}"`
    : str
}

export async function GET() {
  await connectDB()

  const registrations = await Registration.find().sort({ createdAt: -1 }).lean()

  const headers = [
    'Team Name', 'Member Count', 'Registered At',
    'Full Name', 'Student ID', 'Email', 'Contact Number', 'WhatsApp Number',
  ]

  const rows: string[] = [headers.map(csv).join(',')]

  for (const reg of registrations) {
    for (const member of reg.members) {
      rows.push([
        reg.teamName,
        reg.memberCount,
        new Date(reg.createdAt).toISOString(),
        member.fullName,
        member.studentId,
        member.email,
        member.contactNumber,
        member.whatsappNumber,
      ].map(csv).join(','))
    }
  }

  const date = new Date().toISOString().split('T')[0]

  return new NextResponse(rows.join('\n'), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="builderthan-registrations-${date}.csv"`,
    },
  })
}
