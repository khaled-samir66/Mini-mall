"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"

export const WHATSAPP_NUMBER = "201004261985"

export const CATEGORIES = [
  "كتب مدرسية",
  "كتب خارجية",
  "كشاكيل",
  "أدوات مدرسية",
  "شنط مدرسية",
  "ملابس شبابي",
  "ملابس داخلية قطونيل – فرز ثاني",
] as const

export type Product = {
  id: string
  name: string
  category: string
  price: string
  oldPrice?: string
  desc?: string
  image?: string
}

export type CartItem = {
  id: string
  name: string
  price: string
  qty: number
}

type StoreContextValue = {
  products: Product[]
  cart: CartItem[]
  cartCount: number
  cartTotal: number
  addProduct: (product: Omit<Product, "id">) => Promise<void>
  clearProducts: () => Promise<void>
  addToCart: (id: string) => void
  removeFromCart: (id: string) => void
  updateCartQty: (id: string, delta: number) => void
  clearCart: () => void
}

const StoreContext = createContext<StoreContextValue | null>(null)

const PRODUCTS_KEY = "oladHarbProducts"
const CART_KEY = "oladHarbCart"

export function money(v?: string | number) {
  const n = Number(v)
  if (!v || Number.isNaN(n) || n <= 0) return "السعر يحدد لاحقًا"
  return n.toLocaleString("ar-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  })
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)
  const productsRef = useRef<Product[]>([])
  productsRef.current = products

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch("/api/products", { cache: "no-store" })
        if (response.ok) setProducts(await response.json())
      } catch {}
    }
    try {
      const c = localStorage.getItem(CART_KEY)
      if (c) setCart(JSON.parse(c))
    } catch {}
    loadProducts()
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) localStorage.setItem(CART_KEY, JSON.stringify(cart))
  }, [cart, hydrated])

  const addProduct = useCallback(async (product: Omit<Product, "id">) => {
    const response = await fetch("/api/products", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(product),
    })
    if (!response.ok) throw new Error("تعذر إضافة المنتج")
    const created = await response.json()
    setProducts((prev) => [created, ...prev])
  }, [])

  const clearProducts = useCallback(async () => {
    const response = await fetch("/api/products", {
      method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ all: true }),
    })
    if (response.ok) setProducts([])
  }, [])

  const addToCart = useCallback((id: string) => {
    const p = productsRef.current.find((x) => x.id === id)
    if (!p) return
    setCart((prev) => {
      const existing = prev.find((x) => x.id === id)
      if (existing) {
        return prev.map((x) => (x.id === id ? { ...x, qty: x.qty + 1 } : x))
      }
      return [...prev, { id: p.id, name: p.name, price: p.price, qty: 1 }]
    })
  }, [])

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((x) => x.id !== id))
  }, [])

  const updateCartQty = useCallback((id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0),
    )
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const cartCount = useMemo(() => cart.reduce((a, x) => a + x.qty, 0), [cart])
  const cartTotal = useMemo(
    () => cart.reduce((a, x) => a + (Number(x.price) || 0) * x.qty, 0),
    [cart],
  )

  const value = useMemo(
    () => ({
      products,
      cart,
      cartCount,
      cartTotal,
      addProduct,
      clearProducts,
      addToCart,
      removeFromCart,
      updateCartQty,
      clearCart,
    }),
    [products, cart, cartCount, cartTotal, addProduct, clearProducts, addToCart, removeFromCart, updateCartQty, clearCart],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error("useStore must be used within StoreProvider")
  return ctx
}
