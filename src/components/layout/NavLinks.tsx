"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Link as NavLink } from "@/lib/content-schema";

export function NavLinks({ links }: { links: NavLink[] }) {
  const path = usePathname();
  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href.split("?")[0]));
  return links.map((l) => (
    <Link key={l.href + l.label} className={active(l.href) ? "navlink active" : "navlink"} href={l.href}>
      {l.label}
    </Link>
  ));
}
