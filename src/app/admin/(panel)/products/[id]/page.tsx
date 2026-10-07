import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { categories, db, productCategories, products } from "@/db";
import { requireAdmin } from "@/lib/auth";
import { productUrl } from "@/lib/format";
import { PageTitle } from "@/components/admin/ui";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function EditProduct({ params }: PageProps<"/admin/products/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const isNew = id === "new";
  const [product] = isNew ? [null] : await db.select().from(products).where(eq(products.id, Number(id) || 0));
  if (!isNew && !product) notFound();
  const [cats, links] = await Promise.all([
    db.select({ id: categories.id, name: categories.name, parentId: categories.parentId }).from(categories).orderBy(categories.sortOrder, categories.name),
    product ? db.select().from(productCategories).where(eq(productCategories.productId, product.id)) : [],
  ]);

  return (
    <>
      <PageTitle
        actions={
          product?.published && (
            <a href={productUrl(product.slug)} target="_blank" className="text-sm font-semibold text-[#174abc]">
              საიტზე ნახვა ↗
            </a>
          )
        }
      >
        <Link href="/admin/products" className="text-slate-400 font-normal">
          პროდუქცია /
        </Link>{" "}
        {product ? product.name : "ახალი პროდუქტი"}
      </PageTitle>
      <ProductForm product={product} categories={cats} selected={links.map((l) => l.categoryId)} />
    </>
  );
}
