"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { useCart } from "@/components/cart/CartProvider";
import { AddToCart, FavButton } from "@/components/cart/CartUI";
import { money, productUrl } from "@/lib/format";

export function Favorites() {
  const { favs } = useCart();
  if (!favs.length)
    return (
      <div className="empty" style={{ marginBottom: 60 }}>
        <Icon name="heart" />
        <h3>თქვენი სია ჯერ ცარიელია</h3>
        <p>მონიშნეთ სასურველი პროდუქტი გულის ღილაკით.</p>
        <Link className="primary" href="/catalog">
          კატალოგის ნახვა
        </Link>
      </div>
    );
  return (
    <div className="products" style={{ paddingBottom: 60 }}>
      {favs.map((p) => (
        <article className="product" key={p.id}>
          <div className="product-visual">
            <FavButton item={p} />
            <Link href={productUrl(p.slug)} className="product-img" tabIndex={-1}>
              {p.image && <Image src={p.image} alt="" fill sizes="240px" />}
            </Link>
          </div>
          <div className="product-body">
            <h3>
              <Link href={productUrl(p.slug)}>{p.name}</Link>
            </h3>
            <div className="price-row" style={{ marginTop: 10 }}>
              <span className="price">{money(p.price)}<span className="currency">₾</span></span>
            </div>
            <AddToCart item={p} />
          </div>
        </article>
      ))}
    </div>
  );
}
