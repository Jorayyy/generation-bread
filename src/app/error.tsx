"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] bg-cream-50 flex items-center justify-center px-6 py-24">
      <div className="text-center max-w-md">
        <p className="font-display text-7xl text-ink-200 mb-4">500</p>
        <h1 className="font-display text-3xl text-ink-950 mb-3">
          Something went wrong
        </h1>
        <p className="text-ink-500 text-sm mb-9">
          An unexpected error occurred. Please try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button type="button" onClick={reset} className="btn btn-primary">
            Try again
          </button>
          <Link href="/" className="btn btn-secondary">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
