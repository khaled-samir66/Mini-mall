"use client"

import { useEffect, useState, type FormEvent } from "react"
import { CATEGORIES, money, type Product } from "@/lib/store"
import { LogIn, LogOut, Plus, Pencil, Trash2 } from "lucide-react"

const EMPTY = { id: "", name: "", category: "", price: "", oldPrice: "", desc: "", image: "" }

export default function AdminPage() {
  const [auth, setAuth] = useState(false)
  const [email, setEmail] = useState("")
  const [loginEmail, setLoginEmail] = useState("")
  const [password, setPassword] = useState("")
  const [form, setForm] = useState(EMPTY)
  const [products, setProducts] = useState<Product[]>([])
  const [notice, setNotice] = useState("")
  const [busy, setBusy] = useState(false)

  async function load() {
    const me = await fetch("/api/admin/me", { cache: "no-store" }).then(r => r.json())
    setAuth(me.authenticated)
    setEmail(me.email || "")
    if (me.authenticated) setProducts(await fetch("/api/products", { cache: "no-store" }).then(r => r.json()))
  }
  useEffect(() => { load() }, [])

  async function login(e: FormEvent) {
    e.preventDefault(); setBusy(true); setNotice("")
    const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: loginEmail, password }) })
    const data = await r.json(); setBusy(false)
    if (!r.ok) return setNotice(data.error || "تعذر تسجيل الدخول")
    setPassword(""); await load()
  }

  async function save(e: FormEvent) {
    e.preventDefault(); setBusy(true); setNotice("")
    const method = form.id ? "PUT" : "POST"
    const r = await fetch("/api/products", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
    const data = await r.json(); setBusy(false)
    if (!r.ok) return setNotice(data.error || "حدث خطأ")
    setForm(EMPTY); setNotice(form.id ? "تم تعديل المنتج." : "تمت إضافة المنتج."); await load()
  }

  async function remove(id: string) {
    if (!confirm("هل تريد حذف هذا المنتج؟")) return
    await fetch("/api/products", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })
    await load()
  }

  async function clearAll() {
    if (!confirm("سيتم حذف جميع المنتجات. هل أنت متأكد؟")) return
    await fetch("/api/products", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ all: true }) })
    await load()
  }

  async function logout() { await fetch("/api/admin/logout", { method: "POST" }); setAuth(false); setProducts([]) }

  if (!auth) return <main className="min-h-screen bg-[#f7f9f8] px-5 py-12"><div className="mx-auto max-w-md rounded-3xl bg-white p-7 shadow-sm"><h1 className="text-3xl font-extrabold">دخول لوحة الإدارة</h1><p className="mt-2 text-muted-foreground">هذه الصفحة للمدير فقط.</p><form onSubmit={login} className="mt-6 grid gap-3"><input className="rounded-xl border p-3.5" type="email" placeholder="البريد الإلكتروني" required value={loginEmail} onChange={e=>setLoginEmail(e.target.value)} /><input className="rounded-xl border p-3.5" type="password" placeholder="كلمة المرور" required value={password} onChange={e=>setPassword(e.target.value)} /><button disabled={busy} className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-green px-5 font-extrabold text-white disabled:opacity-60"><LogIn size={18}/> دخول</button>{notice && <p className="font-bold text-red-600">{notice}</p>}</form></div></main>

  return <main className="min-h-screen bg-[#f7f9f8] px-4 py-8 md:px-8"><div className="mx-auto max-w-6xl"><div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div><span className="font-bold text-brand-green">لوحة الإدارة</span><h1 className="text-3xl font-extrabold">إدارة المنتجات</h1><p className="text-sm text-muted-foreground">مسجل الدخول: {email}</p></div><button onClick={logout} className="flex items-center gap-2 rounded-xl border bg-white px-4 py-2 font-bold"><LogOut size={17}/> خروج</button></div><div className="grid gap-6 lg:grid-cols-[380px_1fr]"><form onSubmit={save} className="grid gap-3 rounded-3xl bg-white p-5 shadow-sm"><h2 className="text-xl font-extrabold">{form.id ? "تعديل المنتج" : "إضافة منتج"}</h2>{([['name','اسم المنتج'],['price','السعر بالجنيه'],['oldPrice','السعر قبل الخصم'],['desc','وصف مختصر'],['image','رابط صورة المنتج']] as const).map(([k,p])=><input key={k} className="rounded-xl border p-3.5" type={k==='price'||k==='oldPrice'?'number':k==='image'?'url':'text'} placeholder={p} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} required={k==='name'}/>)}<select className="rounded-xl border p-3.5" required value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}><option value="">اختر القسم</option>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select><button disabled={busy} className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-yellow font-extrabold disabled:opacity-60">{form.id?<Pencil size={18}/>:<Plus size={18}/>} {form.id?'حفظ التعديل':'إضافة المنتج'}</button>{form.id&&<button type="button" onClick={()=>setForm(EMPTY)} className="rounded-xl border p-3 font-bold">إلغاء التعديل</button>}{notice&&<p className="font-bold text-brand-green">{notice}</p>}</form><section className="rounded-3xl bg-white p-5 shadow-sm"><div className="mb-4 flex items-center justify-between gap-2"><h2 className="text-xl font-extrabold">المنتجات ({products.length})</h2>{products.length>0&&<button onClick={clearAll} className="flex items-center gap-1 rounded-xl border px-3 py-2 text-sm font-bold text-red-600"><Trash2 size={16}/> حذف الكل</button>}</div><div className="grid gap-3">{products.map(p=><div key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4"><div><p className="font-extrabold">{p.name}</p><p className="text-sm text-muted-foreground">{p.category} · {money(p.price)}</p></div><div className="flex gap-2"><button onClick={()=>setForm({...p,id:p.id,oldPrice:p.oldPrice||'',desc:p.desc||'',image:p.image||''})} className="flex items-center gap-1 rounded-lg border px-3 py-2 font-bold"><Pencil size={15}/> تعديل</button><button onClick={()=>remove(p.id)} className="rounded-lg border px-3 py-2 font-bold text-red-600"><Trash2 size={15}/></button></div></div>)}{products.length===0&&<p className="py-10 text-center text-muted-foreground">لا توجد منتجات بعد.</p>}</div></section></div></div></main>
}
