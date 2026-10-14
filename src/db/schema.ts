import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  timestamp,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";

export const collections = pgTable("collections", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  name: varchar("name", { length: 160 }).notNull(),
  tagline: text("tagline").notNull().default(""),
  description: text("description").notNull().default(""),
  image: text("image").notNull().default(""),
  accent: varchar("accent", { length: 32 }).notNull().default("#39ff14"),
  position: integer("position").notNull().default(0),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  name: varchar("name", { length: 200 }).notNull(),
  codename: varchar("codename", { length: 80 }).notNull().default(""),
  collectionSlug: varchar("collection_slug", { length: 120 }).notNull(),
  tagline: text("tagline").notNull().default(""),
  description: text("description").notNull().default(""),
  // price in cents
  priceCents: integer("price_cents").notNull(),
  compareAtCents: integer("compare_at_cents"),
  difficulty: varchar("difficulty", { length: 40 }).notNull().default("Script Kiddie"),
  badge: varchar("badge", { length: 40 }),
  stock: integer("stock").notNull().default(0),
  rating: integer("rating").notNull().default(50), // 0-50 => /10
  reviewCount: integer("review_count").notNull().default(0),
  featured: boolean("featured").notNull().default(false),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  highlights: jsonb("highlights").$type<string[]>().notNull().default([]),
  specs: jsonb("specs").$type<{ label: string; value: string }[]>().notNull().default([]),
  includes: jsonb("includes").$type<string[]>().notNull().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productSlug: varchar("product_slug", { length: 160 }).notNull(),
  author: varchar("author", { length: 120 }).notNull(),
  handle: varchar("handle", { length: 120 }).notNull().default(""),
  rating: integer("rating").notNull(),
  title: varchar("title", { length: 200 }).notNull().default(""),
  body: text("body").notNull().default(""),
  verified: boolean("verified").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 40 }).notNull().unique(),
  email: varchar("email", { length: 200 }).notNull(),
  fullName: varchar("full_name", { length: 200 }).notNull(),
  handle: varchar("handle", { length: 120 }).notNull().default(""),
  address: text("address").notNull().default(""),
  city: varchar("city", { length: 120 }).notNull().default(""),
  postalCode: varchar("postal_code", { length: 40 }).notNull().default(""),
  country: varchar("country", { length: 120 }).notNull().default(""),
  shippingMethod: varchar("shipping_method", { length: 60 }).notNull().default("standard"),
  paymentMethod: varchar("payment_method", { length: 60 }).notNull().default("crypto"),
  subtotalCents: integer("subtotal_cents").notNull(),
  shippingCents: integer("shipping_cents").notNull().default(0),
  discountCents: integer("discount_cents").notNull().default(0),
  totalCents: integer("total_cents").notNull(),
  promoCode: varchar("promo_code", { length: 40 }),
  status: varchar("status", { length: 40 }).notNull().default("confirmed"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 40 }).notNull(),
  productSlug: varchar("product_slug", { length: 160 }).notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  image: text("image").notNull().default(""),
  unitPriceCents: integer("unit_price_cents").notNull(),
  quantity: integer("quantity").notNull(),
});

export type Collection = typeof collections.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
