import type { Metadata } from "next";
import FaqList from "@/components/FaqList";
import { getBusiness, getFaqs } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about Generation Bread orders, payment, delivery, allergens, and bulk orders.",
  alternates: { canonical: "/faq" },
};

export default async function FaqPage() {
  const [faqs, business] = await Promise.all([getFaqs(), getBusiness()]);

  return (
    <>
      <section className="bg-cream-50 border-b border-ink-100">
        <div className="container-site pt-14 pb-10">
          <span className="eyebrow mb-3">Help</span>
          <h1 className="font-display text-4xl lg:text-5xl text-ink-950">
            Frequently asked questions
          </h1>
          <p className="text-ink-500 mt-4 max-w-lg">
            Got questions? We&apos;ve got answers. If you can&apos;t find what you&apos;re
            looking for, feel free to reach out.
          </p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <FaqList faqs={faqs} messenger={business.social.messenger} />
        </div>
      </section>
    </>
  );
}
