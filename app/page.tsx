import type { Metadata } from "next";
import Link from "next/link";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

export const metadata: Metadata = {
  title: "Lantern — Illuminate your queries",
  description:
    "Build complex database filters visually. Nested AND/OR logic, live SQL preview, validation, and mock execution — no SQL required.",
};

const FEATURES = [
  {
    title: "Visual conditions",
    body: "Compose filters as field → operator → value cards. Schema-aware inputs for numbers, dates, enums, and booleans.",
  },
  {
    title: "Nested logic",
    body: "Combine conditions with AND/OR groups at unlimited depth. Drag to reorder. Same power as hand-written SQL.",
  },
  {
    title: "Live preview",
    body: "Watch SQL, MongoDB, and GraphQL output update as you build. One query tree, three export formats.",
  },
  {
    title: "Smart validation",
    body: "Catch incompatible operators, missing values, and empty groups before you run. Status dots on every card.",
  },
  {
    title: "Mock execution",
    body: "Run queries against sample users and orders data. Sort, paginate, and verify logic without a real database.",
  },
  {
    title: "Portable queries",
    body: "Export JSON, import saved queries, use presets and snapshots. Share filter logic with your team.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Add conditions",
    body: "Pick a field, operator, and value for each rule on the canvas.",
  },
  {
    step: "02",
    title: "Nest your logic",
    body: "Group rules with AND/OR and preview the generated query instantly.",
  },
  {
    step: "03",
    title: "Execute & export",
    body: "Run against mock data, then export JSON or copy SQL for production.",
  },
];

export default function LandingPage() {
  return (
    <div className="lantern-marketing flex min-h-dvh flex-col bg-[var(--bg-app)]">
      <MarketingNav />

      {/* Hero */}
      <section className="lantern-hero relative overflow-hidden border-b border-[var(--border)]">
        <div className="lantern-hero-grid pointer-events-none absolute inset-0" aria-hidden />
        <div className="lantern-hero-glow pointer-events-none absolute inset-0" aria-hidden />

        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24 lg:px-6 lg:py-28">
          <div className="max-w-2xl">
            <p className="mb-4 inline-flex rounded-full border border-[var(--accent)]/20 bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
              Visual query builder
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-[var(--fg)] sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
              Illuminate complex queries{" "}
              <span className="text-[var(--accent)]">before you run them</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-[var(--fg-muted)]">
              Lantern lets you build nested database filters by clicking — with live
              SQL preview, validation, and a simulated run against sample data.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/builder"
                className="lantern-btn-primary inline-flex rounded-xl px-6 py-3 text-sm font-semibold"
              >
                Open builder
              </Link>
              <Link
                href="/docs/getting-started"
                className="lantern-btn-secondary inline-flex rounded-xl px-6 py-3 text-sm font-semibold"
              >
                Read the docs
              </Link>
            </div>
          </div>

          {/* Preview card */}
          <div className="mt-14 max-w-3xl">
            <div className="workflow-card overflow-hidden rounded-2xl">
              <div className="flex items-center gap-2 border-b border-[var(--border)] bg-[var(--bg-muted)]/50 px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--danger)]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--warning)]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--success)]" />
                <span className="ml-2 text-xs font-medium text-[var(--fg-muted)]">
                  Query preview
                </span>
              </div>
              <pre className="lantern-code overflow-x-auto p-5 text-[0.7rem] leading-relaxed sm:text-xs">
                {`SELECT * FROM users
WHERE (age > 18 AND country = 'Nigeria')
   OR (status = 'active' AND purchases > 10);`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-16 lg:px-6 lg:py-20">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)] sm:text-3xl">
            Everything you need to filter with confidence
          </h2>
          <p className="mt-3 text-[var(--fg-muted)]">
            From a single condition to deeply nested logic — Lantern keeps the UI
            simple and the generated query correct.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <article
              key={feature.title}
              className="workflow-card rounded-2xl p-5 transition-transform hover:-translate-y-0.5"
            >
              <h3 className="font-semibold text-[var(--fg)]">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--fg-muted)]">
                {feature.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-[var(--border)] bg-[var(--bg-canvas)]">
        <div className="mx-auto max-w-6xl px-4 py-16 lg:px-6 lg:py-20">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)] sm:text-3xl">
            How it works
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {STEPS.map((item) => (
              <div key={item.step}>
                <span className="text-xs font-bold tracking-widest text-[var(--accent)]">
                  {item.step}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-[var(--fg)]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--fg-muted)]">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16 text-center lg:px-6 lg:py-20">
        <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)] sm:text-3xl">
          Ready to build your first query?
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-[var(--fg-muted)]">
          Open the builder and follow the getting started guide — you will have a
          nested filter running in under five minutes.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/builder"
            className="lantern-btn-primary inline-flex rounded-xl px-6 py-3 text-sm font-semibold"
          >
            Launch Lantern
          </Link>
          <Link
            href="/docs"
            className="lantern-btn-secondary inline-flex rounded-xl px-6 py-3 text-sm font-semibold"
          >
            Browse documentation
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
