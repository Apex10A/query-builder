import Link from "next/link";
import { LanternLogo } from "@/components/brand/lantern-logo";

export function MarketingFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-card)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-6">
        <LanternLogo size="sm" href="/" />
        <nav
          className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--fg-muted)]"
          aria-label="Footer navigation"
        >
          <Link href="/docs" className="hover:text-[var(--fg)]">
            Documentation
          </Link>
          <Link href="/docs/getting-started" className="hover:text-[var(--fg)]">
            Getting started
          </Link>
          <Link href="/builder" className="hover:text-[var(--fg)]">
            Open builder
          </Link>
        </nav>
        <p className="text-xs text-[var(--fg-subtle)]">
          Built with Next.js, TypeScript, and Zustand
        </p>
      </div>
    </footer>
  );
}
