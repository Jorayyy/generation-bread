import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-[70vh] bg-cream-50 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <span className="font-display text-[22vw] text-ink-100 select-none">
          404
        </span>
      </div>

      <div className="relative z-10 text-center px-6 py-24">
        <p className="font-display text-6xl lg:text-8xl text-ink-200 mb-4">
          404
        </p>
        <h1 className="font-display text-3xl lg:text-4xl text-ink-950 mb-4">
          Page not found
        </h1>
        <p className="text-ink-500 mb-9 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn btn-primary">
            Back to home
          </Link>
          <Link href="/products" className="btn btn-secondary">
            Shop products
          </Link>
        </div>
      </div>
    </section>
  );
}
