"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { uploadImage } from "@/lib/actions/admin";

/** Uploads to Blob immediately; the parent stores only the resulting URLs. */
export function ImageUploader({ value, onChange, max = 12 }: { value: string[]; onChange: (urls: string[]) => void; max?: number }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setError(null);
    const list = [...files].slice(0, max - value.length);
    setBusy(list.length);
    const urls: string[] = [];
    for (const file of list) {
      const form = new FormData();
      form.set("file", file);
      const res = await uploadImage(form);
      if (res.ok) urls.push(res.url);
      else setError(res.error);
      setBusy((n) => n - 1);
    }
    onChange([...value, ...urls]);
    if (input.current) input.current.value = "";
  }

  const move = (i: number, d: number) => {
    const next = [...value];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    onChange(next);
  };

  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {value.map((url, i) => (
          <div key={url} className="relative aspect-square rounded-lg border border-slate-200 bg-white group">
            <Image src={url} alt="" fill sizes="160px" className="object-contain p-2" />
            {i === 0 && <span className="absolute left-1 top-1 text-[11px] bg-[#174abc] text-white rounded px-1.5">მთავარი</span>}
            <div className="absolute inset-x-1 bottom-1 flex justify-between gap-1">
              <button type="button" disabled={i === 0} onClick={() => move(i, -1)} className="bg-white/90 border rounded px-2 text-sm disabled:opacity-30" aria-label="მარცხნივ">←</button>
              <button type="button" onClick={() => onChange(value.filter((u) => u !== url))} className="bg-white/90 border border-red-200 text-red-600 rounded px-2 text-sm">წაშლა</button>
              <button type="button" disabled={i === value.length - 1} onClick={() => move(i, 1)} className="bg-white/90 border rounded px-2 text-sm disabled:opacity-30" aria-label="მარჯვნივ">→</button>
            </div>
          </div>
        ))}
        {value.length < max && (
          <button
            type="button"
            onClick={() => input.current?.click()}
            disabled={busy > 0}
            className="aspect-square rounded-lg border-2 border-dashed border-slate-300 text-slate-500 hover:border-[#174abc] hover:text-[#174abc] text-sm font-semibold"
          >
            {busy > 0 ? `იტვირთება… (${busy})` : "+ სურათის დამატება"}
          </button>
        )}
      </div>
      <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => upload(e.target.files)} />
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
}
