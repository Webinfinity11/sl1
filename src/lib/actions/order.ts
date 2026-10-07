"use server";

import { and, eq, gte, sql } from "drizzle-orm";
import { updateTag } from "next/cache";
import { z } from "zod";
import { db, orders, products, type OrderItem } from "@/db";
import { getProductsByIds } from "@/lib/data";
import { finalPrice } from "@/lib/format";
import { adjustStock } from "@/lib/stock";
import { notifyNewOrder } from "@/lib/notify";
import { after } from "next/server";

const schema = z.object({
  name: z.string().trim().min(2, "მიუთითეთ სახელი").max(100),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d\s()-]{9,20}$/, "მიუთითეთ სწორი ტელეფონის ნომერი"),
  email: z.union([z.literal(""), z.email("ელფოსტა არასწორია")]).optional(),
  address: z.string().trim().min(5, "მიუთითეთ მიწოდების მისამართი").max(500),
  comment: z.string().trim().max(1000).optional(),
  items: z
    .array(z.object({ id: z.number().int().positive(), qty: z.number().int().min(1).max(999) }))
    .min(1, "კალათა ცარიელია")
    .max(200),
});

export type OrderResult = { ok: true; id: number } | { ok: false; error: string };

export async function placeOrder(input: z.input<typeof schema>): Promise<OrderResult> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const data = parsed.data;

  // Prices and stock always come from the database, never from the browser.
  const found = await getProductsByIds(data.items.map((i) => i.id));
  const items: OrderItem[] = [];
  for (const i of data.items) {
    const p = found.find((f) => f.id === i.id);
    if (!p || !p.inStock) continue;
    if (p.stockQty != null && i.qty > p.stockQty)
      return { ok: false, error: `„${p.name}“ მარაგში მხოლოდ ${p.stockQty} ცალია. შეცვალეთ რაოდენობა კალათაში.` };
    items.push({ productId: p.id, name: p.name, sku: p.sku, price: finalPrice(p), qty: i.qty, image: p.images[0] ?? null });
  }
  if (!items.length) return { ok: false, error: "კალათაში არსებული პროდუქცია აღარ არის ხელმისაწვდომი." };

  // Reserve tracked stock with conditional updates so two simultaneous orders can't oversell.
  const reserved: { productId: number; qty: number }[] = [];
  for (const i of items) {
    const p = found.find((f) => f.id === i.productId)!;
    if (p.stockQty == null) continue;
    const ok = await db
      .update(products)
      .set({ stockQty: sql`${products.stockQty} - ${i.qty}`, inStock: sql`${products.stockQty} - ${i.qty} > 0` })
      .where(and(eq(products.id, p.id), gte(products.stockQty, i.qty)))
      .returning({ id: products.id });
    if (!ok.length) {
      await adjustStock(reserved, 1);
      return { ok: false, error: `„${p.name}“ სამწუხაროდ ახლახან ამოიწურა. განაახლეთ კალათა.` };
    }
    reserved.push({ productId: p.id, qty: i.qty });
  }

  const total = items.reduce((n, i) => n + i.price * i.qty, 0);
  try {
    const [order] = await db
      .insert(orders)
      .values({
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        address: data.address,
        comment: data.comment ?? "",
        items,
        total: Math.round(total * 100) / 100,
      })
      .returning({ id: orders.id });
    if (reserved.length) updateTag("products");
    // Runs after the response is sent, so a slow mail provider never delays checkout.
    after(() => notifyNewOrder({ id: order.id, name: data.name, phone: data.phone, total, items }));
    return { ok: true, id: order.id };
  } catch (e) {
    await adjustStock(reserved, 1);
    throw e;
  }
}
