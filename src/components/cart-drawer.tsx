"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "./cart-context";
import { formatPrice } from "@/lib/format";

const FREE_SHIPPING_AT = 25000;

export function CartDrawer() {
  const { isOpen, close, lines, setQuantity, removeItem, subtotalCents, count, lastAdded } = useCart();
  const router = useRouter();

  if (!isOpen) return null;

  const remaining = Math.max(FREE_SHIPPING_AT - subtotalCents, 0);
  const progress = Math.min((subtotalCents / FREE_SHIPPING_AT) * 100, 100);

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Cart">
      <button
        type="button"
        aria-label="Close cart"
        onClick={close}
        className="absolute inset-0 animate-fade bg-void/75 backdrop-blur-sm"
      />
      <aside className="relative flex h-full w-full max-w-[440px] animate-drawer-in flex-col border-l border-white/10 bg-ink shadow-[0_0_120px_rgba(0,0,0,0.9)]">
        <div className="flex items-center justify-between border-b border-white/8 px-6 py-5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-acid">Your payload</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-bone">
              Cart <span className="text-ash">({count})</span>
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-ash transition-colors hover:border-acid/50 hover:text-acid"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {lines.length > 0 ? (
          <div className="border-b border-white/8 px-6 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ash">
              {remaining > 0 ? (
                <>
                  <span className="text-bone">{formatPrice(remaining)}</span> to free courier
                </>
              ) : (
                <span className="text-acid">Free courier unlocked</span>
              )}
            </p>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/8">
              <div
                className="h-full rounded-full bg-acid transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : null}

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <div className="grid h-16 w-16 place-items-center rounded-2xl border border-white/10 font-mono text-lg text-ash">
                0x0
              </div>
              <p className="text-sm text-ash">Empty buffer. Nothing staged yet.</p>
              <Link
                href="/shop"
                onClick={close}
                className="rounded-full border border-acid/40 bg-acid/10 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-acid transition-colors hover:bg-acid hover:text-void"
              >
                Browse the arsenal
              </Link>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {lines.map((line) => (
                <li
                  key={line.slug}
                  className={`flex gap-4 rounded-xl border p-3 transition-colors ${
                    lastAdded === line.slug
                      ? "border-acid/50 bg-acid/5"
                      : "border-white/8 bg-panel/50"
                  }`}
                >
                  <Link
                    href={`/products/${line.slug}`}
                    onClick={close}
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-white/8"
                  >
                    <Image src={line.image} alt={line.name} fill sizes="80px" className="object-cover" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/products/${line.slug}`}
                        onClick={close}
                        className="truncate text-sm font-medium text-bone hover:text-acid"
                      >
                        {line.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeItem(line.slug)}
                        className="font-mono text-[10px] uppercase tracking-[0.15em] text-ash/60 transition-colors hover:text-red-400"
                      >
                        Del
                      </button>
                    </div>
                    <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ash/60">
                      {line.codename}
                    </p>
                    <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                      <div className="flex items-center rounded-full border border-white/10">
                        <button
                          type="button"
                          aria-label="Decrease"
                          onClick={() => setQuantity(line.slug, line.quantity - 1)}
                          className="h-7 w-7 rounded-l-full text-ash transition-colors hover:text-acid"
                        >
                          −
                        </button>
                        <span className="w-7 text-center font-mono text-[11px] text-bone">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase"
                          onClick={() => setQuantity(line.slug, line.quantity + 1)}
                          className="h-7 w-7 rounded-r-full text-ash transition-colors hover:text-acid"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-mono text-[13px] text-bone">
                        {formatPrice(line.priceCents * line.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 ? (
          <div className="border-t border-white/8 bg-panel/40 px-6 py-5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ash">Subtotal</span>
              <span className="text-lg font-semibold text-bone">{formatPrice(subtotalCents)}</span>
            </div>
            <p className="mt-1 text-[11px] text-ash/70">
              Shipping, duties and the obligatory legal lecture calculated at checkout.
            </p>
            <button
              type="button"
              onClick={() => {
                close();
                router.push("/checkout");
              }}
              className="mt-4 w-full rounded-full bg-acid px-6 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-void transition-all hover:bg-bone"
            >
              Secure checkout
            </button>
            <button
              type="button"
              onClick={close}
              className="mt-2 w-full rounded-full px-6 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-ash transition-colors hover:text-bone"
            >
              Keep browsing
            </button>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
