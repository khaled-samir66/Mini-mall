import crypto from "crypto"
import { cookies } from "next/headers"

export const sessionCookie = "admin_session"

function getSecret() {
  const secret = process.env.SESSION_SECRET

  if (!secret) {
    throw new Error("SESSION_SECRET is missing")
  }

  return secret
}

export function makeSession(email: string) {
  const payload = Buffer.from(
    JSON.stringify({
      email,
      exp: Date.now() + 1000 * 60 * 60 * 24 * 7,
    })
  ).toString("base64url")

  const signature = crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url")

  return `${payload}.${signature}`
}

export function verifySession(token?: string | null) {
  if (!token) return null

  try {
    const [payload, signature] = token.split(".")

    if (!payload || !signature) return null

    const expected = crypto
      .createHmac("sha256", getSecret())
      .update(payload)
      .digest("base64url")

    if (
      !crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expected)
      )
    ) {
      return null
    }

    const data = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    )

    if (!data.email || !data.exp) return null

    if (Date.now() > data.exp) return null

    return {
      email: String(data.email),
    }
  } catch {
    return null
  }
}

export async function getAdminEmail() {
  const cookieStore = await cookies()
  const token = cookieStore.get(sessionCookie)?.value

  const session = verifySession(token)

  return session?.email ?? null
}
