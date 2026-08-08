import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { makeSession, sessionCookie } from "@/lib/auth"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const { email, password } = await request.json()
  if (!email || !password) return NextResponse.json({ error: "أدخل البريد وكلمة المرور" }, { status: 400 })
  const [rows]: any = await db.execute("SELECT email, password_hash FROM admins WHERE email=? LIMIT 1", [String(email).trim().toLowerCase()])
  const admin = rows[0]
  if (!admin || !(await bcrypt.compare(String(password), admin.password_hash))) {
    return NextResponse.json({ error: "بيانات الدخول غير صحيحة" }, { status: 401 })
  }
  const response = NextResponse.json({ ok: true })
  response.cookies.set(sessionCookie(admin.email))
  return response
}
