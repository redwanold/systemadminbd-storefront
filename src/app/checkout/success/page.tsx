import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orders } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { formatPrice, SHIPPING_OPTIONS } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Order confirmed" };

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: number } = await searchParams;
  await ensureSeeded();

  const order = number
    ? (await db.select().from(orders).where(eq(orders.orderNumber, number)).limit(1))[0]
    : undefined;
  const items = order
    ? await db.select().from(orderItems).where(eq(orderItems.orderNumber, order.orderNumber))
    : [];

  if (!order) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-5 px-5 py-28 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Order not found</h1>
        <p className="text-sm text-ash">That reference does not match anything in our ledger.</p>
        <Link
          href="/shop"
          className="rounded-full bg-acid px-7 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-void"
        >
          Back to the arsenal
        </Link>
      </div>
    );
  }

  const ship = SHIPPING_OPTIONS.find((o) => o.id === order.shippingMethod) ?? SHIPPING_OPTIONS[0];

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:py-24">
      <div className="animate-rise text-center">
        <span className="inline-grid h-14 w-14 place-items-center rounded-2xl border border-acid/40 bg-acid/10 text-xl text-acid">
          ✓
        </span>
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-acid">
          Transmission complete
        </p>
        <h1 className="mt-4 text-[clamp(2rem,4.5vw,3rem)] font-semibold tracking-[-0.03em]">
          Order {order.orderNumber} confirmed
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-ash">
          A receipt is on its way to{" "}
          <span className="text-bone">{order.email}</span>. Your crate leaves the bench within 48
          hours via {ship.label.toLowerCase()} ({ship.detail.toLowerCase()}).
        </p>
      </div>

      <div className="mt-12 overflow-hidden rounded-2xl border border-white/8 bg-panel/40">
        <ul className="divide-y divide-white/6">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-4 p-5">
              {item.image ? (
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-white/8">
                  <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                </div>
              ) : null}
              <div className="min-w-0 flex-1">
                <Link
                  href={`/products/${item.productSlug}`}
                  className="truncate text-[14px] text-bone hover:text-acid"
                >
                  {item.name}
                </Link>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ash/60">
                  Qty {item.quantity} · {formatPrice(item.unitPriceCents)} each
                </p>
              </div>
              <span className="font-mono text-[13px] text-bone">
                {formatPrice(item.unitPriceCents * item.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <dl className="flex flex-col gap-2.5 border-t border-white/8 p-5 text-[13px]">
          <div className="flex justify-between">
            <dt className="text-ash">Subtotal</dt>
            <dd className="font-mono text-bone">{formatPrice(order.subtotalCents)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ash">Shipping</dt>
            <dd className="font-mono text-bone">
              {order.shippingCents === 0 ? "Free" : formatPrice(order.shippingCents)}
            </dd>
          </div>
          {order.discountCents > 0 ? (
            <div className="flex justify-between">
              <dt className="text-ash">Discount {order.promoCode ? `(${order.promoCode})` : ""}</dt>
              <dd className="font-mono text-acid">− {formatPrice(order.discountCents)}</dd>
            </div>
          ) : null}
          <div className="mt-2 flex items-center justify-between border-t border-white/8 pt-4">
            <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-ash">Paid</dt>
            <dd className="text-xl font-semibold tracking-tight">{formatPrice(order.totalCents)}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/8 bg-void/50 p-5">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.24em] text-acid">Ship to</h2>
          <p className="mt-3 text-[13px] leading-relaxed text-ash">
            {order.fullName}
            {order.handle ? ` · ${order.handle}` : ""}
            <br />
            {order.address}
            <br />
            {order.city} {order.postalCode}
            <br />
            {order.country}
          </p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-void/50 p-5">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.24em] text-acid">Next steps</h2>
          <ul className="mt-3 flex flex-col gap-2 text-[13px] text-ash">
            <li>▸ Scope card arrives inside the box — fill it in first.</li>
            <li>▸ Firmware channel invite lands with your receipt.</li>
            <li>▸ Support replies within one business day, by a human.</li>
          </ul>
        </div>
      </div>

      <div className="mt-10 flex justify-center">
        <Link
          href="/shop"
          className="rounded-full border border-white/12 px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.2em] text-bone transition-colors hover:border-acid/60 hover:text-acid"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
