"use client";

import { memo, useMemo } from "react";
import { motion } from "framer-motion";
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

interface QueryPreviewProps {
  compact?: boolean;
}

function QueryPreviewComponent({ compact }: QueryPreviewProps) {
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
    <section className="flex flex-col gap-4" aria-label="Query preview">
      {!compact && (
        <div>
          <h3 className="text-sm font-semibold">Live preview</h3>
          <p className="text-xs text-[var(--fg-muted)]">Updates as you build</p>
        </div>
      )}
      {compact && (
        <div>
          <h3 className="text-sm font-semibold text-[var(--fg)]">Generated query</h3>
          <p className="mt-0.5 text-xs text-[var(--fg-muted)]">
            Switch format below
          </p>
        </div>
      )}

      <div className="flex gap-1 rounded-lg border border-[var(--border)] bg-[var(--bg-muted)] p-1">
        {FORMATS.map((f) => (
          <motion.button
            key={f.id}
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={() => setPreviewFormat(f.id)}
            className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${
              previewFormat === f.id
                ? "bg-[var(--bg-card)] text-[var(--accent)] shadow-sm"
                : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
            }`}
          >
            {f.label}
          </motion.button>
        ))}
      </div>

      <motion.pre
        key={previewFormat + preview.slice(0, 20)}
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="lantern-code max-h-72 overflow-auto p-4"
        data-testid="query-preview"
      >
        {preview || "-- compose conditions to generate output --"}
      </motion.pre>
    </section>
  );
}

export const QueryPreview = memo(QueryPreviewComponent);
