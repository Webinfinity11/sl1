import "server-only";
import type { OrderItem } from "@/db";

export type NewOrder = { id: number; name: string; phone: string; total: number; items: OrderItem[] };

/**
 * Called after every successful checkout. Orders already appear in the admin dashboard;
 * this is the single place to add the email (or SMS/Telegram) notification later.
 */
export async function notifyNewOrder(order: NewOrder) {
  console.log(`[order] #${order.id} ${order.name} ${order.phone} — ${order.total.toFixed(2)} ₾, ${order.items.length} items`);
}
