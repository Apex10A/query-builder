"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { LanternLogo } from "@/components/brand/lantern-logo";
import { useQueryStore } from "@/lib/store/query-store";

export type MainTab = "builder" | "activity";

interface WorkflowTopNavProps {
  activeTab: MainTab;
  onTabChange: (tab: MainTab) => void;
}

export function WorkflowTopNav({ activeTab, onTabChange }: WorkflowTopNavProps) {
  const theme = useQueryStore((s) => s.theme);
  const setTheme = useQueryStore((s) => s.setTheme);
  const pushHistory = useQueryStore((s) => s.pushHistory);
  const exportJson = useQueryStore((s) => s.exportJson);
  const importJson = useQueryStore((s) => s.importJson);
  const history = useQueryStore((s) => s.history);

  const fileRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const cycleTheme = useCallback(() => {
    const order: Array<"light" | "dark" | "system"> = ["light", "dark", "system"];
    setTheme(order[(order.indexOf(theme) + 1) % order.length]);
  }, [theme, setTheme]);

  const handleExport = () => {
    const blob = new Blob([exportJson()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lantern-query-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header className="lantern-nav sticky top-0 z-30 shrink-0">
      <div className="flex h-14 items-center gap-4 px-4 lg:px-6">
        <LanternLogo size="sm" />

        <nav
          className="absolute left-1/2 flex -translate-x-1/2 gap-1"
          aria-label="Main sections"
        >
          {(
            [
              { id: "builder" as const, label: "Builder" },
              { id: "activity" as const, label: "Activity" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              className="lantern-nav-tab"
              data-active={activeTab === tab.id}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {history.length > 0 && (
            <span className="hidden rounded-full bg-[var(--accent-soft)] px-2 py-0.5 text-xs font-medium text-[var(--accent)] sm:inline">
              {history.length} snapshots
            </span>
          )}
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => pushHistory()}
            className="lantern-btn-secondary hidden rounded-lg px-3 py-1.5 text-xs font-medium sm:inline-flex"
          >
            Save
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={handleExport}
            className="lantern-btn-secondary rounded-lg px-3 py-1.5 text-xs font-medium"
          >
            Export
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => fileRef.current?.click()}
            className="lantern-btn-secondary rounded-lg px-3 py-1.5 text-xs font-medium"
          >
            Import
          </motion.button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              const reader = new FileReader();
              reader.onload = () => {
                try {
                  importJson(String(reader.result));
                  setImportError(null);
                } catch (err) {
                  setImportError(
                    err instanceof Error ? err.message : "Import failed"
                  );
                }
              };
              reader.readAsText(f);
              e.target.value = "";
            }}
          />
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={cycleTheme}
            className="lantern-btn-secondary flex h-8 w-8 items-center justify-center rounded-lg text-sm"
            title="Toggle theme"
          >
            {theme === "dark" ? "◐" : "○"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(exportJson());
              } catch {
                handleExport();
              }
            }}
            className="lantern-btn-primary rounded-lg px-4 py-1.5 text-xs font-semibold"
          >
            Share
          </motion.button>
        </div>
      </div>
      {importError && (
        <p className="px-6 pb-2 text-xs text-[var(--danger)]">{importError}</p>
      )}
    </header>
  );
}
