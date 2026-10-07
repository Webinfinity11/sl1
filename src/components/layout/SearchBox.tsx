"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { finalPrice, money, productUrl } from "@/lib/format";
import type { ProductCard } from "@/lib/data";

export function SearchBox() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [results, setResults] = useState<ProductCard[]>([]);
  const [total, setTotal] = useState(0);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement as HTMLElement | null)?.tagName ?? "";
      if (e.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(tag)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => !boxRef.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, []);

  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) {
      setResults([]);
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`, { signal: ctrl.signal });
        const data = await res.json();
        setResults(data.items);
        setTotal(data.total);
        setOpen(true);
      } catch {}
    }, 200);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q]);

  const go = () => {
    setOpen(false);
    router.push(q.trim() ? `/catalog?q=${encodeURIComponent(q.trim())}` : "/catalog");
  };

  return (
    <form
      ref={boxRef}
      className="search"
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        go();
      }}
    >
      <Icon name="search" />
      <input
        ref={inputRef}
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => results.length && setOpen(true)}
        aria-label="პროდუქტის ძიება"
        placeholder="მოძებნეთ პროდუქტი ან კოდი…"
        autoComplete="off"
      />
      <span className="key">/</span>
      {open && q.trim().length >= 2 && (
        <div className="suggest">
          {results.length === 0 ? (
            <p className="suggest-empty">„{q}“ — ვერაფერი მოიძებნა</p>
          ) : (
            <>
              {results.map((p) => (
                <Link key={p.id} href={productUrl(p.slug)} className="suggest-item" onClick={() => setOpen(false)}>
                  <span className="suggest-thumb">
                    {p.image && <Image src={p.image} alt="" width={44} height={44} />}
                  </span>
                  <span className="suggest-name">
                    {p.name}
                    {p.sku && <small>კოდი: {p.sku}</small>}
                  </span>
                  <strong>{finalPrice(p) ? `${money(finalPrice(p))} ₾` : ""}</strong>
                </Link>
              ))}
              <button type="submit" className="suggest-all">
                ყველა შედეგი ({total}) <Icon name="arrow" />
              </button>
            </>
          )}
        </div>
      )}
    </form>
  );
}
