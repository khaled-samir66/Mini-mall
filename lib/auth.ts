import { createHmac, timingSafeEqual } from "node:crypto"
import { cookies } from "next/headers"

const COOKIE = "olad_harb_admin"
const TTL = 60 * 60 * 24 * 7

function secret() {
  return process.env.SESSION_SECRET || "change-this-secret-before-production"
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex")
}

function tokenFor(email: string, expires: number) {
  const value = `${email}|${expires}`
  return `${Buffer.from(value).toString("base64url")}.${sign(value)}`
}

export function makeSession(email: string) {
  return tokenFor(email, Math.floor(Date.now() / 1000) + TTL)
}

export function verifySession(token?: string) {
  if (!token) return null
  const [encoded, signature] = token.split(".")
  if (!encoded || !signature) return null
  try {
    const value = Buffer.from(encoded, "base64url").toString("utf8")
    const expected = sign(value)
    if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null
    const [email, expiresText] = value.split("|")
    if (!email || Number(expiresText) < Math.floor(Date.now() / 1000)) return null
    return email
  } catch {
    return null
  }
}

export async function getAdminEmail() {
  const store = await cookies()
  return verifySession(store.get(COOKIE)?.value)
}

export function sessionCookie(value: string) {
  return {
    name: COOKIE,
    value,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  }
}


export function clearSessionCookie() {
  return {
    name: COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  }
}
export function sessionCookie(value: string) {
  return {
    name: COOKIE,
    value,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: true,
    path: "/",
    maxAge: TTL,
  }
}
