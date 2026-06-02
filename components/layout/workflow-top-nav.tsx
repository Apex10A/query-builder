"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { LanternLogo } from "@/components/brand/lantern-logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ImportErrorModal } from "@/components/ui/import-error-modal";
import { useQueryStore } from "@/lib/store/query-store";
import { useToastStore } from "@/lib/store/toast-store";

export type MainTab = "builder" | "activity";

interface WorkflowTopNavProps {
  activeTab: MainTab;
  onTabChange: (tab: MainTab) => void;
}

export function WorkflowTopNav({ activeTab, onTabChange }: WorkflowTopNavProps) {
  const pushHistory = useQueryStore((s) => s.pushHistory);
  const exportJson = useQueryStore((s) => s.exportJson);
  const importJson = useQueryStore((s) => s.importJson);
  const history = useQueryStore((s) => s.history);
  const addToast = useToastStore((s) => s.addToast);

  const fileRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const handleExport = () => {
    const blob = new Blob([exportJson()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lantern-query-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast("Query exported to file", "success");
  };

  const handleShare = async () => {
    const json = exportJson();
    try {
      await navigator.clipboard.writeText(json);
      addToast("Query copied to clipboard", "success");
    } catch {
      handleExport();
      addToast("Clipboard unavailable — file downloaded instead", "info");
    }
  };

  const handleSave = () => {
    pushHistory();
    addToast("Snapshot saved", "success");
  };

  return (
    <>
      <header className="lantern-nav sticky top-0 z-30 shrink-0 border-b border-[var(--border)] bg-[var(--bg-card)] shadow-sm">
        <div className="flex h-14 items-center gap-4 px-4 lg:px-6">
          <LanternLogo size="sm" />

          <nav
            className="absolute left-1/2 flex -translate-x-1/2 gap-1 rounded-lg bg-[var(--bg-muted)]/50 p-1"
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
                className="lantern-nav-tab cursor-pointer rounded-md px-4 py-1.5 text-sm font-medium transition-colors data-[active=true]:bg-[var(--bg-card)] data-[active=true]:font-semibold data-[active=true]:text-[var(--fg)] data-[active=true]:shadow-sm"
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
              onClick={handleSave}
              className="lantern-btn-secondary hidden cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium sm:inline-flex"
            >
              Save
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={handleExport}
              className="lantern-btn-secondary cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium"
            >
              Export
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => fileRef.current?.click()}
              className="lantern-btn-secondary cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium"
            >
              Import
            </motion.button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                const reader = new FileReader();
                reader.onload = () => {
                  try {
                    importJson(String(reader.result));
                    setImportError(null);
                    addToast("Query imported successfully", "success");
                  } catch (err) {
                    const msg =
                      err instanceof Error ? err.message : "Import failed";
                    setImportError(msg);
                  }
                };
                reader.onerror = () => {
                  setImportError("Could not read the selected file.");
                };
                reader.readAsText(f);
                e.target.value = "";
              }}
            />
            <ThemeToggle />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={handleShare}
              className="lantern-btn-primary cursor-pointer rounded-lg px-4 py-1.5 text-xs font-semibold"
            >
              Share
            </motion.button>
          </div>
        </div>
      </header>

      <ImportErrorModal
        open={importError !== null}
        message={importError ?? ""}
        onClose={() => setImportError(null)}
      />
    </>
  );
}
