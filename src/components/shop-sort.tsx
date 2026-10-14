"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

const OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "rating", label: "Top rated" },
  { value: "price-asc", label: "Price: low → high" },
  { value: "price-desc", label: "Price: high → low" },
  { value: "newest", label: "Newest" },
];

export function ShopSort() {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const current = params.get("sort") ?? "featured";

  return (
    <label className="flex items-center gap-3">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ash">Sort</span>
      <select
        value={current}
        disabled={pending}
        onChange={(e) => {
          const next = new URLSearchParams(params.toString());
          if (e.target.value === "featured") next.delete("sort");
          else next.set("sort", e.target.value);
          const qs = next.toString();
          startTransition(() => router.push(qs ? `/shop?${qs}` : "/shop", { scroll: false }));
        }}
        className="cursor-pointer rounded-full border border-white/12 bg-void px-4 py-2 font-mono text-[11px] text-bone outline-none transition-colors hover:border-acid/50 focus:border-acid/60"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value} className="bg-void">
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
