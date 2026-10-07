import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Icon } from "@/components/Icon";
import { Listing, ListingSkeleton } from "@/components/Listing";
import { getCategory, getCategoryTree } from "@/lib/data";
import { categoryUrl } from "@/lib/format";

const slugOf = async (params: PageProps<"/category/[slug]">["params"]) => decodeURIComponent((await params).slug);

export async function generateStaticParams() {
  return (await getCategoryTree()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/category/[slug]">): Promise<Metadata> {
  const found = await getCategory(await slugOf(params));
  if (!found) return {};
  const { category } = found;
  return {
    title: category.name,
    description: category.description || `${category.name} — ${category.count} პროდუქტი SMARTLINE-ზე.`,
    alternates: { canonical: categoryUrl(category.slug) },
  };
}

async function CategoryContent({ params, searchParams }: PageProps<"/category/[slug]">) {
  const found = await getCategory(await slugOf(params));
  if (!found) notFound();
  const { category, trail, descendantIds } = found;
  const sp = (await searchParams) as Record<string, string | undefined>;
  return (
    <>
      <div className="pagehead">
        <nav className="crumbs" aria-label="ნავიგაცია">
          <Link href="/">მთავარი</Link>
          <Icon name="right" />
          <Link href="/catalog">პროდუქცია</Link>
          {trail.map((c) => (
            <span key={c.id} style={{ display: "contents" }}>
              <Icon name="right" />
              {c.id === category.id ? <span>{c.name}</span> : <Link href={categoryUrl(c.slug)}>{c.name}</Link>}
            </span>
          ))}
        </nav>
        <h1>{category.name}</h1>
        {category.description && <p>{category.description}</p>}
      </div>
      <Listing
        base={categoryUrl(category.slug)}
        sp={sp}
        category={{ id: category.id, descendantIds }}
        subcategories={category.children}
      />
    </>
  );
}

export default function CategoryPage(props: PageProps<"/category/[slug]">) {
  return (
    <div className="container">
      <Suspense fallback={<><div className="pagehead"><h1>&nbsp;</h1></div><ListingSkeleton /></>}>
        <CategoryContent {...props} />
      </Suspense>
    </div>
  );
}
