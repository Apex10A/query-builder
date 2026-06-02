"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  HistoryEntry,
  PreviewFormat,
  QueryPreset,
  QueryRoot,
  ValidationIssue,
} from "@/lib/types/query";
import { getSchemaById } from "@/lib/schema/sources";
import { createInitialRoot, cloneRoot } from "@/lib/utils/tree";
import { validateQueryTree } from "@/lib/engine/validation";
import { generateSql } from "@/lib/engine/sql-generator";
import { generateMongo } from "@/lib/engine/mongo-generator";
import { generateGraphQL } from "@/lib/engine/graphql-generator";
import { exportQueryJson, importQueryJson } from "@/lib/utils/import-export";
import { nanoid } from "nanoid";

interface QueryState {
  schemaId: string;
  root: QueryRoot;
  previewFormat: PreviewFormat;
  validationIssues: ValidationIssue[];
  history: HistoryEntry[];
  presets: QueryPreset[];
  theme: "light" | "dark" | "system";
  isExecuting: boolean;
  lastResultCount: number | null;

  setSchemaId: (id: string) => void;
  setRoot: (root: QueryRoot) => void;
  setPreviewFormat: (format: PreviewFormat) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
  revalidate: () => void;
  pushHistory: (label?: string) => void;
  restoreHistory: (id: string) => void;
  savePreset: (name: string) => void;
  loadPreset: (id: string) => void;
  deletePreset: (id: string) => void;
  exportJson: () => string;
  importJson: (json: string) => void;
  setExecuting: (v: boolean) => void;
  setLastResultCount: (n: number | null) => void;
  getPreview: () => string;
}

function computeValidation(schemaId: string, root: QueryRoot): ValidationIssue[] {
  const schema = getSchemaById(schemaId);
  if (!schema) return [];
  return validateQueryTree(root, schema);
}

export const useQueryStore = create<QueryState>()(
  persist(
    (set, get) => ({
      schemaId: "users",
      root: createInitialRoot(),
      previewFormat: "sql",
      validationIssues: [],
      history: [],
      presets: [],
      theme: "light",
      isExecuting: false,
      lastResultCount: null,

      setSchemaId: (id) => {
        const root = createInitialRoot();
        set({
          schemaId: id,
          root,
          validationIssues: computeValidation(id, root),
          lastResultCount: null,
        });
      },

      setRoot: (root) => {
        const { schemaId } = get();
        set({
          root,
          validationIssues: computeValidation(schemaId, root),
        });
      },

      setPreviewFormat: (format) => set({ previewFormat: format }),

      setTheme: (theme) => set({ theme }),

      revalidate: () => {
        const { schemaId, root } = get();
        set({ validationIssues: computeValidation(schemaId, root) });
      },

      pushHistory: (label) => {
        const { schemaId, root, history } = get();
        const entry: HistoryEntry = {
          id: nanoid(),
          label: label ?? `Snapshot ${history.length + 1}`,
          timestamp: Date.now(),
          root: cloneRoot(root),
          schemaId,
        };
        set({ history: [entry, ...history].slice(0, 20) });
      },

      restoreHistory: (id) => {
        const entry = get().history.find((h) => h.id === id);
        if (!entry) return;
        set({
          schemaId: entry.schemaId,
          root: cloneRoot(entry.root),
          validationIssues: computeValidation(entry.schemaId, entry.root),
        });
      },

      savePreset: (name) => {
        const { schemaId, root, presets } = get();
        const preset: QueryPreset = {
          id: nanoid(),
          name,
          schemaId,
          root: cloneRoot(root),
          createdAt: Date.now(),
        };
        set({ presets: [...presets, preset] });
      },

      loadPreset: (id) => {
        const preset = get().presets.find((p) => p.id === id);
        if (!preset) return;
        set({
          schemaId: preset.schemaId,
          root: cloneRoot(preset.root),
          validationIssues: computeValidation(preset.schemaId, preset.root),
        });
      },

      deletePreset: (id) => {
        set({ presets: get().presets.filter((p) => p.id !== id) });
      },

      exportJson: () => exportQueryJson(get().schemaId, get().root),

      importJson: (json) => {
        const { schemaId, root } = importQueryJson(json);
        set({
          schemaId,
          root,
          validationIssues: computeValidation(schemaId, root),
        });
      },

      setExecuting: (v) => set({ isExecuting: v }),

      setLastResultCount: (n) => set({ lastResultCount: n }),

      getPreview: () => {
        const { schemaId, root, previewFormat } = get();
        const schema = getSchemaById(schemaId);
        if (!schema) return "";
        switch (previewFormat) {
          case "sql":
            return generateSql(root, schema);
          case "mongo":
            return generateMongo(root);
          case "graphql":
            return generateGraphQL(root);
          default:
            return "";
        }
      },
    }),
    {
      name: "visual-query-builder",
      partialize: (s) => ({
        schemaId: s.schemaId,
        root: s.root,
        previewFormat: s.previewFormat,
        history: s.history,
        presets: s.presets,
        theme: s.theme,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.validationIssues = computeValidation(state.schemaId, state.root);
        }
      },
    }
  )
);
