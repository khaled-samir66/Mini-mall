import bcrypt from "bcryptjs"
import pg from "pg"
const { Pool } = pg

const { DATABASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env
if (!DATABASE_URL || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  throw new Error("Set DATABASE_URL, ADMIN_EMAIL and ADMIN_PASSWORD first.")
}
const db = new Pool({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } })
const hash = await bcrypt.hash(ADMIN_PASSWORD, 12)
await db.query(
  `INSERT INTO admins (email, password_hash) VALUES ($1, $2)
   ON CONFLICT (email) DO UPDATE SET password_hash=EXCLUDED.password_hash`,
  [ADMIN_EMAIL.toLowerCase(), hash],
)
await db.end()
console.log("Admin created/updated:", ADMIN_EMAIL)
