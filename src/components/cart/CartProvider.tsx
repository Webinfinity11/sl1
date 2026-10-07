"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartLine = {
  id: number;
  name: string;
  slug: string;
  price: number;
  image: string | null;
  qty: number;
};
export type FavItem = Omit<CartLine, "qty">;

type CartState = {
  lines: CartLine[];
  favs: FavItem[];
  count: number;
  total: number;
  hasQuoteItems: boolean;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  add: (item: FavItem, qty?: number) => void;
  setQty: (id: number, qty: number) => void;
  remove: (id: number) => void;
  clear: () => void;
  toggleFav: (item: FavItem) => void;
  isFav: (id: number) => boolean;
  toast: string | null;
  notify: (message: string) => void;
};

const CartContext = createContext<CartState | null>(null);
const CART_KEY = "sl1-cart";
const FAV_KEY = "sl1-favs";
export const MAX_QTY = 999;

function read<T>(key: string, fallback: T): T {
  try {
    const v = JSON.parse(localStorage.getItem(key) ?? "null");
    return Array.isArray(v) ? (v as T) : fallback;
  } catch {
    return fallback;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [favs, setFavs] = useState<FavItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setLines(read(CART_KEY, []));
    setFavs(read(FAV_KEY, []));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(lines));
      localStorage.setItem(FAV_KEY, JSON.stringify(favs));
    } catch {}
  }, [lines, favs, loaded]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const clampQty = (n: number) => Math.min(MAX_QTY, Math.max(1, Math.floor(n) || 1));

  const add = useCallback((item: FavItem, qty = 1) => {
    setLines((ls) => {
      const existing = ls.find((l) => l.id === item.id);
      if (existing) return ls.map((l) => (l.id === item.id ? { ...l, ...item, qty: clampQty(l.qty + qty) } : l));
      return [...ls, { ...item, qty: clampQty(qty) }];
    });
    setToast("პროდუქტი დაემატა კალათაში ✓");
  }, []);

  const value = useMemo<CartState>(
    () => ({
      lines,
      favs,
      count: lines.reduce((n, l) => n + l.qty, 0),
      total: lines.reduce((n, l) => n + l.price * l.qty, 0),
      hasQuoteItems: lines.some((l) => l.price === 0),
      drawerOpen,
      setDrawerOpen,
      add,
      setQty: (id, qty) => setLines((ls) => ls.map((l) => (l.id === id ? { ...l, qty: clampQty(qty) } : l))),
      remove: (id) => setLines((ls) => ls.filter((l) => l.id !== id)),
      clear: () => setLines([]),
      toggleFav: (item) =>
        setFavs((fs) => (fs.some((f) => f.id === item.id) ? fs.filter((f) => f.id !== item.id) : [...fs, item])),
      isFav: (id) => favs.some((f) => f.id === id),
      toast,
      notify: setToast,
    }),
    [lines, favs, drawerOpen, add, toast],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
