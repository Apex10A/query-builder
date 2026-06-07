import type { Metadata } from "next";
import Link from "next/link";
import { DocsShell } from "@/components/marketing/docs-shell";

export const metadata: Metadata = {
  title: "Import & export",
  description: "Save, load, and share Lantern query JSON.",
};

export default function ImportExportPage() {
  return (
    <DocsShell>
      <p className="docs-eyebrow">Import & export</p>
      <h1>Portable query JSON</h1>
      <p className="docs-lead">
        Export saves your current query tree and data source as JSON. Import
        loads a file back into the builder. Share copies the JSON to your
        clipboard.
      </p>

      <h2>Header actions</h2>
      <ul>
        <li>
          <strong>Export</strong> — downloads{" "}
          <code>lantern-query-&#123;timestamp&#125;.json</code>
        </li>
        <li>
          <strong>Import</strong> — pick a JSON file from disk
        </li>
        <li>
          <strong>Share</strong> — copy export JSON to clipboard
        </li>
        <li>
          <strong>Save</strong> (Ctrl+S) — push a snapshot to Activity history
        </li>
      </ul>

      <h2>Export format</h2>
      <pre>{`{
  "version": 1,
  "schemaId": "users",
  "exportedAt": "2025-06-06T12:00:00.000Z",
  "root": {
    "id": "root",
    "type": "group",
    "logic": "and",
    "children": [ ... ]
  }
}`}</pre>

      <h2>Import safety</h2>
      <p>Lantern validates imports before applying them:</p>
      <ul>
        <li>Must be valid JSON with <code>version</code>, <code>schemaId</code>, and <code>root</code></li>
        <li>Maximum tree depth enforced (protects against oversized payloads)</li>
        <li>Node shapes must match expected rule/group structure</li>
      </ul>
      <p>Malformed files show an error in the header or import modal.</p>

      <h2>Presets vs snapshots</h2>
      <table>
        <thead>
          <tr>
            <th>Feature</th>
            <th>Where</th>
            <th>Use case</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Snapshots</td>
            <td>Activity tab / Ctrl+S</td>
            <td>Version history while you work</td>
          </tr>
          <tr>
            <td>Presets</td>
            <td>Details tab → Quick presets</td>
            <td>Named templates you reload often</td>
          </tr>
          <tr>
            <td>Export file</td>
            <td>Header → Export</td>
            <td>Share with others or backup offline</td>
          </tr>
        </tbody>
      </table>

      <p>
        To save a preset: type a name in the Details tab input and press{" "}
        <strong>Enter</strong>. Load from the dropdown below.
      </p>

      <p>
        <Link href="/docs/shortcuts">Keyboard shortcuts</Link> ·{" "}
        <Link href="/builder">Open builder</Link>
      </p>
    </DocsShell>
  );
}
