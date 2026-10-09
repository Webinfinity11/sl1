"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/Icon";
import { categoryUrl } from "@/lib/format";

export type SideNode = { id: number; name: string; slug: string; image: string | null; count: number; children: SideNode[] };

/** Category sidebar with collapsible branches; the branch holding the current category starts open. */
export function SidebarTree({ tree, activeId }: { tree: SideNode[]; activeId?: number }) {
  const contains = (n: SideNode): boolean => n.id === activeId || n.children.some(contains);
  return (
    <aside className="sidebar" aria-label="კატეგორიები">
      <div className="side-head">
        <Icon name="grid" /> კატეგორიები
      </div>
      <Link className={activeId ? "side-all" : "side-all active"} href="/catalog">
        ყველა პროდუქტი
      </Link>
      <ul className="side-tree">
        {tree.map((n) => (
          <Branch key={n.id} node={n} depth={0} activeId={activeId} startOpen={contains(n)} contains={contains} />
        ))}
      </ul>
    </aside>
  );
}

function Branch({
  node,
  depth,
  activeId,
  startOpen,
  contains,
}: {
  node: SideNode;
  depth: number;
  activeId?: number;
  startOpen: boolean;
  contains: (n: SideNode) => boolean;
}) {
  const [open, setOpen] = useState(startOpen);
  const kids = node.children;
  const active = node.id === activeId;
  return (
    <li className={depth === 0 ? "side-root" : "side-child"}>
      <div className={`side-row${active ? " active" : ""}${open && kids.length ? " open" : ""}`}>
        <Link href={categoryUrl(node.slug)} className="side-link">
          {depth === 0 && (
            <span className="side-thumb">{node.image && <Image src={node.image} alt="" width={28} height={28} />}</span>
          )}
          <span className="side-name">{node.name}</span>
          <span className="side-count">{node.count}</span>
        </Link>
        {kids.length > 0 && (
          <button
            type="button"
            className="side-toggle"
            aria-expanded={open}
            aria-label={`${node.name}: ${open ? "დახურვა" : "ქვეკატეგორიები"}`}
            onClick={() => setOpen((o) => !o)}
          >
            <Icon name="down" />
          </button>
        )}
      </div>
      {open && kids.length > 0 && (
        <ul className="side-sub">
          {kids.map((k) => (
            <Branch key={k.id} node={k} depth={depth + 1} activeId={activeId} startOpen={contains(k)} contains={contains} />
          ))}
        </ul>
      )}
    </li>
  );
}
