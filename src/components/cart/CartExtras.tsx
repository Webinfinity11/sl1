"use client";

import { Icon } from "@/components/Icon";
import { money } from "@/lib/format";
import { useSite } from "@/components/SiteProvider";

export function FreeDeliveryBar({ total }: { total: number }) {
  const site = useSite();
  const left = site.freeDeliveryFrom - total;
  const pct = Math.min(100, (total / site.freeDeliveryFrom) * 100);
  return (
    <div className={left <= 0 ? "freebar done" : "freebar"}>
      <p>
        <Icon name="truck" />
        {left <= 0 ? (
          <span>მიწოდება უფასოა!</span>
        ) : (
          <span>
            უფასო მიწოდებამდე დარჩა <b>{money(left)} ₾</b>
          </span>
        )}
      </p>
      <div className="freebar-track">
        <div style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

const steps = ["კალათა", "მონაცემები", "დადასტურება"];

export function CheckoutSteps({ current }: { current: number }) {
  return (
    <ol className="steps">
      {steps.map((s, i) => (
        <li key={s} className={i < current ? "done" : i === current ? "current" : ""}>
          <span>{i < current ? <Icon name="check" /> : i + 1}</span>
          {s}
        </li>
      ))}
    </ol>
  );
}
