import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { MobileCartTab } from "@/components/cart/CartUI";
import { getCategoryTree } from "@/lib/data";
import { categoryUrl } from "@/lib/format";
import { site } from "@/lib/site";

export async function Footer() {
  "use cache";
  const popular = (await getCategoryTree()).toSorted((a, b) => b.count - a.count).slice(0, 5);
  return (
    <footer className="footer">
      <div className="container">
        <div className="footgrid">
          <div>
            <Image className="footlogo" src="/img/logo.webp" alt="SMARTLINE" width={164} height={42} />
            <p>ყველაფერი საჭირო თქვენი ოფისისთვის, ბიზნესისთვის და სახლისთვის.</p>
          </div>
          <div>
            <h3>SMARTLINE</h3>
            <Link href="/about">ჩვენ შესახებ</Link>
            <Link href="/catalog">პროდუქცია</Link>
            <Link href="/delivery">მიწოდება და გადახდა</Link>
            <Link href="/faq">ხშირად დასმული კითხვები</Link>
            <Link href="/contact">კონტაქტი</Link>
          </div>
          <div>
            <h3>პოპულარული კატეგორიები</h3>
            {popular.map((c) => (
              <Link key={c.id} href={categoryUrl(c.slug)}>
                {c.name}
              </Link>
            ))}
          </div>
          <div>
            <h3>დაგვიკავშირდით</h3>
            <p className="footline">
              <Icon name="pin" /> {site.address}
            </p>
            <a className="footline" href={`tel:${site.phone}`}>
              <Icon name="phone" /> {site.phoneLabel}
            </a>
            <a className="footline" href={`mailto:${site.email}`}>
              <Icon name="mail" /> {site.email}
            </a>
          </div>
        </div>
        <div className="bottom">
          <span>© {new Date().getFullYear()} SMARTLINE. ყველა უფლება დაცულია.</span>
          <strong>DESIGN BY INFINITY</strong>
        </div>
      </div>
    </footer>
  );
}

export function MobileTabBar() {
  return (
    <nav className="tabbar" aria-label="მობილური ნავიგაცია">
      <Link href="/">
        <span className="tabicon">
          <Icon name="home" />
        </span>
        მთავარი
      </Link>
      <Link href="/categories">
        <span className="tabicon">
          <Icon name="grid" />
        </span>
        კატალოგი
      </Link>
      <Link href="/favorites">
        <span className="tabicon">
          <Icon name="heart" />
        </span>
        რჩეულები
      </Link>
      <MobileCartTab />
    </nav>
  );
}
