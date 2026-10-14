"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "./cart-context";

const NAV = [
  { href: "/shop", label: "All Tools" },
  { href: "/shop?collection=recon-rigs", label: "Recon" },
  { href: "/shop?collection=payload-hardware", label: "Payloads" },
  { href: "/shop?collection=wireless-warfare", label: "Wireless" },
  { href: "/shop?collection=noob-starter-kits", label: "Starter Kits" },
];

export function SiteHeader() {
  const { count, open, hydrated } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <>
      <div className="relative overflow-hidden border-b border-white/5 bg-acid/8">
        <div className="flex w-max animate-marquee gap-10 py-2">
          {Array.from({ length: 2 }).map((_, dup) => (
            <div key={dup} className="flex shrink-0 gap-10">
              {[
                "Authorised lab use only — scope card ships with every unit",
                "Free standard courier on orders over $250",
                "Firmware signed + reproducible builds",
                "Dhaka · Singapore · Rotterdam fulfilment",
                "90-day human support on every kit",
              ].map((t) => (
                <span
                  key={t}
                  className="font-mono text-[10px] uppercase tracking-[0.28em] text-acid/80"
                >
                  {t} <span className="text-acid/30">◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <header
        className={`sticky top-0 z-40 border-b transition-all duration-300 ${
          scrolled
            ? "border-white/8 bg-void/85 backdrop-blur-xl"
            : "border-transparent bg-gradient-to-b from-void to-void/0"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-6 px-5 sm:px-8">
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-md border border-acid/40 bg-acid/10 font-mono text-[13px] font-bold text-acid transition-all group-hover:bg-acid group-hover:text-void">
              $_
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-[15px] font-semibold tracking-tight text-bone">
                Systemadmin<span className="text-acid">bd</span>
              </span>
              <span className="mt-0.5 font-mono text-[8.5px] uppercase tracking-[0.28em] text-ash/70">
                Black Hat Tooling
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-mono text-[11px] uppercase tracking-[0.18em] text-ash transition-colors hover:text-acid"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <Link
              href="/shop"
              className="hidden rounded-full border border-white/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ash transition-colors hover:border-acid/50 hover:text-acid sm:inline-flex"
            >
              Search
            </Link>
            <button
              type="button"
              onClick={open}
              className="relative inline-flex items-center gap-2 rounded-full border border-acid/35 bg-acid/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-acid transition-all hover:bg-acid hover:text-void"
            >
              Cart
              <span className="grid h-4 min-w-4 place-items-center rounded-full bg-void/70 px-1 text-[9px] text-acid">
                {hydrated ? count : 0}
              </span>
            </button>
            <button
              type="button"
              aria-label="Menu"
              onClick={() => setMenuOpen((v) => !v)}
              className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-bone lg:hidden"
            >
              <span className="flex flex-col gap-[3px]">
                <span className="block h-px w-4 bg-current" />
                <span className="block h-px w-4 bg-current" />
                <span className="block h-px w-4 bg-current" />
              </span>
            </button>
          </div>
        </div>

        {menuOpen ? (
          <div className="animate-fade border-t border-white/8 bg-void/95 px-5 py-4 backdrop-blur-xl lg:hidden">
            <nav className="flex flex-col gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-2.5 font-mono text-[12px] uppercase tracking-[0.18em] text-ash transition-colors hover:bg-white/5 hover:text-acid"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        ) : null}
      </header>
    </>
  );
}
