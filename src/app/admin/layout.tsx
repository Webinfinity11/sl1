import type { Metadata } from "next";

export const metadata: Metadata = { title: { default: "ადმინი", template: "%s · ადმინი" }, robots: { index: false } };

export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-slate-50 text-slate-800 text-[15px]">{children}</div>;
}
