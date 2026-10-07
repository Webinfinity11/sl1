import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Icon, type IconName } from "@/components/Icon";
import { getContent } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { about } = await getContent();
  return { title: "ჩვენ შესახებ", description: about.intro.slice(0, 160) };
}

const reasonIcons: IconName[] = ["tag", "box", "shield", "truck", "check", "phone"];

export default async function AboutPage() {
  const { about, site } = await getContent();
  return (
    <>
      <section className="pagehero">
        <div className="container pagehero-grid">
          <div>
            <div className="eyebrow">ჩვენ შესახებ</div>
            <h1>{about.title}</h1>
            <p>{about.intro}</p>
            {about.note && <p className="pagehero-note">{about.note}</p>}
          </div>
          <div className="pagehero-art">
            <Image src="/img/heroimg.webp" alt="" fill sizes="(max-width: 900px) 100vw, 520px" priority />
          </div>
        </div>
      </section>

      <div className="container">
        {about.stats.length > 0 && (
          <ul className="stats">
            {about.stats.map((s) => (
              <li key={s.label}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </li>
            ))}
          </ul>
        )}

        {about.mission.length > 0 && (
          <section className="section mission">
            <div className="mission-art">
              <Image src="/img/techimg.webp" alt="" fill sizes="(max-width: 900px) 100vw, 480px" />
            </div>
            <div className="mission-text">
              <div className="eyebrow">{about.missionTitle}</div>
              {about.mission.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>
        )}

        {about.reasons.length > 0 && (
          <section className="section">
            <div className="sectiontitle">
              <div>
                <h2>{about.reasonsTitle}</h2>
                {about.reasonsText && <p>{about.reasonsText}</p>}
              </div>
            </div>
            <div className="values">
              {about.reasons.map((r, i) => (
                <article key={r} className="value">
                  <span className="value-icon">
                    <Icon name={reasonIcons[i % reasonIcons.length]} />
                  </span>
                  <h3>{r}</h3>
                </article>
              ))}
            </div>
          </section>
        )}

        {about.clients.length > 0 && (
          <section className="section">
            <div className="sectiontitle">
              <div>
                <h2>{about.clientsTitle}</h2>
                {about.clientsText && <p>{about.clientsText}</p>}
              </div>
            </div>
            <ul className="client-list">
              {about.clients.map((c) => (
                <li key={c}>
                  <Icon name="check" /> {c}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="business howto">
          <div>
            <div className="eyebrow">{about.howtoEyebrow}</div>
            <h2>{about.howtoTitle}</h2>
            <p>{about.howtoText}</p>
          </div>
          <div className="howto-actions">
            <a className="primary" href={`tel:${site.phone}`}>
              <Icon name="phone" /> {site.phoneLabel}
            </a>
            <a className="secondary" href={`mailto:${site.email}`}>
              <Icon name="mail" /> {site.email}
            </a>
            <Link className="textlink" href="/catalog">
              კატალოგის ნახვა <Icon name="arrow" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
