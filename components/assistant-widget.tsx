"use client"

import { useEffect, useRef, useState, type KeyboardEvent } from "react"
import { Bot, X, Send } from "lucide-react"
import { money, useStore, type Product } from "@/lib/store"

type Message = { who: "bot" | "user"; text: string }

const QUICK = ["مواعيد العمل", "العنوان", "طريقة الطلب", "الكتب الخارجية"]

function botAnswer(q: string, products: Product[]) {
  const s = q.toLowerCase()
  if (s.includes("ميعاد") || s.includes("مواعيد") || s.includes("ساعة"))
    return "مواعيد العمل من الساعة ١٠ صباحاً إلى الساعة ١٢ مساءً."
  if (s.includes("عنوان") || s.includes("فين") || s.includes("مكان"))
    return "العنوان: اللبيني هرم عند أولاد رجب، أول شارع الأورمان تراب."
  if (s.includes("واتساب") || s.includes("تواصل") || s.includes("رقم"))
    return "واتساب الطلبات وخدمة العملاء: 01004261985. والهاتف الآخر: 01117609269."
  if (s.includes("توصيل") || s.includes("دليفري"))
    return "يوجد توصيل للمناطق القريبة من المحل بشرط الكميات، والتكلفة حسب المسافة."
  if (s.includes("طلب") || s.includes("حجز") || s.includes("عربون"))
    return "يمكنك حجز المنتجات من السلة وإرسال الطلب عبر واتساب، وسيتم تأكيد التوافر وقيمة العربون معك."
  if (s.includes("خصم") || s.includes("كتاب") || s.includes("خارجي")) {
    const books = products.filter((p) => p.category === "كتب خارجية")
    return books.length
      ? `لدينا ${books.length} منتجًا في قسم الكتب الخارجية. ويوجد خصم ١٠٪ على جميع الكتب الخارجية لفترة محدودة.`
      : "يوجد خصم ١٠٪ على جميع الكتب الخارجية لفترة محدودة. المنتجات والأسعار ستظهر هنا بعد إضافتها."
  }
  const hit = products.find((p) => `${p.name} ${p.category ?? ""}`.toLowerCase().includes(s))
  return hit
    ? `${hit.name}: ${money(hit.price)}. ${hit.desc || "الكمية محدودة."}`
    : "أقدر أساعدك في المنتجات والأسعار والتوافر وطريقة الطلب والمواعيد والعنوان. اكتب اسم المنتج أو سؤالك."
}

export function AssistantWidget({
  open,
  onOpenChange,
  pendingQuestion,
  onQuestionHandled,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  pendingQuestion: string | null
  onQuestionHandled: () => void
}) {
  const { products } = useStore()
  const [messages, setMessages] = useState<Message[]>([
    {
      who: "bot",
      text: "أهلاً بك! اسألني عن المنتجات، الأسعار، التوافر، طريقة الطلب، العنوان أو مواعيد العمل.",
    },
  ])
  const [input, setInput] = useState("")
  const bodyRef = useRef<HTMLDivElement>(null)

  function ask(question: string) {
    const q = question.trim()
    if (!q) return
    setMessages((prev) => [...prev, { who: "user", text: q }])
    setTimeout(() => {
      setMessages((prev) => [...prev, { who: "bot", text: botAnswer(q, products) }])
    }, 250)
  }

  useEffect(() => {
    if (open && pendingQuestion) {
      ask(pendingQuestion)
      onQuestionHandled()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, pendingQuestion])

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [messages])

  function handleSend() {
    ask(input)
    setInput("")
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.nativeEvent.isComposing && e.keyCode !== 229) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        aria-label="مساعد أولاد حرب"
        className="fixed bottom-[22px] start-[22px] z-[60] grid h-[58px] w-[58px] place-items-center rounded-full bg-brand-green text-white shadow-[0_10px_30px_rgba(0,0,0,.25)] transition hover:brightness-110"
      >
        <Bot size={26} aria-hidden="true" />
      </button>

      {open && (
        <div className="fixed bottom-[90px] start-[22px] z-[70] w-[min(390px,calc(100vw-44px))] overflow-hidden rounded-[18px] bg-white shadow-[0_20px_70px_rgba(0,0,0,.25)]">
          <div className="flex items-center justify-between bg-brand-dark px-4 py-3.5 text-white">
            <strong className="flex items-center gap-2">
              <Bot size={20} aria-hidden="true" /> مساعد أولاد حرب
            </strong>
            <button type="button" onClick={() => onOpenChange(false)} aria-label="إغلاق">
              <X size={22} aria-hidden="true" />
            </button>
          </div>

          <div ref={bodyRef} className="h-[260px] overflow-auto bg-[#f5f7f6] p-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`mb-2 max-w-[90%] rounded-xl px-3 py-2 ${
                  m.who === "bot"
                    ? "border border-[#e1e6e3] bg-white"
                    : "ms-auto bg-[#dff2e5]"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5 p-2">
            {QUICK.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => ask(q)}
                className="rounded-full border border-[#d5ddd8] bg-white px-2.5 py-1 text-sm transition hover:border-brand-green"
              >
                {q}
              </button>
            ))}
          </div>

          <div className="flex border-t border-[#e5e8e8]">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="اكتب سؤالك..."
              aria-label="اكتب سؤالك"
              className="flex-1 border-0 p-3 outline-none"
            />
            <button
              type="button"
              onClick={handleSend}
              aria-label="إرسال"
              className="flex items-center gap-1.5 bg-brand-green px-4 font-bold text-white transition hover:brightness-110"
            >
              <Send size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
