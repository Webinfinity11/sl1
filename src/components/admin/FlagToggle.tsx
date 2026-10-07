"use client";

import { useOptimistic, useTransition } from "react";
import { setProductFlag } from "@/lib/actions/admin";

export function FlagToggle({ id, flag, value }: { id: number; flag: "published" | "inStock"; value: boolean }) {
  const [optimistic, setOptimistic] = useOptimistic(value);
  const [, start] = useTransition();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={optimistic}
      onClick={() =>
        start(async () => {
          setOptimistic(!optimistic);
          await setProductFlag(id, flag, !optimistic);
        })
      }
      className={`relative inline-flex h-6 w-11 rounded-full transition ${optimistic ? "bg-green-500" : "bg-slate-300"}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${optimistic ? "left-5.5" : "left-0.5"}`} />
    </button>
  );
}
