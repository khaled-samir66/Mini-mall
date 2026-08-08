"use client"

import { useState } from "react"
import { StoreProvider } from "@/lib/store"
import { SiteHeader } from "@/components/site-header"
import { HeroSection, OfferBanner } from "@/components/hero-section"
import { ProductsSection } from "@/components/products-section"
import { AboutSection, SiteFooter } from "@/components/about-section"
import { ContactSection } from "@/components/contact-section"
import { AssistantWidget } from "@/components/assistant-widget"
import { CartWidget } from "@/components/cart-widget"

export function HomeShell() {
  const [assistantOpen, setAssistantOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null)

  function askAboutProduct(name: string) {
    setPendingQuestion(`ما سعر وتوافر ${name}؟`)
    setAssistantOpen(true)
  }

  return (
    <StoreProvider>
      <SiteHeader />
      <main>
        <HeroSection />
        <OfferBanner />
        <ProductsSection onAsk={askAboutProduct} onAddToCart={() => setCartOpen(true)} />
        <AboutSection />
        <ContactSection />
      </main>
      <SiteFooter />

      <AssistantWidget
        open={assistantOpen}
        onOpenChange={setAssistantOpen}
        pendingQuestion={pendingQuestion}
        onQuestionHandled={() => setPendingQuestion(null)}
      />
      <CartWidget open={cartOpen} onOpenChange={setCartOpen} />
    </StoreProvider>
  )
}
