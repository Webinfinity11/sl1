"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const options = [
  ["default", "რეკომენდებული"],
  ["new", "უახლესი"],
  ["price-asc", "ფასი: დაბლიდან მაღლისკენ"],
  ["price-desc", "ფასი: მაღლიდან დაბლისკენ"],
  ["name", "დასახელება: ა–ჰ"],
] as const;

export function SortSelect({ value }: { value: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  return (
    <label className="sort">
      დალაგება:
      <select
        value={value}
        onChange={(e) => {
          const next = new URLSearchParams(params);
          if (e.target.value === "default") next.delete("sort");
          else next.set("sort", e.target.value);
          next.delete("page");
          const qs = next.toString();
          router.push(qs ? `${pathname}?${qs}` : pathname);
        }}
      >
        {options.map(([v, label]) => (
          <option key={v} value={v}>
            {label}
          </option>
        ))}
      </select>
    </label>
  );
}
