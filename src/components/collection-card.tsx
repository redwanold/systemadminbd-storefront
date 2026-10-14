import Image from "next/image";
import Link from "next/link";
import type { Collection } from "@/db/schema";

export function CollectionCard({
  collection,
  count,
  large = false,
  index = 0,
}: {
  collection: Collection;
  count: number;
  large?: boolean;
  index?: number;
}) {
  return (
    <Link
      href={`/shop?collection=${collection.slug}`}
      className={`group relative animate-rise overflow-hidden rounded-2xl border border-white/8 transition-all duration-500 hover:border-white/20 ${
        large ? "md:col-span-2 md:row-span-2" : ""
      }`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className={`relative ${large ? "aspect-[4/3] md:aspect-square" : "aspect-[4/3]"}`}>
        <Image
          src={collection.image}
          alt={collection.name}
          fill
          sizes={large ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 25vw"}
          className="object-cover opacity-70 transition-all duration-700 group-hover:scale-105 group-hover:opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent" />
        <div
          className="absolute inset-x-0 bottom-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: `linear-gradient(90deg, transparent, ${collection.accent}, transparent)` }}
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: collection.accent }}
          />
          <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-ash">
            {count} units
          </span>
        </div>
        <h3
          className={`mt-2 font-semibold tracking-tight text-bone transition-colors ${
            large ? "text-2xl sm:text-3xl" : "text-lg"
          }`}
        >
          {collection.name}
        </h3>
        <p className={`mt-1.5 text-ash ${large ? "max-w-md text-sm" : "text-[12px]"}`}>
          {large ? collection.description : collection.tagline}
        </p>
        <span
          className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] transition-transform group-hover:translate-x-1"
          style={{ color: collection.accent }}
        >
          Browse <span>→</span>
        </span>
      </div>
    </Link>
  );
}
