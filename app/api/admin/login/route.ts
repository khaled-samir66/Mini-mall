import { NextResponse } from "next/server"
import { makeSession, sessionCookie } from "@/lib/auth"

export async function POST(request: Request) {
  const { email, password } = await request.json()

  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminEmail || !adminPassword) {
    return NextResponse.json(
      { error: "إعدادات المدير غير موجودة" },
      { status: 500 }
    )
  }

  if (String(email).trim() !== adminEmail || String(password) !== adminPassword) {
    return NextResponse.json(
      { error: "البريد أو كلمة المرور غير صحيحة" },
      { status: 401 }
    )
  }

  const response = NextResponse.json({ ok: true })

  response.cookies.set(sessionCookie, makeSession(adminEmail), {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
  })

  return response
}
