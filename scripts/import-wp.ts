// One-time import of the WooCommerce export (wp-export/*.ndjson) into Postgres + Vercel Blob.
// Re-runnable: rows are upserted by wp_id and images already in Blob are reused.
// Usage: npx tsx scripts/import-wp.ts
import "./env";
import { readFileSync } from "node:fs";
import { put, head } from "@vercel/blob";
import { sql } from "drizzle-orm";
import { db, categories, products, productCategories, type Spec } from "../src/db";

type WpImage = { src: string };
type WpCategory = {
  id: number;
  name: string;
  slug: string;
  parent: number;
  description: string;
  image: WpImage | null;
  menu_order: number;
  count: number;
};
type WpProduct = {
  id: number;
  name: string;
  slug: string;
  sku: string;
  status: string;
  featured: boolean;
  regular_price: string;
  sale_price: string;
  price: string;
  stock_status: string;
  short_description: string;
  description: string;
  date_created_gmt: string;
  categories: { id: number }[];
  images: WpImage[];
};

const load = <T>(f: string): T[] =>
  readFileSync(`wp-export/${f}.ndjson`, "utf8").trim().split("\n").map((l) => JSON.parse(l));

const entities: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', "#039": "'", nbsp: " ", ndash: "–", mdash: "—" };
const decodeEntities = (s: string) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/&([a-z0-9#]+);/gi, (m, e) => entities[e] ?? m);

const toText = (html: string) =>
  decodeEntities(
    html
      .replace(/<(br|\/p|\/li|\/h\d)[^>]*>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/[ \t]+/g, " ")
      .replace(/\n\s*\n+/g, "\n"),
  ).trim();

const decodeSlug = (s: string) => {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
};

// Woodmart stores specs as <span class="lstbef">ლეიბლი:</span>მნიშვნელობა list items.
function parseSpecs(html: string): Spec[] {
  const specs: Spec[] = [];
  for (const li of html.split(/<li[\s>]/i).slice(1)) {
    const m = li.match(/lstbef">([^<]+)<\/span>([\s\S]*?)<\/span>/);
    if (!m) continue;
    const label = toText(m[1]).replace(/:\s*$/, "");
    const value = toText(m[2]);
    if (label && value) specs.push({ label, value });
  }
  return specs;
}

const norm = (s: string) => s.replace(/\s+/g, "");
const designImages: Record<string, string> = JSON.parse(readFileSync("scripts/category-images.json", "utf8"));
const designImageFor = (name: string) =>
  Object.entries(designImages).find(([k]) => norm(name).startsWith(norm(k)))?.[1] ?? null;

async function mirror(src: string, path: string): Promise<string | null> {
  const ext = (src.split("?")[0].match(/\.(\w{3,4})$/)?.[1] ?? "jpg").toLowerCase();
  const pathname = `${path}.${ext}`;
  try {
    return (await head(pathname)).url;
  } catch {}
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(src);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = Buffer.from(await res.arrayBuffer());
      const blob = await put(pathname, body, {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: res.headers.get("content-type") ?? undefined,
      });
      return blob.url;
    } catch (e) {
      if (attempt === 3) {
        console.warn(`  image failed ${src}: ${(e as Error).message}`);
        return null;
      }
    }
  }
  return null;
}

async function pool<T>(items: T[], size: number, fn: (item: T, i: number) => Promise<void>) {
  let next = 0;
  await Promise.all(
    Array.from({ length: size }, async () => {
      while (next < items.length) {
        const i = next++;
        await fn(items[i], i);
      }
    }),
  );
}

async function main() {
  const wpCats = load<WpCategory>("categories");
  const wpProducts = load<WpProduct>("products");

  // Categories: insert flat, then wire parents once every wp_id has a local id.
  console.log(`categories: ${wpCats.length}`);
  const catId = new Map<number, number>();
  await pool(wpCats, 6, async (c) => {
    const image =
      (c.parent === 0 && designImageFor(c.name)) ||
      (c.image ? await mirror(c.image.src, `categories/${c.id}`) : null);
    const values = {
      wpId: c.id,
      name: decodeEntities(c.name),
      slug: decodeSlug(c.slug),
      description: toText(c.description),
      image,
      sortOrder: c.menu_order,
    };
    const [row] = await db
      .insert(categories)
      .values(values)
      .onConflictDoUpdate({ target: categories.wpId, set: values })
      .returning({ id: categories.id });
    catId.set(c.id, row.id);
  });
  for (const c of wpCats) {
    const parentId = c.parent ? (catId.get(c.parent) ?? null) : null;
    await db.update(categories).set({ parentId }).where(sql`${categories.wpId} = ${c.id}`);
  }

  console.log(`products: ${wpProducts.length}`);
  let done = 0;
  await pool(wpProducts, 8, async (p) => {
    const images: string[] = [];
    for (const [i, img] of p.images.entries()) {
      const url = await mirror(img.src, `products/${p.id}-${i}`);
      if (url) images.push(url);
    }
    const specs = parseSpecs(p.short_description);
    const regular = parseFloat(p.regular_price || p.price) || 0;
    const sale = parseFloat(p.sale_price);
    const values = {
      wpId: p.id,
      name: decodeEntities(p.name).trim(),
      slug: decodeSlug(p.slug) || `product-${p.id}`,
      sku: p.sku || null,
      price: regular,
      salePrice: sale > 0 && sale < regular ? sale : null,
      inStock: p.stock_status !== "outofstock",
      published: p.status === "publish",
      featured: p.featured,
      summary: specs.length ? "" : toText(p.short_description),
      description: toText(p.description),
      specs,
      images,
      createdAt: new Date(p.date_created_gmt + "Z"),
      updatedAt: new Date(),
    };
    const [row] = await db
      .insert(products)
      .values(values)
      .onConflictDoUpdate({ target: products.wpId, set: values })
      .returning({ id: products.id });
    await db.delete(productCategories).where(sql`${productCategories.productId} = ${row.id}`);
    const links = p.categories
      .map((c) => catId.get(c.id))
      .filter((id): id is number => id !== undefined)
      .map((categoryId) => ({ productId: row.id, categoryId }));
    if (links.length) await db.insert(productCategories).values(links).onConflictDoNothing();
    if (++done % 50 === 0) console.log(`  ${done}/${wpProducts.length}`);
  });

  const [{ count }] = await db.execute<{ count: number }>(sql`select count(*)::int as count from products`).then((r) => r.rows);
  console.log(`done: ${count} products in DB`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
