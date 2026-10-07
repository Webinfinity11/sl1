"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/Icon";

/** Horizontal product row with prev/next arrows instead of a scrollbar. */
export function RailScroller({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const update = () => {
    const el = ref.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  };

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const go = (dir: number) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };

  return (
    <div className="rail-wrap">
      <button className="rail-arrow prev" onClick={() => go(-1)} disabled={edges.start} aria-label="წინა">
        <Icon name="left" />
      </button>
      <div className="rail" ref={ref} onScroll={update}>
        {children}
      </div>
      <button className="rail-arrow next" onClick={() => go(1)} disabled={edges.end} aria-label="შემდეგი">
        <Icon name="right" />
      </button>
    </div>
  );
}
