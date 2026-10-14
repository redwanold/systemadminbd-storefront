import { sql } from "drizzle-orm";
import { db } from "./index";
import { collections, products, reviews } from "./schema";
import { collectionSeed, reconProducts, type ProductSeed } from "./seed-data";
import { payloadProducts } from "./seed-data-2";
import {
  wirelessProducts,
  starterProducts,
  starterProductsExtra,
  opsecProducts,
} from "./seed-data-3";
import { featuredReviews, reviewPool, type ReviewSeed } from "./seed-reviews";

export const allProducts: ProductSeed[] = [
  ...reconProducts,
  ...payloadProducts,
  ...wirelessProducts,
  ...starterProducts,
  ...starterProductsExtra,
  ...opsecProducts,
];

const DDL = `
CREATE TABLE IF NOT EXISTS collections (
  id serial PRIMARY KEY,
  slug varchar(120) NOT NULL UNIQUE,
  name varchar(160) NOT NULL,
  tagline text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  image text NOT NULL DEFAULT '',
  accent varchar(32) NOT NULL DEFAULT '#39ff14',
  position integer NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS products (
  id serial PRIMARY KEY,
  slug varchar(160) NOT NULL UNIQUE,
  name varchar(200) NOT NULL,
  codename varchar(80) NOT NULL DEFAULT '',
  collection_slug varchar(120) NOT NULL,
  tagline text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  price_cents integer NOT NULL,
  compare_at_cents integer,
  difficulty varchar(40) NOT NULL DEFAULT 'Script Kiddie',
  badge varchar(40),
  stock integer NOT NULL DEFAULT 0,
  rating integer NOT NULL DEFAULT 50,
  review_count integer NOT NULL DEFAULT 0,
  featured boolean NOT NULL DEFAULT false,
  images jsonb NOT NULL DEFAULT '[]'::jsonb,
  highlights jsonb NOT NULL DEFAULT '[]'::jsonb,
  specs jsonb NOT NULL DEFAULT '[]'::jsonb,
  includes jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamp NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS reviews (
  id serial PRIMARY KEY,
  product_slug varchar(160) NOT NULL,
  author varchar(120) NOT NULL,
  handle varchar(120) NOT NULL DEFAULT '',
  rating integer NOT NULL,
  title varchar(200) NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  verified boolean NOT NULL DEFAULT true,
  created_at timestamp NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS orders (
  id serial PRIMARY KEY,
  order_number varchar(40) NOT NULL UNIQUE,
  email varchar(200) NOT NULL,
  full_name varchar(200) NOT NULL,
  handle varchar(120) NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  city varchar(120) NOT NULL DEFAULT '',
  postal_code varchar(40) NOT NULL DEFAULT '',
  country varchar(120) NOT NULL DEFAULT '',
  shipping_method varchar(60) NOT NULL DEFAULT 'standard',
  payment_method varchar(60) NOT NULL DEFAULT 'crypto',
  subtotal_cents integer NOT NULL,
  shipping_cents integer NOT NULL DEFAULT 0,
  discount_cents integer NOT NULL DEFAULT 0,
  total_cents integer NOT NULL,
  promo_code varchar(40),
  status varchar(40) NOT NULL DEFAULT 'confirmed',
  created_at timestamp NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS order_items (
  id serial PRIMARY KEY,
  order_number varchar(40) NOT NULL,
  product_slug varchar(160) NOT NULL,
  name varchar(200) NOT NULL,
  image text NOT NULL DEFAULT '',
  unit_price_cents integer NOT NULL,
  quantity integer NOT NULL
);
`;

function reviewsFor(product: ProductSeed, index: number): ReviewSeed[] {
  const custom = featuredReviews[product.slug];
  if (custom) return custom;
  const count = 3 + (index % 2);
  const out: ReviewSeed[] = [];
  for (let i = 0; i < count; i += 1) {
    const picked = reviewPool[(index * 5 + i * 3) % reviewPool.length];
    out.push({ ...picked, daysAgo: picked.daysAgo + index * 2 + i });
  }
  return out;
}

let seedPromise: Promise<void> | null = null;

async function runSeed() {
  await db.execute(sql.raw(DDL));

  const existing = await db.execute<{ count: string }>(
    sql`select count(*)::text as count from products`,
  );
  if (Number(existing.rows[0]?.count ?? "0") > 0) return;

  await db.insert(collections).values(collectionSeed).onConflictDoNothing();

  const reviewRows: (typeof reviews.$inferInsert)[] = [];
  const productRows: (typeof products.$inferInsert)[] = [];

  allProducts.forEach((p, index) => {
    const rs = reviewsFor(p, index);
    const total = rs.reduce((sum, r) => sum + r.rating, 0);
    const avg = rs.length ? Math.round((total / rs.length) * 10) : 50;
    productRows.push({
      slug: p.slug,
      name: p.name,
      codename: p.codename,
      collectionSlug: p.collectionSlug,
      tagline: p.tagline,
      description: p.description,
      priceCents: p.priceCents,
      compareAtCents: p.compareAtCents ?? null,
      difficulty: p.difficulty,
      badge: p.badge ?? null,
      stock: p.stock,
      rating: avg,
      reviewCount: rs.length,
      featured: p.featured ?? false,
      images: p.images,
      highlights: p.highlights,
      specs: p.specs,
      includes: p.includes,
      createdAt: new Date(Date.now() - index * 86400000),
    });
    rs.forEach((r) => {
      reviewRows.push({
        productSlug: p.slug,
        author: r.author,
        handle: r.handle,
        rating: r.rating,
        title: r.title,
        body: r.body,
        verified: true,
        createdAt: new Date(Date.now() - r.daysAgo * 86400000),
      });
    });
  });

  await db.insert(products).values(productRows).onConflictDoNothing();
  await db.insert(reviews).values(reviewRows);
}

export function ensureSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = runSeed().catch((err) => {
      seedPromise = null;
      throw err;
    });
  }
  return seedPromise;
}
