"use client";

import { create } from "zustand";
import { nanoid } from "nanoid";

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastState {
  toasts: ToastItem[];
  addToast: (message: string, type?: ToastType) => void;
  dismissToast: (id: string) => void;
}

const AUTO_DISMISS_MS = 4000;

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  addToast: (message, type = "info") => {
    const id = nanoid();
    set({ toasts: [...get().toasts, { id, message, type }] });
    setTimeout(() => {
      if (get().toasts.some((t) => t.id === id)) {
        set({ toasts: get().toasts.filter((t) => t.id !== id) });
      }
    }, AUTO_DISMISS_MS);
  },

  dismissToast: (id) => {
    set({ toasts: get().toasts.filter((t) => t.id !== id) });
  },
}));
