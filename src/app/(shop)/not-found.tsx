import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container success">
      <h1>გვერდი ვერ მოიძებნა</h1>
      <p className="muted">შესაძლოა პროდუქტი წაშლილია ან ბმული შეიცვალა.</p>
      <Link className="primary" href="/catalog">
        კატალოგის ნახვა
      </Link>
    </div>
  );
}
