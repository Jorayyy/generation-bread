import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import SafeImg from "@/components/SafeImg";
import { getBusiness, getCategories, getProducts, getReviews, productImage } from "@/lib/store";
import { messengerUrl } from "@/lib/messenger";
import { formatPeso } from "@/lib/format";

export const dynamic = "force-dynamic";

const craftSteps = [
  {
    n: "01",
    title: "Baked fresh daily",
    body: "Everything comes out of the oven the same day you buy it — no day-old shelves, no overnight storage.",
  },
  {
    n: "02",
    title: "Slow fermentation",
    body: "Our croissants and sourdough rest for up to three days, developing flavor you can taste in every layer.",
  },
  {
    n: "03",
    title: "Quality ingredients",
    body: "Real butter, local ube, and carefully sourced flour. We don't cut corners on what goes in.",
  },
  {
    n: "04",
    title: "Warm hospitality",
    body: "A neighborhood café on P. Gomez Street where you're greeted by name and leave with something warm.",
  },
];

export default async function Home() {
  const [business, products, categories, reviewsList] = await Promise.all([
    getBusiness(),
    getProducts(),
    getCategories(),
    getReviews(),
  ]);
  const reviews = reviewsList.slice(0, 6);

  const featured = products.filter((p) => p.featured);
  const signature = featured.slice(0, 5);
  const newArrivals = products.filter((p) => p.isNew).slice(0, 4);
  const startingPrice = products.length
    ? Math.min(...products.map((p) => p.price))
    : null;

  const messenger = messengerUrl(
    business.social.messenger,
    "Hi Generation Bread! I'd like to place an order."
  );

  return (
    <>
      {/* —— Hero —— */}
      <section className="relative overflow-hidden bg-cream-50">
        <div className="container-site pt-14 pb-16 lg:pt-20 lg:pb-24">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-end">
            <div className="lg:col-span-6 xl:col-span-5">
              <Reveal>
                <div className="inline-flex items-center gap-2.5 bg-white border border-ink-200 rounded-full px-4 py-1.5 text-[13px] text-ink-600 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" aria-hidden="true" />
                  Est. {business.founded} · {business.location.city}
                </div>
              </Reveal>

              <Reveal delay={80}>
                <h1 className="font-display text-[clamp(2.75rem,7vw,4.5rem)] leading-[1.05] text-ink-950 mt-6">
                  Fresh bread &amp; pastry,{" "}
                  <span className="text-brand-700 italic">baked daily</span> in Tacloban.
                </h1>
              </Reveal>

              <Reveal delay={160}>
                <p className="text-ink-600 text-lg leading-relaxed mt-5 max-w-md">
                  A neighborhood bakery café serving warm pandesal, buttery croissants,
                  and cakes made from scratch. Home of the Ube Cheese Pandesal.
                </p>
              </Reveal>

              <Reveal delay={240}>
                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                  <Link href="/products" className="btn btn-primary">
                    Shop the menu
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                  <a href={messenger} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                    Order via Messenger
                  </a>
                </div>
              </Reveal>

              <Reveal delay={320}>
                <dl className="flex flex-wrap items-end gap-8 pt-8 mt-8 border-t border-ink-200/70">
                  <div>
                    <dt className="sr-only">Followers</dt>
                    <dd className="font-display text-2xl text-ink-950">{business.stats.followers}</dd>
                    <p className="text-[13px] text-ink-400 mt-0.5">Followers</p>
                  </div>
                  <div>
                    <dt className="sr-only">Rating</dt>
                    <dd className="font-display text-2xl text-ink-950">{business.stats.rating} ★</dd>
                    <p className="text-[13px] text-ink-400 mt-0.5">Google rating</p>
                  </div>
                  {startingPrice !== null && (
                    <div>
                      <dt className="sr-only">Starting price</dt>
                      <dd className="font-display text-2xl text-ink-950">{formatPeso(startingPrice)}+</dd>
                      <p className="text-[13px] text-ink-400 mt-0.5">Starting price</p>
                    </div>
                  )}
                </dl>
              </Reveal>
            </div>

            <Reveal delay={150} className="lg:col-span-6 xl:col-span-7">
              <div className="relative aspect-[4/3] lg:aspect-[16/11] rounded-3xl overflow-hidden bg-cream-200 shadow-xl shadow-ink-900/5">
                {signature[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={productImage(signature[0])}
                    alt={signature[0].name}
                    className="w-full h-full object-cover"
                    fetchPriority="high"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/40 via-transparent to-transparent" aria-hidden="true" />
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-5 py-3.5 shadow-lg">
                    <p className="text-[13px] text-ink-500">From the oven today</p>
                    <p className="font-display text-lg text-ink-950 leading-tight mt-0.5">
                      {signature[0]?.name}
                    </p>
                  </div>
                  <span className="badge bg-brand-700 text-white hidden sm:inline-flex">
                    {business.contact.hours}
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* —— Trust strip (replaces marquee) —— */}
      <div className="border-y border-ink-100 bg-white">
        <div className="container-site py-4 flex flex-wrap items-center justify-center sm:justify-between gap-x-8 gap-y-2 text-[13px] text-ink-500">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500" aria-hidden="true" />
            Baked fresh every morning
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500" aria-hidden="true" />
            Pickup &amp; delivery in Tacloban
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500" aria-hidden="true" />
            GCash · Maya · COD
          </span>
          <span className="hidden sm:flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500" aria-hidden="true" />
            {business.contact.hours}
          </span>
        </div>
      </div>

      {/* —— Signature products (editorial) —— */}
      {signature.length > 0 && (
        <section className="section bg-cream-50">
          <div className="container-site">
            <Reveal>
              <div className="flex items-end justify-between mb-10">
                <div>
                  <span className="eyebrow mb-3">Signature bakes</span>
                  <h2 className="font-display text-3xl lg:text-4xl text-ink-950">
                    What we&apos;re known for
                  </h2>
                </div>
                <Link
                  href="/products"
                  className="hidden sm:inline-flex btn btn-ghost text-sm"
                >
                  Full menu
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </Reveal>

            {/* Large feature + stacked small */}
            <div className="grid lg:grid-cols-12 gap-6">
              {signature[0] && (
                <Reveal className="lg:col-span-7">
                  <Link
                    href={`/products/${signature[0].slug}`}
                    className="group block relative aspect-[4/3] lg:aspect-[16/10] rounded-3xl overflow-hidden bg-cream-200"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={productImage(signature[0])}
                      alt={signature[0].name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-ink-950/10 to-transparent" aria-hidden="true" />
                    <div className="absolute bottom-6 left-6 right-6">
                      {signature[0].badge && (
                        <span className="badge bg-white/95 text-brand-700 mb-3">{signature[0].badge}</span>
                      )}
                      <h3 className="font-display text-2xl lg:text-3xl text-white leading-tight">
                        {signature[0].name}
                      </h3>
                      <p className="text-white/80 text-sm mt-1.5">
                        {formatPeso(signature[0].price)} · {signature[0].category}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              )}

              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                {signature.slice(1, 4).map((product, i) => (
                  <Reveal key={product.id} delay={80 + i * 70}>
                    <Link
                      href={`/products/${product.slug}`}
                      className="group flex items-center gap-4 bg-white border border-ink-100 rounded-2xl p-4 hover:border-brand-300 transition-colors h-full"
                    >
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-cream-100 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={productImage(product)}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        {product.badge && (
                          <span className="text-[11px] font-semibold text-brand-700">{product.badge}</span>
                        )}
                        <h3 className="font-display text-base text-ink-950 truncate leading-snug">
                          {product.name}
                        </h3>
                        <p className="text-sm text-ink-500 mt-0.5">{formatPeso(product.price)}</p>
                      </div>
                      <svg className="w-4 h-4 text-ink-300 group-hover:text-brand-600 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Remaining featured as row */}
            {signature.length > 4 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-8 mt-8">
                {signature.slice(4, 8).map((product, i) => (
                  <Reveal key={product.id} delay={i * 70}>
                    <ProductCard product={product} />
                  </Reveal>
                ))}
              </div>
            )}

            <div className="sm:hidden mt-8 text-center">
              <Link href="/products" className="btn btn-primary w-full">
                View all products
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* —— New arrivals —— */}
      {newArrivals.length > 0 && (
        <section className="section bg-white border-y border-ink-100">
          <div className="container-site">
            <Reveal>
              <div className="flex items-end justify-between mb-10">
                <div>
                  <span className="eyebrow mb-3">Just in</span>
                  <h2 className="font-display text-3xl lg:text-4xl text-ink-950">
                    New arrivals
                  </h2>
                </div>
                <Link href="/products?sort=newest" className="btn btn-ghost text-sm">
                  Shop new
                </Link>
              </div>
            </Reveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-8">
              {newArrivals.map((product, i) => (
                <Reveal key={product.id} delay={i * 70}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* —— Menu by category —— */}
      {categories.length > 0 && (
        <section className="section bg-cream-50">
          <div className="container-site">
            <Reveal>
              <div className="flex items-end justify-between mb-10">
                <div>
                  <span className="eyebrow mb-3">The menu</span>
                  <h2 className="font-display text-3xl lg:text-4xl text-ink-950">
                    Browse by category
                  </h2>
                </div>
                <Link href="/products" className="hidden sm:inline-flex btn btn-ghost text-sm">
                  Full menu
                </Link>
              </div>
            </Reveal>

            <div className="grid sm:grid-cols-3 gap-6">
              {categories.map((category, i) => {
                const count = products.filter((p) => p.category === category.slug).length;
                const sample = products.filter((p) => p.category === category.slug).slice(0, 2);
                return (
                  <Reveal key={category.id} delay={i * 80}>
                    <Link
                      href={`/products?category=${category.slug}`}
                      className="group block bg-white border border-ink-100 rounded-3xl overflow-hidden h-full flex flex-col hover:shadow-lg hover:shadow-ink-900/5 hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-cream-200">
                        {category.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={category.image}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-brand-100 to-cream-200" />
                        )}
                        <span className="absolute top-3.5 left-3.5 badge bg-white/95 text-ink-700">
                          {count} item{count !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <h3 className="font-display text-xl text-ink-950">
                          {category.name}
                        </h3>
                        <p className="text-ink-500 text-sm mt-2 leading-relaxed flex-1">
                          {category.description}
                        </p>
                        {sample.length > 0 && (
                          <p className="text-[13px] text-brand-700 mt-4 border-t border-ink-100 pt-3">
                            {sample.map((p) => p.name).join(" · ")}
                          </p>
                        )}
                        <span className="text-sm font-medium text-brand-600 mt-3 group-hover:text-brand-700 transition-colors">
                          View {category.name} →
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* —— The Craft —— */}
      <section className="section bg-brand-950 text-cream-100">
        <div className="container-site">
          <Reveal>
            <div className="max-w-2xl mb-12">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-brand-300 mb-3 block">
                Our craft
              </span>
              <h2 className="font-display text-3xl lg:text-5xl text-cream-50 leading-tight">
                How we bake
              </h2>
              <p className="text-cream-300/80 mt-4 text-lg leading-relaxed">
                Four things we never compromise on — from the first mix to the moment
                it reaches your hands.
              </p>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {craftSteps.map((step, i) => (
              <Reveal key={step.n} delay={i * 90}>
                <div className="border-t border-brand-700/60 pt-6">
                  <span className="font-display text-sm text-brand-400 block mb-4">{step.n}</span>
                  <h3 className="font-display text-xl text-cream-50 mb-3">{step.title}</h3>
                  <p className="text-cream-300/70 text-sm leading-relaxed">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* —— Brand story —— */}
      <section className="section bg-white">
        <div className="container-site">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <Reveal>
              <div className="space-y-6">
                <span className="eyebrow">Our story</span>
                <h2 className="font-display text-3xl lg:text-5xl text-ink-950 leading-tight">
                  Born in Tacloban,
                  <br />
                  raised on fresh bread
                </h2>
                <p className="text-ink-600 leading-relaxed max-w-lg text-[15px]">
                  {business.description}
                </p>
                <p className="text-ink-500 italic font-display text-lg border-l-2 border-brand-300 pl-5">
                  &ldquo;{business.motto}&rdquo;
                </p>

                {business.milestones.length > 0 && (
                  <ul className="space-y-3 pt-2">
                    {business.milestones.slice(0, 3).map((m) => (
                      <li key={m.year} className="flex gap-4 text-sm">
                        <span className="font-display text-brand-600 w-14 shrink-0">{m.year}</span>
                        <span className="text-ink-600">{m.title}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <Link href="/about" className="btn btn-secondary inline-flex">
                  Read our story
                </Link>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="relative aspect-[4/3] bg-cream-100 rounded-3xl overflow-hidden flex items-center justify-center">
                <SafeImg
                  src={business.logo}
                  alt={business.name}
                  className="w-44 h-44 rounded-full object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-white via-white/85 to-transparent">
                  <p className="font-display text-2xl text-ink-950">{business.name}</p>
                  <p className="text-ink-500 text-sm mt-0.5">
                    Est. {business.founded} · {business.location.full}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* —— Reviews —— */}
      {reviews.length > 0 && (
        <section className="section bg-cream-50 border-y border-ink-100">
          <div className="container-site">
            <Reveal>
              <div className="text-center max-w-xl mx-auto mb-12">
                <span className="eyebrow mb-3">Reviews</span>
                <h2 className="font-display text-3xl lg:text-4xl text-ink-950">
                  What neighbors say
                </h2>
              </div>
            </Reveal>

            <div className="grid md:grid-cols-3 gap-6">
              {reviews.slice(0, 3).map((review, i) => (
                <Reveal key={review.id} delay={i * 80}>
                  <figure className="bg-white rounded-3xl p-7 border border-ink-100 h-full flex flex-col">
                    <div className="flex gap-1 mb-5" aria-label={`${review.rating} out of 5 stars`}>
                      {Array.from({ length: review.rating }).map((_, star) => (
                        <svg key={star} className="w-4 h-4 text-honey-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <blockquote className="text-ink-600 leading-relaxed mb-6 text-[15px] flex-1">
                      &ldquo;{review.text}&rdquo;
                    </blockquote>
                    <figcaption className="flex items-center gap-3">
                      <span className="w-10 h-10 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center font-display text-sm">
                        {review.name[0]}
                      </span>
                      <span>
                        <span className="block text-sm font-medium text-ink-900">{review.name}</span>
                        <span className="block text-ink-400 text-xs">{review.source}</span>
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* —— Social —— */}
      <section className="section bg-white">
        <div className="container-site text-center">
          <Reveal>
            <span className="eyebrow mb-3">Follow along</span>
            <h2 className="font-display text-3xl lg:text-4xl text-ink-950 mb-5">
              Join {business.stats.followers} followers
            </h2>
            <p className="text-ink-500 mb-9 max-w-xl mx-auto">
              Fresh bakes, menu drops, and behind-the-scenes from P. Gomez Street —
              straight to your feed.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href={business.social.facebook} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                Facebook
              </a>
              <a href={business.social.tiktok} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                Instagram
              </a>
              <a href={business.social.messenger} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                Messenger
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* —— Closing CTA —— */}
      <section className="section bg-cream-100 border-t border-ink-100">
        <div className="container-site text-center">
          <Reveal>
            <h2 className="font-display text-4xl lg:text-6xl text-ink-950 mb-5 leading-tight">
              Hungry yet?
            </h2>
            <p className="text-ink-600 text-lg mb-9 max-w-lg mx-auto">
              Order online for pickup or delivery, or message us on Messenger —
              we&apos;ll have it warm and ready.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/products" className="btn btn-primary !px-8 !py-4">
                Shop the menu
              </Link>
              <a href={messenger} target="_blank" rel="noopener noreferrer" className="btn btn-secondary !px-8 !py-4">
                Order via Messenger
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
