"use client"

import { useState, type FormEvent } from "react"
import { Plus, Trash2 } from "lucide-react"
import { CATEGORIES, useStore } from "@/lib/store"

const EMPTY = {
  name: "",
  category: "",
  price: "",
  oldPrice: "",
  desc: "",
  image: "",
}

export function ManageSection() {
  const { addProduct, clearProducts } = useStore()
  const [form, setForm] = useState(EMPTY)
  const [notice, setNotice] = useState("")

  function update(key: keyof typeof EMPTY, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    addProduct({
      name: form.name.trim(),
      category: form.category,
      price: form.price,
      oldPrice: form.oldPrice || undefined,
      desc: form.desc.trim() || undefined,
      image: form.image.trim() || undefined,
    })
    setForm(EMPTY)
    setNotice("تمت إضافة المنتج بنجاح.")
    setTimeout(() => setNotice(""), 2500)
  }

  function handleClear() {
    if (confirm("حذف كل المنتجات التي أضفتها من هذا المتصفح؟")) clearProducts()
  }

  const inputClass =
    "rounded-xl border border-[#d8dfe2] bg-white p-3.5 outline-none focus:border-brand-green"

  return (
    <section id="manage" className="py-16 md:py-20">
      <div className="mx-auto w-[92%] max-w-[1160px]">
        <div className="mb-7">
          <span className="inline-block rounded-full bg-[#eaf7ef] px-3.5 py-1 font-bold text-brand-green">
            إدارة المحتوى
          </span>
          <h2 className="my-1 text-3xl font-extrabold">إضافة المنتجات</h2>
          <p className="text-sm text-muted-foreground">
            المنتجات هنا تُحفظ في متصفحك. عند رفع الموقع على استضافة مع قاعدة بيانات يمكن تحويلها إلى
            إدارة منتجات حقيقية من أي جهاز.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-3 rounded-[20px] bg-[#f7f9f8] p-6 sm:grid-cols-2"
        >
          <input
            className={inputClass}
            placeholder="اسم المنتج"
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
          <select
            className={inputClass}
            required
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
          >
            <option value="">اختر القسم</option>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <input
            className={inputClass}
            type="number"
            min="0"
            step="0.01"
            placeholder="السعر بالجنيه"
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
          />
          <input
            className={inputClass}
            type="number"
            min="0"
            step="0.01"
            placeholder="السعر قبل الخصم (اختياري)"
            value={form.oldPrice}
            onChange={(e) => update("oldPrice", e.target.value)}
          />
          <input
            className={inputClass}
            placeholder="وصف مختصر"
            value={form.desc}
            onChange={(e) => update("desc", e.target.value)}
          />
          <input
            className={inputClass}
            type="url"
            placeholder="رابط صورة المنتج (اختياري)"
            value={form.image}
            onChange={(e) => update("image", e.target.value)}
          />
          <button
            type="submit"
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-yellow px-5 font-extrabold text-[#161616] transition hover:brightness-105"
          >
            <Plus size={18} aria-hidden="true" />
            إضافة المنتج
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#ccd3d7] bg-white px-5 font-extrabold text-foreground transition hover:bg-muted"
          >
            <Trash2 size={18} aria-hidden="true" />
            حذف المنتجات المضافة
          </button>
          {notice && (
            <p className="font-bold text-brand-green sm:col-span-2" role="status">
              {notice}
            </p>
          )}
        </form>
      </div>
    </section>
  )
}
