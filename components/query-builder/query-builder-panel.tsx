"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { useQueryStore } from "@/lib/store/query-store";
import { getSchemaById } from "@/lib/schema/sources";
import { ConditionGroup } from "./condition-group";
import { countRules, maxDepth } from "@/lib/utils/tree";
import { isQueryValid } from "@/lib/engine/validation";

function QueryBuilderPanelComponent() {
  const schemaId = useQueryStore((s) => s.schemaId);
  const root = useQueryStore((s) => s.root);
  const validationIssues = useQueryStore((s) => s.validationIssues);

  const schema = getSchemaById(schemaId);
  if (!schema) return null;

  const valid = isQueryValid(root, schema);
  const errorCount = validationIssues.filter((i) => i.severity === "error").length;

  return (
    <section className="mx-auto max-w-3xl" aria-label="Query builder">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
          Workflow
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--fg)]">
          Build your query
        </h1>
        <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[var(--fg-muted)]">
          <span>
            {countRules(root)} conditions · depth {maxDepth(root)}
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
              valid
                ? "bg-[var(--success-soft)] text-[var(--success)]"
                : "bg-[var(--danger-soft)] text-[var(--danger)]"
            }`}
          >
            {valid ? "Ready" : `${errorCount} issues`}
          </span>
        </p>
      </motion.div>

      <ConditionGroup group={root} schema={schema} isRoot depth={0} />
    </section>
  );
}

export const QueryBuilderPanel = memo(QueryBuilderPanelComponent);
