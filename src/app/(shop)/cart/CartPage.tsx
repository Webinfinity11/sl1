"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { useCart } from "@/components/cart/CartProvider";
import { Stepper } from "@/components/cart/CartUI";
import { FreeDeliveryBar } from "@/components/cart/CartExtras";
import { money, productUrl } from "@/lib/format";
import { useSite } from "@/components/SiteProvider";

export function CartPage() {
  const { lines, count, total, setQty, remove, clear } = useCart();
  const site = useSite();

  if (!lines.length)
    return (
      <div className="empty cart-empty">
        <span className="empty-badge">
          <Icon name="cart" />
        </span>
        <h3>თქვენი კალათა ცარიელია</h3>
        <p>დაათვალიერეთ კატალოგი და დაამატეთ სასურველი პროდუქცია.</p>
        <Link className="primary" href="/catalog">
          კატალოგის ნახვა <Icon name="arrow" />
        </Link>
      </div>
    );

  return (
    <div className="checkout">
      <div className="card cart-table">
        <div className="cart-table-head">
          <h2>
            პროდუქცია <span className="muted">({count})</span>
          </h2>
          <button className="linkbtn" onClick={clear}>
            კალათის გასუფთავება
          </button>
        </div>
        {lines.map((l) => (
          <div className="cart-row" key={l.id}>
            <Link href={productUrl(l.slug)} className="cart-row-img">
              {l.image && <Image src={l.image} alt="" fill sizes="96px" />}
            </Link>
            <div className="cart-row-info">
              <Link href={productUrl(l.slug)} className="cart-row-name">
                {l.name}
              </Link>
              <span className="muted small">{money(l.price)} ₾ / ცალი</span>
            </div>
            <Stepper value={l.qty} onChange={(n) => setQty(l.id, n)} label={l.name} max={l.max} />
            <strong className="cart-row-sum">{money(l.price * l.qty)} ₾</strong>
            <button className="remove" onClick={() => remove(l.id)} aria-label={`${l.name}: წაშლა`}>
              <Icon name="trash" />
            </button>
          </div>
        ))}
        <Link className="textlink back" href="/catalog">
          <Icon name="left" /> შოპინგის გაგრძელება
        </Link>
      </div>

      <aside className="card summary">
        <h2>შეკვეთის ჯამი</h2>
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
        <Link className="primary wide" href="/checkout">
          გაფორმებაზე გადასვლა <Icon name="arrow" />
        </Link>
        <ul className="trust">
          <li>
            <Icon name="shield" /> გადახდა შეკვეთის დადასტურების შემდეგ
          </li>
          <li>
            <Icon name="tag" /> გადახდის მოქნილი სისტემა
          </li>
        </ul>
      </aside>
    </div>
  );
}
