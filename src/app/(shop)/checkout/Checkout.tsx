"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Icon } from "@/components/Icon";
import { useCart } from "@/components/cart/CartProvider";
import { CheckoutSteps, FreeDeliveryBar } from "@/components/cart/CartExtras";
import { placeOrder } from "@/lib/actions/order";
import { money } from "@/lib/format";
import { useSite } from "@/components/SiteProvider";

export function Checkout() {
  const { lines, count, total, clear } = useCart();
  const site = useSite();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<number | null>(null);
  const [pending, start] = useTransition();

  if (done)
    return (
      <>
        <div className="pagehead checkout-head">
          <h1>შეკვეთა მიღებულია</h1>
          <CheckoutSteps current={3} />
        </div>
        <div className="success card">
          <span className="tick">
            <Icon name="check" />
          </span>
          <h2>მადლობა შეკვეთისთვის!</h2>
          <p className="order-no">
            შეკვეთის ნომერი <strong>#{done}</strong>
          </p>
          <p className="muted">მენეჯერი მალე დაგიკავშირდებათ შეკვეთის დასადასტურებლად და მიწოდების დროის შესათანხმებლად.</p>
          <div className="success-actions">
            <Link className="primary" href="/catalog">
              შოპინგის გაგრძელება
            </Link>
            <a className="secondary" href={`tel:${site.phone}`}>
              <Icon name="phone" /> {site.phoneLabel}
            </a>
          </div>
        </div>
      </>
    );

  return (
    <>
      <div className="pagehead checkout-head">
        <h1>შეკვეთის გაფორმება</h1>
        <CheckoutSteps current={1} />
      </div>
      {!lines.length ? (
        <div className="empty cart-empty">
          <span className="empty-badge">
            <Icon name="cart" />
          </span>
          <h3>თქვენი კალათა ცარიელია</h3>
          <Link className="primary" href="/catalog">
            კატალოგის ნახვა
          </Link>
        </div>
      ) : (
        <div className="checkout">
          <form
            className="form checkout-form"
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
            <section className="card">
              <h2>
                <span className="num">1</span> საკონტაქტო ინფორმაცია
              </h2>
              <div className="row2">
                <label>
                  სახელი, გვარი / კომპანია *
                  <input name="name" required autoComplete="name" maxLength={100} placeholder="მაგ. გიორგი ბერიძე" />
                </label>
                <label>
                  ტელეფონი *
                  <input name="phone" type="tel" required autoComplete="tel" maxLength={20} placeholder="5XX XX XX XX" />
                </label>
              </div>
              <label>
                ელფოსტა <span className="optional">(არასავალდებულო)</span>
                <input name="email" type="email" autoComplete="email" maxLength={120} placeholder="name@example.com" />
              </label>
            </section>

            <section className="card">
              <h2>
                <span className="num">2</span> მიწოდება
              </h2>
              <label>
                მისამართი *
                <textarea name="address" required autoComplete="street-address" maxLength={500} rows={2} placeholder="ქალაქი, ქუჩა, სახლი, ბინა / ოფისი" />
              </label>
              <label>
                კომენტარი <span className="optional">(არასავალდებულო)</span>
                <textarea name="comment" maxLength={1000} rows={3} placeholder="მაგ. სასურველი მიწოდების დრო, კომპანიის საიდენტიფიკაციო კოდი" />
              </label>
            </section>

            <section className="card">
              <h2>
                <span className="num">3</span> გადახდა
              </h2>
              <div className="payopt">
                <Icon name="shield" />
                <div>
                  <strong>გადახდა დადასტურების შემდეგ</strong>
                  <p className="muted small">გაყიდვების მენეჯერი დაგიკავშირდებათ და შეგითანხმებთ გადახდის პირობებს.</p>
                </div>
              </div>
            </section>

            {error && <p className="error">{error}</p>}
            <button className="primary wide submit" disabled={pending}>
              {pending ? "იგზავნება…" : `შეკვეთის გაგზავნა · ${money(total)} ₾`} <Icon name="arrow" />
            </button>
          </form>

          <aside className="card summary">
            <div className="summary-head">
              <h2>თქვენი შეკვეთა</h2>
              <Link href="/cart" className="textlink">
                რედაქტირება
              </Link>
            </div>
            <div className="summary-lines">
              {lines.map((l) => (
                <div className="summary-line" key={l.id}>
                  <span className="thumb">
                    {l.image && <Image src={l.image} alt="" fill sizes="52px" />}
                    <b>{l.qty}</b>
                  </span>
                  <span className="name">{l.name}</span>
                  <strong>{money(l.price * l.qty)} ₾</strong>
                </div>
              ))}
            </div>
            <FreeDeliveryBar total={total} />
            <dl className="summary-rows">
              <div>
                <dt>პროდუქცია ({count})</dt>
                <dd>{money(total)} ₾</dd>
              </div>
              <div>
                <dt>მიწოდება</dt>
                <dd>{total >= site.freeDeliveryFrom ? "უფასო" : "დაზუსტდება"}</dd>
              </div>
            </dl>
            <div className="summary-total">
              <span>ჯამი</span>
              <strong>{money(total)} ₾</strong>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
