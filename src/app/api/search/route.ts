import { getProducts } from "@/lib/data";

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q")?.trim().slice(0, 100) ?? "";
  if (q.length < 2) return Response.json({ items: [], total: 0 });
  const { items, total } = await getProducts({ q });
  return Response.json({ items: items.slice(0, 6), total });
}
