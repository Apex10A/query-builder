"use client";

import { motion } from "framer-motion";
import { useQueryStore } from "@/lib/store/query-store";
import { useToastStore } from "@/lib/store/toast-store";

interface ActivityPanelProps {
  onRestored?: () => void;
}

export function ActivityPanel({ onRestored }: ActivityPanelProps) {
  const history = useQueryStore((s) => s.history);
  const restoreHistory = useQueryStore((s) => s.restoreHistory);
  const addToast = useToastStore((s) => s.addToast);

  const handleRestore = (id: string, label: string) => {
    restoreHistory(id);
    addToast(`Restored "${label}"`, "success");
    onRestored?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-2xl"
    >
      <h2 className="mb-1 text-lg font-semibold text-[var(--fg)]">Activity</h2>
      <p className="mb-6 text-sm text-[var(--fg-muted)]">
        Query snapshots and recent changes
      </p>

      {history.length === 0 ? (
        <div className="workflow-card flex flex-col items-center gap-3 p-12 text-center">
          <span className="text-3xl opacity-40">📋</span>
          <p className="text-sm text-[var(--fg-muted)]">
            No snapshots yet. Press Save or Ctrl+S to capture your query.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {history.map((entry, i) => (
            <motion.li
              key={entry.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <button
                type="button"
                onClick={() => handleRestore(entry.id, entry.label)}
                className="workflow-card flex w-full cursor-pointer items-center justify-between gap-4 p-4 text-left transition-transform hover:scale-[1.01]"
              >
                <div>
                  <p className="font-medium text-[var(--fg)]">{entry.label}</p>
                  <p className="mt-0.5 text-xs text-[var(--fg-muted)]">
                    {new Date(entry.timestamp).toLocaleString()} ·{" "}
                    {entry.schemaId}
                  </p>
                </div>
                <span className="cursor-pointer text-xs font-medium text-[var(--accent)] hover:underline">
                  Restore →
                </span>
              </button>
            </motion.li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}
