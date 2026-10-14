"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Review } from "@/db/schema";
import { formatDate } from "@/lib/format";
import { Stars } from "./ui";

export function ReviewSection({
  slug,
  reviews,
  average,
}: {
  slug: string;
  reviews: Review[];
  average: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ author: "", handle: "", rating: 5, title: "", body: "" });

  const buckets = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, productSlug: slug }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Could not post review");
      setDone(true);
      setOpen(false);
      setForm({ author: "", handle: "", rating: 5, title: "", body: "" });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section id="reviews" className="mt-20 border-t border-white/8 pt-14">
      <div className="grid gap-10 lg:grid-cols-[320px_1fr]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-acid">Field reports</p>
          <div className="mt-4 flex items-end gap-3">
            <span className="text-5xl font-semibold tracking-tight">{average.toFixed(1)}</span>
            <div className="pb-2">
              <Stars value={average} size={15} />
              <p className="mt-1 font-mono text-[10px] text-ash">{reviews.length} verified</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            {buckets.map((b) => (
              <div key={b.star} className="flex items-center gap-3">
                <span className="w-3 font-mono text-[11px] text-ash">{b.star}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/8">
                  <div
                    className="h-full rounded-full bg-acid/80"
                    style={{
                      width: `${reviews.length ? (b.count / reviews.length) * 100 : 0}%`,
                    }}
                  />
                </div>
                <span className="w-5 text-right font-mono text-[10px] text-ash/60">{b.count}</span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="mt-7 w-full rounded-full border border-acid/40 bg-acid/10 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-acid transition-colors hover:bg-acid hover:text-void"
          >
            {open ? "Cancel" : "Write a report"}
          </button>
          {done ? (
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-acid">
              Report logged. Thanks.
            </p>
          ) : null}
        </div>

        <div>
          {open ? (
            <form
              onSubmit={submit}
              className="mb-8 animate-fade rounded-2xl border border-white/10 bg-panel/50 p-6"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name">
                  <input
                    required
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    className="field"
                  />
                </Field>
                <Field label="Handle">
                  <input
                    value={form.handle}
                    onChange={(e) => setForm({ ...form, handle: e.target.value })}
                    placeholder="@yourhandle"
                    className="field"
                  />
                </Field>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ash">
                  Rating
                </span>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setForm({ ...form, rating: n })}
                    className={`font-mono text-[12px] ${
                      n <= form.rating ? "text-acid" : "text-ash/40"
                    }`}
                    aria-label={`${n} stars`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <div className="mt-4">
                <Field label="Headline">
                  <input
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="field"
                  />
                </Field>
              </div>
              <div className="mt-4">
                <Field label="Report">
                  <textarea
                    required
                    rows={4}
                    value={form.body}
                    onChange={(e) => setForm({ ...form, body: e.target.value })}
                    className="field resize-none"
                  />
                </Field>
              </div>
              {error ? <p className="mt-3 text-[12px] text-red-400">{error}</p> : null}
              <button
                type="submit"
                disabled={busy}
                className="mt-5 rounded-full bg-acid px-6 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-void transition-colors hover:bg-bone disabled:opacity-50"
              >
                {busy ? "Transmitting…" : "Submit report"}
              </button>
            </form>
          ) : null}

          <ul className="flex flex-col gap-4">
            {reviews.map((r, i) => (
              <li
                key={r.id}
                className="animate-rise rounded-2xl border border-white/8 bg-panel/40 p-6"
                style={{ animationDelay: `${Math.min(i, 6) * 50}ms` }}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full border border-acid/25 bg-acid/8 font-mono text-[12px] text-acid">
                      {r.author.slice(0, 1)}
                    </span>
                    <div>
                      <p className="text-[13px] text-bone">{r.author}</p>
                      <p className="font-mono text-[10px] text-ash/60">{r.handle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Stars value={r.rating} />
                    <span className="font-mono text-[10px] text-ash/50">
                      {formatDate(r.createdAt)}
                    </span>
                  </div>
                </div>
                <h4 className="mt-4 text-[15px] font-medium tracking-tight text-bone">{r.title}</h4>
                <p className="mt-2 text-[13px] leading-relaxed text-ash">{r.body}</p>
                {r.verified ? (
                  <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.2em] text-acid/70">
                    ✓ Verified purchase
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ash">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
