import type { Metadata } from "next";
import { ContactBox } from "@/components/ContactBox";

export const metadata: Metadata = { title: "ხშირად დასმული კითხვები" };

export default function Page() {
  return (
    <div className="container">
      <div className="pagehead">
        <h1>ხშირად დასმული კითხვები</h1>
      </div>
      <div className="prose">
        <h2>როგორ შევუკვეთო?</h2>
        <p>დაამატეთ პროდუქცია კალათაში, შეავსეთ საკონტაქტო ინფორმაცია და გამოგზავნეთ შეკვეთა. მენეჯერი დაგიკავშირდებათ დასადასტურებლად.</p>
        <h2>რას ნიშნავს „ფასი შეთანხმებით“?</h2>
        <p>ზოგიერთი პროდუქციის ფასი დამოკიდებულია რაოდენობასა და კონფიგურაციაზე. დაამატეთ კალათაში და ფასს მენეჯერი დაგიზუსტებთ.</p>
        <h2>მუშაობთ კომპანიებთან?</h2>
        <p>დიახ — გთავაზობთ ინდივიდუალურ ფასებს, ინვოისს და რეგულარულ მომარაგებას.</p>
        <ContactBox />
      </div>
    </div>
  );
}
