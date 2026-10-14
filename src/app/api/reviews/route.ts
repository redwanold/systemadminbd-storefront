import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { products, reviews } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  await ensureSeeded();
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const productSlug = String(body.productSlug ?? "").trim();
    const author = String(body.author ?? "").trim();
    const title = String(body.title ?? "").trim();
    const text = String(body.body ?? "").trim();
    const handle = String(body.handle ?? "").trim();
    const rating = Math.min(5, Math.max(1, Number(body.rating) || 5));

    if (!productSlug || !author || !title || !text) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existing = await db
      .select({ slug: products.slug })
      .from(products)
      .where(eq(products.slug, productSlug))
      .limit(1);
    if (!existing.length) {
      return NextResponse.json({ error: "Unknown product" }, { status: 404 });
    }

    await db.insert(reviews).values({
      productSlug,
      author: author.slice(0, 120),
      handle: handle.slice(0, 120),
      rating,
      title: title.slice(0, 200),
      body: text.slice(0, 2000),
      verified: false,
    });

    const agg = await db
      .select({
        avg: sql<number>`coalesce(round(avg(${reviews.rating}) * 10), 50)`,
        count: sql<number>`count(*)::int`,
      })
      .from(reviews)
      .where(eq(reviews.productSlug, productSlug));

    await db
      .update(products)
      .set({ rating: Number(agg[0]?.avg ?? 50), reviewCount: Number(agg[0]?.count ?? 0) })
      .where(eq(products.slug, productSlug));

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not save review" }, { status: 500 });
  }
}
