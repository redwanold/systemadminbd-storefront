export function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function ratingToStars(rating: number) {
  return Math.round((rating / 10) * 10) / 10;
}

export function formatDate(value: Date | string) {
  const d = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

export const SHIPPING_OPTIONS = [
  { id: "standard", label: "Standard courier", detail: "5-8 business days", cents: 0 },
  { id: "express", label: "Express tracked", detail: "2-3 business days", cents: 1800 },
  { id: "blackbag", label: "Black Bag overnight", detail: "Next day, signature required", cents: 4900 },
] as const;

export const PROMO_CODES: Record<string, { type: "percent" | "flat"; value: number; label: string }> = {
  NOOB10: { type: "percent", value: 10, label: "10% off for first-timers" },
  ROOTME: { type: "percent", value: 15, label: "15% off sitewide" },
  FREESHELL: { type: "flat", value: 2500, label: "$25 off your crate" },
};
