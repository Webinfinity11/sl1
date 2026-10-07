"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { categoryUrl } from "@/lib/format";

export type MenuCategory = {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  count: number;
  children: { id: number; name: string; slug: string; count: number }[];
};

/** Two-pane mega menu on desktop; accordion list on mobile. */
export function CategoryMenu({ tree }: { tree: MenuCategory[] }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(tree[0]?.id);
  const [expanded, setExpanded] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const current = tree.find((c) => c.id === active);

  return (
    <div className="catwrap" ref={ref}>
      <button className="catalogue" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span>
          <Icon name="menu" />
          ყველა კატეგორია
        </span>
        <Icon name="down" />
      </button>
      {open && (
        <div className="megamenu">
          <ul className="mega-roots">
            {tree.map((c) => (
              <li key={c.id}>
                <div className={c.id === active ? "mega-root active" : "mega-root"} onMouseEnter={() => setActive(c.id)}>
                  <Link href={categoryUrl(c.slug)}>
                    <span className="mega-img">{c.image && <Image src={c.image} alt="" width={36} height={32} />}</span>
                    <span>{c.name}</span>
                  </Link>
                  {c.children.length > 0 && (
                    <button
                      className="mega-toggle"
                      aria-label={`${c.name}: ქვეკატეგორიები`}
                      aria-expanded={expanded === c.id}
                      onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                    >
                      <Icon name={expanded === c.id ? "down" : "right"} />
                    </button>
                  )}
                </div>
                {expanded === c.id && (
                  <ul className="mega-mobile-children">
                    {c.children.map((s) => (
                      <li key={s.id}>
                        <Link href={categoryUrl(s.slug)}>{s.name}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          {current && (
            <div className="mega-panel">
              <div className="mega-head">
                <h3>{current.name}</h3>
                <Link className="textlink" href={categoryUrl(current.slug)}>
                  ყველა ({current.count}) <Icon name="arrow" />
                </Link>
              </div>
              {current.children.length ? (
                <ul className="mega-children">
                  {current.children.map((s) => (
                    <li key={s.id}>
                      <Link href={categoryUrl(s.slug)}>
                        {s.name} <small>{s.count}</small>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="muted">ქვეკატეგორიები არ აქვს.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
