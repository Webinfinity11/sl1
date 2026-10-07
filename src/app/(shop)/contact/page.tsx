import type { Metadata } from "next";
import { ContactBox } from "@/components/ContactBox";

export const metadata: Metadata = { title: "კონტაქტი" };

export default function Page() {
  return (
    <div className="container">
      <div className="pagehead">
        <h1>კონტაქტი</h1>
      </div>
      <div className="prose">
        <p>დაგვიკავშირდით ნებისმიერ საკითხზე — შეკვეთა, ფასის დაზუსტება ან ინდივიდუალური შეთავაზება თქვენი ბიზნესისთვის.</p>
        <ContactBox />
      </div>
    </div>
  );
}
