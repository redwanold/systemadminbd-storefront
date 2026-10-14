import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orders, products } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { PROMO_CODES, SHIPPING_OPTIONS } from "@/lib/format";

export const dynamic = "force-dynamic";

type IncomingLine = { slug: string; quantity: number };

function orderNumber() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
  let out = "";
  for (let i = 0; i < 6; i += 1) out += chars[Math.floor(Math.random() * chars.length)];
  return `SA-${out}`;
}

export async function POST(request: Request) {
  await ensureSeeded();
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const items = Array.isArray(body.items) ? (body.items as IncomingLine[]) : [];
    if (!items.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const email = String(body.email ?? "").trim();
    const fullName = String(body.fullName ?? "").trim();
    if (!email || !fullName) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const resolved = await Promise.all(
      items.map(async (item) => {
        const rows = await db
          .select()
          .from(products)
          .where(eq(products.slug, String(item.slug)))
          .limit(1);
        const product = rows[0];
        if (!product) return null;
        const quantity = Math.max(1, Math.min(Number(item.quantity) || 1, 99));
        return { product, quantity };
      }),
    );

    const lines = resolved.filter((l): l is NonNullable<typeof l> => l !== null);
    if (!lines.length) {
      return NextResponse.json({ error: "No valid items" }, { status: 400 });
    }

    const subtotalCents = lines.reduce((s, l) => s + l.product.priceCents * l.quantity, 0);

    const shippingId = String(body.shippingMethod ?? "standard");
    const shippingOption =
      SHIPPING_OPTIONS.find((o) => o.id === shippingId) ?? SHIPPING_OPTIONS[0];
    const shippingCents = subtotalCents >= 25000 && shippingOption.id === "standard" ? 0 : shippingOption.cents;

    const promoRaw = String(body.promoCode ?? "").trim().toUpperCase();
    const promo = PROMO_CODES[promoRaw];
    const discountCents = promo
      ? promo.type === "percent"
        ? Math.round((subtotalCents * promo.value) / 100)
        : Math.min(promo.value, subtotalCents)
      : 0;

    const totalCents = Math.max(0, subtotalCents + shippingCents - discountCents);
    const number = orderNumber();

    await db.insert(orders).values({
      orderNumber: number,
      email,
      fullName,
      handle: String(body.handle ?? "").slice(0, 120),
      address: String(body.address ?? ""),
      city: String(body.city ?? ""),
      postalCode: String(body.postalCode ?? ""),
      country: String(body.country ?? ""),
      shippingMethod: shippingOption.id,
      paymentMethod: String(body.paymentMethod ?? "crypto"),
      subtotalCents,
      shippingCents,
      discountCents,
      totalCents,
      promoCode: promo ? promoRaw : null,
      status: "confirmed",
    });

    await db.insert(orderItems).values(
      lines.map((l) => ({
        orderNumber: number,
        productSlug: l.product.slug,
        name: l.product.name,
        image: l.product.images[0] ?? "",
        unitPriceCents: l.product.priceCents,
        quantity: l.quantity,
      })),
    );

    return NextResponse.json({ orderNumber: number, totalCents });
  } catch {
    return NextResponse.json({ error: "Could not place order" }, { status: 500 });
  }
}
