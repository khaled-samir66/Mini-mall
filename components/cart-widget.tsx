"use client"

import { ShoppingCart, X, Trash2, MessageCircle, Minus, Plus } from "lucide-react"
import { money, useStore, WHATSAPP_NUMBER } from "@/lib/store"

export function CartWidget({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { cart, cartCount, cartTotal, removeFromCart, updateCartQty } = useStore()

  function sendOrder() {
    if (!cart.length) {
      alert("أضف منتجًا أولاً.")
      return
    }
    const lines = cart.map((x) => `- ${x.name} × ${x.qty}`).join("\n")
    const msg = `مرحباً، أريد حجز المنتجات التالية من ميني مول أولاد حرب:\n${lines}\n\nأرجو تأكيد التوافر وقيمة العربون وطريقة الحجز.`
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank")
  }

  return (
    <>
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        aria-label="سلة الحجز"
        className="fixed bottom-[22px] end-[22px] z-[60] grid h-[58px] w-[58px] place-items-center rounded-full bg-brand-yellow text-[#111] shadow-[0_10px_30px_rgba(0,0,0,.25)] transition hover:brightness-105"
      >
        <ShoppingCart size={24} aria-hidden="true" />
        <span className="absolute -top-1 -end-0.5 grid h-[23px] w-[23px] place-items-center rounded-full bg-[#d82727] text-[13px] text-white">
          {cartCount}
        </span>
      </button>

      {open && (
        <div className="fixed bottom-[90px] end-[22px] z-[70] w-[min(390px,calc(100vw-44px))] overflow-hidden rounded-[18px] bg-white pb-4 shadow-[0_20px_70px_rgba(0,0,0,.25)]">
          <div className="flex items-center justify-between bg-brand-green px-4 py-3.5 text-white">
            <strong className="flex items-center gap-2">
              <ShoppingCart size={20} aria-hidden="true" /> سلة الحجز
            </strong>
            <button type="button" onClick={() => onOpenChange(false)} aria-label="إغلاق">
              <X size={22} aria-hidden="true" />
            </button>
          </div>

          <div className="max-h-[300px] overflow-auto p-3">
            {cart.length ? (
              cart.map((x) => (
                <div
                  key={x.id}
                  className="flex items-center justify-between gap-2.5 border-b border-[#eee] py-2.5"
                >
                  <span>
                    {x.name} × {x.qty}
                  </span>
                  <div className="flex items-center gap-2">
                    <strong>{money((Number(x.price) || 0) * x.qty)}</strong>
                    <button type="button" onClick={() => updateCartQty(x.id, -1)} aria-label={`تقليل كمية ${x.name}`} className="grid h-7 w-7 place-items-center rounded-full border border-[#d8dfe2]">
                      <Minus size={14} aria-hidden="true" />
                    </button>
                    <span className="min-w-5 text-center font-bold">{x.qty}</span>
                    <button type="button" onClick={() => updateCartQty(x.id, 1)} aria-label={`زيادة كمية ${x.name}`} className="grid h-7 w-7 place-items-center rounded-full border border-[#d8dfe2]">
                      <Plus size={14} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFromCart(x.id)}
                      aria-label={`حذف ${x.name}`}
                      className="text-[#d82727]"
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">السلة فارغة.</p>
            )}
          </div>

          {cart.length > 0 && (
            <div className="px-3 font-extrabold">
              الإجمالي التقريبي: {money(cartTotal)}
            </div>
          )}

          <button
            type="button"
            onClick={sendOrder}
            className="mx-3 mt-3 flex w-[calc(100%-24px)] items-center justify-center gap-2 rounded-xl bg-brand-green px-4 py-3 font-extrabold text-white transition hover:brightness-110"
          >
            <MessageCircle size={18} aria-hidden="true" />
            إرسال الحجز عبر واتساب
          </button>
        </div>
      )}
    </>
  )
}
