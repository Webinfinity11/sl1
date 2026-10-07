"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/Icon";

export function PriceFilter({ min, max }: { min?: number; max?: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [from, setFrom] = useState(min ? String(min) : "");
  const [to, setTo] = useState(max ? String(max) : "");

  const apply = (f: string, t: string) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of [["min", f], ["max", t]]) {
      const n = parseFloat(v);
      if (n > 0) next.set(k, String(n));
      else next.delete(k);
    }
    next.delete("page");
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  return (
    <form
      className="pricefilter"
      onSubmit={(e) => {
        e.preventDefault();
        apply(from, to);
      }}
    >
      <span>ფასი ₾</span>
      <input inputMode="decimal" placeholder="დან" value={from} onChange={(e) => setFrom(e.target.value)} aria-label="მინიმალური ფასი" />
      <i>–</i>
      <input inputMode="decimal" placeholder="მდე" value={to} onChange={(e) => setTo(e.target.value)} aria-label="მაქსიმალური ფასი" />
      <button type="submit" aria-label="ფასის ფილტრის გამოყენება">
        <Icon name="check" />
      </button>
      {(min || max) && (
        <button
          type="button"
          className="clear"
          aria-label="ფასის ფილტრის მოხსნა"
          onClick={() => {
            setFrom("");
            setTo("");
            apply("", "");
          }}
        >
          <Icon name="close" />
        </button>
      )}
    </form>
  );
}
