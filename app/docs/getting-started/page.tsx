import type { Metadata } from "next";
import Link from "next/link";
import { DocsShell } from "@/components/marketing/docs-shell";

export const metadata: Metadata = {
  title: "Getting started",
  description: "Build your first visual query in Lantern.",
};

export default function GettingStartedPage() {
  return (
    <DocsShell>
      <p className="docs-eyebrow">Getting started</p>
      <h1>Your first query</h1>
      <p className="docs-lead">
        This guide walks you through building a nested filter and running it
        against sample data. It takes about five minutes.
      </p>

      <h2>1. Open the builder</h2>
      <p>
        Go to the <Link href="/builder">builder</Link>. You will see a dot-grid
        canvas with one empty condition card and a sidebar on the right.
      </p>

      <h2>2. Add two simple conditions</h2>
      <ol>
        <li>Select data source <strong>Users</strong> in the Details tab (if not already selected).</li>
        <li>Rule 1: <code>Age</code> → <code>Greater Than</code> → <code>18</code></li>
        <li>Click <strong>+ Add condition</strong></li>
        <li>Rule 2: <code>Country</code> → <code>Equals</code> → <code>Nigeria</code></li>
      </ol>
      <p>
        The group chip should read <strong>AND</strong> — both rules must match.
      </p>

      <h2>3. Add a nested OR group</h2>
      <ol>
        <li>Click <strong>+ Add group</strong> and set the new group to <strong>OR</strong>.</li>
        <li>Inside it, add: <code>Status</code> = <code>active</code></li>
        <li>Add another condition: <code>Purchases</code> &gt; <code>10</code></li>
      </ol>
      <p>Your logic is now:</p>
      <pre>{`(age > 18 AND country = 'Nigeria')
OR (status = 'active' AND purchases > 10)`}</pre>

      <h2>4. Preview and run</h2>
      <ol>
        <li>Open the <strong>Query</strong> sidebar tab — SQL updates as you type.</li>
        <li>Switch format to MongoDB or GraphQL to see other outputs.</li>
        <li>Open <strong>Results</strong> and click <strong>Execute</strong>.</li>
      </ol>
      <p>
        Execute only works when status is <strong>Valid</strong> in the Details
        tab. See the{" "}
        <Link href="/docs/validation">validation guide</Link> for what blocks a
        run.
      </p>

      <h2>5. Save your work</h2>
      <ul>
        <li>
          <strong>Ctrl+S</strong> — save a snapshot to the Activity tab
        </li>
        <li>
          <strong>Export</strong> — download query JSON from the header
        </li>
        <li>
          <strong>Quick presets</strong> — name and save reusable templates in
          the Details tab
        </li>
      </ul>

      <p>
        Next: read the full{" "}
        <Link href="/docs/builder-guide">query builder guide</Link>.
      </p>
    </DocsShell>
  );
}
