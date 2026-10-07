import { cacheLife, cacheTag } from "next/cache";
import { and, asc, desc, eq, ilike, inArray, isNotNull, or, sql, type SQL } from "drizzle-orm";
import { db, categories, products, productCategories, type Category, type Product } from "@/db";

export type CategoryNode = Category & { count: number; children: CategoryNode[] };
export type ProductCard = Pick<
  Product,
  "id" | "name" | "slug" | "sku" | "price" | "salePrice" | "inStock" | "stockQty"
> & { image: string | null; category: string | null };

export type SortKey = "default" | "new" | "price-asc" | "price-desc" | "name";
export const PER_PAGE = 24;

const effectivePrice = sql`coalesce(${products.salePrice}, ${products.price})`;

/** Whole category tree with published-product counts rolled up to every ancestor. */
export async function getCategoryTree() {
  "use cache";
  cacheLife("hours");
  cacheTag("categories", "products");

  const [rows, links] = await Promise.all([
    db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.name)),
    db
      .select({ categoryId: productCategories.categoryId, productId: productCategories.productId })
      .from(productCategories)
      .innerJoin(products, eq(products.id, productCategories.productId))
      .where(eq(products.published, true)),
  ]);

  const byId = new Map<number, CategoryNode>(rows.map((c) => [c.id, { ...c, count: 0, children: [] }]));
  const roots: CategoryNode[] = [];
  for (const node of byId.values()) {
    const parent = node.parentId ? byId.get(node.parentId) : undefined;
    if (parent) parent.children.push(node);
    else roots.push(node);
  }

  // A product counts once per category even if it is linked to several of its descendants.
  const sets = new Map<number, Set<number>>();
  for (const { categoryId, productId } of links) {
    for (let c = byId.get(categoryId); c; c = c.parentId ? byId.get(c.parentId) : undefined) {
      if (!sets.has(c.id)) sets.set(c.id, new Set());
      sets.get(c.id)!.add(productId);
    }
  }
  for (const node of byId.values()) node.count = sets.get(node.id)?.size ?? 0;

  const sortTree = (list: CategoryNode[]) => {
    list.sort((a, b) => a.sortOrder - b.sortOrder || b.count - a.count);
    list.forEach((n) => sortTree(n.children));
  };
  sortTree(roots);
  return roots;
}

export function flattenTree(nodes: CategoryNode[]): CategoryNode[] {
  return nodes.flatMap((n) => [n, ...flattenTree(n.children)]);
}

export async function getCategory(slug: string) {
  const all = flattenTree(await getCategoryTree());
  const category = all.find((c) => c.slug === slug);
  if (!category) return null;
  const trail: CategoryNode[] = [];
  for (let c: CategoryNode | undefined = category; c; c = all.find((p) => p.id === c!.parentId)) trail.unshift(c);
  return { category, trail, descendantIds: flattenTree([category]).map((c) => c.id) };
}

export type ProductQuery = {
  categoryIds?: number[];
  q?: string;
  sort?: SortKey;
  page?: number;
  sale?: boolean;
  inStock?: boolean;
  priced?: boolean;
  minPrice?: number;
  maxPrice?: number;
};

export async function getProducts(query: ProductQuery) {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const { categoryIds, q, sort = "default", page = 1, sale, inStock, priced, minPrice, maxPrice } = query;
  const where: (SQL | undefined)[] = [eq(products.published, true)];
  if (categoryIds?.length) {
    where.push(
      inArray(
        products.id,
        db
          .select({ id: productCategories.productId })
          .from(productCategories)
          .where(inArray(productCategories.categoryId, categoryIds)),
      ),
    );
  }
  if (q) {
    const term = `%${q.replace(/[%_\\]/g, "\\$&")}%`;
    where.push(or(ilike(products.name, term), ilike(products.sku, term)));
  }
  if (sale) where.push(isNotNull(products.salePrice));
  if (inStock) where.push(eq(products.inStock, true));
  if (priced) where.push(sql`${products.price} > 0`);
  if (minPrice) where.push(sql`${effectivePrice} >= ${minPrice}`);
  if (maxPrice) where.push(sql`${effectivePrice} <= ${maxPrice}`);

  const order = {
    default: [desc(products.featured), desc(products.inStock), sql`${products.price} = 0`, desc(products.createdAt)],
    new: [desc(products.createdAt)],
    "price-asc": [sql`${products.price} = 0`, asc(effectivePrice)],
    "price-desc": [sql`${products.price} = 0`, desc(effectivePrice)],
    name: [asc(products.name)],
  }[sort];

  const filter = and(...where);
  const [rows, [{ total }]] = await Promise.all([
    db
      .select()
      .from(products)
      .where(filter)
      .orderBy(...order, asc(products.id))
      .limit(PER_PAGE)
      .offset((Math.max(1, page) - 1) * PER_PAGE),
    db.select({ total: sql<number>`count(*)::int` }).from(products).where(filter),
  ]);

  return { items: await toCards(rows), total, pages: Math.max(1, Math.ceil(total / PER_PAGE)) };
}

async function toCards(rows: Product[]): Promise<ProductCard[]> {
  if (!rows.length) return [];
  const all = flattenTree(await getCategoryTree());
  const links = await db
    .select()
    .from(productCategories)
    .where(inArray(productCategories.productId, rows.map((r) => r.id)));
  // Show the most specific category a product sits in.
  const depth = (id: number) => {
    let d = 0;
    for (let c = all.find((x) => x.id === id); c?.parentId; c = all.find((x) => x.id === c!.parentId)) d++;
    return d;
  };
  return rows.map((p) => {
    const best = links
      .filter((l) => l.productId === p.id)
      .sort((a, b) => depth(b.categoryId) - depth(a.categoryId))[0];
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      price: p.price,
      salePrice: p.salePrice,
      inStock: p.inStock,
      stockQty: p.stockQty,
      image: p.images[0] ?? null,
      category: best ? (all.find((c) => c.id === best.categoryId)?.name ?? null) : null,
    };
  });
}

export async function getProduct(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const [product] = await db
    .select()
    .from(products)
    .where(and(eq(products.slug, slug), eq(products.published, true)));
  if (!product) return null;

  const links = await db.select().from(productCategories).where(eq(productCategories.productId, product.id));
  const all = flattenTree(await getCategoryTree());
  const linked = links.map((l) => all.find((c) => c.id === l.categoryId)).filter((c): c is CategoryNode => !!c);
  const primary = linked.sort((a, b) => (b.parentId ? 1 : 0) - (a.parentId ? 1 : 0))[0] ?? null;
  const trail = primary ? (await getCategory(primary.slug))!.trail : [];

  const related = primary
    ? (await getProducts({ categoryIds: [primary.id] })).items.filter((p) => p.id !== product.id).slice(0, 10)
    : [];

  return { product, categories: linked, trail, related };
}

export async function getHomeSections() {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const [latest, sale] = await Promise.all([
    getProducts({ sort: "new", inStock: true, priced: true }),
    getProducts({ sale: true }),
  ]);
  return { latest: latest.items.slice(0, 10), sale: sale.items.slice(0, 10) };
}

/** Uncached lookup used when pricing an order. */
export function getProductsByIds(ids: number[]) {
  return db
    .select()
    .from(products)
    .where(and(inArray(products.id, ids), eq(products.published, true)));
}

export async function getAllSlugs() {
  "use cache";
  cacheLife("hours");
  cacheTag("products", "categories");
  const [p, c] = await Promise.all([
    db.select({ slug: products.slug, updatedAt: products.updatedAt }).from(products).where(eq(products.published, true)),
    db.select({ slug: categories.slug }).from(categories),
  ]);
  return { products: p, categories: c };
}
