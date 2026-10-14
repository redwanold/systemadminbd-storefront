import { and, asc, desc, eq, gte, ilike, inArray, lte, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { collections, products, reviews, type Product } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";

export type SortKey = "featured" | "price-asc" | "price-desc" | "rating" | "newest";

export type ShopFilters = {
  collection?: string[];
  difficulty?: string[];
  min?: number;
  max?: number;
  q?: string;
  sort?: SortKey;
  inStock?: boolean;
};

export async function getCollections() {
  await ensureSeeded();
  return db.select().from(collections).orderBy(asc(collections.position));
}

export async function getCollection(slug: string) {
  await ensureSeeded();
  const rows = await db.select().from(collections).where(eq(collections.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function getFeaturedProducts(limit = 6) {
  await ensureSeeded();
  return db
    .select()
    .from(products)
    .where(eq(products.featured, true))
    .orderBy(desc(products.rating))
    .limit(limit);
}

export async function getBestSellers(limit = 4) {
  await ensureSeeded();
  return db
    .select()
    .from(products)
    .orderBy(desc(products.reviewCount), desc(products.rating))
    .limit(limit);
}

export async function getNewArrivals(limit = 4) {
  await ensureSeeded();
  return db.select().from(products).orderBy(desc(products.createdAt)).limit(limit);
}

export async function getProducts(filters: ShopFilters = {}): Promise<Product[]> {
  await ensureSeeded();
  const conditions = [];
  if (filters.collection?.length) {
    conditions.push(inArray(products.collectionSlug, filters.collection));
  }
  if (filters.difficulty?.length) {
    conditions.push(inArray(products.difficulty, filters.difficulty));
  }
  if (typeof filters.min === "number") {
    conditions.push(gte(products.priceCents, filters.min));
  }
  if (typeof filters.max === "number") {
    conditions.push(lte(products.priceCents, filters.max));
  }
  if (filters.inStock) {
    conditions.push(gte(products.stock, 1));
  }
  if (filters.q) {
    const term = `%${filters.q}%`;
    conditions.push(
      or(
        ilike(products.name, term),
        ilike(products.tagline, term),
        ilike(products.codename, term),
        ilike(products.description, term),
      )!,
    );
  }

  const order = (() => {
    switch (filters.sort) {
      case "price-asc":
        return [asc(products.priceCents)];
      case "price-desc":
        return [desc(products.priceCents)];
      case "rating":
        return [desc(products.rating), desc(products.reviewCount)];
      case "newest":
        return [desc(products.createdAt)];
      default:
        return [desc(products.featured), desc(products.rating)];
    }
  })();

  const base = db.select().from(products);
  const query = conditions.length ? base.where(and(...conditions)) : base;
  return query.orderBy(...order);
}

export async function getProductBySlug(slug: string) {
  await ensureSeeded();
  const rows = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function getProductsBySlugs(slugs: string[]) {
  await ensureSeeded();
  if (!slugs.length) return [];
  return db.select().from(products).where(inArray(products.slug, slugs));
}

export async function getRelatedProducts(product: Product, limit = 4) {
  await ensureSeeded();
  return db
    .select()
    .from(products)
    .where(and(eq(products.collectionSlug, product.collectionSlug), sql`${products.slug} <> ${product.slug}`))
    .orderBy(desc(products.rating))
    .limit(limit);
}

export async function getReviews(slug: string) {
  await ensureSeeded();
  return db
    .select()
    .from(reviews)
    .where(eq(reviews.productSlug, slug))
    .orderBy(desc(reviews.createdAt));
}

export async function getPriceBounds() {
  await ensureSeeded();
  const rows = await db
    .select({
      min: sql<number>`coalesce(min(${products.priceCents}), 0)`,
      max: sql<number>`coalesce(max(${products.priceCents}), 0)`,
    })
    .from(products);
  return rows[0] ?? { min: 0, max: 0 };
}

export async function getCollectionCounts(): Promise<Record<string, number>> {
  await ensureSeeded();
  const rows = await db
    .select({ slug: products.collectionSlug, count: sql<number>`count(*)::int` })
    .from(products)
    .groupBy(products.collectionSlug);
  return Object.fromEntries(rows.map((r) => [r.slug, Number(r.count)]));
}

export async function getTopReviews(limit = 3) {
  await ensureSeeded();
  return db
    .select({
      id: reviews.id,
      author: reviews.author,
      handle: reviews.handle,
      rating: reviews.rating,
      title: reviews.title,
      body: reviews.body,
      createdAt: reviews.createdAt,
      productSlug: reviews.productSlug,
      productName: products.name,
    })
    .from(reviews)
    .innerJoin(products, eq(products.slug, reviews.productSlug))
    .where(eq(reviews.rating, 5))
    .orderBy(desc(reviews.createdAt))
    .limit(limit);
}

export const DIFFICULTIES = ["Script Kiddie", "Apprentice", "Operator", "Black Hat"] as const;
