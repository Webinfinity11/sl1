import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Icon } from "@/components/Icon";
import { AddToCart, FavButton } from "@/components/cart/CartUI";
import { Gallery } from "@/components/Gallery";
import { ProductCard } from "@/components/ProductCard";
import { getAllSlugs, getProduct } from "@/lib/data";
import { categoryUrl, discount, finalPrice, money, productUrl } from "@/lib/format";
import { site } from "@/lib/site";

const slugOf = async (params: PageProps<"/product/[slug]">["params"]) => decodeURIComponent((await params).slug);

export async function generateStaticParams() {
  return (await getAllSlugs()).products.slice(0, 100).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const data = await getProduct(await slugOf(params));
  if (!data) return {};
  const { product } = data;
  const price = finalPrice(product);
  return {
    title: product.name,
    description:
      product.summary.slice(0, 160) ||
      `${product.name}${price ? ` — ${money(price)} ₾` : ""}. შეუკვეთეთ SMARTLINE-ზე.`,
    alternates: { canonical: productUrl(product.slug) },
    openGraph: { images: product.images.slice(0, 1) },
  };
}

async function ProductContent({ params }: PageProps<"/product/[slug]">) {
  const data = await getProduct(await slugOf(params));
  if (!data) notFound();
  const { product, trail, categories, related } = data;
  const price = finalPrice(product);
  const off = discount(product);
  const item = { id: product.id, name: product.name, slug: product.slug, price, image: product.images[0] ?? null };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku ?? undefined,
    image: product.images,
    description: product.summary || product.description || undefined,
    offers:
      price > 0
        ? {
            "@type": "Offer",
            price: price.toFixed(2),
            priceCurrency: "GEL",
            availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            url: `${site.url}${productUrl(product.slug)}`,
          }
        : undefined,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="pagehead">
        <nav className="crumbs" aria-label="ნავიგაცია">
          <Link href="/">მთავარი</Link>
          {trail.map((c) => (
            <span key={c.id} style={{ display: "contents" }}>
              <Icon name="right" />
              <Link href={categoryUrl(c.slug)}>{c.name}</Link>
            </span>
          ))}
        </nav>
      </div>
      <div className="pdp">
        <Gallery images={product.images} name={product.name} badge={off > 0 ? `−${off}%` : null} />
        <div className="pdp-info">
          {trail.length > 0 && <div className="eyebrow">{trail.at(-1)!.name}</div>}
          <h1>{product.name}</h1>
          <div className="pdp-meta">
            <span className={product.inStock ? "stock" : "stock out"}>{product.inStock ? "მარაგშია" : "არ არის მარაგში"}</span>
            {product.sku && <span>კოდი: {product.sku}</span>}
          </div>
          <div className="pdp-price">
            {price > 0 ? (
              <>
                <span className="price">
                  {money(price)}
                  <span className="currency">₾</span>
                </span>
                {off > 0 && <span className="oldprice">{money(product.price)} ₾</span>}
              </>
            ) : (
              <span className="price-request">ფასი შეთანხმებით</span>
            )}
          </div>
          {product.inStock && (
            <div className="pdp-buy">
              <AddToCart item={item} size="lg" />
              <FavButton item={item} />
            </div>
          )}
          {price === 0 && (
            <p className="note">დაამატეთ კალათაში და გამოგზავნეთ მოთხოვნა — მენეჯერი დაგიკავშირდებათ ფასის დასაზუსტებლად.</p>
          )}
          <div className="pdp-perks">
            <div>
              <Icon name="truck" /> უფასო მიწოდება {site.freeDeliveryFrom} ₾-დან შეკვეთაზე
            </div>
            <div>
              <Icon name="phone" /> კითხვები? <a href={`tel:${site.phone}`}>{site.phoneLabel}</a>
            </div>
          </div>
          {product.specs.length > 0 && (
            <table className="specs">
              <tbody>
                {product.specs.map((s) => (
                  <tr key={s.label}>
                    <th>{s.label}</th>
                    <td>{s.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {product.summary && <p className="pdp-desc">{product.summary}</p>}
          {product.description && <p className="pdp-desc">{product.description}</p>}
          {categories.length > 0 && (
            <div className="pdp-cats">
              {categories.map((c) => (
                <Link key={c.id} className="chip" href={categoryUrl(c.slug)}>
                  {c.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      {related.length > 0 && (
        <section className="section">
          <div className="sectiontitle">
            <h2>მსგავსი პროდუქცია</h2>
          </div>
          <div className="rail">
            {related.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export default function ProductPage(props: PageProps<"/product/[slug]">) {
  return (
    <div className="container">
      <Suspense fallback={<div className="pdp" style={{ minHeight: 600 }} />}>
        <ProductContent {...props} />
      </Suspense>
    </div>
  );
}
