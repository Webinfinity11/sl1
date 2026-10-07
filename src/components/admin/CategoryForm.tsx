"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Category } from "@/db/schema";
import { deleteCategory, saveCategory } from "@/lib/actions/admin";
import { slugify } from "@/lib/admin-shared";
import { Button, Card, Field, inputCls } from "./ui";
import { ImageUploader } from "./ImageUploader";

type Cat = { id: number; name: string; parentId: number | null };

export function CategoryForm({ category, all, defaultParent }: { category: Category | null; all: Cat[]; defaultParent: number | null }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [parentId, setParentId] = useState<number | null>(category?.parentId ?? defaultParent);
  const [description, setDescription] = useState(category?.description ?? "");
  const [image, setImage] = useState<string[]>(category?.image ? [category.image] : []);
  const [sortOrder, setSortOrder] = useState(String(category?.sortOrder ?? 0));

  // A category can't become a child of itself or of its own descendants.
  const branch = new Set<number>(category ? [category.id] : []);
  for (let grew = branch.size > 0; grew; ) {
    grew = false;
    for (const c of all)
      if (c.parentId && branch.has(c.parentId) && !branch.has(c.id)) {
        branch.add(c.id);
        grew = true;
      }
  }
  const options: { id: number; label: string }[] = [];
  const walk = (pid: number | null, depth: number) =>
    all
      .filter((c) => c.parentId === pid && !branch.has(c.id))
      .forEach((c) => {
        options.push({ id: c.id, label: `${"— ".repeat(depth)}${c.name}` });
        walk(c.id, depth + 1);
      });
  walk(null, 0);

  const save = () =>
    start(async () => {
      setMessage(null);
      const res = await saveCategory(category?.id ?? null, {
        name,
        slug,
        parentId,
        description,
        image: image[0] ?? null,
        sortOrder,
      });
      if (!res.ok) return setMessage({ ok: false, text: res.error });
      setMessage({ ok: true, text: "შენახულია ✓" });
      if (!category) router.replace(`/admin/categories/${res.id}`);
      else router.refresh();
    });

  const remove = () => {
    if (!category || !confirm(`წაიშალოს „${category.name}“? პროდუქცია არ წაიშლება, მხოლოდ ამ კატეგორიიდან მოიხსნება.`)) return;
    start(async () => {
      const res = await deleteCategory(category.id);
      if (!res.ok) return setMessage({ ok: false, text: res.error });
      router.replace("/admin/categories");
    });
  };

  return (
    <form
      className="grid lg:grid-cols-[1fr_320px] gap-5 items-start"
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
    >
      <Card>
        <div className="grid gap-4">
          <Field label="დასახელება *">
            <input
              value={name}
              required
              onChange={(e) => {
                setName(e.target.value);
                if (!category) setSlug(slugify(e.target.value));
              }}
              className={inputCls}
            />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="ბმული (slug)">
              <input value={slug} onChange={(e) => setSlug(e.target.value)} className={inputCls} />
            </Field>
            <Field label="მშობელი კატეგორია">
              <select value={parentId ?? ""} onChange={(e) => setParentId(Number(e.target.value) || null)} className={inputCls}>
                <option value="">— მთავარი კატეგორია —</option>
                {options.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="აღწერა">
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={inputCls} />
          </Field>
          <Field label="რიგითობა" hint="ნაკლები რიცხვი = უფრო მაღლა">
            <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className={`${inputCls} max-w-32`} />
          </Field>
          <div>
            <span className="block text-sm font-semibold mb-1.5">სურათი</span>
            <ImageUploader value={image} onChange={(urls) => setImage(urls.slice(-1))} max={1} />
          </div>
        </div>
      </Card>
      <Card>
        <div className="grid gap-3">
          <Button disabled={pending}>{pending ? "ინახება…" : "შენახვა"}</Button>
          {message && <p className={`text-sm ${message.ok ? "text-green-700" : "text-red-600"}`}>{message.text}</p>}
          {category && (
            <>
              <Link href={`/admin/categories/new?parent=${category.id}`} className="text-center text-sm font-semibold text-[#174abc] py-2">
                + ქვეკატეგორიის დამატება
              </Link>
              <Link href={`/admin/products?cat=${category.id}`} className="text-center text-sm font-semibold text-[#174abc] py-2">
                ამ კატეგორიის პროდუქცია →
              </Link>
              <Button type="button" variant="danger" onClick={remove} disabled={pending}>
                კატეგორიის წაშლა
              </Button>
            </>
          )}
        </div>
      </Card>
    </form>
  );
}
