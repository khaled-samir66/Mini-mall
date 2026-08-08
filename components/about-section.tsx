import { BookOpen, NotebookPen, Backpack, Shirt } from "lucide-react"

const CARDS = [
  { icon: BookOpen, title: "كتب خارجية", note: "خصم ١٠٪ لفترة محدودة" },
  { icon: NotebookPen, title: "كشاكيل", note: "عادي وسلك بجميع الأحجام" },
  { icon: Backpack, title: "مستلزمات مدرسية", note: "شنط وأدوات مدرسية" },
  { icon: Shirt, title: "ملابس", note: "شبابي وقطونيل فرز ثاني" },
]

export function AboutSection() {
  return (
    <section id="about" className="bg-[#f6f8f7] py-16 md:py-20">
      <div className="mx-auto grid w-[92%] max-w-[1160px] grid-cols-1 items-center gap-11 md:grid-cols-2">
        <div>
          <span className="inline-block rounded-full bg-[#eaf7ef] px-3.5 py-1 font-bold text-brand-green">
            لماذا أولاد حرب؟
          </span>
          <h2 className="my-2 text-3xl font-extrabold">كل احتياجاتك الدراسية في مكان واحد</h2>
          <p className="leading-relaxed text-muted-foreground">
            كتب مدرسية، كتب خارجية، كشاكيل، أدوات مدرسية، شنط، وملابس شبابي وملابس داخلية قطونيل فرز
            ثاني.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          {CARDS.map((c) => (
            <div
              key={c.title}
              className="grid gap-1 rounded-[17px] bg-white p-5 shadow-[0_12px_35px_rgba(0,0,0,.10)]"
            >
              <c.icon size={30} className="text-brand-green" aria-hidden="true" />
              <strong className="text-base">{c.title}</strong>
              <span className="text-sm text-muted-foreground">{c.note}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function SiteFooter() {
  return (
    <footer className="bg-[#050d12] py-5 text-[#aeb9be]">
      <div className="mx-auto flex w-[92%] max-w-[1160px] flex-col justify-between gap-1 sm:flex-row">
        <span>© ميني مول أولاد حرب</span>
        <span>كل ما تحتاجه... تجده لدينا</span>
      </div>
    </footer>
  )
}
