import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Icon } from "@/components/Icon";
import { HeaderCounters } from "@/components/cart/CartUI";
import { getCategoryTree } from "@/lib/data";
import { getContent } from "@/lib/content";
import { CategoryMenu, type MenuCategory } from "./CategoryMenu";
import { NavLinks } from "./NavLinks";
import { SearchBox } from "./SearchBox";

export async function Header() {
  "use cache";
  const [tree, { header, site }] = await Promise.all([getCategoryTree(), getContent()]);
  const menu: MenuCategory[] = tree
    .map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      image: c.image,
      count: c.count,
      children: c.children
        .map((s) => ({ id: s.id, name: s.name, slug: s.slug, count: s.count })),
    }));

  return (
    <>
      <div className="topbar">
        <div className="container topinner">
          <span>
            <Icon name="truck" /> {header.topbarText}
          </span>
          <div className="toplinks">
            {header.topLinks.map((l) => (
              <Link key={l.href + l.label} href={l.href}>
                {l.label}
              </Link>
            ))}
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
            <Suspense
              fallback={header.navLinks.map((l) => (
                <Link key={l.href + l.label} className="navlink" href={l.href}>
                  {l.label}
                </Link>
              ))}
            >
              <NavLinks links={header.navLinks} />
            </Suspense>
            {header.offerLabel && (
              <Link className="navoffer" href={header.offerHref || "/catalog"}>
                <Icon name="tag" />
                {header.offerLabel}
              </Link>
            )}
          </div>
        </nav>
      </header>
    </>
  );
}
