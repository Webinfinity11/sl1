import Image from "next/image";
import Link from "next/link";
import { sql } from "drizzle-orm";
import { categories, db, productCategories, type Category } from "@/db";
import { requireAdmin } from "@/lib/auth";
import { Button, PageTitle } from "@/components/admin/ui";
import { HomeCategoriesEditor } from "@/components/admin/HomeCategoriesEditor";
import { getCategoryTree, type CategoryNode } from "@/lib/data";
import { getHomeCategoryIds } from "@/lib/content";

export default async function CategoriesAdmin() {
  await requireAdmin();
  const [cats, counts, tree, picked] = await Promise.all([
    db.select().from(categories).orderBy(categories.sortOrder, categories.name),
    db
      .select({ id: productCategories.categoryId, n: sql<number>`count(*)::int` })
      .from(productCategories)
      .groupBy(productCategories.categoryId),
    getCategoryTree(),
    getHomeCategoryIds(),
  ]);
  // Same fallback as the home page: the first 12 top-level categories until a pick is saved.
  const homeIds = picked ?? tree.slice(0, 12).map((c) => c.id);
  const homeOptions = (function flat(list: CategoryNode[], depth: number): { id: number; name: string; depth: number; count: number }[] {
    return list.flatMap((c) => [{ id: c.id, name: c.name, depth, count: c.count }, ...flat(c.children, depth + 1)]);
  })(tree, 0);
  const count = (id: number) => counts.find((c) => c.id === id)?.n ?? 0;
  const childrenOf = (id: number | null) => cats.filter((c) => c.parentId === id);

  const rows = (list: Category[], depth: number): React.ReactNode[] =>
    list.flatMap((c) => [
      <Link
        key={c.id}
        href={`/admin/categories/${c.id}`}
        className="flex items-center gap-3 py-2.5 px-3 hover:bg-slate-50"
        style={{ paddingLeft: 12 + depth * 28 }}
      >
        <span className="w-9 h-8 relative shrink-0">
          {c.image && <Image src={c.image} alt="" fill sizes="36px" className="object-contain" />}
        </span>
        <span className={depth === 0 ? "font-bold flex-1" : "flex-1"}>{c.name}</span>
        <span className="text-sm text-slate-400">{count(c.id)} პროდ.</span>
      </Link>,
      ...rows(childrenOf(c.id), depth + 1),
    ]);

  return (
    <>
      <PageTitle
        actions={
          <Link href="/admin/categories/new">
            <Button>+ ახალი კატეგორია</Button>
          </Link>
        }
      >
        კატეგორიები <span className="text-slate-400 font-normal text-lg">({cats.length})</span>
      </PageTitle>
      <div className="mb-6">
        <HomeCategoriesEditor options={homeOptions} initial={homeIds} />
      </div>
      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">{rows(childrenOf(null), 0)}</div>
    </>
  );
}
