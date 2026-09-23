"use client";

import { useEffect, useState } from "react";
import { useContent } from "@/lib/content-context";

function isOpenNow(now: Date) {
  const hour = now.getHours() + now.getMinutes() / 60;
  return hour >= 7 && hour < 23;
}

export default function HoursBanner() {
  const { business } = useContent();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const tick = () => setOpen(isOpenNow(new Date()));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-brand-900 text-cream-100 text-[11px] tracking-[0.12em] uppercase">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 h-9 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`w-1.5 h-1.5 rounded-full shrink-0 ${open ? "bg-emerald-400" : "bg-amber-400"}`}
            aria-hidden="true"
          />
          <span className="truncate">
            {open ? "Open Now — Fresh Bakes All Day" : "Closed Now — Opens 7:00 AM"}
          </span>
        </div>
        <span className="hidden sm:inline text-cream-300 shrink-0">
          {business.contact.hours}
        </span>
      </div>
    </div>
  );
}
