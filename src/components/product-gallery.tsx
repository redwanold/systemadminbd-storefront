"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const list = images.length ? images : ["/images/hero.jpg"];
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);

  return (
    <div className="flex flex-col-reverse gap-4 lg:flex-row">
      <div className="flex gap-3 lg:flex-col">
        {list.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`View image ${i + 1}`}
            className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border transition-all lg:h-20 lg:w-20 ${
              active === i
                ? "border-acid opacity-100"
                : "border-white/10 opacity-55 hover:opacity-90"
            }`}
          >
            <Image src={src} alt="" fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>

      <div
        className="scanlines relative flex-1 overflow-hidden rounded-2xl border border-white/10 bg-panel"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setZoom({
            x: ((e.clientX - r.left) / r.width) * 100,
            y: ((e.clientY - r.top) / r.height) * 100,
          });
        }}
        onMouseLeave={() => setZoom(null)}
      >
        <div className="relative aspect-square">
          <Image
            key={list[active]}
            src={list[active]}
            alt={name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 46vw"
            className="animate-fade object-cover transition-transform duration-500"
            style={
              zoom
                ? { transform: "scale(1.65)", transformOrigin: `${zoom.x}% ${zoom.y}%` }
                : undefined
            }
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/35 via-transparent to-transparent" />
        <div className="pointer-events-none absolute bottom-3 right-3 rounded-full border border-white/10 bg-void/70 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-ash backdrop-blur">
          {active + 1} / {list.length} · hover to zoom
        </div>
      </div>
    </div>
  );
}
