import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/add-to-cart";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { ReviewSection } from "@/components/review-section";
import { Stars, Tag } from "@/components/ui";
import { formatPrice, ratingToStars } from "@/lib/format";
import { getProductBySlug, getRelatedProducts, getReviews } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Unit not found" };
  return { title: product.name, description: product.tagline };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [reviews, related] = await Promise.all([
    getReviews(slug),
    getRelatedProducts(product, 4),
  ]);

  const average = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : ratingToStars(product.rating);

  const discount =
    product.compareAtCents && product.compareAtCents > product.priceCents
      ? Math.round(((product.compareAtCents - product.priceCents) / product.compareAtCents) * 100)
      : 0;

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8 lg:py-16">
      <nav className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ash/60">
        <Link href="/" className="transition-colors hover:text-acid">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="transition-colors hover:text-acid">
          Arsenal
        </Link>
        <span>/</span>
        <Link
          href={`/shop?collection=${product.collectionSlug}`}
          className="transition-colors hover:text-acid"
        >
          {product.collectionSlug.replace(/-/g, " ")}
        </Link>
        <span>/</span>
        <span className="text-ash">{product.codename}</span>
      </nav>

      <div className="mt-8 grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div className="animate-fade">
          <ProductGallery images={product.images} name={product.name} />
        </div>

        <div className="animate-rise">
          <div className="flex flex-wrap items-center gap-2">
            {product.badge ? <Tag tone="acid">{product.badge}</Tag> : null}
            <Tag>{product.difficulty}</Tag>
            <Tag tone={product.stock > 10 ? "default" : "warn"}>
              {product.stock > 0 ? `${product.stock} in stock` : "Backordered"}
            </Tag>
          </div>

          <h1 className="mt-5 text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.03] tracking-[-0.03em]">
            {product.name}
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-ash">{product.tagline}</p>

          <div className="mt-5 flex items-center gap-3">
            <Stars value={average} size={15} />
            <a
              href="#reviews"
              className="font-mono text-[11px] text-ash transition-colors hover:text-acid"
            >
              {average.toFixed(1)} · {reviews.length} field reports
            </a>
          </div>

          <div className="mt-7 flex items-end gap-3">
            <span className="text-3xl font-semibold tracking-tight">
              {formatPrice(product.priceCents)}
            </span>
            {product.compareAtCents ? (
              <>
                <span className="pb-1 font-mono text-sm text-ash/60 line-through">
                  {formatPrice(product.compareAtCents)}
                </span>
                <span className="mb-1 rounded-full border border-acid/40 bg-acid/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-acid">
                  save {discount}%
                </span>
              </>
            ) : null}
          </div>

          <AddToCart product={product} />

          <div className="mt-10 rounded-2xl border border-white/8 bg-panel/40 p-6">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.26em] text-acid">
              Why it exists
            </h2>
            <p className="mt-3 text-[13.5px] leading-relaxed text-ash">{product.description}</p>
            <ul className="mt-5 flex flex-col gap-2.5">
              {product.highlights.map((h) => (
                <li key={h} className="flex items-start gap-3 text-[13px] text-bone/90">
                  <span className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-acid" />
                  {h}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/8 bg-panel/40 p-6">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.26em] text-acid">
                Specification
              </h2>
              <dl className="mt-4 flex flex-col gap-3">
                {product.specs.map((s) => (
                  <div key={s.label} className="flex justify-between gap-4 border-b border-white/6 pb-2">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ash">
                      {s.label}
                    </dt>
                    <dd className="text-right text-[12px] text-bone">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="rounded-2xl border border-white/8 bg-panel/40 p-6">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.26em] text-acid">
                In the box
              </h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                {product.includes.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[12.5px] text-ash">
                    <span className="font-mono text-[10px] text-acid/70">▸</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <ReviewSection slug={product.slug} reviews={reviews} average={average} />

      {related.length ? (
        <section className="mt-20 border-t border-white/8 pt-14">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Pairs well with
            </h2>
            <Link
              href={`/shop?collection=${product.collectionSlug}`}
              className="font-mono text-[10px] uppercase tracking-[0.2em] text-ash transition-colors hover:text-acid"
            >
              Whole line →
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
