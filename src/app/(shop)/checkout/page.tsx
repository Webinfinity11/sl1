import type { Metadata } from "next";
import { Checkout } from "./Checkout";

export const metadata: Metadata = { title: "შეკვეთის გაფორმება", robots: { index: false } };

export default function CheckoutPage() {
  return (
    <div className="container narrow">
      <Checkout />
    </div>
  );
}
