"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useToastStore, type ToastType } from "@/lib/store/toast-store";
import { cn } from "@/lib/utils/cn";

const styles: Record<ToastType, string> = {
  success:
    "border-[var(--success)]/30 bg-[var(--success-soft)] text-[var(--success)]",
  error: "border-[var(--danger)]/30 bg-[var(--danger-soft)] text-[var(--danger)]",
  info: "border-[var(--accent)]/30 bg-[var(--accent-soft)] text-[var(--accent)]",
};

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const dismissToast = useToastStore((s) => s.dismissToast);

  return (
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-[100] flex max-w-sm flex-col gap-2"
      aria-live="polite"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 8, scale: 0.96 }}
            className={cn(
              "pointer-events-auto flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg backdrop-blur-sm",
              styles[toast.type]
            )}
          >
            <span>{toast.message}</span>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="shrink-0 cursor-pointer opacity-70 hover:opacity-100"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
