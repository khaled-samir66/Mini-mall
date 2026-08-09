import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sessionCookie, verifySession } from "@/lib/auth"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(sessionCookie)?.value

    const session = verifySession(token)

    if (!session) {
      return NextResponse.json({
        authenticated: false,
        email: "",
      })
    }

    return NextResponse.json({
      authenticated: true,
      email: session.email,
    })
  } catch (error) {
    console.error("ME_ERROR", error)

    return NextResponse.json({
      authenticated: false,
      email: "",
    })
  }
}
