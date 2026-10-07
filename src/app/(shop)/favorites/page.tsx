import type { Metadata } from "next";
import { Favorites } from "./Favorites";

export const metadata: Metadata = { title: "სურვილების სია", robots: { index: false } };

export default function FavoritesPage() {
  return (
    <div className="container">
      <div className="pagehead">
        <h1>სურვილების სია</h1>
      </div>
      <Favorites />
    </div>
  );
}
