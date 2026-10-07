import type { Metadata } from "next";
import { Favorites } from "./Favorites";

export const metadata: Metadata = { title: "რჩეულები", robots: { index: false } };

export default function FavoritesPage() {
  return (
    <div className="container">
      <div className="pagehead">
        <h1>რჩეულები</h1>
      </div>
      <Favorites />
    </div>
  );
}
