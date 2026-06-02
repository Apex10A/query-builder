"use client";

import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { AppToolbar } from "@/components/toolbar/app-toolbar";
import { QueryBuilderPanel } from "@/components/query-builder/query-builder-panel";
import { QueryPreview } from "@/components/preview/query-preview";
import { ResultsPanel } from "@/components/results/results-panel";

export function AppShell() {
  useKeyboardShortcuts();

  return (
    <div className="flex min-h-full flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <AppToolbar />
      <main className="mx-auto grid w-full max-w-7xl flex-1 gap-6 p-4 lg:grid-cols-2 lg:p-6">
        <div className="flex flex-col gap-6 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 lg:p-6">
          <QueryBuilderPanel />
        </div>
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 lg:p-6">
            <QueryPreview />
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 lg:p-6">
            <ResultsPanel />
          </div>
        </div>
      </main>
      <footer className="border-t border-zinc-200 px-4 py-3 text-center text-xs text-zinc-500 dark:border-zinc-800">
        Shortcuts: Ctrl+S snapshot · Ctrl+E copy export · Ctrl+Shift+R reset
      </footer>
    </div>
  );
}
