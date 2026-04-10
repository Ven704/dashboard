"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Overview" },
  { href: "/analytics", label: "Analytics" },
  { href: "/trades", label: "Trades" },
  { href: "/reviews", label: "Reviews" },
  { href: "/patterns", label: "Patterns" },
  { href: "/signals", label: "Signals" },
  { href: "/strategy", label: "Strategy" },
  { href: "/wallets", label: "Wallets" },
] as const;

const DashboardNav = () => {
  const pathname = usePathname();

  return (
    <aside className="border-b border-[var(--border)] bg-zinc-950/80 md:w-52 md:shrink-0 md:border-b-0 md:border-r">
      <div className="px-4 py-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Bot dashboard
        </p>
        <p className="mt-1 font-mono text-sm text-[var(--foreground)]">
          Ven704
        </p>
      </div>
      <nav
        className="flex flex-wrap gap-1 px-2 pb-4 md:flex-col md:px-3"
        aria-label="Main"
      >
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-emerald-500/15 font-medium text-emerald-400"
                  : "text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default DashboardNav;
