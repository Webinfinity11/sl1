import type { Metadata } from "next";
import { ContactBox } from "@/components/ContactBox";
import { getContent } from "@/lib/content";

export const metadata: Metadata = { title: "მიწოდება და გადახდა" };

export default async function DeliveryPage() {
  const { delivery } = await getContent();
  return (
    <>
      <section className="pagehero compact">
        <div className="container">
          <h1>{delivery.title}</h1>
        </div>
      </section>
      <div className="container prose">
        {delivery.sections.map((s) => (
          <section key={s.title}>
            <h2>{s.title}</h2>
            {s.text.split(/\n\s*\n/).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </section>
        ))}
        <ContactBox />
      </div>
    </>
  );
}
