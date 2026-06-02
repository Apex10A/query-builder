"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { QueryDetailsPanel } from "./query-details-panel";
import { QueryPreview } from "@/components/preview/query-preview";
import { ResultsPanel } from "@/components/results/results-panel";

export type SidebarTab = "details" | "query" | "results";

const TABS: { id: SidebarTab; label: string; badge?: string }[] = [
  { id: "details", label: "Details" },
  { id: "query", label: "Query" },
  { id: "results", label: "Results" },
];

interface WorkflowSidebarProps {
  defaultTab?: SidebarTab;
  resultsCount?: number | null;
}

export function WorkflowSidebar({
  defaultTab = "details",
  resultsCount,
}: WorkflowSidebarProps) {
  const [tab, setTab] = useState<SidebarTab>(defaultTab);

  return (
    <aside className="lantern-sidebar flex max-h-[45vh] w-full shrink-0 flex-col border-t lg:max-h-none lg:w-[var(--sidebar-width)] lg:border-t-0">
      <div className="flex border-b border-[var(--border)]">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className="lantern-sidebar-tab"
            data-active={tab === t.id}
            onClick={() => setTab(t.id)}
          >
            {t.label}
            {t.id === "results" && resultsCount != null && (
              <span className="ml-1 rounded-full bg-[var(--accent-soft)] px-1.5 text-[0.65rem] text-[var(--accent)]">
                {resultsCount}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {tab === "details" && <QueryDetailsPanel key="details" />}
          {tab === "query" && (
            <motion.div
              key="query"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.25 }}
              className="p-5"
            >
              <QueryPreview compact />
            </motion.div>
          )}
          {tab === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.25 }}
              className="p-5"
            >
              <ResultsPanel compact />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
}
