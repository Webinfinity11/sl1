import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCategoryTree } from "@/lib/data";
import { categoryUrl } from "@/lib/format";

export const metadata: Metadata = { title: "კატეგორიები" };

export default async function CategoriesPage() {
  "use cache";
  const tree = await getCategoryTree();
  return (
    <div className="container">
      <div className="pagehead">
        <h1>კატეგორიები</h1>
      </div>
      <div className="cat-index">
        {tree.map((c) => (
          <div className="card" key={c.id}>
            <Link href={categoryUrl(c.slug)}>
              <span className="catthumb">{c.image && <Image src={c.image} alt="" fill sizes="56px" />}</span>
              <span>
                {c.name} <small className="muted">({c.count})</small>
              </span>
            </Link>
            {c.children.length > 0 && (
              <ul>
                {c.children
                  .map((s) => (
                    <li key={s.id}>
                      <Link href={categoryUrl(s.slug)}>{s.name}</Link>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
