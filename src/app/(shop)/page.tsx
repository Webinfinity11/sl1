import Image from "next/image";
import Link from "next/link";
import { cacheLife } from "next/cache";
import { Icon } from "@/components/Icon";
import { ProductCard } from "@/components/ProductCard";
import { RailScroller } from "@/components/RailScroller";
import { getCategoryTree, getHomeSections, type CategoryNode, type ProductCard as Card } from "@/lib/data";
import { categoryUrl } from "@/lib/format";
import { getContent } from "@/lib/content";

const benefitIcons = ["truck", "box", "tag", "shield"] as const;

const brands = ["ariel", "tide", "fairy", "domestos", "cif", "mrmuscle", "frosch", "pronto", "duck", "glade", "safeguard", "selpak", "bagi", "hobby", "belux", "teo", "acord", "rorax"];

export default async function HomePage() {
  "use cache";
  cacheLife("hours");

  const [tree, { latest, sale }, { home, site }] = await Promise.all([getCategoryTree(), getHomeSections(), getContent()]);
  // Tree order = admin "sort order", then product count.
  const shown = tree.filter((c) => c.count > 0).slice(0, 12);
  const productTotal = tree.reduce((n, c) => n + c.count, 0);

  return (
    <>
      <div className="container hero-area">
        <section className="hero">
          <div className="herotext">
            <div className="eyebrow">{home.heroEyebrow}</div>
            <h1>
              {home.heroTitle}
              <br />
              <span>{home.heroTitleAccent}</span>
            </h1>
            <p>{home.heroText}</p>
            <div className="hero-actions">
              <Link className="primary" href="/catalog">
                {home.heroButton} <Icon name="arrow" />
              </Link>
              {home.heroSecondButton && (
                <Link className="secondary" href="/contact">
                  {home.heroSecondButton}
                </Link>
              )}
            </div>
            <ul className="hero-stats">
              <li>
                <strong>{productTotal}+</strong> პროდუქტი
              </li>
              <li>
                <strong>{shown.length}</strong> კატეგორია
              </li>
              <li>
                <strong>{site.freeDeliveryFrom} ₾</strong>-დან უფასო მიწოდება
              </li>
            </ul>
          </div>
          <div className="heroart">
            <Image src="/img/heroimg.webp" alt="საკანცელარიო და ოფისის პროდუქცია" fill sizes="(max-width: 900px) 100vw, 640px" priority />
          </div>
        </section>
        <div className="benefits">
          {home.benefits.slice(0, 4).map((b, i) => (
            <Benefit key={i} icon={benefitIcons[i]} title={b.title} text={b.text} />
          ))}
        </div>
      </div>

      <section className="container section">
        <div className="sectiontitle">
          <div>
            <h2>{home.categoriesTitle}</h2>
            <p>{home.categoriesText}</p>
          </div>
          <Link className="textlink" href="/categories">
            ყველა კატეგორია <Icon name="arrow" />
          </Link>
        </div>
        <div className="catgrid">
          {shown.map((c, i) => (
            <CategoryTile key={c.id} c={c} tone={i % 6} />
          ))}
        </div>
      </section>

      {sale.length > 0 && <Rail title="ფასდაკლებები" sub="სპეციალური შეთავაზებები" href="/catalog?sale=1" items={sale} shaded />}
      <Rail title="ახალი პროდუქცია" sub="ბოლოს დამატებული" href="/catalog?sort=new" items={latest} shaded={!sale.length} />

      <div className="container section">
        <h2 className="brandheading">{home.brandsTitle}</h2>
        <div className="brands">
          {brands.map((b) => (
            <div key={b}>
              <Image src={`/img/brands/${b}.webp`} alt={b} fill sizes="200px" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Benefit({ icon, title, text }: { icon: "truck" | "box" | "tag" | "shield"; title: string; text: string }) {
  return (
    <div className="benefit">
      <Icon name={icon} />
      <div>
        <strong>{title}</strong>
        <span>{text}</span>
      </div>
    </div>
  );
}

function CategoryTile({ c, tone }: { c: CategoryNode; tone: number }) {
  return (
    <Link className={`cattile tone${tone}`} href={categoryUrl(c.slug)}>
      <span className="cattile-img">{c.image && <Image src={c.image} alt="" fill sizes="(max-width: 600px) 30vw, 180px" />}</span>
      <span className="cattile-text">
        <strong>{c.name}</strong>
        <small>{c.count} პროდუქტი</small>
      </span>
      <span className="cattile-go" aria-hidden="true">
        <Icon name="arrow" />
      </span>
    </Link>
  );
}

function Rail({ title, sub, href, items, shaded }: { title: string; sub: string; href: string; items: Card[]; shaded?: boolean }) {
  return (
    <section className={shaded ? "section shop" : "section"}>
      <div className="container">
        <div className="sectiontitle">
          <div>
            <h2>{title}</h2>
            <p>{sub}</p>
          </div>
          <Link className="textlink" href={href}>
            ყველა <Icon name="arrow" />
          </Link>
        </div>
        <RailScroller>
          {items.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </RailScroller>
      </div>
    </section>
  );
}
