"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DOC_LINKS } from "@/lib/docs/navigation";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { cn } from "@/lib/utils/cn";

export function DocsShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="lantern-marketing flex min-h-dvh flex-col bg-[var(--bg-app)]">
      <MarketingNav />
      <div className="mx-auto flex w-full max-w-6xl flex-1 gap-10 px-4 py-10 lg:px-6">
        <aside className="hidden w-56 shrink-0 lg:block">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--fg-subtle)]">
            Documentation
          </p>
          <nav className="flex flex-col gap-0.5" aria-label="Documentation sections">
            {DOC_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                    : "text-[var(--fg-muted)] hover:bg-[var(--bg-muted)] hover:text-[var(--fg)]"
                )}
              >
                {link.title}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="docs-prose min-w-0 flex-1">{children}</main>
      </div>
      <MarketingFooter />
    </div>
  );
}
