"use client";

import { memo, useCallback, useMemo, useState } from "react";
import { useQueryStore } from "@/lib/store/query-store";
import { getDatasetForSchema } from "@/lib/data/mock-dataset";
import { getSchemaById } from "@/lib/schema/sources";
import { executeQuery, paginateResults, sortResults } from "@/lib/engine/executor";
import { isQueryValid } from "@/lib/engine/validation";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 5;

function ResultsPanelComponent() {
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
    await new Promise((r) => setTimeout(r, 400));

    const filtered = executeQuery(root, dataset);
    setResults(filtered);
    setLastResultCount(filtered.length);
    setExecuting(false);
  }, [schema, root, dataset, setExecuting, setLastResultCount]);

  return (
    <section className="flex flex-col gap-3" aria-label="Query results">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">Results</h2>
          {lastResultCount !== null && (
            <p className="text-sm text-zinc-500">
              {lastResultCount} matching record{lastResultCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {schema && (
            <>
              <select
                className="h-9 rounded-lg border border-zinc-300 bg-white px-2 text-sm dark:border-zinc-600 dark:bg-zinc-900"
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
                aria-label="Sort field"
              >
                {schema.fields.map((f) => (
                  <option key={f.name} value={f.name}>
                    Sort: {f.label ?? f.name}
                  </option>
                ))}
              </select>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
              >
                {sortDir === "asc" ? "↑" : "↓"}
              </Button>
            </>
          )}
          <Button
            variant="primary"
            onClick={runQuery}
            disabled={isExecuting}
          >
            {isExecuting ? "Running…" : "Run query"}
          </Button>
        </div>
      </div>

      <div className="min-h-[200px] rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
        {isExecuting && (
          <div className="flex h-48 items-center justify-center text-sm text-zinc-500 animate-pulse">
            Filtering dataset…
          </div>
        )}
        {!isExecuting && hasRun && paged.data.length === 0 && (
          <div className="flex h-48 flex-col items-center justify-center gap-2 text-zinc-500">
            <span className="text-2xl">∅</span>
            <p className="text-sm">No records match this query</p>
          </div>
        )}
        {!isExecuting && paged.data.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-100 dark:bg-zinc-800">
                <tr>
                  {Object.keys(paged.data[0]).map((key) => (
                    <th key={key} className="px-3 py-2 font-medium capitalize">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paged.data.map((row, i) => (
                  <tr
                    key={String(row.id ?? i)}
                    className="border-t border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                  >
                    {Object.values(row).map((val, j) => (
                      <td key={j} className="px-3 py-2 font-mono text-xs">
                        {String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!isExecuting && !hasRun && (
          <div className="flex h-48 items-center justify-center text-sm text-zinc-500">
            Run a query to inspect matching records
          </div>
        )}
      </div>

      {hasRun && paged.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <Button
            size="sm"
            variant="secondary"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-zinc-500">
            Page {page} of {paged.totalPages}
          </span>
          <Button
            size="sm"
            variant="secondary"
            disabled={page >= paged.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </section>
  );
}

export const ResultsPanel = memo(ResultsPanelComponent);
