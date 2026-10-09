"use client";

import { useState, useTransition } from "react";
import { saveHomeCategories } from "@/lib/actions/admin";
import { Button, Card } from "./ui";

type Option = { id: number; name: string; depth: number; count: number };

/** Picks which categories fill the home page grid (6 per row); newly ticked ones go to the end. */
export function HomeCategoriesEditor({ options, initial }: { options: Option[]; initial: number[] }) {
  const [ids, setIds] = useState(initial);
  const [pending, start] = useTransition();
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const byId = new Map(options.map((o) => [o.id, o]));

  const toggle = (id: number) => setIds((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]));
  const move = (i: number, by: number) =>
    setIds((list) => {
      const next = [...list];
      [next[i], next[i + by]] = [next[i + by], next[i]];
      return next;
    });
  const save = () =>
    start(async () => {
      const res = await saveHomeCategories(ids);
      setMessage(res.ok ? { ok: true, text: "შენახულია ✓" } : { ok: false, text: res.error });
    });

  return (
    <Card
      title="მთავარი გვერდის კატეგორიები"
      actions={
        <div className="flex items-center gap-3">
          {message && <span className={`text-sm ${message.ok ? "text-green-700" : "text-red-600"}`}>{message.text}</span>}
          <Button onClick={save} disabled={pending}>
            {pending ? "ინახება…" : "შენახვა"}
          </Button>
        </div>
      }
    >
      <p className="text-sm text-slate-500 mb-4">
        მონიშნული კატეგორიები ჩანს მთავარ გვერდზე, თითო რიგში 6. ახლად მონიშნული ემატება ბოლოში. რიგითობას ისრებით შეცვლით.
      </p>
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <div className="text-sm font-semibold mb-2">მთავარ გვერდზე ({ids.length})</div>
          <ol className="border border-slate-200 rounded-lg divide-y divide-slate-100 max-h-96 overflow-y-auto">
            {ids.map((id, i) => (
              <li key={id} className="flex items-center gap-2 px-3 py-2 text-sm">
                <span className="w-6 text-slate-400">{i + 1}.</span>
                <span className="flex-1">{byId.get(id)?.name ?? `#${id}`}</span>
                <button type="button" className="px-1.5 text-slate-500 disabled:opacity-30" disabled={i === 0} onClick={() => move(i, -1)} aria-label="ზემოთ">
                  ↑
                </button>
                <button type="button" className="px-1.5 text-slate-500 disabled:opacity-30" disabled={i === ids.length - 1} onClick={() => move(i, 1)} aria-label="ქვემოთ">
                  ↓
                </button>
                <button type="button" className="px-1.5 text-red-500" onClick={() => toggle(id)} aria-label="მოხსნა">
                  ✕
                </button>
              </li>
            ))}
            {ids.length === 0 && <li className="px-3 py-2 text-sm text-slate-400">არაფერია მონიშნული</li>}
          </ol>
        </div>
        <div>
          <div className="text-sm font-semibold mb-2">ყველა კატეგორია</div>
          <div className="border border-slate-200 rounded-lg max-h-96 overflow-y-auto py-1">
            {options.map((o) => (
              <label key={o.id} className="flex items-center gap-2 py-1.5 pr-3 text-sm hover:bg-slate-50 cursor-pointer" style={{ paddingLeft: 12 + o.depth * 20 }}>
                <input type="checkbox" checked={ids.includes(o.id)} onChange={() => toggle(o.id)} />
                <span className={o.depth === 0 ? "font-semibold flex-1" : "flex-1"}>{o.name}</span>
                <span className="text-slate-400">{o.count}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
