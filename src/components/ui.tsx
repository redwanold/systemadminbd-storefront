import Link from "next/link";
import type { ReactNode } from "react";

export function Stars({ value, size = 13 }: { value: number; size?: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <span className="inline-flex items-center gap-[2px]" aria-label={`${value} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const state = i < full ? "full" : i === full && half ? "half" : "empty";
        return (
          <svg
            key={i}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            aria-hidden="true"
            className={state === "empty" ? "text-edge" : "text-acid"}
          >
            <defs>
              <linearGradient id={`half-${i}-${size}`}>
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.12)" />
              </linearGradient>
            </defs>
            <path
              d="M12 2.6l2.74 5.9 6.26.78-4.6 4.4 1.2 6.32L12 16.9l-5.6 3.1 1.2-6.32-4.6-4.4 6.26-.78z"
              fill={state === "half" ? `url(#half-${i}-${size})` : "currentColor"}
              opacity={state === "empty" ? 0.25 : 1}
            />
          </svg>
        );
      })}
    </span>
  );
}

export function Tag({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "acid" | "warn";
}) {
  const tones = {
    default: "border-white/10 bg-white/5 text-ash",
    acid: "border-acid/40 bg-acid/10 text-acid",
    warn: "border-amber-400/40 bg-amber-400/10 text-amber-300",
  } as const;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  hrefLabel,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.34em] text-acid">{eyebrow}</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-bone sm:text-4xl">{title}</h2>
        {description ? <p className="mt-3 text-sm leading-relaxed text-ash">{description}</p> : null}
      </div>
      {href && hrefLabel ? (
        <Link
          href={href}
          className="group inline-flex w-fit items-center gap-2 border-b border-white/15 pb-1 font-mono text-[11px] uppercase tracking-[0.22em] text-bone transition-colors hover:border-acid hover:text-acid"
        >
          {hrefLabel}
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      ) : null}
    </div>
  );
}
