import Image from "next/image";
import Link from "next/link";
import { and, desc, eq, ilike, inArray, or, sql, type SQL } from "drizzle-orm";
import { categories, db, productCategories, products } from "@/db";
import { requireAdmin } from "@/lib/auth";
import { money } from "@/lib/format";
import { Button, PageTitle, inputCls } from "@/components/admin/ui";
import { FlagToggle } from "@/components/admin/FlagToggle";

const PER_PAGE = 50;
const filters = { "": "ყველა", hidden: "დამალული", noprice: "ფასის გარეშე", noimage: "სურათის გარეშე", out: "არ არის მარაგში", low: "მცირე მარაგი (≤5)" };

export default async function ProductsAdmin({ searchParams }: PageProps<"/admin/products">) {
  await requireAdmin();
  const sp = (await searchParams) as Record<string, string | undefined>;
  const q = sp.q?.trim() ?? "";
  const cat = Number(sp.cat) || 0;
  const filter = (sp.filter ?? "") as keyof typeof filters;
  const page = Math.max(1, Number(sp.page) || 1);

  const where: (SQL | undefined)[] = [];
  if (q) where.push(or(ilike(products.name, `%${q}%`), ilike(products.sku, `%${q}%`)));
  if (cat) {
    // Include products in every descendant of the chosen category.
    const all = await db.select({ id: categories.id, parentId: categories.parentId }).from(categories);
    const ids = [cat];
    for (let i = 0; i < ids.length; i++) all.filter((c) => c.parentId === ids[i]).forEach((c) => ids.push(c.id));
    where.push(
      inArray(products.id, db.select({ id: productCategories.productId }).from(productCategories).where(inArray(productCategories.categoryId, ids))),
    );
  }
  if (filter === "hidden") where.push(eq(products.published, false));
  if (filter === "noprice") where.push(eq(products.price, 0));
  if (filter === "noimage") where.push(sql`jsonb_array_length(${products.images}) = 0`);
  if (filter === "out") where.push(eq(products.inStock, false));
  if (filter === "low") where.push(sql`${products.stockQty} <= 5`);

  const cond = and(...where);
  const [rows, [{ total }], cats] = await Promise.all([
    db.select().from(products).where(cond).orderBy(desc(products.updatedAt), desc(products.id)).limit(PER_PAGE).offset((page - 1) * PER_PAGE),
    db.select({ total: sql<number>`count(*)::int` }).from(products).where(cond),
    db.select({ id: categories.id, name: categories.name, parentId: categories.parentId }).from(categories).orderBy(categories.name),
  ]);
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));
  const link = (patch: Record<string, string | number>) => {
    const p = new URLSearchParams(Object.entries({ ...sp, ...patch }).filter(([, v]) => v !== "" && v !== undefined && v !== 0) as [string, string][]);
    return `/admin/products?${p}`;
  };
  const roots = cats.filter((c) => !c.parentId);

  return (
    <>
      <PageTitle
        actions={
          <Link href="/admin/products/new">
            <Button>+ ახალი პროდუქტი</Button>
          </Link>
        }
      >
        პროდუქცია <span className="text-slate-400 font-normal text-lg">({total})</span>
      </PageTitle>

      <form className="flex flex-wrap gap-2 mb-3" action="/admin/products">
        <input name="q" defaultValue={q} placeholder="ძიება სახელით ან კოდით" className={`${inputCls} flex-1 min-w-48`} />
        <select name="cat" defaultValue={cat || ""} className={`${inputCls} w-auto max-w-64`}>
          <option value="">ყველა კატეგორია</option>
          {roots.map((r) => (
            <optgroup key={r.id} label={r.name}>
              <option value={r.id}>{r.name} (ყველა)</option>
              {cats
                .filter((c) => c.parentId === r.id)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
        {filter && <input type="hidden" name="filter" value={filter} />}
        <Button variant="secondary">ძიება</Button>
      </form>
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(filters).map(([key, label]) => (
          <Link
            key={key}
            href={link({ filter: key, page: 1 })}
            className={`rounded-full px-3 py-1.5 text-sm border ${filter === key ? "bg-[#174abc] text-white border-[#174abc]" : "bg-white border-slate-300"}`}
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="p-3 w-16"></th>
              <th className="p-3">დასახელება</th>
              <th className="p-3">კოდი</th>
              <th className="p-3 text-right">ფასი</th>
              <th className="p-3 text-center">მარაგში</th>
              <th className="p-3 text-center">საიტზე</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="p-2">
                  <div className="w-12 h-12 relative bg-slate-50 rounded">
                    {p.images[0] && <Image src={p.images[0]} alt="" fill sizes="48px" className="object-contain" />}
                  </div>
                </td>
                <td className="p-3">
                  <Link href={`/admin/products/${p.id}`} className="font-semibold hover:text-[#174abc]">
                    {p.name}
                  </Link>
                </td>
                <td className="p-3 text-slate-500">{p.sku}</td>
                <td className="p-3 text-right whitespace-nowrap">
                  {p.salePrice ? (
                    <>
                      <b className="text-orange-700">{money(p.salePrice)}</b> <s className="text-slate-400">{money(p.price)}</s>
                    </>
                  ) : p.price ? (
                    money(p.price)
                  ) : (
                    <span className="text-amber-600">—</span>
                  )}
                </td>
                <td className="p-3 text-center">
                  {p.stockQty != null ? (
                    <span className={`font-semibold ${p.stockQty === 0 ? "text-red-600" : p.stockQty <= 5 ? "text-amber-600" : "text-green-700"}`}>{p.stockQty} ც.</span>
                  ) : (
                    <FlagToggle id={p.id} flag="inStock" value={p.inStock} />
                  )}
                </td>
                <td className="p-3 text-center">
                  <FlagToggle id={p.id} flag="published" value={p.published} />
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  ვერაფერი მოიძებნა
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <div className="flex gap-2 justify-center mt-5">
          {page > 1 && <Link className="px-3 py-2 rounded-lg border bg-white" href={link({ page: page - 1 })}>← წინა</Link>}
          <span className="px-3 py-2">
            {page} / {pages}
          </span>
          {page < pages && <Link className="px-3 py-2 rounded-lg border bg-white" href={link({ page: page + 1 })}>შემდეგი →</Link>}
        </div>
      )}
    </>
  );
}
