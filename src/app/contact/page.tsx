import type { Metadata } from "next";
import { getBusiness } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Visit",
  description:
    "Get in touch with Generation Bread — P. Gomez Street, Tacloban City, Leyte. Call, message on Messenger, or follow us on Facebook and Instagram.",
  alternates: { canonical: "/contact" },
};

const MAPS_SRC =
  "https://www.google.com/maps?q=P.+Gomez+Street,+Tacloban+City,+Leyte,+Philippines&output=embed";

export default async function ContactPage() {
  const business = await getBusiness();

  const cards = [
    {
      href: `tel:${business.contact.phoneRaw}`,
      label: "Phone",
      value: business.contact.phone,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      ),
    },
    {
      href: business.social.messenger,
      label: "Messenger",
      value: "Message us",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
    },
    {
      href: business.social.facebook,
      label: "Facebook",
      value: "@generationbread",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      href: business.social.tiktok,
      label: "Instagram",
      value: business.contact.tiktokHandle,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <section className="bg-cream-50 border-b border-ink-100">
        <div className="container-site pt-14 pb-10">
          <span className="eyebrow mb-3">Contact</span>
          <h1 className="font-display text-4xl lg:text-5xl text-ink-950">
            Get in touch
          </h1>
          <p className="text-ink-500 mt-4 max-w-lg">
            Have a question, custom order, or just want to say hello? We&apos;d love to hear
            from you.
          </p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-site">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card) => (
              <a
                key={card.label}
                href={card.href}
                target={card.href.startsWith("http") ? "_blank" : undefined}
                rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="p-7 bg-cream-50 border border-ink-100 rounded-2xl hover:bg-white hover:border-brand-300 hover:shadow-md transition-all group"
              >
                <div className="mb-5 text-brand-700">{card.icon}</div>
                <h2 className="text-xs font-semibold tracking-[0.1em] uppercase text-ink-400 mb-2">
                  {card.label}
                </h2>
                <p className="font-display text-lg text-ink-950 group-hover:text-brand-700 transition-colors">
                  {card.value}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-cream-50 border-y border-ink-100">
        <div className="container-site">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <span className="eyebrow">Visit us</span>
              <h2 className="font-display text-3xl text-ink-950">
                {business.location.city}
              </h2>
              <p className="text-ink-600 leading-relaxed">{business.contact.address}</p>

              <dl className="space-y-3">
                <div className="flex items-center gap-4">
                  <dt className="text-xs font-semibold tracking-[0.1em] uppercase text-ink-400 w-24">
                    Hours
                  </dt>
                  <dd className="text-sm text-ink-800">{business.contact.hours}</dd>
                </div>
                <div className="flex items-center gap-4">
                  <dt className="text-xs font-semibold tracking-[0.1em] uppercase text-ink-400 w-24">
                    Region
                  </dt>
                  <dd className="text-sm text-ink-800">{business.contact.region}</dd>
                </div>
              </dl>
            </div>

            <div className="aspect-[4/3] bg-cream-200 relative overflow-hidden rounded-3xl">
              <iframe
                src={MAPS_SRC}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Generation Bread Location - Tacloban City"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-site text-center">
          <h2 className="font-display text-3xl lg:text-4xl text-ink-950 mb-4">
            Ready to order?
          </h2>
          <p className="text-ink-500 mb-8 max-w-lg mx-auto">
            Message us on Messenger for quick response and easy ordering.
          </p>
          <a
            href={business.social.messenger}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Order now
          </a>
        </div>
      </section>
    </>
  );
}
