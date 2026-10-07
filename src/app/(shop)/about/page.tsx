import type { Metadata } from "next";
import { ContactBox } from "@/components/ContactBox";

export const metadata: Metadata = { title: "ჩვენ შესახებ" };

export default function Page() {
  return (
    <div className="container">
      <div className="pagehead">
        <h1>ჩვენ შესახებ</h1>
      </div>
      <div className="prose">
        <p>
          SMARTLINE აერთიანებს საკანცელარიო პროდუქციას, კომპიუტერის აქსესუარებს, ჰიგიენის საშუალებებს, სამეურნეო
          ნივთებსა და სხვა ყოველდღიურ საჭიროებებს — ოფისისთვის, ბიზნესისთვის და სახლისთვის.
        </p>
        <p>
          ვმუშაობთ როგორც ფიზიკურ პირებთან, ისე კომპანიებთან. ბიზნეს კლიენტებისთვის გთავაზობთ ინდივიდუალურ ფასებს და
          რეგულარულ მომარაგებას.
        </p>
        <ContactBox />
      </div>
    </div>
  );
}
