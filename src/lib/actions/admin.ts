"use server";

import bcrypt from "bcryptjs";
import { put } from "@vercel/blob";
import { and, eq, ne, sql } from "drizzle-orm";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { admins, categories, db, orders, productCategories, products, settings } from "@/db";
import { ORDER_STATUSES, slugify } from "@/lib/admin-shared";
import { adjustStock } from "@/lib/stock";
import { sanitizeSection } from "@/lib/content";
import { contentDefaults, type ContentKey } from "@/lib/content-schema";
import { createSession, destroySession, requireAdmin } from "@/lib/auth";

export type ActionResult = { ok: true; id?: number } | { ok: false; error: string };

const fail = (error: string): ActionResult => ({ ok: false, error });

// ───────── auth ─────────

export async function login(_: unknown, form: FormData): Promise<ActionResult> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  const [admin] = await db.select().from(admins).where(eq(admins.email, email));
  // Compare against a dummy hash too, so timing doesn't reveal which emails exist.
  const ok = await bcrypt.compare(password, admin?.passwordHash ?? "$2b$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinva");
  if (!admin || !ok) return fail("ელფოსტა ან პაროლი არასწორია");
  await createSession(admin.id, admin.email);
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

export async function changePassword(_: unknown, form: FormData): Promise<ActionResult> {
  const session = await requireAdmin();
  const current = String(form.get("current") ?? "");
  const next = String(form.get("next") ?? "");
  if (next.length < 8) return fail("ახალი პაროლი მინიმუმ 8 სიმბოლო უნდა იყოს");
  const [admin] = await db.select().from(admins).where(eq(admins.id, session.id));
  if (!admin || !(await bcrypt.compare(current, admin.passwordHash))) return fail("მიმდინარე პაროლი არასწორია");
  await db.update(admins).set({ passwordHash: await bcrypt.hash(next, 10) }).where(eq(admins.id, admin.id));
  return { ok: true };
}

// ───────── images ─────────

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];

export async function uploadImage(form: FormData): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  await requireAdmin();
  const file = form.get("file");
  if (!(file instanceof File)) return { ok: false, error: "ფაილი ვერ მოიძებნა" };
  if (!IMAGE_TYPES.includes(file.type)) return { ok: false, error: "მხოლოდ სურათები (JPG, PNG, WEBP)" };
  if (file.size > 6 * 1024 * 1024) return { ok: false, error: "სურათი 6MB-ზე მეტია" };
  const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const blob = await put(`uploads/${Date.now()}.${ext}`, file, { access: "public", addRandomSuffix: true });
  return { ok: true, url: blob.url };
}

// ───────── products ─────────

const money = z.coerce.number().min(0).max(1_000_000);
const productSchema = z.object({
  name: z.string().trim().min(2, "მიუთითეთ დასახელება").max(200),
  slug: z.string().trim().max(100).optional(),
  sku: z.string().trim().max(60).optional(),
  price: money,
  salePrice: z.union([z.literal(""), z.null(), money]).optional(),
  inStock: z.boolean(),
  stockQty: z.union([z.literal(""), z.null(), z.coerce.number().int().min(0).max(1_000_000)]).optional(),
  published: z.boolean(),
  featured: z.boolean(),
  summary: z.string().max(5000),
  description: z.string().max(20000),
  specs: z.array(z.object({ label: z.string().trim().max(80), value: z.string().trim().max(200) })).max(40),
  images: z.array(z.url()).max(12),
  categoryIds: z.array(z.number().int()).max(30),
});
export type ProductInput = z.input<typeof productSchema>;

async function uniqueSlug(table: typeof products | typeof categories, base: string, id?: number) {
  const root = base || "item";
  for (let n = 1; ; n++) {
    const slug = n === 1 ? root : `${root}-${n}`;
    const [hit] = await db
      .select({ id: table.id })
      .from(table)
      .where(id ? and(eq(table.slug, slug), ne(table.id, id)) : eq(table.slug, slug));
    if (!hit) return slug;
  }
}

export async function saveProduct(id: number | null, input: ProductInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0].message);
  const d = parsed.data;
  const sale = d.salePrice === "" || d.salePrice == null ? null : Number(d.salePrice);
  if (sale !== null && sale >= d.price) return fail("ფასდაკლებული ფასი ძველ ფასზე ნაკლები უნდა იყოს");

  const stockQty = d.stockQty === "" || d.stockQty == null ? null : Number(d.stockQty);
  const values = {
    name: d.name,
    slug: await uniqueSlug(products, slugify(d.slug || d.name), id ?? undefined),
    sku: d.sku || null,
    price: d.price,
    salePrice: sale,
    // A tracked stock count decides availability on its own.
    inStock: stockQty === null ? d.inStock : stockQty > 0,
    stockQty,
    published: d.published,
    featured: d.featured,
    summary: d.summary.trim(),
    description: d.description.trim(),
    specs: d.specs.filter((s) => s.label && s.value),
    images: d.images,
    updatedAt: new Date(),
  };

  let productId = id;
  if (id) await db.update(products).set(values).where(eq(products.id, id));
  else [{ id: productId }] = await db.insert(products).values(values).returning({ id: products.id });

  await db.delete(productCategories).where(eq(productCategories.productId, productId!));
  if (d.categoryIds.length)
    await db
      .insert(productCategories)
      .values([...new Set(d.categoryIds)].map((categoryId) => ({ productId: productId!, categoryId })));

  updateTag("products");
  return { ok: true, id: productId! };
}

export async function deleteProduct(id: number): Promise<ActionResult> {
  await requireAdmin();
  await db.delete(products).where(eq(products.id, id));
  updateTag("products");
  return { ok: true };
}

export async function setProductFlag(id: number, flag: "published" | "inStock", value: boolean): Promise<ActionResult> {
  await requireAdmin();
  await db.update(products).set({ [flag]: value, updatedAt: new Date() }).where(eq(products.id, id));
  updateTag("products");
  return { ok: true };
}

// ───────── categories ─────────

const categorySchema = z.object({
  name: z.string().trim().min(2, "მიუთითეთ დასახელება").max(120),
  slug: z.string().trim().max(100).optional(),
  parentId: z.number().int().nullable(),
  description: z.string().max(2000),
  image: z.union([z.url(), z.literal(""), z.null()]),
  sortOrder: z.coerce.number().int().min(-1000).max(1000),
});
export type CategoryInput = z.input<typeof categorySchema>;

export async function saveCategory(id: number | null, input: CategoryInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0].message);
  const d = parsed.data;

  if (id && d.parentId) {
    // Refuse to move a category under itself or one of its own descendants.
    const all = await db.select({ id: categories.id, parentId: categories.parentId }).from(categories);
    for (let p: number | null = d.parentId; p; p = all.find((c) => c.id === p)?.parentId ?? null)
      if (p === id) return fail("კატეგორია საკუთარ ქვეკატეგორიაში ვერ გადავა");
  }

  const values = {
    name: d.name,
    slug: await uniqueSlug(categories, slugify(d.slug || d.name), id ?? undefined),
    parentId: d.parentId,
    description: d.description.trim(),
    image: d.image || null,
    sortOrder: d.sortOrder,
  };
  let categoryId = id;
  if (id) await db.update(categories).set(values).where(eq(categories.id, id));
  else [{ id: categoryId }] = await db.insert(categories).values(values).returning({ id: categories.id });
  updateTag("categories");
  return { ok: true, id: categoryId! };
}

export async function deleteCategory(id: number): Promise<ActionResult> {
  await requireAdmin();
  const [{ children }] = await db
    .select({ children: sql<number>`count(*)::int` })
    .from(categories)
    .where(eq(categories.parentId, id));
  if (children > 0) return fail("ჯერ წაშალეთ ან გადაიტანეთ ქვეკატეგორიები");
  await db.delete(categories).where(eq(categories.id, id));
  updateTag("categories");
  updateTag("products");
  return { ok: true };
}

// ───────── orders ─────────

export async function setOrderStatus(id: number, status: string): Promise<ActionResult> {
  await requireAdmin();
  if (!ORDER_STATUSES.includes(status as (typeof ORDER_STATUSES)[number])) return fail("უცნობი სტატუსი");
  const [order] = await db.select().from(orders).where(eq(orders.id, id));
  if (!order) return fail("შეკვეთა ვერ მოიძებნა");
  if (order.status === status) return { ok: true };
  // Cancelling returns the units to stock; re-opening a cancelled order takes them again.
  const units = order.items.map((i) => ({ productId: i.productId, qty: i.qty }));
  if (status === "cancelled") await adjustStock(units, 1);
  else if (order.status === "cancelled") await adjustStock(units, -1);
  await db.update(orders).set({ status }).where(eq(orders.id, id));
  updateTag("products");
  return { ok: true };
}

// ───────── site content ─────────

export async function saveContent(key: string, value: unknown): Promise<ActionResult> {
  await requireAdmin();
  if (!(key in contentDefaults)) return fail("უცნობი სექცია");
  const clean = sanitizeSection(key as ContentKey, value);
  await db
    .insert(settings)
    .values({ key, value: clean })
    .onConflictDoUpdate({ target: settings.key, set: { value: clean, updatedAt: new Date() } });
  updateTag("content");
  return { ok: true };
}

export async function resetContent(key: string): Promise<ActionResult> {
  await requireAdmin();
  if (!(key in contentDefaults)) return fail("უცნობი სექცია");
  await db.delete(settings).where(eq(settings.key, key));
  updateTag("content");
  return { ok: true };
}
