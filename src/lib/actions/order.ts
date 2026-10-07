"use server";

import { z } from "zod";
import { db, orders, type OrderItem } from "@/db";
import { getProductsByIds } from "@/lib/data";
import { finalPrice } from "@/lib/format";

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

  // Prices always come from the database, never from the browser.
  const found = await getProductsByIds(data.items.map((i) => i.id));
  const items: OrderItem[] = data.items.flatMap((i) => {
    const p = found.find((f) => f.id === i.id);
    if (!p || !p.inStock) return [];
    return [{ productId: p.id, name: p.name, sku: p.sku, price: finalPrice(p), qty: i.qty, image: p.images[0] ?? null }];
  });
  if (!items.length) return { ok: false, error: "კალათაში არსებული პროდუქცია აღარ არის ხელმისაწვდომი." };

  const total = items.reduce((n, i) => n + i.price * i.qty, 0);
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

  return { ok: true, id: order.id };
}
