import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer, Toast } from "@/components/cart/CartUI";
import { Footer, MobileTabBar } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SiteProvider } from "@/components/SiteProvider";
import { getContent } from "@/lib/content";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const { site } = await getContent();
  return (
    <SiteProvider value={site}>
      <CartProvider>
        <Header />
        <main>{children}</main>
        <Footer />
        <MobileTabBar />
        <CartDrawer />
        <Toast />
      </CartProvider>
    </SiteProvider>
  );
}
