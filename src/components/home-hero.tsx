import Image from "next/image";
import Link from "next/link";

const STATS = [
  { value: "18", label: "Field-tested units" },
  { value: "4.8", label: "Average rating" },
  { value: "62k", label: "Noobs levelled up" },
  { value: "48h", label: "Dispatch window" },
];

export function HomeHero() {
  return (
    <section className="scanlines relative isolate overflow-hidden">
      <div className="grid-noise pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute -left-40 top-10 h-[480px] w-[480px] rounded-full bg-acid/10 blur-[140px]" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-[420px] w-[420px] rounded-full bg-cyan-400/8 blur-[150px]" />

      <div className="relative mx-auto grid max-w-[1400px] items-center gap-12 px-5 pb-20 pt-16 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:pb-28 lg:pt-24">
        <div className="animate-rise">
          <div className="inline-flex items-center gap-2 rounded-full border border-acid/30 bg-acid/8 px-3.5 py-1.5">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-acid" />
            <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-acid">
              Drop 07 · Live now
            </span>
          </div>

          <h1 className="mt-7 text-[clamp(2.6rem,6.4vw,4.75rem)] font-semibold leading-[0.96] tracking-[-0.035em] text-bone">
            Black hat tools,
            <br />
            <span className="text-glow text-acid">white hat manners.</span>
          </h1>

          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-ash sm:text-base">
            Systemadminbd builds the offensive security hardware we wished existed when we were
            fumbling through our first CTF. Machined, documented and scope-gated — so the only thing
            you break is the lab you were told to break.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2.5 rounded-full bg-acid px-7 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-void transition-all hover:bg-bone"
            >
              Enter the arsenal
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/shop?collection=noob-starter-kits"
              className="inline-flex items-center gap-2.5 rounded-full border border-white/14 px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.22em] text-bone transition-all hover:border-acid/60 hover:text-acid"
            >
              Start as a noob
            </Link>
          </div>

          <dl className="mt-12 grid max-w-xl grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/8 bg-white/8 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="bg-void px-4 py-4">
                <dt className="font-mono text-xl font-semibold text-acid">{s.value}</dt>
                <dd className="mt-1 font-mono text-[9px] uppercase leading-relaxed tracking-[0.16em] text-ash">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative animate-fade" style={{ animationDelay: "160ms" }}>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 sm:aspect-[5/4] lg:aspect-[4/5]">
            <Image
              src="/images/hero.jpg"
              alt="Systemadminbd flagship hardware"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 46vw"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-void/10 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 animate-sweep bg-gradient-to-b from-acid/0 via-acid/15 to-acid/0" />

            <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/10 bg-void/75 p-4 backdrop-blur-xl">
              <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-acid">
                Flagship · SA-PS4
              </p>
              <p className="mt-2 text-[15px] font-medium text-bone">PortSniffer Mk IV</p>
              <p className="mt-1 text-[12px] text-ash">
                1.2M pps hardware sweeps · 14h field battery
              </p>
              <Link
                href="/products/portsniffer-mk-iv"
                className="mt-3 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-bone transition-colors hover:text-acid"
              >
                Inspect unit <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
