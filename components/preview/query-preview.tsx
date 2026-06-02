"use client";

import { memo, useMemo } from "react";
import { useQueryStore } from "@/lib/store/query-store";
import { getSchemaById } from "@/lib/schema/sources";
import { generateSql } from "@/lib/engine/sql-generator";
import { generateMongo } from "@/lib/engine/mongo-generator";
import { generateGraphQL } from "@/lib/engine/graphql-generator";
import type { PreviewFormat } from "@/lib/types/query";

const FORMATS: { id: PreviewFormat; label: string }[] = [
  { id: "sql", label: "SQL" },
  { id: "mongo", label: "MongoDB" },
  { id: "graphql", label: "GraphQL" },
];

function QueryPreviewComponent() {
  const previewFormat = useQueryStore((s) => s.previewFormat);
  const setPreviewFormat = useQueryStore((s) => s.setPreviewFormat);
  const root = useQueryStore((s) => s.root);
  const schemaId = useQueryStore((s) => s.schemaId);

  const preview = useMemo(() => {
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
  }, [root, schemaId, previewFormat]);

  return (
    <section className="flex flex-col gap-3" aria-label="Query preview">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">Live preview</h2>
        <div className="flex rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
          {FORMATS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setPreviewFormat(f.id)}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                previewFormat === f.id
                  ? "bg-violet-600 text-white"
                  : "bg-white text-zinc-600 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-300"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <pre
        className="max-h-64 overflow-auto rounded-xl border border-zinc-200 bg-zinc-950 p-4 font-mono text-xs text-emerald-400 leading-relaxed transition-opacity duration-200 dark:border-zinc-700"
        data-testid="query-preview"
      >
        {preview || "-- build conditions to see preview --"}
      </pre>
    </section>
  );
}

export const QueryPreview = memo(QueryPreviewComponent);
