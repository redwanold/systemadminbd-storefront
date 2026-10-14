export const px = (id: number, w = 1100, h = 1100) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`;

export const collectionSeed = [
  {
    slug: "recon-rigs",
    name: "Recon Rigs",
    tagline: "Look before you leap.",
    description:
      "Passive listening posts, port sweepers and terrain mappers. Draw the map before you ever touch the target — built for authorised lab ranges and CTF arenas.",
    image: "/images/col-recon.jpg",
    accent: "#39ff14",
    position: 1,
  },
  {
    slug: "payload-hardware",
    name: "Payload Hardware",
    tagline: "Small box. Large consequences.",
    description:
      "Drop boxes, injection keys and implant-class hardware for red team simulations. Ships locked, signed and documented so your blue team actually learns something.",
    image: "/images/col-payload.jpg",
    accent: "#c084fc",
    position: 2,
  },
  {
    slug: "wireless-warfare",
    name: "Wireless Warfare",
    tagline: "The air is a protocol too.",
    description:
      "Long-range adapters, directional antennas and sub-GHz radios. Tuned in our Dhaka lab, shipped with legal-range firmware and a licence reminder sticker.",
    image: "/images/col-wireless.jpg",
    accent: "#22d3ee",
    position: 3,
  },
  {
    slug: "noob-starter-kits",
    name: "Noob Starter Kits",
    tagline: "Day one to first shell.",
    description:
      "You watched the videos. Now get the crate. Curated bundles with a guided 30-day syllabus, a vulnerable lab image and a hotline to our support grunts.",
    image: "/images/col-starter.jpg",
    accent: "#fbbf24",
    position: 4,
  },
  {
    slug: "opsec-anonymity",
    name: "Opsec & Anonymity",
    tagline: "Leave nothing. Not even a timestamp.",
    description:
      "Faraday kit, hardened routers and tamper-evident storage. The fastest way to end a career is forgetting which interface you were on.",
    image: px(5935794),
    accent: "#f472b6",
    position: 5,
  },
];

export type ProductSeed = {
  slug: string;
  name: string;
  codename: string;
  collectionSlug: string;
  tagline: string;
  description: string;
  priceCents: number;
  compareAtCents?: number;
  difficulty: string;
  badge?: string;
  stock: number;
  featured?: boolean;
  images: string[];
  highlights: string[];
  specs: { label: string; value: string }[];
  includes: string[];
};

export const reconProducts: ProductSeed[] = [
  {
    slug: "portsniffer-mk-iv",
    name: "PortSniffer Mk IV",
    codename: "SA-PS4",
    collectionSlug: "recon-rigs",
    tagline: "A full-spectrum port sweep in a cigarette-pack chassis.",
    description:
      "The Mk IV is the rig that made our name. A quad-core scanning appliance with hardware offload for SYN sweeps, it chews through a /16 while sipping battery. The 1.9-inch OLED shows live host discovery so you can watch a subnet bloom in real time. Firmware is signed, open and auditable, because you should never run a black box you cannot read.",
    priceCents: 34900,
    compareAtCents: 42900,
    difficulty: "Operator",
    badge: "Best Seller",
    stock: 24,
    featured: true,
    images: [px(36169772), px(36169769), px(1148820), px(37694202)],
    highlights: [
      "Hardware-offloaded SYN and UDP sweeps at 1.2M pps",
      "Live host-bloom visualisation on 1.9-inch OLED",
      "14-hour field battery with hot-swap cell",
      "Signed, fully open firmware. No blobs.",
    ],
    specs: [
      { label: "CPU", value: "Quad-core ARM A55 @ 1.8GHz" },
      { label: "Memory", value: "4GB LPDDR4 / 64GB eMMC" },
      { label: "Interfaces", value: "2.5GbE, USB-C OTG, microSD" },
      { label: "Battery", value: "6200mAh hot-swap" },
      { label: "Chassis", value: "CNC 6061 aluminium, matte black" },
      { label: "Weight", value: "412g" },
    ],
    includes: ["PortSniffer Mk IV unit", "Hot-swap cells (x2)", "Braided USB-C cable", "Range licence card", "Quickstart zine"],
  },
  {
    slug: "ghostmap-terrain-scanner",
    name: "GhostMap Terrain Scanner",
    codename: "SA-GM1",
    collectionSlug: "recon-rigs",
    tagline: "Passive network cartography. Zero packets sent.",
    description:
      "GhostMap never speaks. It listens to broadcast chatter, ARP noise and mDNS gossip, then renders a living topology of everything on the wire. Perfect for engagements where the rules say do not touch.",
    priceCents: 22900,
    difficulty: "Apprentice",
    stock: 41,
    featured: true,
    images: [px(17323801), px(17489156), px(3520697)],
    highlights: [
      "One hundred percent passive. Emits nothing.",
      "Auto-generated topology graph export (SVG/JSON)",
      "Fingerprints 4,100+ device profiles",
      "Tap-mode and SPAN-mode capture",
    ],
    specs: [
      { label: "Capture", value: "Dual 1GbE passive tap" },
      { label: "Storage", value: "256GB NVMe" },
      { label: "Export", value: "PCAP, JSON, SVG topology" },
      { label: "Power", value: "USB-C PD 15W" },
      { label: "Weight", value: "290g" },
    ],
    includes: ["GhostMap unit", "Passive tap harness", "USB-C PD brick", "Printed topology cheat sheet"],
  },
  {
    slug: "oracle-db-prober",
    name: "Oracle DB Prober",
    codename: "SA-OD2",
    collectionSlug: "recon-rigs",
    tagline: "Fingerprint every database on the range in one pass.",
    description:
      "Point it at a CIDR block and the Prober identifies engine, version, TLS posture and default-credential exposure across eleven database families. Report templates are court-ready, which is a sentence we hope you never need.",
    priceCents: 18900,
    compareAtCents: 21900,
    difficulty: "Apprentice",
    stock: 63,
    images: [px(3520699), px(36169770), px(17489157)],
    highlights: [
      "11 database engines fingerprinted",
      "Default-credential exposure scoring",
      "One-click PDF and Markdown reporting",
      "Read-only by design",
    ],
    specs: [
      { label: "Form factor", value: "Pocket appliance, 96 x 62 x 18mm" },
      { label: "Interfaces", value: "1GbE, USB-C" },
      { label: "Engines", value: "PostgreSQL, MySQL, MSSQL, Mongo, Redis, +6" },
      { label: "Power", value: "5V 2A" },
    ],
    includes: ["Oracle DB Prober", "Ethernet patch cable", "Report template pack"],
  },
  {
    slug: "shadowcrawl-headless-rig",
    name: "ShadowCrawl Headless Rig",
    codename: "SA-SC9",
    collectionSlug: "recon-rigs",
    tagline: "Forty browser contexts. One silent box.",
    description:
      "A rack-free headless crawling appliance for mapping sprawling web estates. Runs forty isolated browser contexts, rotates fingerprints per context, and writes a clean site graph you can actually read at 3am.",
    priceCents: 74900,
    difficulty: "Black Hat",
    badge: "Pro",
    stock: 7,
    images: [px(17489160), px(5480781), px(37605913)],
    highlights: [
      "40 concurrent isolated browser contexts",
      "Per-context fingerprint rotation",
      "Site graph export with diffing between runs",
      "Fanless. Silent. 19W idle.",
    ],
    specs: [
      { label: "CPU", value: "8-core x86, 3.4GHz boost" },
      { label: "Memory", value: "32GB DDR5" },
      { label: "Storage", value: "1TB NVMe" },
      { label: "Network", value: "Dual 2.5GbE" },
      { label: "Cooling", value: "Passive vapour chamber" },
    ],
    includes: ["ShadowCrawl chassis", "Dual PSU", "Rack ears", "3-year firmware channel"],
  },
];
