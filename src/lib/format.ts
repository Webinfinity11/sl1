export const money = (n: number) => n.toFixed(2);

export const finalPrice = (p: { price: number; salePrice: number | null }) => p.salePrice ?? p.price;

export const discount = (p: { price: number; salePrice: number | null }) =>
  p.salePrice && p.price ? Math.round((1 - p.salePrice / p.price) * 100) : 0;

export const productUrl = (slug: string) => `/product/${encodeURIComponent(slug)}`;
export const categoryUrl = (slug: string) => `/category/${encodeURIComponent(slug)}`;

/** Units a shopper may put in the cart: tracked stock, or the general cap. */
export const maxQty = (stockQty: number | null | undefined) => (stockQty == null ? 999 : Math.max(0, stockQty));

export const LOW_STOCK = 5;
