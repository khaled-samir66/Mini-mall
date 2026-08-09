import { NextResponse } from "next/server"
import { sessionCookie } from "@/lib/auth"

export async function POST() {
  const response = NextResponse.json({
    ok: true,
  })

  response.cookies.set({
    name: sessionCookie,
    value: "",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })

  return response
}
