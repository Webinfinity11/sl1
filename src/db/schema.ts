import {
  pgTable,
  serial,
  integer,
  text,
  numeric,
  boolean,
  timestamp,
  jsonb,
  primaryKey,
  index,
} from "drizzle-orm/pg-core";

export type Spec = { label: string; value: string };
export type OrderItem = {
  productId: number;
  name: string;
  sku: string | null;
  price: number;
  qty: number;
  image: string | null;
};

export const categories = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    wpId: integer("wp_id").unique(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    parentId: integer("parent_id"),
    description: text("description").notNull().default(""),
    image: text("image"),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("categories_parent_idx").on(t.parentId)],
);

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    wpId: integer("wp_id").unique(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    sku: text("sku"),
    price: numeric("price", { precision: 10, scale: 2, mode: "number" }).notNull().default(0),
    salePrice: numeric("sale_price", { precision: 10, scale: 2, mode: "number" }),
    inStock: boolean("in_stock").notNull().default(true),
    // null = stock isn't tracked for this product; otherwise in_stock follows stock_qty > 0
    stockQty: integer("stock_qty"),
    published: boolean("published").notNull().default(true),
    featured: boolean("featured").notNull().default(false),
    summary: text("summary").notNull().default(""),
    description: text("description").notNull().default(""),
    specs: jsonb("specs").$type<Spec[]>().notNull().default([]),
    images: jsonb("images").$type<string[]>().notNull().default([]),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("products_sku_idx").on(t.sku)],
);

export const productCategories = pgTable(
  "product_categories",
  {
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.productId, t.categoryId] }), index("pc_category_idx").on(t.categoryId)],
);

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  address: text("address").notNull(),
  comment: text("comment").notNull().default(""),
  items: jsonb("items").$type<OrderItem[]>().notNull(),
  total: numeric("total", { precision: 10, scale: 2, mode: "number" }).notNull(),
  // new → confirmed → delivered | cancelled
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Order = typeof orders.$inferSelect;

/** Editable site content (header, footer, page copy), one JSON document per section. */
export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").$type<Record<string, unknown>>().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
