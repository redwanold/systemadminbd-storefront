"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";

type Option = { value: string; label: string; count?: number };

const PRICE_BUCKETS: Option[] = [
  { value: "0-10000", label: "Under $100" },
  { value: "10000-20000", label: "$100 – $200" },
  { value: "20000-35000", label: "$200 – $350" },
  { value: "35000-0", label: "$350+" },
];

export function ShopFilters({
  collections,
  difficulties,
  totalCount,
}: {
  collections: Option[];
  difficulties: Option[];
  totalCount: number;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState(params.get("q") ?? "");

  const push = useCallback(
    (next: URLSearchParams) => {
      const qs = next.toString();
      startTransition(() => router.push(qs ? `/shop?${qs}` : "/shop", { scroll: false }));
    },
    [router],
  );

  const toggle = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    const current = next.getAll(key);
    next.delete(key);
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updated.forEach((v) => next.append(key, v));
    push(next);
  };

  const setSingle = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (value === null || next.get(key) === value) next.delete(key);
    else next.set(key, value);
    push(next);
  };

  const selected = (key: string, value: string) => params.getAll(key).includes(value);
  const activeCount =
    params.getAll("collection").length +
    params.getAll("difficulty").length +
    (params.get("price") ? 1 : 0) +
    (params.get("stock") ? 1 : 0) +
    (params.get("q") ? 1 : 0);

  const body = (
    <div className={`flex flex-col gap-8 ${pending ? "opacity-60" : ""} transition-opacity`}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const next = new URLSearchParams(params.toString());
          if (search.trim()) next.set("q", search.trim());
          else next.delete("q");
          push(next);
        }}
      >
        <label className="font-mono text-[10px] uppercase tracking-[0.24em] text-acid">Search</label>
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-white/10 bg-void px-3 py-2.5 focus-within:border-acid/50">
          <span className="font-mono text-[11px] text-acid">/</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="grep the arsenal"
            className="w-full bg-transparent font-mono text-[12px] text-bone outline-none placeholder:text-ash/45"
          />
        </div>
      </form>

      <FilterGroup title="Collection">
        {collections.map((c) => (
          <CheckRow
            key={c.value}
            label={c.label}
            count={c.count}
            checked={selected("collection", c.value)}
            onChange={() => toggle("collection", c.value)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Skill tier">
        {difficulties.map((d) => (
          <CheckRow
            key={d.value}
            label={d.label}
            count={d.count}
            checked={selected("difficulty", d.value)}
            onChange={() => toggle("difficulty", d.value)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Price">
        {PRICE_BUCKETS.map((b) => (
          <CheckRow
            key={b.value}
            label={b.label}
            radio
            checked={params.get("price") === b.value}
            onChange={() => setSingle("price", b.value)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Availability">
        <CheckRow
          label="In stock only"
          checked={params.get("stock") === "1"}
          onChange={() => setSingle("stock", "1")}
        />
      </FilterGroup>

      {activeCount > 0 ? (
        <button
          type="button"
          onClick={() => {
            setSearch("");
            const next = new URLSearchParams();
            const sort = params.get("sort");
            if (sort) next.set("sort", sort);
            push(next);
          }}
          className="rounded-full border border-white/12 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-ash transition-colors hover:border-red-400/50 hover:text-red-300"
        >
          Clear {activeCount} filter{activeCount > 1 ? "s" : ""}
        </button>
      ) : null}
    </div>
  );

  return (
    <>
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="w-full rounded-full border border-white/12 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-bone transition-colors hover:border-acid/50"
        >
          {mobileOpen ? "Hide filters" : `Filters${activeCount ? ` (${activeCount})` : ""}`}
        </button>
        {mobileOpen ? (
          <div className="mt-5 animate-fade rounded-2xl border border-white/8 bg-panel/40 p-5">{body}</div>
        ) : null}
      </div>

      <aside className="hidden lg:block">
        <div className="sticky top-24">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ash">
            {totalCount} units matched
          </p>
          <div className="mt-6">{body}</div>
        </div>
      </aside>
    </>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-mono text-[10px] uppercase tracking-[0.24em] text-acid">{title}</h3>
      <div className="mt-3 flex flex-col gap-1">{children}</div>
    </div>
  );
}

function CheckRow({
  label,
  count,
  checked,
  onChange,
  radio = false,
}: {
  label: string;
  count?: number;
  checked: boolean;
  onChange: () => void;
  radio?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="group flex items-center justify-between gap-3 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-white/4"
    >
      <span className="flex items-center gap-2.5">
        <span
          className={`grid h-3.5 w-3.5 shrink-0 place-items-center border transition-all ${
            radio ? "rounded-full" : "rounded-[3px]"
          } ${checked ? "border-acid bg-acid" : "border-white/20 group-hover:border-acid/50"}`}
        >
          {checked ? <span className="text-[8px] font-bold leading-none text-void">✓</span> : null}
        </span>
        <span className={`text-[13px] ${checked ? "text-bone" : "text-ash"}`}>{label}</span>
      </span>
      {typeof count === "number" ? (
        <span className="font-mono text-[10px] text-ash/50">{count}</span>
      ) : null}
    </button>
  );
}
