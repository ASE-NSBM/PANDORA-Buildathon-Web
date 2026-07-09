import { google } from 'googleapis'

interface MemberRow {
  fullName?: string
  studentId?: string
  email?: string
  contactNumber?: string
  whatsappNumber?: string
}

interface RegistrationRow {
  teamName: string
  memberCount: number
  members: MemberRow[]
  createdAt?: string | Date
}

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID
const SHEET_NAME = process.env.GOOGLE_SHEETS_SHEET_NAME || 'Sheet1'

// Widest possible layout: team fields + 4 members × 5 fields each.
const HEADER = [
  'Timestamp',
  'Team Name',
  'Members',
  ...Array.from({ length: 4 }, (_, i) => {
    const n = i + 1
    return [`M${n} Name`, `M${n} Student ID`, `M${n} Email`, `M${n} Contact`, `M${n} WhatsApp`]
  }).flat(),
]

function getAuth() {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY

  if (!clientEmail || !privateKey || !SPREADSHEET_ID) return null

  return new google.auth.JWT({
    email: clientEmail,
    // Support both raw newlines and \n-escaped keys (common in .env / Vercel).
    key: privateKey.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
}

function toRow(reg: RegistrationRow): (string | number)[] {
  const timestamp = reg.createdAt ? new Date(reg.createdAt).toISOString() : new Date().toISOString()
  const memberCells = reg.members.flatMap((m) => [
    m.fullName ?? '',
    m.studentId ?? '',
    m.email ?? '',
    m.contactNumber ?? '',
    m.whatsappNumber ?? '',
  ])
  return [timestamp, reg.teamName, reg.memberCount, ...memberCells]
}

/**
 * Append a registration to the configured Google Sheet. Best-effort: any
 * failure (missing config, auth error, API error) is logged and swallowed so
 * it never blocks the primary MongoDB write. Writes a header row first if the
 * sheet is empty.
 */
export async function appendRegistrationToSheet(reg: RegistrationRow): Promise<void> {
  const auth = getAuth()
  if (!auth) {
    console.warn('[sheets] Google Sheets not configured — skipping append.')
    return
  }

  try {
    const sheets = google.sheets({ version: 'v4', auth })

    // Ensure a header row exists (only writes when the sheet is empty).
    const existing = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1:A1`,
    })
    if (!existing.data.values || existing.data.values.length === 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A1`,
        valueInputOption: 'RAW',
        requestBody: { values: [HEADER] },
      })
    }

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [toRow(reg)] },
    })
  } catch (err) {
    console.error('[sheets] Failed to append registration:', err)
  }
}

/**
 * Replace the sheet's contents with the header plus every provided
 * registration. Used to backfill/re-sync all existing records at once.
 * Throws on failure so the caller can report the error (unlike the
 * best-effort single append).
 */
export async function syncAllRegistrationsToSheet(
  regs: RegistrationRow[],
): Promise<{ synced: number }> {
  const auth = getAuth()
  if (!auth) {
    throw new Error(
      'Google Sheets is not configured. Set GOOGLE_SHEETS_CLIENT_EMAIL, GOOGLE_SHEETS_PRIVATE_KEY and GOOGLE_SHEETS_SPREADSHEET_ID.',
    )
  }

  const sheets = google.sheets({ version: 'v4', auth })

  // Wipe existing values (keeps the tab/formatting) then write header + rows.
  await sheets.spreadsheets.values.clear({
    spreadsheetId: SPREADSHEET_ID,
    range: SHEET_NAME,
  })

  const values = [HEADER, ...regs.map(toRow)]
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A1`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values },
  })

  return { synced: regs.length }
}
