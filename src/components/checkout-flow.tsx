"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useCart } from "./cart-context";
import { formatPrice, PROMO_CODES, SHIPPING_OPTIONS } from "@/lib/format";

const STEPS = ["Identity", "Delivery", "Payment"] as const;

const PAYMENTS = [
  { id: "crypto", label: "Crypto (BTC / XMR / ETH)", detail: "Settles in ~10 minutes" },
  { id: "card", label: "Card", detail: "Visa, Mastercard, Amex" },
  { id: "invoice", label: "Company invoice", detail: "NET-30, approval required" },
];

export function CheckoutFlow() {
  const { lines, subtotalCents, setQuantity, removeItem, clear, hydrated } = useCart();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [promoInput, setPromoInput] = useState("");
  const [promo, setPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [shipping, setShipping] = useState<string>("standard");
  const [payment, setPayment] = useState("crypto");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    email: "",
    fullName: "",
    handle: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const shippingOption = SHIPPING_OPTIONS.find((o) => o.id === shipping) ?? SHIPPING_OPTIONS[0];
  const shippingCents =
    subtotalCents >= 25000 && shippingOption.id === "standard" ? 0 : shippingOption.cents;

  const discountCents = useMemo(() => {
    if (!promo) return 0;
    const rule = PROMO_CODES[promo];
    if (!rule) return 0;
    return rule.type === "percent"
      ? Math.round((subtotalCents * rule.value) / 100)
      : Math.min(rule.value, subtotalCents);
  }, [promo, subtotalCents]);

  const totalCents = Math.max(0, subtotalCents + shippingCents - discountCents);

  const stepValid = (index: number) => {
    if (index === 0) return form.email.includes("@") && form.fullName.trim().length > 1;
    if (index === 1)
      return (
        form.address.trim().length > 3 &&
        form.city.trim().length > 1 &&
        form.country.trim().length > 1
      );
    return true;
  };

  async function placeOrder() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          shippingMethod: shipping,
          paymentMethod: payment,
          promoCode: promo ?? "",
          items: lines.map((l) => ({ slug: l.slug, quantity: l.quantity })),
        }),
      });
      const data = (await res.json()) as { orderNumber?: string; error?: string };
      if (!res.ok || !data.orderNumber) throw new Error(data.error ?? "Order failed");
      clear();
      router.push(`/checkout/success?order=${data.orderNumber}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Order failed");
      setBusy(false);
    }
  }

  if (hydrated && lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-5 px-5 py-28 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-2xl border border-white/10 font-mono text-lg text-ash">
          0x0
        </span>
        <h1 className="text-3xl font-semibold tracking-tight">Nothing staged</h1>
        <p className="text-sm text-ash">
          Your cart is empty, which makes checkout philosophically difficult.
        </p>
        <Link
          href="/shop"
          className="rounded-full bg-acid px-7 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-void transition-colors hover:bg-bone"
        >
          Back to the arsenal
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8 lg:py-16">
      <nav className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ash/60">
        <Link href="/shop" className="transition-colors hover:text-acid">
          Arsenal
        </Link>
        <span>/</span>
        <span className="text-ash">Checkout</span>
      </nav>

      <h1 className="mt-6 text-[clamp(2rem,4.2vw,3.2rem)] font-semibold tracking-[-0.03em]">
        Secure checkout
      </h1>
      <p className="mt-3 max-w-xl text-sm text-ash">
        Three steps. No account required. We keep the minimum data needed to ship a box and nothing
        more.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.25fr_0.85fr] lg:gap-14">
        <div>
          <ol className="flex items-center gap-2">
            {STEPS.map((label, i) => (
              <li key={label} className="flex flex-1 items-center gap-2">
                <button
                  type="button"
                  onClick={() => i < step && setStep(i)}
                  className={`flex items-center gap-2.5 rounded-full border px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors ${
                    i === step
                      ? "border-acid bg-acid/10 text-acid"
                      : i < step
                        ? "border-white/15 text-bone"
                        : "border-white/8 text-ash/50"
                  }`}
                >
                  <span>{i < step ? "✓" : `0${i + 1}`}</span>
                  <span className="hidden sm:inline">{label}</span>
                </button>
                {i < STEPS.length - 1 ? <span className="h-px flex-1 bg-white/10" /> : null}
              </li>
            ))}
          </ol>

          <div className="mt-8 rounded-2xl border border-white/8 bg-panel/40 p-6 sm:p-8">
            {step === 0 ? (
              <div className="animate-fade">
                <h2 className="text-lg font-medium tracking-tight">Who are we shipping to?</h2>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <Field label="Full name">
                    <input
                      className="field"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      placeholder="A. Operator"
                    />
                  </Field>
                  <Field label="Email">
                    <input
                      className="field"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@domain.net"
                    />
                  </Field>
                  <Field label="Handle (optional)">
                    <input
                      className="field"
                      value={form.handle}
                      onChange={(e) => setForm({ ...form, handle: e.target.value })}
                      placeholder="@nullbyte"
                    />
                  </Field>
                </div>
                <p className="mt-5 font-mono text-[10px] leading-relaxed tracking-[0.12em] text-ash/60">
                  Order confirmation and firmware notices go to this address. We do not sell it,
                  rent it, or lose it in an S3 bucket.
                </p>
              </div>
            ) : null}

            {step === 1 ? (
              <div className="animate-fade">
                <h2 className="text-lg font-medium tracking-tight">Delivery</h2>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Field label="Street address">
                      <input
                        className="field"
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        placeholder="14 Gulshan Ave, Apt 3B"
                      />
                    </Field>
                  </div>
                  <Field label="City">
                    <input
                      className="field"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                    />
                  </Field>
                  <Field label="Postal code">
                    <input
                      className="field"
                      value={form.postalCode}
                      onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                    />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Country">
                      <input
                        className="field"
                        value={form.country}
                        onChange={(e) => setForm({ ...form, country: e.target.value })}
                      />
                    </Field>
                  </div>
                </div>

                <div className="mt-7 flex flex-col gap-3">
                  {SHIPPING_OPTIONS.map((o) => {
                    const free = subtotalCents >= 25000 && o.id === "standard";
                    return (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => setShipping(o.id)}
                        className={`flex items-center justify-between gap-4 rounded-xl border px-5 py-4 text-left transition-colors ${
                          shipping === o.id
                            ? "border-acid/60 bg-acid/8"
                            : "border-white/10 hover:border-white/25"
                        }`}
                      >
                        <span>
                          <span className="block text-[13px] text-bone">{o.label}</span>
                          <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-ash">
                            {o.detail}
                          </span>
                        </span>
                        <span className="font-mono text-[12px] text-bone">
                          {free ? "Free" : o.cents === 0 ? "Free" : formatPrice(o.cents)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="animate-fade">
                <h2 className="text-lg font-medium tracking-tight">Payment</h2>
                <div className="mt-6 flex flex-col gap-3">
                  {PAYMENTS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPayment(p.id)}
                      className={`flex items-center justify-between gap-4 rounded-xl border px-5 py-4 text-left transition-colors ${
                        payment === p.id
                          ? "border-acid/60 bg-acid/8"
                          : "border-white/10 hover:border-white/25"
                      }`}
                    >
                      <span>
                        <span className="block text-[13px] text-bone">{p.label}</span>
                        <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-ash">
                          {p.detail}
                        </span>
                      </span>
                      <span
                        className={`h-3.5 w-3.5 rounded-full border ${
                          payment === p.id ? "border-acid bg-acid" : "border-white/25"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <label className="mt-7 flex items-start gap-3 rounded-xl border border-white/10 bg-void/50 p-4">
                  <input type="checkbox" defaultChecked className="mt-0.5 accent-[#39ff14]" />
                  <span className="text-[12px] leading-relaxed text-ash">
                    I confirm this hardware will only be used against systems I own or have written
                    authorisation to test.
                  </span>
                </label>

                {error ? (
                  <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-[12px] text-red-300">
                    {error}
                  </p>
                ) : null}
              </div>
            ) : null}

            <div className="mt-8 flex items-center justify-between gap-3">
              <button
                type="button"
                disabled={step === 0}
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="rounded-full border border-white/12 px-6 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ash transition-colors hover:text-bone disabled:opacity-30"
              >
                Back
              </button>
              {step < 2 ? (
                <button
                  type="button"
                  disabled={!stepValid(step)}
                  onClick={() => setStep((s) => s + 1)}
                  className="rounded-full bg-acid px-8 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-void transition-colors hover:bg-bone disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-ash"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  disabled={busy}
                  onClick={placeOrder}
                  className="rounded-full bg-acid px-8 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-void transition-colors hover:bg-bone disabled:opacity-60"
                >
                  {busy ? "Encrypting…" : `Pay ${formatPrice(totalCents)}`}
                </button>
              )}
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-white/8 bg-panel/40 p-6">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.26em] text-acid">
              Order summary
            </h2>
            <ul className="mt-5 flex flex-col gap-4">
              {lines.map((l) => (
                <li key={l.slug} className="flex gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-white/8">
                    <Image src={l.image} alt={l.name} fill sizes="64px" className="object-cover" />
                    <span className="absolute right-0 top-0 grid h-5 w-5 place-items-center rounded-bl-lg bg-void/85 font-mono text-[10px] text-acid">
                      {l.quantity}
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-[13px] text-bone">{l.name}</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ash/60">
                      {l.codename}
                    </span>
                    <div className="mt-auto flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setQuantity(l.slug, l.quantity - 1)}
                        className="font-mono text-[11px] text-ash hover:text-acid"
                      >
                        −
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuantity(l.slug, l.quantity + 1)}
                        className="font-mono text-[11px] text-ash hover:text-acid"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(l.slug)}
                        className="font-mono text-[9px] uppercase tracking-[0.16em] text-ash/50 hover:text-red-400"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <span className="font-mono text-[12px] text-bone">
                    {formatPrice(l.priceCents * l.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <form
              className="mt-6 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const code = promoInput.trim().toUpperCase();
                if (PROMO_CODES[code]) {
                  setPromo(code);
                  setPromoError(null);
                } else {
                  setPromo(null);
                  setPromoError("Invalid code");
                }
              }}
            >
              <input
                className="field"
                placeholder="Promo code"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
              />
              <button
                type="submit"
                className="shrink-0 rounded-lg border border-white/12 px-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ash transition-colors hover:border-acid/50 hover:text-acid"
              >
                Apply
              </button>
            </form>
            {promo ? (
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-acid">
                {promo} · {PROMO_CODES[promo].label}
              </p>
            ) : null}
            {promoError ? (
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-red-400">
                {promoError}
              </p>
            ) : null}
            <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-ash/45">
              Try NOOB10 · ROOTME · FREESHELL
            </p>

            <dl className="mt-6 flex flex-col gap-2.5 border-t border-white/8 pt-5 text-[13px]">
              <Row label="Subtotal" value={formatPrice(subtotalCents)} />
              <Row
                label="Shipping"
                value={shippingCents === 0 ? "Free" : formatPrice(shippingCents)}
              />
              {discountCents > 0 ? (
                <Row label="Discount" value={`− ${formatPrice(discountCents)}`} accent />
              ) : null}
              <div className="mt-3 flex items-center justify-between border-t border-white/8 pt-4">
                <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-ash">Total</dt>
                <dd className="text-xl font-semibold tracking-tight text-bone">
                  {formatPrice(totalCents)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-4 rounded-2xl border border-white/8 bg-void/50 p-5">
            <p className="font-mono text-[9px] uppercase leading-relaxed tracking-[0.16em] text-ash/60">
              ◆ TLS 1.3 · PCI-DSS proxy · zero card data stored
              <br />◆ Discreet packaging, no branding on the outer box
              <br />◆ Customs paperwork pre-filled for 46 countries
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-ash">{label}</dt>
      <dd className={accent ? "font-mono text-acid" : "font-mono text-bone"}>{value}</dd>
    </div>
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
