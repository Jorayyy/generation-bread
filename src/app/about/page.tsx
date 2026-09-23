import type { Metadata } from "next";
import Link from "next/link";
import { getBusiness } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story of Generation Bread — a bakery café on P. Gomez Street, Tacloban City, Leyte, Philippines, open since June 2022.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const business = await getBusiness();

  return (
    <>
      <section className="bg-cream-50 border-b border-ink-100">
        <div className="container-site pt-14 pb-10">
          <span className="eyebrow mb-3">About</span>
          <h1 className="font-display text-4xl lg:text-5xl text-ink-950">
            Our story
          </h1>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-site">
          <div className="grid lg:grid-cols-2 gap-14">
            <div className="space-y-5">
              <span className="eyebrow">The beginning</span>
              <h2 className="font-display text-3xl text-ink-950">
                {business.founded} · {business.location.city}
              </h2>
              <p className="text-ink-600 leading-relaxed">
                {business.description}
              </p>
            </div>

            <div className="space-y-5">
              <span className="eyebrow">Our purpose</span>
              <h2 className="font-display text-3xl text-ink-950">
                Bread &amp; craft
              </h2>
              <p className="text-ink-600 leading-relaxed">{business.mission}</p>
              <p className="text-ink-500 italic font-display text-lg border-l-2 border-brand-300 pl-5">
                &ldquo;{business.motto}&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-cream-50 border-y border-ink-100">
        <div className="container-site">
          <div className="text-center mb-12">
            <span className="eyebrow mb-3">Values</span>
            <h2 className="font-display text-3xl lg:text-4xl text-ink-950">
              What we stand for
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {business.values.map((value, i) => (
              <div
                key={value.title}
                className="p-7 bg-white border border-ink-100 rounded-2xl hover:shadow-md transition-shadow"
              >
                <span className="font-display text-sm text-brand-500 block mb-4">
                  0{i + 1}
                </span>
                <h3 className="font-display text-xl text-ink-950 mb-3">
                  {value.title}
                </h3>
                <p className="text-ink-500 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-site">
          <div className="text-center mb-12">
            <span className="eyebrow mb-3">Journey</span>
            <h2 className="font-display text-3xl lg:text-4xl text-ink-950">
              Milestones
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            {business.milestones.map((milestone, i) => (
              <div
                key={`${milestone.year}-${i}`}
                className="flex gap-6 pb-10 border-l border-ink-200 pl-7 relative group"
              >
                <span
                  className="absolute left-0 top-0 w-2.5 h-2.5 bg-brand-500 rounded-full -translate-x-[5.5px] group-hover:scale-150 transition-transform"
                  aria-hidden="true"
                />
                <div className="font-display text-sm text-brand-600 w-20 shrink-0 pt-0.5">
                  {milestone.year}
                </div>
                <div>
                  <h3 className="font-display text-lg text-ink-950 mb-2">
                    {milestone.title}
                  </h3>
                  <p className="text-ink-500 text-sm leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-cream-100 border-t border-ink-100">
        <div className="container-site text-center">
          <h2 className="font-display text-3xl lg:text-4xl text-ink-950 mb-4">
            Join the community
          </h2>
          <p className="text-ink-500 mb-8 max-w-lg mx-auto">
            Follow us for fresh bakes, menu specials, and café updates.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={business.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Follow on Facebook
            </a>
            <Link href="/products" className="btn btn-secondary">
              Shop now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
