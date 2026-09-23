"use client";

import { useState } from "react";
import Link from "next/link";
import type { Faq } from "@/lib/types";
import { messengerUrl } from "@/lib/messenger";

export default function FaqList({
  faqs,
  messenger,
}: {
  faqs: Faq[];
  messenger: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <>
      <div className="divide-y divide-ink-100 border-y border-ink-100">
        {faqs.map((faq, i) => (
          <div key={faq.id}>
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between gap-4 py-5 text-left group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
              aria-expanded={openIndex === i}
            >
              <span className="font-display text-lg text-ink-950 group-hover:text-brand-700 transition-colors">
                {faq.question}
              </span>
              <span
                className={`w-8 h-8 shrink-0 rounded-full border border-ink-200 text-ink-500 flex items-center justify-center transition-all group-hover:border-brand-400 ${
                  openIndex === i ? "rotate-45 bg-brand-600 border-brand-600 text-white" : ""
                }`}
                aria-hidden="true"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12M6 12h12" />
                </svg>
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === i ? "max-h-96 pb-6" : "max-h-0"
              }`}
            >
              <p className="text-ink-500 leading-relaxed text-sm pr-12">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <span className="eyebrow mb-3">Still stuck?</span>
        <h2 className="font-display text-2xl lg:text-3xl text-ink-950 mb-4">
          Message us
        </h2>
        <p className="text-ink-500 mb-7 max-w-lg mx-auto text-sm">
          Can&apos;t find the answer you&apos;re looking for? Message us on Messenger and
          we&apos;ll get back to you as soon as possible.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={messengerUrl(messenger, "Hi Generation Bread! I have a question.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Message us
          </a>
          <Link href="/contact" className="btn btn-secondary">
            Contact page
          </Link>
        </div>
      </div>
    </>
  );
}
