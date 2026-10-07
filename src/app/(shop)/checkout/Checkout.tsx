"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Icon } from "@/components/Icon";
import { useCart } from "@/components/cart/CartProvider";
import { placeOrder } from "@/lib/actions/order";
import { money } from "@/lib/format";
import { site } from "@/lib/site";

export function Checkout() {
  const { lines, total, hasQuoteItems, clear } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<number | null>(null);
  const [pending, start] = useTransition();

  if (done)
    return (
      <div className="success">
        <span className="tick">
          <Icon name="check" />
        </span>
        <h1>შეკვეთა მიღებულია!</h1>
        <p className="muted">
          შეკვეთის ნომერი: <strong>#{done}</strong>. მენეჯერი მალე დაგიკავშირდებათ დასადასტურებლად.
        </p>
        <Link className="primary" href="/catalog">
          შოპინგის გაგრძელება
        </Link>
      </div>
    );

  if (!lines.length)
    return (
      <div className="empty empty-plain">
        <Icon name="cart" />
        <h3>თქვენი კალათა ცარიელია</h3>
        <Link className="primary" href="/catalog">
          კატალოგის ნახვა
        </Link>
      </div>
    );

  return (
    <div className="checkout">
      <form
        className="card form"
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          setError(null);
          start(async () => {
            const res = await placeOrder({
              name: String(f.get("name")),
              phone: String(f.get("phone")),
              email: String(f.get("email") ?? ""),
              address: String(f.get("address")),
              comment: String(f.get("comment") ?? ""),
              items: lines.map((l) => ({ id: l.id, qty: l.qty })),
            });
            if (res.ok) {
              clear();
              setDone(res.id);
              window.scrollTo({ top: 0 });
            } else setError(res.error);
          });
        }}
      >
        <h2>საკონტაქტო ინფორმაცია</h2>
        <div className="row2">
          <label>
            სახელი, გვარი / კომპანია *
            <input name="name" required autoComplete="name" maxLength={100} />
          </label>
          <label>
            ტელეფონი *
            <input name="phone" type="tel" required autoComplete="tel" maxLength={20} placeholder="5XX XX XX XX" />
          </label>
        </div>
        <label>
          ელფოსტა
          <input name="email" type="email" autoComplete="email" maxLength={120} />
        </label>
        <label>
          მიწოდების მისამართი *
          <textarea name="address" required autoComplete="street-address" maxLength={500} rows={2} />
        </label>
        <label>
          კომენტარი
          <textarea name="comment" maxLength={1000} rows={3} placeholder="მაგ. სასურველი დრო, ინვოისის საჭიროება" />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="primary wide" disabled={pending}>
          {pending ? "იგზავნება…" : "შეკვეთის გაგზავნა"} <Icon name="arrow" />
        </button>
        <p className="note">
          გადახდა ხდება შეკვეთის დადასტურების შემდეგ. კითხვებისთვის: <a href={`tel:${site.phone}`}>{site.phoneLabel}</a>
        </p>
      </form>
      <aside className="card">
        <h2>თქვენი შეკვეთა</h2>
        {lines.map((l) => (
          <div className="summary-line" key={l.id}>
            <span className="thumb">{l.image && <Image src={l.image} alt="" fill sizes="52px" />}</span>
            <span>
              {l.name} <span className="muted">× {l.qty}</span>
            </span>
            <strong>{l.price ? `${money(l.price * l.qty)} ₾` : "—"}</strong>
          </div>
        ))}
        <div className="summary-total">
          <span>ჯამი</span>
          <strong>{money(total)} ₾</strong>
        </div>
        <p className="note">
          {total >= site.freeDeliveryFrom
            ? "✓ მიწოდება უფასოა"
            : `უფასო მიწოდებამდე დარჩა ${money(site.freeDeliveryFrom - total)} ₾`}
        </p>
        {hasQuoteItems && <p className="note">„—“ აღნიშნული პროდუქციის ფასს მენეჯერი დაგიზუსტებთ.</p>}
      </aside>
    </div>
  );
}
