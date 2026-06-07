import type { Metadata } from "next";
import Link from "next/link";
import { DocsShell } from "@/components/marketing/docs-shell";

export const metadata: Metadata = {
  title: "Validation",
  description: "When Lantern marks a query valid or invalid.",
};

export default function ValidationPage() {
  return (
    <DocsShell>
      <p className="docs-eyebrow">Validation</p>
      <h1>Valid vs invalid queries</h1>
      <p className="docs-lead">
        Lantern validates the entire query tree on every change. The Details tab
        shows <strong>Valid</strong> or an error count. Execute on the Results
        tab is blocked until the query is valid.
      </p>

      <h2>What stays valid</h2>
      <p>
        A query is <strong>Valid</strong> when every group and condition passes
        all checks below. Preview (SQL/Mongo/GraphQL) still updates even when
        invalid — incomplete rules are simply skipped in the generated string.
      </p>

      <h2>Tree-level errors</h2>
      <ul>
        <li>
          <strong>No conditions</strong> — root group is empty (“Add at least one
          condition”)
        </li>
        <li>
          <strong>Empty nested group</strong> — a group with zero children
        </li>
      </ul>

      <h2>Condition-level errors</h2>
      <table>
        <thead>
          <tr>
            <th>Situation</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Field not selected</td>
            <td>Select a field</td>
          </tr>
          <tr>
            <td>Wrong operator for field type</td>
            <td>e.g. Contains on a number field</td>
          </tr>
          <tr>
            <td>Missing value</td>
            <td>Value is required</td>
          </tr>
          <tr>
            <td>Between without end value</td>
            <td>End value is required for between</td>
          </tr>
          <tr>
            <td>Invalid range</td>
            <td>Range start must be ≤ end</td>
          </tr>
          <tr>
            <td>Empty In Array list</td>
            <td>Provide at least one value</td>
          </tr>
          <tr>
            <td>Non-numeric value on number field</td>
            <td>Value must be a number</td>
          </tr>
          <tr>
            <td>Bad regex pattern</td>
            <td>Invalid regular expression</td>
          </tr>
        </tbody>
      </table>

      <h2>Null checks</h2>
      <p>
        <code>Is Null</code> and <code>Is Not Null</code> do not require a value.
        A rule like <code>Email → Is Null</code> can be valid with only the field
        and operator set.
      </p>

      <h2>Demo tip</h2>
      <p>To show validation in action:</p>
      <ol>
        <li>Clear the field dropdown on a condition → Status shows errors</li>
        <li>Pick Contains on a number field → operator/type error</li>
        <li>Add a nested group and delete all rules inside → empty group error</li>
        <li>Fix the issues → Status returns to Valid and Execute works</li>
      </ol>

      <p>
        <Link href="/docs/builder-guide">Query builder guide</Link> ·{" "}
        <Link href="/builder">Open builder</Link>
      </p>
    </DocsShell>
  );
}
