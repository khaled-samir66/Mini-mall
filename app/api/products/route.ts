import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getAdminEmail } from "@/lib/auth"

export const runtime = "nodejs"

function normalize(row: any) {
  return {
    id: String(row.id),
    name: row.name,
    category: row.category,
    price: row.price == null ? "" : String(row.price),
    oldPrice: row.old_price == null ? undefined : String(row.old_price),
    desc: row.description || undefined,
    image: row.image || undefined,
  }
}

export async function GET() {
  const { rows } = await db.query("SELECT id, name, category, price, old_price, description, image FROM products ORDER BY id DESC")
  return NextResponse.json(rows.map(normalize))
}

export async function POST(request: Request) {
  if (!(await getAdminEmail())) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  const body = await request.json()
  if (!body.name?.trim() || !body.category) return NextResponse.json({ error: "اسم المنتج والقسم مطلوبان" }, { status: 400 })
  const { rows } = await db.query(
    "INSERT INTO products (name, category, price, old_price, description, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, category, price, old_price, description, image",
    [body.name.trim(), body.category, body.price || null, body.oldPrice || null, body.desc?.trim() || null, body.image?.trim() || null],
  )
  return NextResponse.json(normalize(rows[0]), { status: 201 })
}

export async function PUT(request: Request) {
  if (!(await getAdminEmail())) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  const body = await request.json()
  if (!body.id || !body.name?.trim() || !body.category) return NextResponse.json({ error: "بيانات المنتج غير مكتملة" }, { status: 400 })
  await db.query(
    "UPDATE products SET name=$1, category=$2, price=$3, old_price=$4, description=$5, image=$6, updated_at=NOW() WHERE id=$7",
    [body.name.trim(), body.category, body.price || null, body.oldPrice || null, body.desc?.trim() || null, body.image?.trim() || null, body.id],
  )
  return NextResponse.json({ ok: true })
}

export async function DELETE(request: Request) {
  if (!(await getAdminEmail())) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  const body = await request.json()
  if (body.all) await db.query("DELETE FROM products")
  else await db.query("DELETE FROM products WHERE id=$1", [body.id])
  return NextResponse.json({ ok: true })
}
