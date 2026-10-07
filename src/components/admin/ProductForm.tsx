"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Product, Spec } from "@/db/schema";
import { deleteProduct, saveProduct } from "@/lib/actions/admin";
import { slugify } from "@/lib/admin-shared";
import { Button, Card, Field, inputCls } from "./ui";
import { ImageUploader } from "./ImageUploader";

type Cat = { id: number; name: string; parentId: number | null };

export function ProductForm({ product, categories, selected }: { product: Product | null; categories: Cat[]; selected: number[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [sku, setSku] = useState(product?.sku ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [salePrice, setSalePrice] = useState(product?.salePrice != null ? String(product.salePrice) : "");
  const [inStock, setInStock] = useState(product?.inStock ?? true);
  const [stockQty, setStockQty] = useState(product?.stockQty != null ? String(product.stockQty) : "");
  const tracked = stockQty.trim() !== "";
  const [published, setPublished] = useState(product?.published ?? true);
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [summary, setSummary] = useState(product?.summary ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [specs, setSpecs] = useState<Spec[]>(product?.specs ?? []);
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [cats, setCats] = useState<number[]>(selected);
  const [catFilter, setCatFilter] = useState("");

  const toggleCat = (id: number) => {
    setCats((cs) => {
      if (cs.includes(id)) return cs.filter((c) => c !== id);
      // Selecting a subcategory also selects its parents, like WooCommerce did.
      const add = [id];
      for (let p = categories.find((c) => c.id === id)?.parentId; p; p = categories.find((c) => c.id === p)?.parentId)
        add.push(p);
      return [...new Set([...cs, ...add])];
    });
  };

  const submit = () =>
    start(async () => {
      setMessage(null);
      const res = await saveProduct(product?.id ?? null, {
        name,
        slug,
        sku,
        price: price || 0,
        salePrice: salePrice || null,
        inStock,
        stockQty: tracked ? stockQty : null,
        published,
        featured,
        summary,
        description,
        specs,
        images,
        categoryIds: cats,
      });
      if (!res.ok) return setMessage({ ok: false, text: res.error });
      setMessage({ ok: true, text: "შენახულია ✓" });
      if (!product) router.replace(`/admin/products/${res.id}`);
      else router.refresh();
    });

  const remove = () => {
    if (!product || !confirm(`წაიშალოს „${product.name}“? ამის დაბრუნება შეუძლებელია.`)) return;
    start(async () => {
      await deleteProduct(product.id);
      router.replace("/admin/products");
    });
  };

  const roots = categories.filter((c) => !c.parentId);
  const childrenOf = (id: number) => categories.filter((c) => c.parentId === id);
  const matches = (c: Cat) => !catFilter || c.name.toLowerCase().includes(catFilter.toLowerCase());

  const renderCat = (c: Cat, depth: number): React.ReactNode => {
    const kids = childrenOf(c.id);
    const visible = matches(c) || kids.some((k) => matches(k) || childrenOf(k.id).some(matches));
    if (!visible) return null;
    return (
      <div key={c.id}>
        <label className="flex items-center gap-2 py-1 cursor-pointer" style={{ paddingLeft: depth * 18 }}>
          <input type="checkbox" checked={cats.includes(c.id)} onChange={() => toggleCat(c.id)} className="h-4 w-4 accent-[#174abc]" />
          <span className={depth === 0 ? "font-semibold" : ""}>{c.name}</span>
        </label>
        {kids.map((k) => renderCat(k, depth + 1))}
      </div>
    );
  };

  return (
    <form
      className="grid lg:grid-cols-[1fr_320px] gap-5 items-start"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <div className="grid gap-5">
        <Card>
          <div className="grid gap-4">
            <Field label="დასახელება *">
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!product) setSlug(slugify(e.target.value));
                }}
                required
                className={inputCls}
              />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="ბმული (slug)" hint="ავტომატურად იქმნება სახელიდან">
                <input value={slug} onChange={(e) => setSlug(e.target.value)} className={inputCls} />
              </Field>
              <Field label="კოდი (SKU)">
                <input value={sku} onChange={(e) => setSku(e.target.value)} className={inputCls} />
              </Field>
            </div>
          </div>
        </Card>

        <Card title="სურათები">
          <ImageUploader value={images} onChange={setImages} />
        </Card>

        <Card title="აღწერა">
          <div className="grid gap-4">
            <Field label="მოკლე აღწერა">
              <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} className={inputCls} />
            </Field>
            <Field label="სრული აღწერა">
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6} className={inputCls} />
            </Field>
          </div>
        </Card>

        <Card
          title="მახასიათებლები"
          actions={
            <Button type="button" variant="secondary" onClick={() => setSpecs([...specs, { label: "", value: "" }])}>
              + დამატება
            </Button>
          }
        >
          {specs.length === 0 && <p className="text-slate-500 text-sm">მაგ. ზომა, წონა, მასალა, ფერი.</p>}
          <div className="grid gap-2">
            {specs.map((s, i) => (
              <div key={i} className="flex gap-2">
                <input
                  placeholder="მაგ. წონა"
                  value={s.label}
                  onChange={(e) => setSpecs(specs.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))}
                  className={`${inputCls} w-2/5`}
                />
                <input
                  placeholder="მაგ. 3.1 კგ"
                  value={s.value}
                  onChange={(e) => setSpecs(specs.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))}
                  className={inputCls}
                />
                <Button type="button" variant="danger" onClick={() => setSpecs(specs.filter((_, j) => j !== i))} aria-label="წაშლა">
                  ✕
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-5 lg:sticky lg:top-6">
        <Card>
          <div className="grid gap-3">
            <Button disabled={pending}>{pending ? "ინახება…" : "შენახვა"}</Button>
            {message && <p className={`text-sm ${message.ok ? "text-green-700" : "text-red-600"}`}>{message.text}</p>}
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="h-4 w-4 accent-[#174abc]" />
              საიტზე გამოჩნდეს
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={tracked ? Number(stockQty) > 0 : inStock}
                disabled={tracked}
                onChange={(e) => setInStock(e.target.checked)}
                className="h-4 w-4 accent-[#174abc]"
              />
              მარაგშია {tracked && <span className="text-xs text-slate-500">(რაოდენობით)</span>}
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="h-4 w-4 accent-[#174abc]" />
              რეკომენდებული (სიაში პირველი)
            </label>
            {product && (
              <Button type="button" variant="danger" onClick={remove} disabled={pending}>
                პროდუქტის წაშლა
              </Button>
            )}
          </div>
        </Card>

        <Card title="ფასი">
          <div className="grid grid-cols-2 gap-3">
            <Field label="ფასი ₾" hint="მაგ. 12.50">
              <input type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} className={inputCls} />
            </Field>
            <Field label="ფასდაკლებით ₾" hint="ცარიელი = არა">
              <input type="number" step="0.01" min="0" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} className={inputCls} />
            </Field>
          </div>
        </Card>

        <Card title="მარაგი">
          <Field label="რაოდენობა მარაგში" hint="ცარიელი = არ ითვლება. შეკვეთისას ავტომატურად აკლდება.">
            <input type="number" min="0" step="1" value={stockQty} onChange={(e) => setStockQty(e.target.value)} placeholder="არ ითვლება" className={inputCls} />
          </Field>
          {tracked && Number(stockQty) <= 5 && (
            <p className={`text-sm mt-2 ${Number(stockQty) === 0 ? "text-red-600" : "text-amber-600"}`}>
              {Number(stockQty) === 0 ? "ამოწურულია — საიტზე „არ არის მარაგში“" : "მცირე მარაგი — საიტზე ჩანს „დარჩა N ც.“"}
            </p>
          )}
        </Card>

        <Card title={`კატეგორიები (${cats.length})`}>
          <input placeholder="ფილტრი…" value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className={`${inputCls} mb-2`} />
          <div className="max-h-96 overflow-y-auto text-sm">{roots.map((r) => renderCat(r, 0))}</div>
        </Card>
      </div>
    </form>
  );
}
