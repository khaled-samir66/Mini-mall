"use client"

import Image from "next/image"
import { useMemo, useState } from "react"
import { Search, BookOpen, ShoppingCart, MessageCircle } from "lucide-react"
import { CATEGORIES, money, useStore, type Product } from "@/lib/store"

const FILTERS = ["الكل", ...CATEGORIES]

export function ProductsSection({
  onAsk,
  onAddToCart,
}: {
  onAsk: (name: string) => void
  onAddToCart: () => void
}) {
  const { products, addToCart } = useStore()
  const [selected, setSelected] = useState("الكل")
  const [query, setQuery] = useState("")

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter(
      (p) =>
        (selected === "الكل" || p.category === selected) &&
        (!q || `${p.name} ${p.category} ${p.desc ?? ""}`.toLowerCase().includes(q)),
    )
  }, [products, selected, query])

  return (
    <section id="products" className="py-16 md:py-20">
      <div className="mx-auto w-[92%] max-w-[1160px]">
        <div className="mb-7 flex flex-col items-stretch justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <span className="inline-block rounded-full bg-[#eaf7ef] px-3.5 py-1 font-bold text-brand-green">
              متجرنا
            </span>
            <h2 className="my-1 text-3xl font-extrabold">المنتجات</h2>
          </div>
          <div className="relative w-full sm:w-[330px]">
            <Search
              size={18}
              className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث عن منتج..."
              aria-label="ابحث عن منتج"
              className="w-full rounded-xl border border-[#d7dee2] bg-white py-3 pe-11 ps-4 outline-none focus:border-brand-green"
            />
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2.5">
          {FILTERS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSelected(c)}
              className={`rounded-full border px-3.5 py-1.5 text-sm transition ${
                c === selected
                  ? "border-brand-green bg-brand-green text-white"
                  : "border-[#d8dfdb] bg-white text-foreground hover:border-brand-green"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <div className="rounded-[20px] border border-dashed border-[#cfd9d4] bg-[#f7f9f8] px-6 py-12 text-center">
            <BookOpen size={44} className="mx-auto mb-3 text-brand-green" aria-hidden="true" />
            <h3 className="text-xl font-extrabold">المنتجات ستظهر هنا</h3>
            <p className="mx-auto mt-2 max-w-xl text-muted-foreground">تواصل معنا عبر واتساب لمعرفة المنتجات والأسعار المتاحة حاليًا.</p>
            <a href="https://wa.me/201004261985?text=مرحباً، أريد معرفة المنتجات والأسعار المتاحة في ميني مول أولاد حرب" target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-green px-5 py-3 font-extrabold text-white">
              <MessageCircle size={18} aria-hidden="true" />
              اسأل عن المنتجات
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
            {list.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAdd={() => {
                  addToCart(p.id)
                  onAddToCart()
                }}
                onAsk={() => onAsk(p.name)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function ProductCard({
  product,
  onAdd,
  onAsk,
}: {
  product: Product
  onAdd: () => void
  onAsk: () => void
}) {
  return (
    <article className="flex flex-col overflow-hidden rounded-[18px] border border-[#e5e8e9] bg-white shadow-[0_6px_22px_rgba(0,0,0,.05)]">
      {product.image ? (
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          width={320}
          height={290}
          className="aspect-[1.1] w-full bg-[#eef1ef] object-cover"
          unoptimized
        />
      ) : (
        <div className="grid aspect-[1.1] place-items-center bg-gradient-to-br from-[#fff8d7] to-[#e9f5ed]">
          <BookOpen size={48} className="text-brand-green" aria-hidden="true" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-bold text-brand-green">{product.category}</span>
        <h3 className="mb-0.5 mt-1 text-[1.05rem] font-bold">{product.name}</h3>
        <div className="my-2 flex items-center gap-1.5 text-lg font-extrabold text-brand-green">
          {money(product.price)}
          {product.oldPrice ? (
            <span className="text-sm font-normal text-[#92999d] line-through">
              {money(product.oldPrice)}
            </span>
          ) : null}
        </div>
        <p className="text-sm text-muted-foreground">{product.desc || "الكمية محدودة"}</p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={onAdd}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-brand-yellow px-3 py-2.5 font-extrabold text-[#161616] transition hover:brightness-105"
          >
            <ShoppingCart size={16} aria-hidden="true" />
            حجز
          </button>
          <button
            type="button"
            onClick={onAsk}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#ccd3d7] bg-white px-3 py-2.5 font-extrabold text-foreground transition hover:bg-muted"
          >
            <MessageCircle size={16} aria-hidden="true" />
            سؤال
          </button>
        </div>
      </div>
    </article>
  )
}
