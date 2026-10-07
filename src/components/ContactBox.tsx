import { Icon } from "@/components/Icon";
import { site } from "@/lib/site";

export function ContactBox() {
  return (
    <div className="contactbox">
      <p>
        <Icon name="pin" /> {site.address}
      </p>
      <a href={`tel:${site.phone}`}>
        <Icon name="phone" /> {site.phoneLabel}
      </a>
      <a href={`mailto:${site.email}`}>
        <Icon name="mail" /> {site.email}
      </a>
    </div>
  );
}
