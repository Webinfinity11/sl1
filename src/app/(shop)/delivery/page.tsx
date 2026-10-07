import type { Metadata } from "next";
import { ContactBox } from "@/components/ContactBox";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "მიწოდება და გადახდა" };

export default function Page() {
  return (
    <div className="container">
      <div className="pagehead">
        <h1>მიწოდება და გადახდა</h1>
      </div>
      <div className="prose">
        <h2>მიწოდება</h2>
        <p>{site.freeDeliveryFrom} ₾-დან შეკვეთაზე მიწოდება უფასოა. მომსახურების ზონისა და ვადების დასაზუსტებლად დაგვიკავშირდით.</p>
        <h2>გადახდა</h2>
        <p>შეკვეთის გაფორმების შემდეგ მენეჯერი დაგიკავშირდებათ დასადასტურებლად. გადახდა შესაძლებელია ნაღდი ანგარიშსწორებით ან საბანკო გადარიცხვით; კომპანიებისთვის გამოიწერება ინვოისი.</p>
        <ContactBox />
      </div>
    </div>
  );
}
