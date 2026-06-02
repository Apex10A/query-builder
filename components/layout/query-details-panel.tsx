"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useQueryStore } from "@/lib/store/query-store";
import { getSchemaById, DATA_SOURCES } from "@/lib/schema/sources";
import { countRules, maxDepth } from "@/lib/utils/tree";
import { isQueryValid } from "@/lib/engine/validation";

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="detail-row">
      <span className="detail-row-label">{label}</span>
      <span className="detail-row-value">{value}</span>
    </div>
  );
}

export function QueryDetailsPanel() {
  const schemaId = useQueryStore((s) => s.schemaId);
  const setSchemaId = useQueryStore((s) => s.setSchemaId);
  const root = useQueryStore((s) => s.root);
  const validationIssues = useQueryStore((s) => s.validationIssues);
  const presets = useQueryStore((s) => s.presets);
  const savePreset = useQueryStore((s) => s.savePreset);
  const loadPreset = useQueryStore((s) => s.loadPreset);
  const history = useQueryStore((s) => s.history);

  const schema = getSchemaById(schemaId);
  const valid = schema ? isQueryValid(root, schema) : false;
  const errorCount = validationIssues.filter((i) => i.severity === "error").length;

  const stats = useMemo(
    () => ({
      rules: countRules(root),
      depth: maxDepth(root),
    }),
    [root]
  );

  return (
    <motion.div
      key="details"
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-4 p-5"
    >
      <div>
        <h3 className="text-sm font-semibold text-[var(--fg)]">Query details</h3>
        <p className="mt-0.5 text-xs text-[var(--fg-muted)]">
          Schema and validation overview
        </p>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-muted)]/50 p-1">
        <DetailRow
          label="Status"
          value={
            <span
              className={
                valid
                  ? "text-[var(--success)]"
                  : "text-[var(--danger)]"
              }
            >
              {valid ? "Valid" : `${errorCount} errors`}
            </span>
          }
        />
        <DetailRow label="Rules" value={stats.rules} />
        <DetailRow label="Nest depth" value={stats.depth} />
        <DetailRow label="Presets" value={presets.length} />
        <DetailRow label="Snapshots" value={history.length} />
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-[var(--fg-muted)]">
          Data source
        </span>
        <select
          className="lantern-select w-full"
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

      {schema && (
        <div>
          <p className="mb-2 text-xs font-medium text-[var(--fg-muted)]">
            Available fields
          </p>
          <ul className="flex flex-wrap gap-1.5">
            {schema.fields.map((f) => (
              <motion.li
                key={f.name}
                whileHover={{ scale: 1.04 }}
                className="rounded-md border border-[var(--border)] bg-[var(--bg-card)] px-2 py-1 text-xs font-medium text-[var(--fg-muted)]"
              >
                {f.label ?? f.name}
              </motion.li>
            ))}
          </ul>
        </div>
      )}

      <PresetControls
        presets={presets}
        onSave={savePreset}
        onLoad={loadPreset}
      />
    </motion.div>
  );
}

function PresetControls({
  presets,
  onSave,
  onLoad,
}: {
  presets: { id: string; name: string }[];
  onSave: (name: string) => void;
  onLoad: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2 border-t border-[var(--border-soft)] pt-4">
      <p className="text-xs font-medium text-[var(--fg-muted)]">Quick presets</p>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Preset name"
          className="lantern-input flex-1 text-xs"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSave((e.target as HTMLInputElement).value);
              (e.target as HTMLInputElement).value = "";
            }
          }}
        />
      </div>
      {presets.length > 0 && (
        <select
          className="lantern-select w-full text-xs"
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) onLoad(e.target.value);
            e.target.value = "";
          }}
        >
          <option value="">Load preset…</option>
          {presets.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
