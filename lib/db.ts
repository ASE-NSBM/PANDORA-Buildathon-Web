import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const DATA_DIR = path.join(process.cwd(), 'data')
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })

let _db: Database.Database | null = null

export function getDb(): Database.Database {
  if (_db) return _db

  _db = new Database(path.join(DATA_DIR, 'pandora.db'))
  _db.pragma('journal_mode = WAL')
  _db.pragma('foreign_keys = ON')

  _db.exec(`
    CREATE TABLE IF NOT EXISTS registrations (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      teamName    TEXT    NOT NULL,
      memberCount INTEGER NOT NULL DEFAULT 1,
      status      TEXT    NOT NULL DEFAULT 'pending',
      notes       TEXT,
      createdAt   TEXT    NOT NULL DEFAULT (datetime('now')),
      updatedAt   TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS members (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      registrationId INTEGER NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
      fullName       TEXT NOT NULL,
      studentId      TEXT NOT NULL,
      email          TEXT NOT NULL,
      contactNumber  TEXT NOT NULL,
      whatsappNumber TEXT,
      isLeader       INTEGER NOT NULL DEFAULT 0,
      createdAt      TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      email        TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL,
      role         TEXT NOT NULL DEFAULT 'admin',
      createdAt    TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `)

  return _db
}

// ── Row types ──────────────────────────────────────────────
export interface RegistrationRow {
  id: number
  teamName: string
  memberCount: number
  status: 'pending' | 'confirmed' | 'rejected'
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface MemberRow {
  id: number
  registrationId: number
  fullName: string
  studentId: string
  email: string
  contactNumber: string
  whatsappNumber: string | null
  isLeader: number
  createdAt: string
}

export interface AdminUserRow {
  id: number
  email: string
  passwordHash: string
  role: string
  createdAt: string
}

// ── Queries ────────────────────────────────────────────────
export function listRegistrations(search = ''): (RegistrationRow & { leader: string })[] {
  const db = getDb()
  const like = `%${search}%`
  return db
    .prepare(
      `SELECT r.*,
              (SELECT m.fullName FROM members m
               WHERE m.registrationId = r.id AND m.isLeader = 1 LIMIT 1) AS leader
       FROM registrations r
       WHERE (@s = '' OR r.teamName LIKE @like OR r.status LIKE @like)
       ORDER BY r.createdAt DESC`
    )
    .all({ s: search, like }) as (RegistrationRow & { leader: string })[]
}

export function getRegistration(id: number): RegistrationRow | undefined {
  return getDb()
    .prepare('SELECT * FROM registrations WHERE id = ?')
    .get(id) as RegistrationRow | undefined
}

export function getMembers(registrationId: number): MemberRow[] {
  return getDb()
    .prepare('SELECT * FROM members WHERE registrationId = ? ORDER BY isLeader DESC, id ASC')
    .all(registrationId) as MemberRow[]
}

export function updateRegistration(id: number, status: string, notes: string): void {
  getDb()
    .prepare(
      `UPDATE registrations
       SET status = ?, notes = ?, updatedAt = datetime('now')
       WHERE id = ?`
    )
    .run(status, notes, id)
}

export function getAdminByEmail(email: string): AdminUserRow | undefined {
  return getDb()
    .prepare('SELECT * FROM admin_users WHERE email = ?')
    .get(email.toLowerCase().trim()) as AdminUserRow | undefined
}

export function countStats() {
  const db = getDb()
  const total     = (db.prepare('SELECT COUNT(*) c FROM registrations').get()          as { c: number }).c
  const pending   = (db.prepare("SELECT COUNT(*) c FROM registrations WHERE status='pending'").get()   as { c: number }).c
  const confirmed = (db.prepare("SELECT COUNT(*) c FROM registrations WHERE status='confirmed'").get() as { c: number }).c
  const members   = (db.prepare('SELECT COUNT(*) c FROM members').get()                as { c: number }).c
  return { total, pending, confirmed, members }
}
