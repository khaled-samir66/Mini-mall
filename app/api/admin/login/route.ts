import { NextResponse } from "next/server"
import { makeSession, sessionCookie } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const email = String(body.email || "").trim()
    const password = String(body.password || "")

    const adminEmail = String(process.env.ADMIN_EMAIL || "").trim()
    const adminPassword = String(process.env.ADMIN_PASSWORD || "")

    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        { error: "إعدادات المدير غير موجودة في Environment Variables" },
        { status: 500 }
      )
    }

    if (email !== adminEmail || password !== adminPassword) {
      return NextResponse.json(
        { error: "البريد أو كلمة المرور غير صحيحة" },
        { status: 401 }
      )
    }

    const token = makeSession(adminEmail)

    const response = NextResponse.json({
      ok: true,
    })

    response.cookies.set({
      name: sessionCookie,
      value: token,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (error) {
    console.error("LOGIN_ERROR", error)

    return NextResponse.json(
      { error: "حدث خطأ أثناء تسجيل الدخول" },
      { status: 500 }
    )
  }
}
