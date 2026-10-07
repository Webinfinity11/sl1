import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Icon } from "@/components/Icon";
import { HeaderCounters } from "@/components/cart/CartUI";
import { getCategoryTree } from "@/lib/data";
import { site } from "@/lib/site";
import { CategoryMenu, type MenuCategory } from "./CategoryMenu";
import { SearchBox } from "./SearchBox";

export async function Header() {
  "use cache";
  const tree = await getCategoryTree();
  const menu: MenuCategory[] = tree
    .filter((c) => c.count > 0)
    .map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      image: c.image,
      count: c.count,
      children: c.children
        .filter((s) => s.count > 0)
        .map((s) => ({ id: s.id, name: s.name, slug: s.slug, count: s.count })),
    }));

  return (
    <>
      <div className="topbar">
        <div className="container topinner">
          <span>
            <Icon name="truck" /> უფასო მიწოდება {site.freeDeliveryFrom} ₾-დან
          </span>
          <div className="toplinks">
            <Link href="/delivery">მიწოდება და გადახდა</Link>
            <Link href="/faq">ხშირად დასმული კითხვები</Link>
            <a href={`tel:${site.phone}`}>დაგვიკავშირდით: {site.phoneLabel}</a>
          </div>
        </div>
      </div>
      <header className="header">
        <div className="container headrow">
          <Link className="logo" href="/" aria-label="SMARTLINE მთავარი">
            <Image src="/img/logo.webp" alt="SMARTLINE" width={190} height={48} priority />
          </Link>
          <SearchBox />
          <HeaderCounters />
        </div>
        <nav className="nav">
          <div className="container navrow">
            <Suspense fallback={<div className="catwrap"><button className="catalogue">ყველა კატეგორია</button></div>}>
              <CategoryMenu tree={menu} />
            </Suspense>
            <Link className="navlink" href="/catalog">
              პროდუქცია
            </Link>
            <Link className="navlink" href="/about">
              ჩვენ შესახებ
            </Link>
            <Link className="navlink" href="/contact">
              კონტაქტი
            </Link>
            <Link className="navoffer" href="/catalog?sale=1">
              <Icon name="tag" />
              სპეციალური ფასები
            </Link>
          </div>
        </nav>
      </header>
    </>
  );
}
