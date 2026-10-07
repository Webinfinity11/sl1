import type { Metadata, Viewport } from "next";
import { Noto_Sans_Georgian } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const georgian = Noto_Sans_Georgian({
  variable: "--font-georgian",
  subsets: ["georgian", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "SMARTLINE — ყველაფერი ერთ სივრცეში", template: "%s | SMARTLINE" },
  description: site.description,
  openGraph: { siteName: "SMARTLINE", locale: "ka_GE", type: "website" },
};

export const viewport: Viewport = { themeColor: "#174abc" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ka" className={georgian.variable}>
      <body>{children}</body>
    </html>
  );
}
