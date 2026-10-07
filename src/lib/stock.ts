import "server-only";
import { and, eq, sql } from "drizzle-orm";
import { db, products } from "@/db";

/** Adds (sign 1) or removes (sign -1) units for tracked products; untracked ones are skipped. */
export async function adjustStock(items: { productId: number; qty: number }[], sign: 1 | -1) {
  for (const i of items) {
    await db
      .update(products)
      .set({
        stockQty: sql`${products.stockQty} + ${sign * i.qty}`,
        inStock: sql`${products.stockQty} + ${sign * i.qty} > 0`,
      })
      .where(and(eq(products.id, i.productId), sql`${products.stockQty} is not null`));
  }
}
