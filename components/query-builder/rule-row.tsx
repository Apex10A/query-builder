"use client";

import { memo, useCallback, useMemo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import type { QueryRule } from "@/lib/types/query";
import type { DataSourceSchema } from "@/lib/types/query";
import {
  getOperatorsForFieldType,
  OPERATOR_LABELS,
} from "@/lib/engine/operators";
import { getIssuesForNode } from "@/lib/engine/validation";
import { useQueryStore } from "@/lib/store/query-store";
import { updateNodeInTree } from "@/lib/utils/tree";
import { ValueInput } from "./value-input";
import { cn } from "@/lib/utils/cn";

interface RuleRowProps {
  rule: QueryRule;
  schema: DataSourceSchema;
  onRemove: () => void;
  index: number;
}

function RuleRowComponent({ rule, schema, onRemove, index }: RuleRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: rule.id });

  const root = useQueryStore((s) => s.root);
  const setRoot = useQueryStore((s) => s.setRoot);
  const validationIssues = useQueryStore((s) => s.validationIssues);

  const fieldMeta = useMemo(
    () => schema.fields.find((f) => f.name === rule.field),
    [schema.fields, rule.field]
  );

  const operators = useMemo(
    () =>
      fieldMeta
        ? getOperatorsForFieldType(fieldMeta.type)
        : getOperatorsForFieldType("string"),
    [fieldMeta]
  );

  const issues = getIssuesForNode(validationIssues, rule.id);
  const hasError = issues.some((i) => i.severity === "error");
  const isComplete =
    rule.field && !hasError && (rule.operator === "is_null" || rule.operator === "is_not_null" || rule.value !== "");

  const status = hasError ? "error" : isComplete ? "success" : "warning";

  const updateRule = useCallback(
    (patch: Partial<QueryRule>) => {
      setRoot(
        updateNodeInTree(root, rule.id, (node) => {
          if (node.type !== "rule") return node;
          const next = { ...node, ...patch };
          if (patch.field !== undefined && patch.field !== node.field) {
            const f = schema.fields.find((x) => x.name === patch.field);
            const ops = f ? getOperatorsForFieldType(f.type) : [];
            if (!ops.includes(next.operator)) {
              next.operator = ops[0] ?? "equals";
              next.value = "";
              next.valueTo = undefined;
            }
          }
          return next;
        })
      );
    },
    [root, rule.id, schema.fields, setRoot]
  );

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const title =
    rule.field && fieldMeta
      ? `${fieldMeta.label ?? rule.field} ${OPERATOR_LABELS[rule.operator]?.toLowerCase() ?? rule.operator}`
      : "New condition";

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
      className={cn(
        "workflow-card group relative rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 shadow-[var(--shadow-card)] transition-all hover:border-indigo-200 hover:shadow-[var(--shadow-card-hover)]",
        isDragging && "workflow-card-dragging z-20 scale-[1.01] border-indigo-400 shadow-lg",
        hasError && "border-[var(--danger)]"
      )}
      data-testid={`rule-${rule.id}`}
    >
      <div className="mb-3 flex items-start gap-3">
        <button
          type="button"
          className="mt-1 cursor-grab touch-none text-[var(--fg-subtle)] hover:text-[var(--accent)]"
          aria-label="Drag to reorder"
          {...attributes}
          {...listeners}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="5" cy="4" r="1.2" />
            <circle cx="11" cy="4" r="1.2" />
            <circle cx="5" cy="8" r="1.2" />
            <circle cx="11" cy="8" r="1.2" />
            <circle cx="5" cy="12" r="1.2" />
            <circle cx="11" cy="12" r="1.2" />
          </svg>
        </button>

        <span
          className={cn(
            "status-dot mt-1.5",
            status === "success" && "status-dot-success",
            status === "warning" && "status-dot-warning",
            status === "error" && "status-dot-error"
          )}
        />

        <div className="min-w-0 flex-1">
          <p className="font-semibold text-[var(--fg)]">{title}</p>
          <p className="text-xs text-[var(--fg-muted)]">
            {status === "success"
              ? "Complete"
              : status === "error"
                ? "Needs attention"
                : "In progress"}
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={onRemove}
          className="rounded-lg p-1.5 text-[var(--fg-subtle)] hover:bg-[var(--danger-soft)] hover:text-[var(--danger)]"
          aria-label="Remove rule"
        >
          ✕
        </motion.button>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <select
          className="lantern-select"
          value={rule.field}
          onChange={(e) => updateRule({ field: e.target.value })}
          aria-label="Field"
        >
          <option value="">Select field…</option>
          {schema.fields.map((f) => (
            <option key={f.name} value={f.name}>
              {f.label ?? f.name}
            </option>
          ))}
        </select>

        <select
          className="lantern-select"
          value={rule.operator}
          onChange={(e) =>
            updateRule({
              operator: e.target.value as QueryRule["operator"],
              value: "",
              valueTo: undefined,
            })
          }
          aria-label="Operator"
        >
          {operators.map((op) => (
            <option key={op} value={op}>
              {OPERATOR_LABELS[op]}
            </option>
          ))}
        </select>

        <ValueInput
          field={fieldMeta}
          operator={rule.operator}
          value={rule.value}
          valueTo={rule.valueTo}
          onChange={(v) => updateRule({ value: v })}
          onChangeTo={(v) => updateRule({ valueTo: v })}
          hasError={hasError}
        />
      </div>

      {issues.length > 0 && (
        <ul className="mt-2 text-xs text-[var(--danger)]">
          {issues.map((i, idx) => (
            <li key={idx}>{i.message}</li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}

export const RuleRow = memo(RuleRowComponent);
