export function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export const ORDER_STATUSES = ["new", "confirmed", "delivered", "cancelled"] as const;
export const ORDER_STATUS_LABELS: Record<string, string> = {
  new: "ახალი",
  confirmed: "დადასტურებული",
  delivered: "მიწოდებული",
  cancelled: "გაუქმებული",
};
