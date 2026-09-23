"use client";

import Link from "next/link";
import { useContent } from "@/lib/content-context";

export default function Footer() {
  const { business } = useContent();

  return (
    <footer className="bg-brand-950 text-cream-100 pb-16 lg:pb-0">
      <div className="container-site">
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={business.logo}
                alt=""
                className="w-11 h-11 rounded-full object-cover ring-2 ring-brand-700"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  if (target.src.endsWith("/logo.svg")) return;
                  target.src = "/logo.svg";
                }}
              />
              <span className="font-display text-2xl text-cream-50 leading-none">
                Generation Bread
              </span>
            </div>
            <p className="text-cream-300/80 mb-5 max-w-sm leading-relaxed text-[15px]">
              {business.shortDescription}
            </p>
            <p className="text-brand-300 italic text-sm font-display">
              &ldquo;{business.motto}&rdquo;
            </p>
            <p className="text-cream-400/60 text-sm mt-6">
              {business.contact.address}
              <br />
              {business.contact.hours}
            </p>
          </div>

          <div className="lg:col-span-3 lg:col-start-7">
            <h3 className="text-xs font-semibold tracking-[0.15em] uppercase mb-5 text-brand-300">
              Explore
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/products", label: "Shop" },
                { href: "/collections", label: "Menu" },
                { href: "/about", label: "Our Story" },
                { href: "/faq", label: "FAQ" },
                { href: "/contact", label: "Visit Us" },
                { href: "/admin", label: "Admin" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream-200/70 hover:text-cream-50 text-[15px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold tracking-[0.15em] uppercase mb-5 text-brand-300">
              Connect
            </h3>
            <div className="space-y-3">
              <a
                href={business.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-cream-200/70 hover:text-cream-50 text-[15px] transition-colors"
              >
                Facebook
              </a>
              <a
                href={business.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-cream-200/70 hover:text-cream-50 text-[15px] transition-colors"
              >
                Instagram
              </a>
              <a
                href={business.social.messenger}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-cream-200/70 hover:text-cream-50 text-[15px] transition-colors"
              >
                Messenger
              </a>
              <a
                href={`tel:${business.contact.phoneRaw}`}
                className="block text-cream-200/70 hover:text-cream-50 text-[15px] transition-colors"
              >
                {business.contact.phone}
              </a>
              <a
                href={`mailto:${business.contact.email}`}
                className="block text-cream-200/70 hover:text-cream-50 text-[15px] transition-colors"
              >
                {business.contact.email}
              </a>
            </div>
          </div>
        </div>

        <div className="py-7 border-t border-brand-800/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-cream-400/50 text-sm">
            &copy; {new Date().getFullYear()} Generation Bread. All rights reserved.
          </p>
          <p className="text-cream-400/50 text-sm">
            Baked with care in Tacloban City
          </p>
        </div>
      </div>
    </footer>
  );
}
