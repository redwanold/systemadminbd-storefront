"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/db/schema";
import { formatPrice, ratingToStars } from "@/lib/format";
import { useCart } from "./cart-context";
import { Stars } from "./ui";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addItem } = useCart();
  const image = product.images[0] ?? "/images/hero.jpg";
  const discount =
    product.compareAtCents && product.compareAtCents > product.priceCents
      ? Math.round(((product.compareAtCents - product.priceCents) / product.compareAtCents) * 100)
      : 0;

  return (
    <article
      className="group relative flex animate-rise flex-col overflow-hidden rounded-2xl border border-white/8 bg-panel/60 transition-all duration-500 hover:border-acid/35 hover:shadow-[0_28px_70px_-40px_rgba(57,255,20,0.65)]"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden">
        <Image
          src={image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover opacity-85 grayscale-[35%] transition-all duration-700 group-hover:scale-[1.06] group-hover:opacity-100 group-hover:grayscale-0"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-void/15 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-acid/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {product.badge ? (
            <span className="rounded-full border border-acid/40 bg-void/80 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-acid backdrop-blur">
              {product.badge}
            </span>
          ) : null}
          {discount > 0 ? (
            <span className="rounded-full border border-white/15 bg-void/80 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-bone backdrop-blur">
              -{discount}%
            </span>
          ) : null}
        </div>
        {product.stock === 0 ? (
          <div className="absolute inset-0 grid place-items-center bg-void/70">
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-ash">Sold out</span>
          </div>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ash/70">
            {product.codename}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ash/70">
            {product.difficulty}
          </span>
        </div>

        <Link href={`/products/${product.slug}`} className="block">
          <h3 className="text-[17px] font-semibold leading-snug tracking-tight text-bone transition-colors group-hover:text-acid">
            {product.name}
          </h3>
        </Link>
        <p className="line-clamp-2 text-[13px] leading-relaxed text-ash">{product.tagline}</p>

        <div className="flex items-center gap-2">
          <Stars value={ratingToStars(product.rating)} />
          <span className="font-mono text-[10px] text-ash/70">({product.reviewCount})</span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold tracking-tight text-bone">
              {formatPrice(product.priceCents)}
            </span>
            {product.compareAtCents ? (
              <span className="font-mono text-[11px] text-ash/60 line-through">
                {formatPrice(product.compareAtCents)}
              </span>
            ) : null}
          </div>
          <button
            type="button"
            disabled={product.stock === 0}
            onClick={() =>
              addItem({
                slug: product.slug,
                name: product.name,
                codename: product.codename,
                image,
                priceCents: product.priceCents,
                stock: product.stock,
              })
            }
            className="rounded-full border border-white/12 bg-white/5 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-bone transition-all hover:border-acid hover:bg-acid hover:text-void disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-white/12 disabled:hover:bg-white/5 disabled:hover:text-bone"
          >
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
