import type { Metadata } from "next";
import { DocsShell } from "@/components/marketing/docs-shell";
import Link from "next/link";
import { DOC_LINKS } from "@/lib/docs/navigation";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Learn how to use Lantern's visual query builder.",
};

export default function DocsHomePage() {
  return (
    <DocsShell>
      <p className="docs-eyebrow">Documentation</p>
      <h1>Illuminate your queries</h1>
      <p className="docs-lead">
        Lantern is a visual query builder for composing database filters without
        writing SQL by hand. Build nested AND/OR logic, preview SQL/MongoDB/GraphQL
        output, validate rules, and run against mock data.
      </p>

      <h2>What Lantern does</h2>
      <ul>
        <li>
          <strong>Conditions</strong> — each rule is a field, operator, and value
          (or a null check).
        </li>
        <li>
          <strong>Groups</strong> — nest conditions with AND/OR, like parentheses
          in SQL.
        </li>
        <li>
          <strong>Preview</strong> — generated query strings update live in the
          sidebar.
        </li>
        <li>
          <strong>Execution</strong> — filter sample users or orders in-memory
          (no real database connected).
        </li>
      </ul>

      <h2>Documentation sections</h2>
      <div className="docs-card-grid not-prose">
        {DOC_LINKS.filter((l) => l.href !== "/docs").map((link) => (
          <Link key={link.href} href={link.href} className="docs-card">
            <span className="docs-card-title">{link.title}</span>
            {link.description && (
              <span className="docs-card-desc">{link.description}</span>
            )}
          </Link>
        ))}
      </div>

      <h2>Quick links</h2>
      <p>
        <Link href="/builder">Open the builder</Link> ·{" "}
        <Link href="/docs/getting-started">Getting started guide</Link>
      </p>
    </DocsShell>
  );
}
