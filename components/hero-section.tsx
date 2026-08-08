"use client"

import Image from "next/image"
import { BookOpen, MessageCircle } from "lucide-react"
import { WHATSAPP_NUMBER } from "@/lib/store"

export function HeroSection() {
  return (
    <section
      id="home"
      className="text-white"
      style={{
        background:
          "radial-gradient(circle at 80% 20%, rgba(245,196,0,.20), transparent 30%), linear-gradient(135deg,#07131b,#102b20)",
      }}
    >
      <div className="mx-auto grid w-[92%] max-w-[1160px] grid-cols-1 items-center gap-12 py-16 md:grid-cols-[1.35fr_.65fr] md:py-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-yellow/12 px-3.5 py-1.5 font-bold text-[#f7d85c]">
            <BookOpen size={18} aria-hidden="true" />
            كل ما يحتاجه الطالب في مكان واحد
          </span>
          <h1 className="my-5 text-balance text-4xl font-extrabold leading-tight md:text-6xl">
            أهلاً بكم في <span className="text-brand-yellow">ميني مول أولاد حرب</span>
          </h1>
          <p className="max-w-[700px] text-pretty text-lg text-[#d9e1e5]">
            نرحب بكم في موقع ميني مول أولاد حرب لبيع الكتب الخارجية والكشاكيل والأدوات المدرسية
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#products"
              className="inline-flex items-center justify-center rounded-xl bg-brand-yellow px-5 py-3 font-extrabold text-[#161616] transition hover:brightness-105"
            >
              تصفح المنتجات
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("مرحباً، أريد الاستفسار عن منتجات ميني مول أولاد حرب")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-green px-5 py-3 font-extrabold text-white transition hover:brightness-110"
            >
              <MessageCircle size={20} aria-hidden="true" />
              اطلب عبر واتساب
            </a>
          </div>
        </div>

        <div className="mx-auto max-w-[440px] rotate-2 rounded-[30px] bg-white p-3 shadow-2xl">
          <Image
            src="/logo.jpg"
            alt="مكتبة أولاد حرب"
            width={520}
            height={520}
            className="block w-full rounded-[22px]"
          />
        </div>
      </div>
    </section>
  )
}

export function OfferBanner() {
  return (
    <section id="offers" className="bg-brand-cream py-6">
      <div className="mx-auto w-[92%] max-w-[1160px]">
        <div className="flex flex-col items-stretch justify-between gap-5 rounded-[20px] border border-[#f0d46b] bg-white px-7 py-6 shadow-[0_12px_35px_rgba(0,0,0,.10)] sm:flex-row sm:items-center">
          <div>
            <span className="font-extrabold text-brand-green">عرض لفترة محدودة</span>
            <h2 className="my-1 text-2xl font-extrabold">خصم ١٠٪ على جميع الكتب الخارجية</h2>
            <p className="text-muted-foreground">الكمية محدودة — احجز منتجك قبل نفاد الكمية.</p>
          </div>
          <a
            href="#products"
            className="inline-flex items-center justify-center rounded-xl bg-brand-dark px-5 py-3 font-extrabold text-white transition hover:brightness-125"
          >
            شاهد الكتب
          </a>
        </div>
      </div>
    </section>
  )
}
