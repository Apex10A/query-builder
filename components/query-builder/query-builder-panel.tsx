"use client";

import { memo } from "react";
import { useQueryStore } from "@/lib/store/query-store";
import { getSchemaById } from "@/lib/schema/sources";
import { ConditionGroup } from "./condition-group";
import { DATA_SOURCES } from "@/lib/schema/sources";
import { countRules, maxDepth } from "@/lib/utils/tree";
import { isQueryValid } from "@/lib/engine/validation";

function QueryBuilderPanelComponent() {
  const schemaId = useQueryStore((s) => s.schemaId);
  const setSchemaId = useQueryStore((s) => s.setSchemaId);
  const root = useQueryStore((s) => s.root);
  const validationIssues = useQueryStore((s) => s.validationIssues);

  const schema = getSchemaById(schemaId);
  if (!schema) return null;

  const valid = isQueryValid(root, schema);
  const errorCount = validationIssues.filter((i) => i.severity === "error").length;

  return (
    <section className="flex flex-col gap-4" aria-label="Query builder">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Conditions
          </h2>
          <p className="text-sm text-zinc-500">
            {countRules(root)} rules · depth {maxDepth(root)} ·{" "}
            {valid ? (
              <span className="text-emerald-600">Valid</span>
            ) : (
              <span className="text-red-600">{errorCount} errors</span>
            )}
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-zinc-500">Data source</span>
          <select
            className="h-9 rounded-lg border border-zinc-300 bg-white px-3 dark:border-zinc-600 dark:bg-zinc-900"
            value={schemaId}
            onChange={(e) => setSchemaId(e.target.value)}
          >
            {DATA_SOURCES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <ConditionGroup group={root} schema={schema} isRoot depth={0} />
    </section>
  );
}

export const QueryBuilderPanel = memo(QueryBuilderPanelComponent);
