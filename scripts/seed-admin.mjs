// Creates (or reports) the admin login user in data/pandora.db
// Run: npm run seed:admin
import dotenv from 'dotenv'
import path from 'node:path'
import fs from 'node:fs'
import Database from 'better-sqlite3'
import bcrypt from 'bcryptjs'

// Next.js convention: .env.local overrides .env
dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

const email    = (process.env.ADMIN_EMAIL    ?? 'admin@pandora.lk').toLowerCase().trim()
const password =  process.env.ADMIN_PASSWORD ?? ''

if (password.length < 8) {
  console.error('Set ADMIN_PASSWORD in .env.local (minimum 8 characters).')
  process.exit(1)
}

const dataDir = path.join(process.cwd(), 'data')
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })

const db = new Database(path.join(dataDir, 'pandora.db'))
db.pragma('journal_mode = WAL')
db.exec(`
  CREATE TABLE IF NOT EXISTS admin_users (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    email        TEXT UNIQUE NOT NULL,
    passwordHash TEXT NOT NULL,
    role         TEXT NOT NULL DEFAULT 'admin',
    createdAt    TEXT NOT NULL DEFAULT (datetime('now'))
  );
`)

const existing = db.prepare('SELECT id FROM admin_users WHERE email = ?').get(email)
if (existing) {
  console.log(`Admin "${email}" already exists — no changes made.`)
  process.exit(0)
}

const hash = bcrypt.hashSync(password, 12)
db.prepare('INSERT INTO admin_users (email, passwordHash, role) VALUES (?, ?, ?)')
  .run(email, hash, 'super')

console.log(`Created admin user: ${email}`)
process.exit(0)
