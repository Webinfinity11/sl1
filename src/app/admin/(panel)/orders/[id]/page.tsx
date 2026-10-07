import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, orders } from "@/db";
import { requireAdmin } from "@/lib/auth";
import { money } from "@/lib/format";
import { Card, PageTitle } from "@/components/admin/ui";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";

export default async function OrderDetail({ params }: PageProps<"/admin/orders/[id]">) {
  await requireAdmin();
  const [order] = await db.select().from(orders).where(eq(orders.id, Number((await params).id) || 0));
  if (!order) notFound();
  const quote = order.items.some((i) => i.price === 0);

  return (
    <>
      <PageTitle actions={<OrderStatusSelect id={order.id} status={order.status} />}>
        <Link href="/admin/orders" className="text-slate-400 font-normal">
          შეკვეთები /
        </Link>{" "}
        #{order.id}
      </PageTitle>
      <div className="grid lg:grid-cols-[1fr_320px] gap-5 items-start">
        <Card title="პროდუქცია">
          <div className="divide-y divide-slate-100">
            {order.items.map((i) => (
              <div key={i.productId} className="flex items-center gap-3 py-3">
                <div className="w-14 h-14 relative shrink-0 bg-slate-50 rounded">
                  {i.image && <Image src={i.image} alt="" fill sizes="56px" className="object-contain" />}
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/admin/products/${i.productId}`} className="font-semibold hover:text-[#174abc]">
                    {i.name}
                  </Link>
                  {i.sku && <div className="text-xs text-slate-500">კოდი: {i.sku}</div>}
                </div>
                <div className="text-right whitespace-nowrap">
                  {i.qty} × {i.price ? `${money(i.price)} ₾` : <span className="text-amber-600">ფასი დასაზუსტებელი</span>}
                  <div className="font-semibold">{i.price ? `${money(i.price * i.qty)} ₾` : "—"}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-4 mt-2 text-lg">
            <span>ჯამი</span>
            <b>{money(order.total)} ₾</b>
          </div>
          {quote && <p className="text-sm text-amber-700 mt-2">შეკვეთაში არის „ფასი შეთანხმებით“ პროდუქცია — დაუკავშირდით კლიენტს.</p>}
        </Card>
        <Card title="მომხმარებელი">
          <dl className="grid gap-3 text-sm">
            <div>
              <dt className="text-slate-500">სახელი</dt>
              <dd className="font-semibold">{order.name}</dd>
            </div>
            <div>
              <dt className="text-slate-500">ტელეფონი</dt>
              <dd>
                <a href={`tel:${order.phone}`} className="font-semibold text-[#174abc]">
                  {order.phone}
                </a>
              </dd>
            </div>
            {order.email && (
              <div>
                <dt className="text-slate-500">ელფოსტა</dt>
                <dd>
                  <a href={`mailto:${order.email}`} className="text-[#174abc]">
                    {order.email}
                  </a>
                </dd>
              </div>
            )}
            <div>
              <dt className="text-slate-500">მისამართი</dt>
              <dd className="whitespace-pre-line">{order.address}</dd>
            </div>
            {order.comment && (
              <div>
                <dt className="text-slate-500">კომენტარი</dt>
                <dd className="whitespace-pre-line">{order.comment}</dd>
              </div>
            )}
            <div>
              <dt className="text-slate-500">თარიღი</dt>
              <dd>{order.createdAt.toLocaleString("ka-GE", { timeZone: "Asia/Tbilisi" })}</dd>
            </div>
          </dl>
        </Card>
      </div>
    </>
  );
}
