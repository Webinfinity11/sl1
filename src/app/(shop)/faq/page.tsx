import type { Metadata } from "next";
import { ContactBox } from "@/components/ContactBox";
import { getContent } from "@/lib/content";

export const metadata: Metadata = { title: "ხშირად დასმული კითხვები" };

export default async function FaqPage() {
  const { faq } = await getContent();
  return (
    <>
      <section className="pagehero compact">
        <div className="container">
          <div className="eyebrow">FAQ</div>
          <h1>{faq.title}</h1>
        </div>
      </section>
      <div className="container faq">
        {faq.items.map((item, i) => (
          <details key={item.question} open={i === 0}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
        <ContactBox />
      </div>
    </>
  );
}
