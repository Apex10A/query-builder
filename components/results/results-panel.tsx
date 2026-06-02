"use client";

import { memo, useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useQueryStore } from "@/lib/store/query-store";
import { getDatasetForSchema } from "@/lib/data/mock-dataset";
import { getSchemaById } from "@/lib/schema/sources";
import { executeQuery, paginateResults, sortResults } from "@/lib/engine/executor";
import { isQueryValid } from "@/lib/engine/validation";

const PAGE_SIZE = 5;

interface ResultsPanelProps {
  compact?: boolean;
}

function ResultsPanelComponent({ compact }: ResultsPanelProps) {
  const schemaId = useQueryStore((s) => s.schemaId);
  const root = useQueryStore((s) => s.root);
  const isExecuting = useQueryStore((s) => s.isExecuting);
  const setExecuting = useQueryStore((s) => s.setExecuting);
  const lastResultCount = useQueryStore((s) => s.lastResultCount);
  const setLastResultCount = useQueryStore((s) => s.setLastResultCount);

  const [results, setResults] = useState<Record<string, unknown>[]>([]);
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [hasRun, setHasRun] = useState(false);

  const schema = getSchemaById(schemaId);
  const dataset = useMemo(() => getDatasetForSchema(schemaId), [schemaId]);

  const sorted = useMemo(
    () => sortResults(results, sortField, sortDir),
    [results, sortField, sortDir]
  );

  const paged = useMemo(
    () => paginateResults(sorted, page, PAGE_SIZE),
    [sorted, page]
  );

  const runQuery = useCallback(async () => {
    if (!schema) return;
    if (!isQueryValid(root, schema)) return;

    setExecuting(true);
    setHasRun(true);
    setPage(1);
    await new Promise((r) => setTimeout(r, 450));

    const filtered = executeQuery(root, dataset);
    setResults(filtered);
    setLastResultCount(filtered.length);
    setExecuting(false);
  }, [schema, root, dataset, setExecuting, setLastResultCount]);

  return (
    <section className="flex flex-col gap-4" aria-label="Query results">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-[var(--fg)]">Results</h3>
          {lastResultCount !== null && (
            <p className="text-xs text-[var(--fg-muted)]">
              {lastResultCount} record{lastResultCount !== 1 ? "s" : ""} matched
            </p>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          type="button"
          onClick={runQuery}
          disabled={isExecuting}
          className="lantern-btn-primary rounded-lg px-4 py-2 text-xs font-semibold disabled:opacity-60"
        >
          {isExecuting ? "Running…" : "Execute"}
        </motion.button>
      </div>

      {schema && (
        <div className="flex gap-2">
          <select
            className="lantern-select flex-1 text-xs"
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
          >
            {schema.fields.map((f) => (
              <option key={f.name} value={f.name}>
                {f.label ?? f.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
            className="lantern-btn-secondary rounded-lg px-3 text-xs"
          >
            {sortDir === "asc" ? "↑" : "↓"}
          </button>
        </div>
      )}

      <div className="min-h-[180px] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-card)]">
        {isExecuting && (
          <div className="flex h-44 flex-col items-center justify-center gap-3">
            <motion.div
              animate={{ width: ["20%", "80%", "20%"] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className="h-1 max-w-[120px] rounded-full bg-[var(--accent)]"
            />
            <p className="text-xs text-[var(--fg-muted)]">Filtering dataset…</p>
          </div>
        )}
        {!isExecuting && hasRun && paged.data.length === 0 && (
          <div className="flex h-44 flex-col items-center justify-center text-[var(--fg-muted)]">
            <p className="text-2xl">∅</p>
            <p className="mt-2 text-xs">No matches</p>
          </div>
        )}
        {!isExecuting && paged.data.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg-muted)]">
                  {Object.keys(paged.data[0]).map((key) => (
                    <th key={key} className="px-3 py-2 font-semibold capitalize">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paged.data.map((row, i) => (
                  <motion.tr
                    key={String(row.id ?? i)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-[var(--border-soft)] hover:bg-[var(--accent-soft)]/30"
                  >
                    {Object.values(row).map((val, j) => (
                      <td key={j} className="px-3 py-2 font-mono">
                        {String(val)}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!isExecuting && !hasRun && (
          <div className="flex h-44 items-center justify-center text-xs text-[var(--fg-subtle)]">
            Run execute to see data
          </div>
        )}
      </div>

      {hasRun && paged.totalPages > 1 && (
        <div className="flex justify-between text-xs">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="lantern-btn-secondary rounded-lg px-3 py-1 disabled:opacity-40"
          >
            Prev
          </button>
          <span className="text-[var(--fg-muted)]">
            {page} / {paged.totalPages}
          </span>
          <button
            type="button"
            disabled={page >= paged.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="lantern-btn-secondary rounded-lg px-3 py-1 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}

export const ResultsPanel = memo(ResultsPanelComponent);
