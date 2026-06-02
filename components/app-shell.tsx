"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { WorkflowTopNav, type MainTab } from "@/components/layout/workflow-top-nav";
import { WorkflowSidebar } from "@/components/layout/workflow-sidebar";
import { ActivityPanel } from "@/components/layout/activity-panel";
import { QueryBuilderPanel } from "@/components/query-builder/query-builder-panel";
import { useQueryStore } from "@/lib/store/query-store";
import { ToastContainer } from "@/components/ui/toast-container";

export function AppShell() {
  useKeyboardShortcuts();
  const [mainTab, setMainTab] = useState<MainTab>("builder");
  const lastResultCount = useQueryStore((s) => s.lastResultCount);

  return (
    <div className="lantern-app flex h-dvh flex-col overflow-hidden bg-[var(--bg-app)]">
      <WorkflowTopNav activeTab={mainTab} onTabChange={setMainTab} />

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <main className="lantern-canvas min-h-0 min-w-0 flex-1 overflow-y-auto bg-[var(--bg-canvas)] bg-[radial-gradient(circle,var(--border)_1px,transparent_1px)] bg-[length:20px_20px]">
          <AnimatePresence mode="wait">
            {mainTab === "builder" ? (
              <motion.div
                key="builder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="p-6 lg:p-10"
              >
                <QueryBuilderPanel />
              </motion.div>
            ) : (
              <motion.div
                key="activity"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 lg:p-10"
              >
                <ActivityPanel
                  onRestored={() => setMainTab("builder")}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <WorkflowSidebar resultsCount={lastResultCount} />
      </div>
      <ToastContainer />
    </div>
  );
}
