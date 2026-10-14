import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { ShopFilters } from "@/components/shop-filters";
import { ShopSort } from "@/components/shop-sort";
import {
  DIFFICULTIES,
  getCollectionCounts,
  getCollections,
  getProducts,
  type SortKey,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Arsenal",
  description: "Browse every Systemadminbd unit — recon rigs, payload hardware, wireless kit and starter crates.",
};

function asArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const collectionFilter = asArray(sp.collection);
  const difficultyFilter = asArray(sp.difficulty);
  const price = typeof sp.price === "string" ? sp.price : undefined;
  const q = typeof sp.q === "string" ? sp.q : undefined;
  const sort = (typeof sp.sort === "string" ? sp.sort : "featured") as SortKey;
  const inStock = sp.stock === "1";

  let min: number | undefined;
  let max: number | undefined;
  if (price) {
    const [lo, hi] = price.split("-").map((n) => Number(n));
    if (!Number.isNaN(lo) && lo > 0) min = lo;
    if (!Number.isNaN(hi) && hi > 0) max = hi;
  }

  const [items, collections, counts] = await Promise.all([
    getProducts({ collection: collectionFilter, difficulty: difficultyFilter, min, max, q, sort, inStock }),
    getCollections(),
    getCollectionCounts(),
  ]);

  const activeCollection =
    collectionFilter.length === 1 ? collections.find((c) => c.slug === collectionFilter[0]) : null;

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8 lg:py-16">
      <nav className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ash/60">
        <Link href="/" className="transition-colors hover:text-acid">
          Home
        </Link>
        <span>/</span>
        <span className="text-ash">{activeCollection ? activeCollection.name : "Arsenal"}</span>
      </nav>

      <header className="mt-6 max-w-3xl animate-rise">
        <h1 className="text-[clamp(2.1rem,4.6vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
          {activeCollection ? activeCollection.name : "The Arsenal"}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ash sm:text-[15px]">
          {activeCollection
            ? activeCollection.description
            : "Eighteen units across five lines. Filter by skill tier so you buy the thing you can actually operate, not the thing with the best photo."}
        </p>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[230px_1fr]">
        <Suspense fallback={<div className="h-10" />}>
          <ShopFilters
            totalCount={items.length}
            collections={collections.map((c) => ({
              value: c.slug,
              label: c.name,
              count: counts[c.slug] ?? 0,
            }))}
            difficulties={DIFFICULTIES.map((d) => ({ value: d, label: d }))}
          />
        </Suspense>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/8 pb-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ash">
              Showing <span className="text-bone">{items.length}</span> unit
              {items.length === 1 ? "" : "s"}
            </p>
            <Suspense fallback={null}>
              <ShopSort />
            </Suspense>
          </div>

          {items.length === 0 ? (
            <div className="mt-16 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-white/12 py-20 text-center">
              <span className="font-mono text-2xl text-ash/50">404</span>
              <p className="text-sm text-ash">No units matched that filter combination.</p>
              <Link
                href="/shop"
                className="rounded-full border border-acid/40 bg-acid/10 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-acid transition-colors hover:bg-acid hover:text-void"
              >
                Reset filters
              </Link>
            </div>
          ) : (
            <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((p, i) => (
                <ProductCard key={p.slug} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
