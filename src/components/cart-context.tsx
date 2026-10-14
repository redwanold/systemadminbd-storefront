"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type CartLine = {
  slug: string;
  name: string;
  codename: string;
  image: string;
  priceCents: number;
  quantity: number;
  stock: number;
};

type CartContextValue = {
  lines: CartLine[];
  isOpen: boolean;
  hydrated: boolean;
  count: number;
  subtotalCents: number;
  lastAdded: string | null;
  open: () => void;
  close: () => void;
  addItem: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "systemadminbd.cart.v1";

function readStorage(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLine[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((l) => l && typeof l.slug === "string" && l.quantity > 0);
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLines(readStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* quota or private mode */
    }
  }, [lines, hydrated]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  const addItem = useCallback((line: Omit<CartLine, "quantity">, quantity = 1) => {
    setLines((current) => {
      const existing = current.find((l) => l.slug === line.slug);
      if (existing) {
        return current.map((l) =>
          l.slug === line.slug
            ? { ...l, quantity: Math.min(l.quantity + quantity, Math.max(l.stock, 1)) }
            : l,
        );
      }
      return [...current, { ...line, quantity: Math.min(quantity, Math.max(line.stock, 1)) }];
    });
    setIsOpen(true);
    setLastAdded(line.slug);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setLastAdded(null), 2200);
  }, []);

  const setQuantity = useCallback((slug: string, quantity: number) => {
    setLines((current) =>
      quantity <= 0
        ? current.filter((l) => l.slug !== slug)
        : current.map((l) =>
            l.slug === slug ? { ...l, quantity: Math.min(quantity, Math.max(l.stock, 1)) } : l,
          ),
    );
  }, []);

  const removeItem = useCallback((slug: string) => {
    setLines((current) => current.filter((l) => l.slug !== slug));
  }, []);

  const clear = useCallback(() => setLines([]), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((sum, l) => sum + l.quantity, 0);
    const subtotalCents = lines.reduce((sum, l) => sum + l.quantity * l.priceCents, 0);
    return {
      lines,
      isOpen,
      hydrated,
      count,
      subtotalCents,
      lastAdded,
      open,
      close,
      addItem,
      setQuantity,
      removeItem,
      clear,
    };
  }, [lines, isOpen, hydrated, lastAdded, open, close, addItem, setQuantity, removeItem, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
