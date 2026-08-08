"use client"

import { MapPin, Phone, Clock, MessageCircle, Truck } from "lucide-react"
import { WHATSAPP_NUMBER } from "@/lib/store"

export function ContactSection() {
  return (
    <section
      id="contact"
      className="py-16 text-white md:py-20"
      style={{ background: "linear-gradient(135deg,#07131b,#102b20)" }}
    >
      <div className="mx-auto grid w-[92%] max-w-[1160px] grid-cols-1 items-center gap-11 md:grid-cols-2">
        <div>
          <span className="inline-block rounded-full bg-[#eaf7ef] px-3.5 py-1 font-bold text-[#0d6c31]">
            تواصل معنا
          </span>
          <h2 className="my-2 text-3xl font-extrabold">مكتبة أولاد حرب</h2>
          <ul className="mt-4 flex flex-col gap-4 text-[#dce5e8]">
            <li className="flex items-start gap-3">
              <MapPin size={22} className="mt-1 shrink-0 text-brand-yellow" aria-hidden="true" />
              <span>اللبيني هرم عند أولاد رجب، أول شارع الأورمان تراب</span>
            </li>
            <li className="flex items-start gap-3">
              <Phone size={22} className="mt-1 shrink-0 text-brand-yellow" aria-hidden="true" />
              <span dir="ltr">01004261985 — 01117609269</span>
            </li>
            <li className="flex items-start gap-3">
              <Clock size={22} className="mt-1 shrink-0 text-brand-yellow" aria-hidden="true" />
              <span>من الساعة ١٠ صباحاً إلى الساعة ١٢ مساءً</span>
            </li>
          </ul>
        </div>

        <div className="grid gap-3">
          <a
            href="https://www.google.com/maps/search/?api=1&query=ميني+مول+أولاد+حرب+اللبيني+الهرم"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3.5 font-extrabold text-white transition hover:bg-white/15"
          >
            <MapPin size={20} aria-hidden="true" />
            فتح الموقع على الخريطة
          </a>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("مرحباً، أريد الطلب من ميني مول أولاد حرب")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-brand-green px-4 py-3.5 font-extrabold text-white transition hover:brightness-110"
          >
            <MessageCircle size={20} aria-hidden="true" />
            واتساب
          </a>
          <a
            href="tel:01004261985"
            className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3.5 font-extrabold text-brand-dark transition hover:brightness-95"
          >
            <Phone size={20} aria-hidden="true" />
            اتصال
          </a>
          <div className="flex items-start gap-2 rounded-xl bg-white/10 p-4 text-[#dbe4e7]">
            <Truck size={22} className="mt-0.5 shrink-0 text-brand-yellow" aria-hidden="true" />
            <span>التوصيل للمناطق القريبة من المحل بشرط الكميات، والتكلفة حسب المسافة.</span>
          </div>
        </div>
      </div>
    </section>
  )
}
