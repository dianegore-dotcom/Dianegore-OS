import Link from "next/link";
import { CalendarCheck2, Home, Menu, Plus, Search } from "lucide-react";

const items = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/today", label: "Today", icon: CalendarCheck2 },
  { href: "/capture", label: "Capture", icon: Plus, raised: true },
  { href: "/search", label: "Search", icon: Search },
  { href: "/projects", label: "More", icon: Menu },
];

export function MobileNav() {
  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--border)] bg-[var(--surface)] px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 lg:hidden"
    >
      <div className="mx-auto grid max-w-lg grid-cols-5">
        {items.map((item) => (
          <Link
            key={item.href + item.label}
            href={item.href}
            className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-semibold ${
              item.raised ? "-mt-5" : ""
            }`}
          >
            <span className={item.raised ? "flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-strong)] text-white shadow-lg" : ""}>
              <item.icon className="h-5 w-5" aria-hidden="true" />
            </span>
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
