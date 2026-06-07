"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ImportErrorModalProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

export function ImportErrorModal({
  open,
  message,
  onClose,
}: ImportErrorModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close dialog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] cursor-pointer bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            role="alertdialog"
            aria-labelledby="import-error-title"
            aria-describedby="import-error-desc"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            className="fixed left-1/2 top-1/2 z-[91] w-[min(100%-2rem,400px)] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-[var(--danger)]/30 bg-[var(--bg-card)] p-6 shadow-2xl"
          >
            <h2
              id="import-error-title"
              className="text-lg font-semibold text-[var(--fg)]"
            >
              Import failed
            </h2>
            <p
              id="import-error-desc"
              className="mt-2 text-sm leading-relaxed text-[var(--fg-muted)]"
            >
              {message}
            </p>
            <p className="mt-3 text-xs text-[var(--fg-subtle)]">
              Expected a Lantern export file with version 1, schemaId, and a
              valid query tree.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="lantern-btn-primary mt-5 w-full cursor-pointer rounded-lg py-2.5 text-sm font-semibold"
            >
              Got it
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
