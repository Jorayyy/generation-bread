"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContent } from "@/lib/content-context";
import { useCart } from "@/lib/cart-context";
import { messengerUrl } from "@/lib/messenger";
import HoursBanner from "@/components/HoursBanner";

const navLinks = [
  { href: "/products", label: "Shop" },
  { href: "/collections", label: "Menu" },
  { href: "/about", label: "Our Story" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Visit" },
];

const bottomLinks = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/products", label: "Shop", icon: "shop" },
  { href: "#search", label: "Search", icon: "search" },
  { href: "#cart", label: "Cart", icon: "cart" },
];

function NavIcon({ name }: { name: string }) {
  const common = { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" } as const;
  switch (name) {
    case "home":
      return (
        <svg className="w-5 h-5" {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z" />
        </svg>
      );
    case "shop":
      return (
        <svg className="w-5 h-5" {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 7h12l1 13H5L6 7zm3 0a3 3 0 016 0" />
        </svg>
      );
    case "search":
      return (
        <svg className="w-5 h-5" {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
        </svg>
      );
    case "cart":
      return (
        <svg className="w-5 h-5" {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 7h12l-1 13H7L6 7zm3 0a3 3 0 016 0" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { business } = useContent();
  const { count, open } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSearchOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) {
        setIsOpen(false);
        setSearchOpen(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  function submitSearch(e: FormEvent) {
    e.preventDefault();
    const q = searchValue.trim();
    router.push(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
    setSearchOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled || isOpen
            ? "bg-cream-50/95 backdrop-blur-md border-b border-ink-100 shadow-sm"
            : "bg-cream-50/80 backdrop-blur-sm border-b border-transparent"
        }`}
      >
        <HoursBanner />
        <div className="container-site">
          <div className="flex items-center justify-between h-16 lg:h-[4.5rem]">
            <Link
              href="/"
              className="flex items-center gap-3 group shrink-0"
              aria-label="Generation Bread home"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={business.logo}
                alt=""
                className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-200 group-hover:ring-brand-500 transition-all"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  if (target.src.endsWith("/logo.svg")) return;
                  target.src = "/logo.svg";
                }}
              />
              <span className="font-display text-xl text-ink-950 hidden sm:block leading-none">
                Generation Bread
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-0.5" aria-label="Primary">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 text-[15px] font-medium rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                    pathname === link.href
                      ? "text-brand-800 bg-brand-50"
                      : "text-ink-600 hover:text-brand-800 hover:bg-ink-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1 sm:gap-1.5">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSearchOpen((v) => !v)}
                  className={`p-2.5 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                    searchOpen ? "text-brand-800 bg-brand-50" : "text-ink-500 hover:text-brand-800 hover:bg-ink-50"
                  }`}
                  aria-label="Search products"
                  aria-expanded={searchOpen}
                >
                  <NavIcon name="search" />
                </button>

                <div
                  className={`absolute top-full right-0 mt-2 w-72 bg-white border border-ink-200 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ${
                    searchOpen
                      ? "max-h-24 opacity-100 translate-y-0"
                      : "max-h-0 opacity-0 -translate-y-2 border-transparent shadow-none pointer-events-none"
                  }`}
                >
                  <form onSubmit={submitSearch} className="p-3">
                    <input
                      ref={searchInputRef}
                      type="search"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder="Search breads, pastries…"
                      aria-label="Search products"
                      className="input"
                    />
                  </form>
                </div>
              </div>

              <button
                type="button"
                onClick={open}
                className="relative p-2.5 rounded-full text-ink-500 hover:text-brand-800 hover:bg-ink-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
              >
                <NavIcon name="cart" />
                {count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-brand-800 text-white text-[10px] font-semibold flex items-center justify-center rounded-full">
                    {count}
                  </span>
                )}
              </button>

              <a
                href={messengerUrl(business.social.messenger, "Hi Generation Bread! I'd like to order.")}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex btn btn-primary ml-2 !py-2.5 !px-5 text-sm"
              >
                Order online
              </a>

              <button
                type="button"
                onClick={() => setIsOpen((v) => !v)}
                className="lg:hidden p-2.5 text-ink-800 ml-1 rounded-full hover:bg-ink-50"
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
              >
                <div className="w-6 h-4 flex flex-col justify-between">
                  <span
                    className={`w-full h-[1.5px] bg-ink-800 rounded-full transition-all duration-300 ${
                      isOpen ? "rotate-45 translate-y-[5px]" : ""
                    }`}
                  />
                  <span
                    className={`w-full h-[1.5px] bg-ink-800 rounded-full transition-all duration-300 ${
                      isOpen ? "opacity-0" : ""
                    }`}
                  />
                  <span
                    className={`w-full h-[1.5px] bg-ink-800 rounded-full transition-all duration-300 ${
                      isOpen ? "-rotate-45 -translate-y-[5px]" : ""
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 bg-cream-50 transition-all duration-300 lg:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <div className="pt-32 pb-28 px-6 h-full flex flex-col">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="font-display text-3xl text-ink-950 py-3 border-b border-ink-100 hover:text-brand-700 transition-colors"
                style={{
                  transitionDelay: isOpen ? `${i * 60}ms` : "0ms",
                  transform: isOpen ? "translateY(0)" : "translateY(16px)",
                  opacity: isOpen ? 1 : 0,
                  transition: "all 0.4s ease",
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <a
            href={messengerUrl(business.social.messenger, "Hi Generation Bread! I'd like to order.")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="btn btn-primary mt-8 w-full text-base"
          >
            Order via Messenger
          </a>
        </div>
      </div>

      {/* Mobile bottom bar */}
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t border-ink-100 pb-[env(safe-area-inset-bottom)]"
        aria-label="Mobile quick links"
      >
        <div className="grid grid-cols-4">
          {bottomLinks.map((link) => {
            const isCart = link.icon === "cart";
            const isSearch = link.icon === "search";
            const content = (
              <>
                <span className="relative">
                  <NavIcon name={link.icon} />
                  {isCart && count > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 bg-brand-800 text-white text-[9px] font-semibold flex items-center justify-center rounded-full">
                      {count}
                    </span>
                  )}
                </span>
                <span className="text-[10px] font-medium text-ink-500 mt-1">
                  {link.label}
                </span>
              </>
            );

            if (isCart) {
              return (
                <button
                  key="cart"
                  type="button"
                  onClick={open}
                  className="flex flex-col items-center justify-center py-2.5 text-ink-500 hover:text-brand-800 transition-colors"
                  aria-label={`Open cart, ${count} items`}
                >
                  {content}
                </button>
              );
            }

            if (isSearch) {
              return (
                <button
                  key="search"
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="flex flex-col items-center justify-center py-2.5 text-ink-500 hover:text-brand-800 transition-colors"
                  aria-label="Search products"
                >
                  {content}
                </button>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center justify-center py-2.5 transition-colors ${
                  pathname === link.href
                    ? "text-brand-800"
                    : "text-ink-500 hover:text-brand-800"
                }`}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
