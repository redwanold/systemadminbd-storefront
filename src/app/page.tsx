import Link from "next/link";
import { CollectionCard } from "@/components/collection-card";
import { HomeHero } from "@/components/home-hero";
import { ProductCard } from "@/components/product-card";
import { SectionHeading, Stars, Tag } from "@/components/ui";
import {
  getCollectionCounts,
  getCollections,
  getFeaturedProducts,
  getNewArrivals,
  getTopReviews,
} from "@/lib/queries";
import { ratingToStars } from "@/lib/format";

export const dynamic = "force-dynamic";

const PILLARS = [
  {
    step: "01",
    title: "Pick your tier",
    body: "Every unit is labelled Script Kiddie, Apprentice, Operator or Black Hat. Buy one tier above where you are, never three.",
  },
  {
    step: "02",
    title: "Register your scope",
    body: "Scope-gated hardware refuses to transmit until you declare the range you own. It takes ninety seconds and saves careers.",
  },
  {
    step: "03",
    title: "Break things legally",
    body: "Each box ships with a lab image, a syllabus and a support channel staffed by people who were noobs eighteen months ago.",
  },
];

export default async function HomePage() {
  const [collections, counts, featured, fresh, testimonials] = await Promise.all([
    getCollections(),
    getCollectionCounts(),
    getFeaturedProducts(8),
    getNewArrivals(4),
    getTopReviews(3),
  ]);

  return (
    <>
      <HomeHero />

      <section className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 lg:py-24">
        <SectionHeading
          eyebrow="Collections"
          title="Choose your attack surface"
          description="Five curated lines, each tuned in our Dhaka lab and shipped with firmware you can read end to end."
          href="/shop"
          hrefLabel="See everything"
        />
        <div className="mt-10 grid auto-rows-fr gap-4 sm:grid-cols-2 md:grid-cols-4">
          {collections.map((c, i) => (
            <CollectionCard
              key={c.slug}
              collection={c}
              count={counts[c.slug] ?? 0}
              large={i === 0}
              index={i}
            />
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-white/8 bg-ink/60">
        <div className="grid-noise pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-[1400px] px-5 py-16 sm:px-8 lg:py-24">
          <SectionHeading
            eyebrow="Featured hardware"
            title="The units people keep re-ordering"
            description="Ranked by rating and restock velocity. If it is on this shelf, our support queue is quiet about it."
            href="/shop?sort=rating"
            hrefLabel="Shop top rated"
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.34em] text-acid">
              How this works
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              We sell capability.
              <br />
              We insist on consent.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ash">
              Offensive tooling without guardrails creates criminals, not engineers. Everything in
              this shop is built so the learning curve bends toward competence instead of a court
              date.
            </p>
            <Link
              href="/shop?collection=noob-starter-kits"
              className="mt-7 inline-flex items-center gap-2.5 rounded-full border border-acid/40 bg-acid/10 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-acid transition-all hover:bg-acid hover:text-void"
            >
              Start with a crate →
            </Link>
          </div>
          <div className="flex flex-col gap-px overflow-hidden rounded-2xl border border-white/8 bg-white/8">
            {PILLARS.map((p) => (
              <div key={p.step} className="group bg-void p-6 transition-colors hover:bg-panel sm:p-8">
                <div className="flex items-start gap-5">
                  <span className="font-mono text-sm text-acid">{p.step}</span>
                  <div>
                    <h3 className="text-lg font-medium tracking-tight text-bone">{p.title}</h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-ash">{p.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-white/8 bg-ink/60">
        <div className="relative mx-auto max-w-[1400px] px-5 py-16 sm:px-8 lg:py-24">
          <SectionHeading
            eyebrow="Field reports"
            title="What the noobs said after"
            description="Verified purchases, unedited. We only remove the ones with slurs in them."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <figure
                key={t.id}
                className="animate-rise rounded-2xl border border-white/8 bg-panel/50 p-6 transition-colors hover:border-acid/25"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <Stars value={t.rating} size={14} />
                <figcaption className="mt-4 text-[15px] font-medium tracking-tight text-bone">
                  {t.title}
                </figcaption>
                <blockquote className="mt-2 text-[13px] leading-relaxed text-ash">
                  “{t.body}”
                </blockquote>
                <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/8 pt-4">
                  <div>
                    <p className="text-[12px] text-bone">{t.author}</p>
                    <p className="font-mono text-[10px] text-ash/60">{t.handle}</p>
                  </div>
                  <Link
                    href={`/products/${t.productSlug}`}
                    className="font-mono text-[9px] uppercase tracking-[0.18em] text-ash transition-colors hover:text-acid"
                  >
                    {t.productName}
                  </Link>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 lg:py-24">
        <SectionHeading
          eyebrow="Fresh off the bench"
          title="New arrivals"
          href="/shop?sort=newest"
          hrefLabel="All new units"
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {fresh.map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 pb-20 sm:px-8">
        <div className="scanlines relative overflow-hidden rounded-3xl border border-acid/20 bg-gradient-to-br from-panel via-ink to-void p-8 sm:p-14">
          <div className="grid-noise pointer-events-none absolute inset-0 opacity-50" />
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-acid/15 blur-[120px]" />
          <div className="relative max-w-2xl">
            <Tag tone="acid">Drop list</Tag>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
              Get the next drop before the resellers do.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ash">
              One email per drop. Firmware notes, restock alerts and the occasional teardown. No
              trackers in the pixels — we checked, it is kind of our thing.
            </p>
            <form className="mt-7 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                placeholder="operator@yourdomain.net"
                className="w-full rounded-full border border-white/12 bg-void/70 px-5 py-3.5 font-mono text-[12px] text-bone outline-none transition-colors placeholder:text-ash/50 focus:border-acid/60"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-acid px-7 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-void transition-colors hover:bg-bone"
              >
                Subscribe
              </button>
            </form>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ash/50">
              Average rating across the shop · {ratingToStars(48)} / 5
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
