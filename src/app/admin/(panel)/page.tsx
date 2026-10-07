import Link from "next/link";
import { desc, sql } from "drizzle-orm";
import { db, orders, products, categories } from "@/db";
import { requireAdmin } from "@/lib/auth";
import { ORDER_STATUS_LABELS } from "@/lib/admin-shared";
import { Card, PageTitle, StatusBadge } from "@/components/admin/ui";
import { money } from "@/lib/format";

export default async function Dashboard() {
  await requireAdmin();
  const [[stats], [cats], recent] = await Promise.all([
    db
      .select({
        total: sql<number>`count(*)::int`,
        published: sql<number>`count(*) filter (where ${products.published})::int`,
        noPrice: sql<number>`count(*) filter (where ${products.price} = 0 and ${products.published})::int`,
        noImage: sql<number>`count(*) filter (where jsonb_array_length(${products.images}) = 0)::int`,
      })
      .from(products),
    db.select({ n: sql<number>`count(*)::int` }).from(categories),
    db.select().from(orders).orderBy(desc(orders.createdAt)).limit(8),
  ]);
  const newOrders = recent.filter((o) => o.status === "new").length;

  const tiles = [
    ["ახალი შეკვეთები", newOrders, "/admin/orders?status=new"],
    ["აქტიური პროდუქტი", `${stats.published} / ${stats.total}`, "/admin/products"],
    ["კატეგორია", cats.n, "/admin/categories"],
    ["ფასის გარეშე", stats.noPrice, "/admin/products?filter=noprice"],
  ] as const;

  return (
    <>
      <PageTitle>მთავარი</PageTitle>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {tiles.map(([label, value, href]) => (
          <Link key={label} href={href} className="bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-300">
            <div className="text-sm text-slate-500">{label}</div>
            <div className="text-2xl font-bold mt-1">{value}</div>
          </Link>
        ))}
      </div>
      <Card title="ბოლო შეკვეთები" actions={<Link href="/admin/orders" className="text-sm font-semibold text-[#174abc]">ყველა →</Link>}>
        {recent.length === 0 ? (
          <p className="text-slate-500">შეკვეთები ჯერ არ არის.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {recent.map((o) => (
              <Link key={o.id} href={`/admin/orders/${o.id}`} className="flex flex-wrap items-center gap-3 py-3 hover:bg-slate-50 -mx-2 px-2 rounded">
                <span className="font-semibold">#{o.id}</span>
                <span className="flex-1 min-w-0 truncate">{o.name} · {o.phone}</span>
                <StatusBadge status={o.status} label={ORDER_STATUS_LABELS[o.status]} />
                <span className="font-semibold w-24 text-right">{money(o.total)} ₾</span>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}
