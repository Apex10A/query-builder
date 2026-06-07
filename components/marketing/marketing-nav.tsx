"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanternLogo } from "@/components/brand/lantern-logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils/cn";

const NAV_LINKS = [
  { href: "/docs", label: "Docs" },
  { href: "/builder", label: "Builder" },
] as const;

export function MarketingNav() {
  const pathname = usePathname();

  return (
    <header className="lantern-nav sticky top-0 z-40">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 lg:px-6">
        <LanternLogo size="sm" href="/" />

        <nav
          className="ml-auto flex items-center gap-1 sm:gap-2"
          aria-label="Site navigation"
        >
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/docs"
                ? pathname.startsWith("/docs")
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                    : "text-[var(--fg-muted)] hover:bg-[var(--bg-muted)] hover:text-[var(--fg)]"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <ThemeToggle />
          <Link href="/builder" className="lantern-btn-primary ml-1 rounded-lg px-4 py-1.5 text-sm">
            Open app
          </Link>
        </nav>
      </div>
    </header>
  );
}
