import Image from "next/image";
import Link from "next/link";
import { cacheLife } from "next/cache";
import { Icon } from "@/components/Icon";
import { ProductCard } from "@/components/ProductCard";
import { getCategoryTree, getHomeSections, type CategoryNode, type ProductCard as Card } from "@/lib/data";
import { categoryUrl } from "@/lib/format";
import { site } from "@/lib/site";

const brands = ["domestos", "pronto", "bagi", "ariel", "selpak", "frosch"];

export default async function HomePage() {
  "use cache";
  cacheLife("hours");

  const [tree, { latest, sale }] = await Promise.all([getCategoryTree(), getHomeSections()]);
  const shown = tree.filter((c) => c.count > 0);
  // The two largest categories get wide tiles with their top subcategories listed.
  const bigIds = new Set(shown.toSorted((a, b) => b.count - a.count).slice(0, 2).map((c) => c.id));
  const office = shown.find((c) => c.name.includes("კომპიუტერ"));

  return (
    <>
      <div className="container hero-area">
        <div className="hero-grid">
          <section className="hero">
            <Image className="heroimg" src="/img/heroimg.webp" alt="" width={720} height={420} priority />
            <div className="herotext">
              <div className="eyebrow">SMARTLINE / ONLINE SHOP</div>
              <h1>
                ყველაფერი საჭირო.
                <br />
                ერთ სივრცეში.
              </h1>
              <p>ოფისისთვის, ბიზნესისთვის და სახლისთვის — შეარჩიეთ მარტივად, შეუკვეთეთ კომფორტულად.</p>
              <Link className="primary" href="/catalog">
                შეარჩიეთ პროდუქცია <Icon name="arrow" />
              </Link>
              <div className="hero-meta">
                <i /> {shown.length} კატეგორია · სწრაფი მიწოდება თბილისში
              </div>
            </div>
          </section>
          <div className="promos">
            <section className="promo">
              <div className="text">
                <p className="label">სამუშაო სივრცისთვის</p>
                <h3>
                  მეტი კომფორტი
                  <br />
                  თქვენს ოფისში
                </h3>
                <Link className="textlink" href={office ? categoryUrl(office.slug) : "/catalog"}>
                  ნახეთ კოლექცია <Icon name="arrow" />
                </Link>
              </div>
              <Image className="techimg" src="/img/techimg.webp" alt="" width={300} height={220} />
            </section>
            <section className="promo deliverypromo">
              <div className="text">
                <p className="label">კარგი ამბავი</p>
                <h3>
                  მიწოდება
                  <br />
                  უფასოდ
                </h3>
                <Link className="textlink" href="/delivery">
                  {site.freeDeliveryFrom} ₾-დან შეკვეთაზე <Icon name="arrow" />
                </Link>
              </div>
              <div className="delivery-art">
                <Icon name="truck" />
              </div>
            </section>
          </div>
        </div>
        <div className="benefits">
          <Benefit icon="truck" title="სწრაფი მიწოდება" text="თქვენთვის მოსახერხებელ მისამართზე" />
          <Benefit icon="box" title="მარტივი შეკვეთა" text="რაოდენობა პირდაპირ ბარათიდან" />
          <Benefit icon="tag" title="ბიზნეს ფასები" text="ინდივიდუალური შეთავაზება ოფისებისთვის" />
          <Benefit icon="shield" title="ყველაფერი ერთად" text="ასობით პროდუქტი ერთ სივრცეში" />
        </div>
      </div>

      <section className="container section">
        <div className="sectiontitle">
          <div>
            <h2>იპოვეთ თქვენი კატეგორია</h2>
            <p>მარტივი არჩევანი ნებისმიერი საჭიროებისთვის</p>
          </div>
          <Link className="textlink" href="/categories">
            ყველა კატეგორია <Icon name="arrow" />
          </Link>
        </div>
        <div className="categories">
          {[...shown.filter((c) => bigIds.has(c.id)), ...shown.filter((c) => !bigIds.has(c.id))].map((c) => (
            <CategoryTile key={c.id} c={c} big={bigIds.has(c.id)} />
          ))}
        </div>
      </section>

      {sale.length > 0 && <Rail title="ფასდაკლებები" sub="სპეციალური შეთავაზებები" href="/catalog?sale=1" items={sale} shaded />}
      <Rail title="ახალი პროდუქცია" sub="ბოლოს დამატებული" href="/catalog?sort=new" items={latest} shaded={!sale.length} />

      <div className="container section">
        <section className="business">
          <div>
            <div className="eyebrow">SMARTLINE / BUSINESS</div>
            <h2>თქვენი ბიზნესის ყოველდღიური პარტნიორი</h2>
            <p>ოფისის მომარაგება ერთ სივრცეში — მოითხოვეთ ინდივიდუალური შეთავაზება.</p>
          </div>
          <Link className="primary" href="/contact">
            დაგვიკავშირდით <Icon name="arrow" />
          </Link>
        </section>
        <h2 className="brandheading">ბრენდები, რომლებსაც იცნობთ</h2>
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

function CategoryTile({ c, big }: { c: CategoryNode; big: boolean }) {
  const subs = c.children.filter((s) => s.count > 0).toSorted((a, b) => b.count - a.count);
  return (
    <Link className={big ? "category big" : "category"} href={categoryUrl(c.slug)}>
      <span className="catimg">{c.image && <Image src={c.image} alt="" fill sizes="140px" />}</span>
      <span>
        <strong>{c.name}</strong>
        <small style={{ display: "block" }}>{c.count} პროდუქტი</small>
        {big && subs.length > 0 && (
          <span className="subnames">
            {subs
              .slice(0, 4)
              .map((s) => s.name)
              .join(" · ")}
          </span>
        )}
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
        <div className="rail">
          {items.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
