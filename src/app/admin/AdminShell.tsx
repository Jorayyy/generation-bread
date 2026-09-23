"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/logo", label: "Logo" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="bg-white border-b border-ink-100 sticky top-0 z-50">
        <div className="container-site">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2.5">
                <span className="w-8 h-8 bg-brand-700 rounded-lg flex items-center justify-center font-display text-sm text-white">
                  GB
                </span>
                <span className="font-display text-base text-ink-950 hidden sm:block">
                  Generation Bread
                </span>
              </Link>
              <span className="text-ink-200" aria-hidden="true">|</span>
              <span className="text-sm text-ink-400">Admin</span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/"
                target="_blank"
                className="text-ink-500 hover:text-brand-700 text-sm transition-colors"
              >
                View site
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-secondary !py-2 !px-4 text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white border-b border-ink-100">
        <div className="container-site">
          <nav className="flex items-center gap-1 py-3 overflow-x-auto scrollbar-hide" aria-label="Admin">
            {links.map((link) => {
              const active =
                link.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 text-sm font-medium whitespace-nowrap rounded-full transition-colors ${
                    active
                      ? "bg-brand-700 text-white"
                      : "text-ink-500 hover:text-brand-700 hover:bg-ink-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <main className="container-site py-10">{children}</main>
    </div>
  );
}
