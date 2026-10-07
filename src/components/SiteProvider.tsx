"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Content } from "@/lib/content-schema";

type SiteInfo = Content["site"];
const SiteContext = createContext<SiteInfo | null>(null);

export function SiteProvider({ value, children }: { value: SiteInfo; children: ReactNode }) {
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used inside SiteProvider");
  return ctx;
}
