import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { getContent } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getContent();
  return { title: "კონტაქტი", description: `დაგვიკავშირდით: ${site.phoneLabel}, ${site.email}, ${site.address}` };
}

export default async function ContactPage() {
  const { contact, site } = await getContent();
  const mapSrc = `https://maps.google.com/maps?q=${site.lat},${site.lng}&z=16&hl=ka&output=embed`;
  return (
    <>
      <section className="pagehero compact">
        <div className="container">
          <div className="eyebrow">კონტაქტი</div>
          <h1>{contact.title}</h1>
          <p>{contact.text}</p>
        </div>
      </section>

      <div className="container contact">
        <div className="contact-cards">
          <a className="contact-card" href={`tel:${site.phone}`}>
            <span className="value-icon">
              <Icon name="phone" />
            </span>
            <span className="muted small">ტელეფონი</span>
            <strong>{site.phoneLabel}</strong>
            <span className="textlink">
              დარეკვა <Icon name="arrow" />
            </span>
          </a>
          <a className="contact-card" href={`mailto:${site.email}`}>
            <span className="value-icon">
              <Icon name="mail" />
            </span>
            <span className="muted small">ელფოსტა</span>
            <strong>{site.email}</strong>
            <span className="textlink">
              მოგვწერეთ <Icon name="arrow" />
            </span>
          </a>
          <a className="contact-card" href={`https://www.google.com/maps/dir/?api=1&destination=${site.lat},${site.lng}`} target="_blank" rel="noopener">
            <span className="value-icon">
              <Icon name="pin" />
            </span>
            <span className="muted small">ლოკაცია</span>
            <strong>{site.address}</strong>
            <span className="textlink">
              რუკაზე ნახვა <Icon name="arrow" />
            </span>
          </a>
          <div className="contact-card">
            <span className="value-icon">
              <Icon name="clock" />
            </span>
            <span className="muted small">სამუშაო საათები</span>
            <strong>{site.hours}</strong>
          </div>
        </div>

        <div className="contact-grid">
          <div className="map">
            <iframe src={mapSrc} title="SMARTLINE რუკაზე" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
          <aside className="contact-b2b">
            <div className="eyebrow">{contact.boxEyebrow}</div>
            <h2>{contact.boxTitle}</h2>
            <p>{contact.boxText}</p>
            {contact.boxPoints.length > 0 && (
              <ul className="trust">
                {contact.boxPoints.map((p) => (
                  <li key={p}>
                    <Icon name="check" /> {p}
                  </li>
                ))}
              </ul>
            )}
            <a className="primary wide" href={`mailto:${site.email}`}>
              {contact.boxButton} <Icon name="arrow" />
            </a>
            <Link className="textlink" href="/faq">
              ხშირად დასმული კითხვები <Icon name="arrow" />
            </Link>
          </aside>
        </div>
      </div>
    </>
  );
}
