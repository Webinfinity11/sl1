"use client";

import Image from "next/image";
import { useState } from "react";

export function Gallery({ images, name, badge }: { images: string[]; name: string; badge: string | null }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="gallery-main">
        {badge && <span className="badge sale-badge">{badge}</span>}
        {images[active] ? (
          <Image src={images[active]} alt={name} fill sizes="(max-width: 900px) 100vw, 600px" priority />
        ) : (
          <span className="noimg">SMARTLINE</span>
        )}
      </div>
      {images.length > 1 && (
        <div className="thumbs">
          {images.map((src, i) => (
            <button
              key={src}
              className={i === active ? "active" : ""}
              onClick={() => setActive(i)}
              aria-label={`სურათი ${i + 1}`}
            >
              <Image src={src} alt="" fill sizes="76px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
