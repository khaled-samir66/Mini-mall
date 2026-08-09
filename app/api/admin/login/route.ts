import { NextResponse } from "next/server"
import { makeSession, sessionCookie } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        { error: "إعدادات المدير غير موجودة في Environment Variables" },
        { status: 500 }
      )
    }

    if (
      String(email).trim() !== String(adminEmail).trim() ||
      String(password) !== String(adminPassword)
    ) {
      return NextResponse.json(
        { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" },
        { status: 401 }
      )
    }

    const token = makeSession(adminEmail)

    const response = NextResponse.json({
      ok: true,
      authenticated: true,
    })

    response.cookies.set(
      sessionCookie(token)
    )

    return response
  } catch (error) {
    console.error("Admin login error:", error)

    return NextResponse.json(
      { error: "حدث خطأ أثناء تسجيل الدخول" },
      { status: 500 }
    )
  }
}
