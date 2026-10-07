import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer, Toast } from "@/components/cart/CartUI";
import { Footer, MobileTabBar } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Header />
      <main>{children}</main>
      <Footer />
      <MobileTabBar />
      <CartDrawer />
      <Toast />
    </CartProvider>
  );
}
