import type { Metadata } from "next";
import Link from "next/link";
import { DocsShell } from "@/components/marketing/docs-shell";

export const metadata: Metadata = {
  title: "Query builder",
  description: "Conditions, groups, operators, and the builder canvas.",
};

export default function BuilderGuidePage() {
  return (
    <DocsShell>
      <p className="docs-eyebrow">Query builder</p>
      <h1>Conditions, groups & operators</h1>
      <p className="docs-lead">
        The builder canvas is a visual tree of rules and groups. In the UI we
        call each rule a <strong>condition</strong>; in code it is a{" "}
        <strong>rule</strong> — same thing.
      </p>

      <h2>Condition cards</h2>
      <p>Each card has three parts:</p>
      <table>
        <thead>
          <tr>
            <th>Part</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Field</td>
            <td>Column to filter (Age, Country, Status, …)</td>
          </tr>
          <tr>
            <td>Operator</td>
            <td>Equals, Greater Than, Contains, Is Null, …</td>
          </tr>
          <tr>
            <td>Value</td>
            <td>What to compare against (hidden for Is Null / Is Not Null)</td>
          </tr>
        </tbody>
      </table>

      <h2>Status dots</h2>
      <ul>
        <li>
          <strong>Green</strong> — condition is complete and valid
        </li>
        <li>
          <strong>Yellow</strong> — in progress
        </li>
        <li>
          <strong>Red</strong> — validation error on this card
        </li>
      </ul>

      <h2>Groups & logic</h2>
      <p>
        Click the <strong>AND</strong> / <strong>OR</strong> chip on a group to
        toggle how its children combine. Use <strong>+ Add group</strong> for
        nested logic — groups can contain other groups without a depth limit in
        the UI.
      </p>
      <p>
        Drag the handle (⋮⋮) on a card to reorder conditions within a group.
      </p>

      <h2>Schema-driven operators</h2>
      <p>
        Available operators depend on field type. Numbers get comparisons and{" "}
        <code>Between</code>; strings get <code>Contains</code> and{" "}
        <code>Starts With</code>; enums get a dropdown of allowed values.
      </p>
      <p>All field types support <code>Is Null</code> and <code>Is Not Null</code>.</p>

      <h2>Sidebar tabs</h2>
      <table>
        <thead>
          <tr>
            <th>Tab</th>
            <th>Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Details</td>
            <td>Validation status, stats, data source, field list, presets</td>
          </tr>
          <tr>
            <td>Query</td>
            <td>Live SQL / MongoDB / GraphQL preview</td>
          </tr>
          <tr>
            <td>Results</td>
            <td>Execute against mock data, sort and paginate</td>
          </tr>
        </tbody>
      </table>

      <h2>Data sources</h2>
      <p>
        Lantern ships with two mock schemas: <strong>Users</strong> (people with
        age, country, status, purchases, …) and <strong>Orders</strong> (order
        ID, amount, status, date). Switching data source resets the query tree.
      </p>

      <p>
        See <Link href="/docs/validation">validation</Link> for when Execute is
        blocked, and <Link href="/docs/import-export">import & export</Link> for
        saving queries as JSON.
      </p>
    </DocsShell>
  );
}
