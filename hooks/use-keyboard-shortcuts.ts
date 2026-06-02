"use client";

import { useEffect } from "react";
import { useQueryStore } from "@/lib/store/query-store";
import { createInitialRoot } from "@/lib/utils/tree";

export function useKeyboardShortcuts() {
  const pushHistory = useQueryStore((s) => s.pushHistory);
  const setRoot = useQueryStore((s) => s.setRoot);
  const exportJson = useQueryStore((s) => s.exportJson);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;

      if (mod && e.key === "s") {
        e.preventDefault();
        pushHistory("Keyboard snapshot");
      }

      if (mod && e.shiftKey && e.key === "R") {
        e.preventDefault();
        setRoot(createInitialRoot());
      }

      if (mod && e.key === "e") {
        e.preventDefault();
        const json = exportJson();
        void navigator.clipboard.writeText(json);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [pushHistory, setRoot, exportJson]);
}
