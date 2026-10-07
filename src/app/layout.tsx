import type { Metadata, Viewport } from "next";
import "@fontsource-variable/noto-sans-georgian";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "SMARTLINE — ყველაფერი ერთ სივრცეში", template: "%s | SMARTLINE" },
  description: site.description,
  openGraph: { siteName: "SMARTLINE", locale: "ka_GE", type: "website" },
};

export const viewport: Viewport = { themeColor: "#174abc" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ka">
      <body>{children}</body>
    </html>
  );
}
