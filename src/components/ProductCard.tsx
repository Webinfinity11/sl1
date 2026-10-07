import Image from "next/image";
import Link from "next/link";
import { AddToCart, FavButton } from "@/components/cart/CartUI";
import type { ProductCard as Card } from "@/lib/data";
import { LOW_STOCK, discount, finalPrice, money, productUrl } from "@/lib/format";

export function ProductCard({ p, priority }: { p: Card; priority?: boolean }) {
  const price = finalPrice(p);
  const off = discount(p);
  const item = { id: p.id, name: p.name, slug: p.slug, price, image: p.image, max: p.stockQty ?? undefined };
  const href = productUrl(p.slug);
  return (
    <article className="product">
      <div className="product-visual">
        {off > 0 && <span className="badge sale-badge">−{off}%</span>}
        <FavButton item={item} />
        <Link href={href} className="product-img" tabIndex={-1} aria-hidden="true">
          {p.image ? (
            <Image
              src={p.image}
              alt=""
              fill
              sizes="(max-width: 600px) 45vw, (max-width: 1150px) 25vw, 240px"
              priority={priority}
            />
          ) : (
            <span className="noimg">SMARTLINE</span>
          )}
        </Link>
      </div>
      <div className="product-body">
        {p.category && <p className="product-cat">{p.category}</p>}
        <h3>
          <Link href={href}>{p.name}</Link>
        </h3>
        <StockLabel inStock={p.inStock} stockQty={p.stockQty} />
        <div className="price-row">
          <span className="price">
            {money(price)}
            <span className="currency">₾</span>
          </span>
          {off > 0 && <span className="oldprice">{money(p.price)} ₾</span>}
        </div>
        {p.inStock && <AddToCart item={item} />}
        {p.sku && <p className="sku">კოდი: {p.sku}</p>}
      </div>
    </article>
  );
}

export function ProductGrid({ items }: { items: Card[] }) {
  return (
    <div className="products">
      {items.map((p, i) => (
        <ProductCard key={p.id} p={p} priority={i < 4} />
      ))}
    </div>
  );
}

export function StockLabel({ inStock, stockQty }: { inStock: boolean; stockQty: number | null }) {
  if (!inStock) return <span className="stock out">არ არის მარაგში</span>;
  if (stockQty != null && stockQty <= LOW_STOCK) return <span className="stock low">დარჩა {stockQty} ც.</span>;
  return <span className="stock">მარაგშია</span>;
}
