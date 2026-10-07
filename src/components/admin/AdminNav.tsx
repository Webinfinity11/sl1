"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/actions/admin";

const links = [
  ["/admin", "მთავარი"],
  ["/admin/orders", "შეკვეთები"],
  ["/admin/products", "პროდუქცია"],
  ["/admin/categories", "კატეგორიები"],
  ["/admin/settings", "პარამეტრები"],
] as const;

export function AdminNav() {
  const path = usePathname();
  const active = (href: string) => (href === "/admin" ? path === href : path.startsWith(href));
  return (
    <aside className="md:w-60 md:min-h-screen bg-white border-b md:border-b-0 md:border-r border-slate-200 md:sticky md:top-0 md:h-screen flex md:flex-col">
      <Link href="/admin" className="hidden md:block p-5 border-b border-slate-100">
        <Image src="/img/logo.webp" alt="SMARTLINE" width={150} height={38} className="h-auto" />
      </Link>
      <nav className="flex md:flex-col gap-1 p-2 md:p-3 overflow-x-auto flex-1">
        {links.map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className={`whitespace-nowrap rounded-lg px-3 py-2.5 font-semibold ${
              active(href) ? "bg-blue-50 text-[#174abc]" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
      <div className="hidden md:grid gap-1 p-3 border-t border-slate-100 text-sm">
        <a href="/" target="_blank" className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-50">
          საიტის ნახვა ↗
        </a>
        <form action={logout}>
          <button className="w-full text-left rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-50">გასვლა</button>
        </form>
      </div>
    </aside>
  );
}
