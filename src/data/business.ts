import type { Business, Category, Faq, Review } from "@/lib/types";

export { products } from "@/data/products";

const SEEDED_AT = "2025-09-15T00:00:00.000Z";

export const business: Business = {
  name: "Generation Bread",
  tagline: "Baked Daily in Tacloban City",
  description:
    "Generation Bread is a bakery café on P. Gomez Street in Tacloban City, Philippines — a subsidiary of Ironwood Hotel. Home of the Ube Cheese Pandesal, three-day fermented croissants, and a full café menu, baked fresh every day.",
  shortDescription:
    "Bakery café in Tacloban City serving fresh breads, pastries, and cakes daily. Home of the Ube Cheese Pandesal.",
  motto: "FRESH FROM THE OVEN, EVERY DAY",
  mission:
    "To bake bread and pastries worth waking up for — crafted with time-honored techniques, quality ingredients, and a love for Tacloban's food scene.",
  founded: "June 2022",
  logo: "/logo.svg",
  location: {
    city: "Tacloban City",
    province: "Leyte",
    country: "Philippines",
    full: "P. Gomez Street, Tacloban City, Leyte, Philippines",
  },
  contact: {
    phone: "+63 917 102 1233",
    phoneRaw: "639171021233",
    email: "generationbread@gmail.com",
    messenger: "https://m.me/generationbread",
    facebook: "https://www.facebook.com/generationbread/",
    tiktok: "https://www.instagram.com/generationbread/",
    tiktokHandle: "@generationbread",
    address: "P. Gomez Street, Tacloban City, Leyte 6500, Philippines",
    hours: "Daily 7:00 AM – 11:00 PM",
    region: "Eastern Visayas",
  },
  hours: {
    status: "Open Daily 7:00 AM – 11:00 PM",
    description:
      "Walk in for fresh bakes all day, or order online for pickup and delivery in Tacloban City.",
  },
  owner: {
    name: "Generation Bread",
    title: "A subsidiary of Ironwood Hotel",
  },
  stats: {
    followers: "14K+",
    rating: "4.5",
    reviewCount: 106,
    yearsInBusiness: "4+",
  },
  social: {
    facebook: "https://www.facebook.com/generationbread/",
    tiktok: "https://www.instagram.com/generationbread/",
    messenger: "https://m.me/generationbread",
  },
  values: [
    {
      title: "Baked Daily",
      description: "Breads and pastries fresh from the oven every single day.",
    },
    {
      title: "Quality Craft",
      description:
        "Time-honored techniques — like our three-day fermented croissant dough — in every bite.",
    },
    {
      title: "Local Pride",
      description: "A Tacloban-born bakery café with Manila-standard quality.",
    },
    {
      title: "Hospitality",
      description: "Warm service, cozy space, and servings that never skimp.",
    },
  ],
  milestones: [
    {
      year: "Jun 2022",
      title: "Opened",
      description:
        "Generation Bread began baking on P. Gomez Street, downtown Tacloban City.",
    },
    {
      year: "2023",
      title: "Ube Cheese Pandesal",
      description:
        "Our ube cheese pandesal became a Tacloban favorite — soft, filled with real ube and cheese.",
    },
    {
      year: "2025",
      title: "Bakery & Café",
      description:
        "Grown into a full bakery café under Ironwood Hotel — breads, cakes, coffee, and comfort food.",
    },
  ],
};

export const categories: Category[] = [
  {
    id: "cat_breads",
    slug: "breads",
    name: "Breads",
    description: "Daily loaves, pandesal, and soft rolls baked fresh every morning.",
    image: null,
    order: 1,
    status: "active",
  },
  {
    id: "cat_pastries",
    slug: "pastries",
    name: "Pastries",
    description: "Croissants, danishes, tarts, and flaky favorites — including our three-day fermented croissants.",
    image: null,
    order: 2,
    status: "active",
  },
  {
    id: "cat_cakes",
    slug: "cakes",
    name: "Cakes",
    description: "Whole cakes and slices for celebrations, cravings, and everything in between.",
    image: null,
    order: 3,
    status: "active",
  },
];

export const reviews: Review[] = [
  {
    id: "rev_1",
    name: "Local Foodie",
    text: "The Ube Cheese Pandesal is the real deal — soft bread with real ube and cheese. Best in Tacloban!",
    rating: 5,
    source: "Google Review",
    status: "published",
    createdAt: SEEDED_AT,
  },
  {
    id: "rev_2",
    name: "Café Regular",
    text: "Three-day fermented croissants are worth every wait. Cozy spot, great coffee, massive servings.",
    rating: 5,
    source: "Google Review",
    status: "published",
    createdAt: SEEDED_AT,
  },
  {
    id: "rev_3",
    name: "Happy Customer",
    text: "Manila-quality pastries right here in Tacloban. Egg tarts and Spanish latte are my go-to combo!",
    rating: 5,
    source: "Tripadvisor",
    status: "published",
    createdAt: SEEDED_AT,
  },
];

export const faqs: Faq[] = [
  {
    id: "faq_1",
    question: "How can I order from Generation Bread?",
    order: 1,
    answer:
      "Browse our menu here on the website and check out online, or message us on Facebook Messenger. For pickup, order ahead so your bakes are ready when you arrive.",
  },
  {
    id: "faq_2",
    question: "What are your payment methods?",
    order: 2,
    answer:
      "We accept GCash, Maya (PayMaya), bank transfers, and cash on delivery (COD) for select areas. Payment details are provided upon order confirmation.",
  },
  {
    id: "faq_3",
    question: "Do you offer delivery?",
    order: 3,
    answer:
      "Yes! We deliver within Tacloban City. Delivery fees vary by location and are confirmed when we process your order. Pickup from our P. Gomez Street store is also available anytime during opening hours.",
  },
  {
    id: "faq_4",
    question: "What are your operating hours?",
    order: 4,
    answer:
      "We're open daily from 7:00 AM to 11:00 PM. Fresh bakes come out all day — and breads go on sale after 10 PM!",
  },
  {
    id: "faq_5",
    question: "Are your breads baked fresh daily?",
    order: 5,
    answer:
      "Absolutely! Everything is baked fresh daily at our P. Gomez Street bakery. Our croissant dough is fermented for three days for that light, buttery layers.",
  },
  {
    id: "faq_6",
    question: "Do you have allergen information?",
    order: 6,
    answer:
      "Our baked goods may contain wheat, dairy, eggs, nuts, and other allergens. Please message us before ordering if you have food allergies or dietary concerns and we'll help you choose safely.",
  },
  {
    id: "faq_7",
    question: "Do you offer bulk or custom cake orders?",
    order: 7,
    answer:
      "Yes! We take bulk orders for events and custom cake requests. Message us on Facebook at least 2–3 days ahead and we'll create something special for you.",
  },
  {
    id: "faq_8",
    question: "Where is Generation Bread located?",
    order: 8,
    answer:
      "You'll find us on P. Gomez Street, downtown Tacloban City, Leyte — a subsidiary of Ironwood Hotel. Open daily, 7:00 AM to 11:00 PM.",
  },
];

export const services = [
  {
    title: "Daily Fresh Bakes",
    description:
      "Breads, pastries, and cakes baked fresh every day — straight from our oven to your table.",
    icon: "bread",
  },
  {
    title: "Pickup & Delivery",
    description:
      "Order online for easy store pickup, or have your favorites delivered around Tacloban City.",
    icon: "truck",
  },
  {
    title: "Custom Cakes & Bulk Orders",
    description:
      "Celebrations, events, and pasalubong runs — we bake in bulk and customize cakes on request.",
    icon: "cake",
  },
  {
    title: "Café Experience",
    description:
      "Cozy space on P. Gomez Street for coffee, brunch, and late-night pastry runs until 11 PM.",
    icon: "coffee",
  },
];
