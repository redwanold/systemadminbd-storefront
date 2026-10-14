"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "@/db/schema";
import { formatPrice } from "@/lib/format";
import { useCart } from "./cart-context";

export function AddToCart({ product }: { product: Product }) {
  const { addItem } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const soldOut = product.stock === 0;
  const image = product.images[0] ?? "/images/hero.jpg";

  const line = {
    slug: product.slug,
    name: product.name,
    codename: product.codename,
    image,
    priceCents: product.priceCents,
    stock: product.stock,
  };

  return (
    <div className="mt-7">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center rounded-full border border-white/12">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="h-11 w-11 rounded-l-full text-ash transition-colors hover:text-acid"
          >
            −
          </button>
          <span className="w-10 text-center font-mono text-sm text-bone">{qty}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQty((q) => Math.min(Math.max(product.stock, 1), q + 1))}
            className="h-11 w-11 rounded-r-full text-ash transition-colors hover:text-acid"
          >
            +
          </button>
        </div>

        <button
          type="button"
          disabled={soldOut}
          onClick={() => addItem(line, qty)}
          className="flex-1 rounded-full bg-acid px-8 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-void transition-all hover:bg-bone disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-ash"
        >
          {soldOut ? "Sold out" : `Add to cart · ${formatPrice(product.priceCents * qty)}`}
        </button>
      </div>

      <button
        type="button"
        disabled={soldOut}
        onClick={() => {
          addItem(line, qty);
          router.push("/checkout");
        }}
        className="mt-3 w-full rounded-full border border-white/12 px-8 py-3.5 font-mono text-[11px] uppercase tracking-[0.22em] text-bone transition-all hover:border-acid/60 hover:text-acid disabled:cursor-not-allowed disabled:opacity-40"
      >
        Buy it now
      </button>

      <ul className="mt-6 grid gap-2.5 text-[12px] text-ash sm:grid-cols-2">
        <li className="flex items-center gap-2">
          <span className="text-acid">◆</span> Dispatched within 48 hours
        </li>
        <li className="flex items-center gap-2">
          <span className="text-acid">◆</span> 30-day no-questions returns
        </li>
        <li className="flex items-center gap-2">
          <span className="text-acid">◆</span> Signed, reproducible firmware
        </li>
        <li className="flex items-center gap-2">
          <span className="text-acid">◆</span> Scope card in every box
        </li>
      </ul>
    </div>
  );
}
