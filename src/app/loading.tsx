import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loading",
  robots: { index: false, follow: false },
};

export default function Loading() {
  return (
    <div className="min-h-[60vh] bg-cream-50 flex flex-col items-center justify-center gap-4">
      <div className="w-8 h-8 border-2 border-ink-200 border-t-brand-700 rounded-full animate-spin" />
      <p className="font-display text-sm text-ink-400">Loading…</p>
    </div>
  );
}
