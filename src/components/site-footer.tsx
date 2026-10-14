import Link from "next/link";

const COLUMNS = [
  {
    title: "Arsenal",
    links: [
      { label: "All tools", href: "/shop" },
      { label: "Recon rigs", href: "/shop?collection=recon-rigs" },
      { label: "Payload hardware", href: "/shop?collection=payload-hardware" },
      { label: "Wireless warfare", href: "/shop?collection=wireless-warfare" },
      { label: "Noob starter kits", href: "/shop?collection=noob-starter-kits" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Shipping & customs", href: "/shop" },
      { label: "Firmware channel", href: "/shop" },
      { label: "Returns (30 days)", href: "/shop" },
      { label: "Warranty", href: "/shop" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Systemadminbd", href: "/" },
      { label: "Responsible use policy", href: "/" },
      { label: "Range partners", href: "/" },
      { label: "Careers", href: "/" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-white/8 bg-ink">
      <div className="grid-noise pointer-events-none absolute inset-0 opacity-50" />
      <div className="relative mx-auto max-w-[1400px] px-5 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-md border border-acid/40 bg-acid/10 font-mono text-sm font-bold text-acid">
                $_
              </span>
              <span className="text-lg font-semibold tracking-tight text-bone">
                Systemadmin<span className="text-acid">bd</span>
              </span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ash">
              Offensive security hardware, curated for people who are still learning. Every unit ships
              with a scope card, signed firmware and documentation written by someone who remembers
              being confused.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-acid" />
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-ash">
                Warehouse online · 14 engineers on shift
              </span>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="font-mono text-[10px] uppercase tracking-[0.26em] text-acid">
                  {col.title}
                </h3>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-[13px] text-ash transition-colors hover:text-bone"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/8 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ash/60">
            © {new Date().getFullYear()} Systemadminbd Ltd · Fictional storefront, real craftsmanship
          </p>
          <p className="max-w-xl font-mono text-[10px] leading-relaxed tracking-[0.12em] text-ash/50">
            All hardware sold for authorised testing, education and research. Unauthorised access to
            systems you do not own is a crime in every jurisdiction we ship to.
          </p>
        </div>
      </div>
    </footer>
  );
}
