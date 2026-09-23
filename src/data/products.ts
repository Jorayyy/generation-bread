import type { Product } from "@/lib/types";

const SEEDED_AT = "2025-09-15T00:00:00.000Z";

const u = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=85`;

const breadImg = {
  pandesal: u("photo-1509440159596-0249088772ff"),
  loaf: u("photo-1549931319-a545dcf3bc73"),
  rolls: u("photo-1586444248902-2f64eddc13df"),
  sourdough: u("photo-1585478259715-876acc5be8eb"),
  coco: u("photo-1555507036-ab1f4038808a"),
  ube: u("photo-1558961363-fa8fdf82db35"),
};

const pastryImg = {
  croissant: u("photo-1555507036-ab1f4038808a"),
  painChoc: u("photo-1623334044303-241021148842"),
  eggtart: u("photo-1519915028121-7d3463d20b13"),
  crookie: u("photo-1499636136210-6f4ee915583e"),
  danish: u("photo-1509365465985-25d11c17e812"),
  cinnamon: u("photo-1509365390695-33aee754301f"),
};

const cakeImg = {
  cheesecake: u("photo-1533134242443-d4fd215305ad"),
  chocolate: u("photo-1578985545062-69928b1d9587"),
  mango: u("photo-1565958011703-44f9829ba187"),
  rocher: u("photo-1571115177098-24ec42ed204d"),
  slice: u("photo-1464349095431-e9a21285b5f3"),
};

type Seed = {
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number | null;
  description: string;
  features: string[];
  category: "breads" | "pastries" | "cakes";
  images: string[];
  featured?: boolean;
  isNew?: boolean;
  badge?: string | null;
  id?: string;
  createdAt?: string;
};

const addDays = (days: number) =>
  new Date(new Date("2025-09-15T00:00:00.000Z").getTime() + days * 86400000).toISOString();

const seeds: Seed[] = [
  {
    id: "prod_ube-cheese-pandesal",
    slug: "ube-cheese-pandesal",
    name: "Ube Cheese Pandesal",
    price: 75,
    compareAtPrice: null,
    description:
      "Our signature pandesal — soft, pillowy bread filled with real ube and cheese. The bake that put Generation Bread on the map.",
    features: [
      "Filled with real ube and cheese",
      "Soft, fresh-baked daily",
      "Best seller in Tacloban",
      "Great as pasalubong",
    ],
    category: "breads",
    images: [breadImg.ube, breadImg.pandesal],
    badge: "Best Seller",
    featured: true,
    createdAt: SEEDED_AT,
  },
  {
    id: "prod_classic-pandesal",
    slug: "classic-pandesal",
    name: "Classic Pandesal",
    price: 25,
    compareAtPrice: null,
    description:
      "The everyday Filipino breakfast staple — golden crust, soft crumb, straight from the oven every morning.",
    features: ["Baked fresh daily", "Classic recipe", "Perfect with coffee", "Bulk packs available"],
    category: "breads",
    images: [breadImg.pandesal],
    badge: "Daily Fresh",
    featured: true,
    createdAt: SEEDED_AT,
  },
  {
    id: "prod_three-day-croissant",
    slug: "three-day-croissant",
    name: "Three-Day Fermented Croissant",
    price: 145,
    compareAtPrice: null,
    description:
      "Buttery, shatteringly flaky croissant made with dough fermented for three days. Light layers, deep flavor.",
    features: [
      "Three-day fermented dough",
      "100% butter layers",
      "Shatteringly flaky",
      "Baked in small batches",
    ],
    category: "pastries",
    images: [pastryImg.croissant],
    badge: "Signature",
    featured: true,
    createdAt: SEEDED_AT,
  },
  {
    id: "prod_pain-au-chocolat",
    slug: "pain-au-chocolat",
    name: "Pain au Chocolat",
    price: 155,
    compareAtPrice: null,
    description:
      "Classic French chocolate croissant with batons of chocolate wrapped in our signature laminated dough.",
    features: ["Real chocolate batons", "Three-day fermented dough", "Buttery layers", "Baked daily"],
    category: "pastries",
    images: [pastryImg.painChoc],
    createdAt: SEEDED_AT,
  },
  {
    id: "prod_pistachio-pain-au-chocolat",
    slug: "pistachio-pain-au-chocolat",
    name: "Pistachio Pain au Chocolat",
    price: 185,
    compareAtPrice: null,
    description:
      "Our pain au choco taken up a notch with a rich pistachio cream. A nutty, chocolatey crowd favorite.",
    features: ["Pistachio cream filling", "Chocolate batons", "Flaky croissant dough", "Limited daily batches"],
    category: "pastries",
    images: [pastryImg.painChoc, pastryImg.croissant],
    badge: "Popular",
    featured: true,
    createdAt: SEEDED_AT,
  },
  {
    id: "prod_egg-tart",
    slug: "egg-tart",
    name: "Egg Tart",
    price: 65,
    compareAtPrice: null,
    description:
      "Silky custard in a crisp, buttery shell — one of our most-praised pastries, perfect with a Spanish latte.",
    features: ["Silky custard center", "Crispy butter shell", "Baked daily", "Great with coffee"],
    category: "pastries",
    images: [pastryImg.eggtart],
    badge: "Popular",
    createdAt: SEEDED_AT,
  },
  {
    id: "prod_crookie",
    slug: "crookie",
    name: "Crookie",
    price: 165,
    compareAtPrice: null,
    description:
      "Cookie meets croissant — a gooey chocolate chip cookie baked on top of flaky croissant layers. Pure indulgence.",
    features: ["Cookie + croissant hybrid", "Gooey chocolate chips", "Flaky layers", "Small-batch baked"],
    category: "pastries",
    images: [pastryImg.crookie, pastryImg.croissant],
    badge: "Trending",
    isNew: true,
    createdAt: SEEDED_AT,
  },
  {
    id: "prod_pande-coco",
    slug: "pande-coco",
    name: "Pande Coco",
    price: 45,
    compareAtPrice: null,
    description:
      "Soft coconut-filled bun with a tender crumb — a Filipino bakery classic done right.",
    features: ["Sweet coconut filling", "Soft bread", "Baked daily", "Pasalubong favorite"],
    category: "breads",
    images: [breadImg.coco, breadImg.rolls],
    createdAt: SEEDED_AT,
  },
  {
    id: "prod_cheese-rolls",
    slug: "cheese-rolls",
    name: "Cheese Rolls",
    price: 60,
    compareAtPrice: null,
    description:
      "Soft, buttery rolls topped with melted cheese. Warm, comforting, and dangerously easy to finish.",
    features: ["Melted cheese topping", "Soft and buttery", "Baked fresh", "Shareable pack"],
    category: "breads",
    images: [breadImg.rolls],
    badge: "Best Seller",
    createdAt: SEEDED_AT,
  },
  {
    id: "prod_butter-croissant",
    slug: "butter-croissant",
    name: "Butter Croissant",
    price: 125,
    compareAtPrice: null,
    description:
      "Pure butter, pure flake. Our everyday croissant for coffee dips and breakfast runs.",
    features: ["100% butter", "Flaky layers", "Baked daily", "Pairs with any latte"],
    category: "pastries",
    images: [pastryImg.croissant],
    createdAt: SEEDED_AT,
  },
  {
    id: "prod_cinnamon-roll",
    slug: "cinnamon-roll",
    name: "Cinnamon Roll",
    price: 95,
    compareAtPrice: null,
    description:
      "Swirled with cinnamon sugar and finished with a sweet glaze — best enjoyed warm.",
    features: ["Cinnamon sugar swirl", "Sweet glaze", "Best served warm", "Baked daily"],
    category: "pastries",
    images: [pastryImg.cinnamon],
    createdAt: SEEDED_AT,
  },
  {
    id: "prod_sourdough-loaf",
    slug: "sourdough-loaf",
    name: "Sourdough Loaf",
    price: 280,
    compareAtPrice: null,
    description:
      "Naturally leavened loaf with a crackly crust and open crumb. Perfect for toast and sandwiches.",
    features: ["Naturally leavened", "Crackly crust", "Open crumb", "Whole loaf"],
    category: "breads",
    images: [breadImg.sourdough],
    badge: "Artisan",
    featured: true,
    createdAt: SEEDED_AT,
  },
  {
    id: "prod_new-york-cheesecake",
    slug: "new-york-cheesecake",
    name: "New York Cheesecake",
    price: 185,
    compareAtPrice: null,
    description:
      "Dense, creamy, and classic — our New York-style cheesecake is a café favorite by the slice.",
    features: ["Rich and creamy", "Classic NY style", "By the slice", "Available whole on request"],
    category: "cakes",
    images: [cakeImg.cheesecake],
    badge: "Best Seller",
    featured: true,
    createdAt: SEEDED_AT,
  },
  {
    id: "prod_triple-chocolate-mousse",
    slug: "triple-chocolate-mousse",
    name: "Triple Chocolate Mousse Cake",
    price: 195,
    compareAtPrice: null,
    description:
      "Three layers of chocolate mousse on a cocoa base — for when one kind of chocolate isn't enough.",
    features: ["Three chocolate layers", "Light mousse texture", "Cocoa base", "By the slice"],
    category: "cakes",
    images: [cakeImg.chocolate],
    createdAt: SEEDED_AT,
  },
  {
    id: "prod_mango-float-cake",
    slug: "mango-float-cake",
    name: "Mango Float Cake",
    price: 175,
    compareAtPrice: null,
    description:
      "Layers of cream, graham, and ripe mango — a no-bake classic turned celebration cake.",
    features: ["Ripe mango layers", "Creamy filling", "Graham crust", "Celebration-ready"],
    category: "cakes",
    images: [cakeImg.mango],
    createdAt: SEEDED_AT,
  },
  {
    id: "prod_rocher-cake",
    slug: "rocher-cake",
    name: "Rocher Cake",
    price: 210,
    compareAtPrice: null,
    description:
      "Hazelnut chocolate rocher cake with a glossy ganache finish — indulgent from first slice to last.",
    features: ["Hazelnut chocolate", "Glossy ganache", "Premium ingredients", "Whole cakes available"],
    category: "cakes",
    images: [cakeImg.rocher, cakeImg.chocolate],
    badge: "Premium",
    createdAt: SEEDED_AT,
  },
  {
    id: "prod_ube-loaf",
    slug: "ube-loaf",
    name: "Ube Loaf",
    price: 160,
    compareAtPrice: null,
    description:
      "A purple-hued soft loaf swirled with ube. Beautiful sliced, even better toasted with butter.",
    features: ["Real ube swirl", "Soft sandwich loaf", "Baked daily", "Great toasted"],
    category: "breads",
    images: [breadImg.ube],
    isNew: true,
    badge: "New",
    createdAt: SEEDED_AT,
  },
];

export const products: Product[] = seeds.map((seed, index) => ({
  id: seed.id ?? `prod_${seed.slug}`,
  slug: seed.slug,
  name: seed.name,
  price: seed.price,
  compareAtPrice: seed.compareAtPrice ?? null,
  description: seed.description,
  features: seed.features,
  category: seed.category,
  images: seed.images,
  sku: null,
  status: "active",
  featured: seed.featured ?? false,
  isNew: seed.isNew ?? false,
  badge: seed.badge ?? null,
  stock: null,
  lowStockAt: 5,
  variants: [],
  createdAt: seed.createdAt ?? addDays(index),
  updatedAt: seed.createdAt ?? addDays(index),
}));
