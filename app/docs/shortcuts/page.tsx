import type { Metadata } from "next";
import Link from "next/link";
import { DocsShell } from "@/components/marketing/docs-shell";

export const metadata: Metadata = {
  title: "Keyboard shortcuts",
  description: "Keyboard shortcuts in the Lantern query builder.",
};

export default function ShortcutsPage() {
  return (
    <DocsShell>
      <p className="docs-eyebrow">Keyboard shortcuts</p>
      <h1>Speed up your workflow</h1>
      <p className="docs-lead">
        Shortcuts work while the builder is focused. They apply to the main query
        canvas at <Link href="/builder">/builder</Link>.
      </p>

      <table>
        <thead>
          <tr>
            <th>Shortcut</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <kbd>Ctrl</kbd> + <kbd>S</kbd>
            </td>
            <td>Save snapshot to Activity history</td>
          </tr>
          <tr>
            <td>
              <kbd>Ctrl</kbd> + <kbd>E</kbd>
            </td>
            <td>Copy export JSON to clipboard</td>
          </tr>
          <tr>
            <td>
              <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>R</kbd>
            </td>
            <td>Reset query tree to a fresh empty condition</td>
          </tr>
        </tbody>
      </table>

      <h2>Theme</h2>
      <p>
        Use the theme button in the builder header to cycle light → dark → system.
        Theme preference is saved in your browser.
      </p>

      <p>
        <Link href="/docs/getting-started">Getting started</Link> ·{" "}
        <Link href="/docs/import-export">Import & export</Link>
      </p>
    </DocsShell>
  );
}
