"use client"

import Image from "next/image"
import { useState } from "react"
import { Menu, X } from "lucide-react"

const LINKS = [
  { href: "#home", label: "الرئيسية" },
  { href: "#products", label: "المنتجات" },
  { href: "#offers", label: "العروض" },
  { href: "#about", label: "عن المكتبة" },
  { href: "#contact", label: "تواصل معنا" },
  { href: "#manage", label: "إضافة منتجات" },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b-2 border-brand-yellow bg-brand-dark/95 text-white backdrop-blur">
      <div className="mx-auto flex min-h-[78px] w-[92%] max-w-[1160px] items-center gap-6">
        <a href="#home" className="flex items-center gap-2.5 font-extrabold">
          <Image
            src="/logo.jpg"
            alt="شعار مكتبة أولاد حرب"
            width={52}
            height={52}
            className="h-[52px] w-[52px] rounded-full border-2 border-brand-yellow object-cover"
          />
          <span className="text-base">ميني مول أولاد حرب</span>
        </a>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="me-auto text-white md:hidden"
          aria-label="فتح القائمة"
          aria-expanded={open}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>

        <nav className="me-auto hidden gap-6 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-semibold text-white/90 transition-colors hover:text-brand-yellow"
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>

      {open && (
        <nav className="flex flex-col gap-2.5 bg-brand-dark px-[5%] py-4 md:hidden">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-semibold text-white/90 transition-colors hover:text-brand-yellow"
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}
