// Old WooCommerce category URLs (/product-category/parent/child/) → /category/child
export async function GET(request: Request, { params }: RouteContext<"/product-category/[...path]">) {
  const { path } = await params;
  const slug = path.filter((s) => s && s !== "page" && !/^\d+$/.test(s)).at(-1);
  return Response.redirect(new URL(slug ? `/category/${slug}` : "/catalog", request.url), 308);
}
