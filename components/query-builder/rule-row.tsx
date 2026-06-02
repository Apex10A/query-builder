"use client";

import { memo, useCallback, useMemo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface RuleRowProps {
  rule: QueryRule;
  schema: DataSourceSchema;
  onRemove: () => void;
}

function RuleRowComponent({ rule, schema, onRemove }: RuleRowProps) {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex flex-wrap items-start gap-2 rounded-xl border bg-white/80 p-3 shadow-sm transition-all duration-200 dark:bg-zinc-900/80",
        isDragging && "opacity-60 ring-2 ring-violet-400 z-10",
        hasError
          ? "border-red-300 dark:border-red-800"
          : "border-zinc-200 dark:border-zinc-700"
      )}
      data-testid={`rule-${rule.id}`}
    >
      <button
        type="button"
        className="mt-2 cursor-grab text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 touch-none"
        aria-label="Drag to reorder"
        {...attributes}
        {...listeners}
      >
        ⋮⋮
      </button>

      <div className="flex flex-1 flex-wrap gap-2 min-w-0">
        <select
          className="h-9 min-w-[120px] flex-1 rounded-lg border border-zinc-300 bg-white px-2 text-sm dark:border-zinc-600 dark:bg-zinc-900"
          value={rule.field}
          onChange={(e) => updateRule({ field: e.target.value })}
          aria-label="Field"
        >
          <option value="">Field…</option>
          {schema.fields.map((f) => (
            <option key={f.name} value={f.name}>
              {f.label ?? f.name}
            </option>
          ))}
        </select>

        <select
          className="h-9 min-w-[130px] flex-1 rounded-lg border border-zinc-300 bg-white px-2 text-sm dark:border-zinc-600 dark:bg-zinc-900"
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

        <div className="min-w-[140px] flex-[2]">
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
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        aria-label="Remove rule"
        className="shrink-0"
      >
        ✕
      </Button>

      {issues.length > 0 && (
        <ul className="w-full text-xs text-red-600 dark:text-red-400">
          {issues.map((i, idx) => (
            <li key={idx}>{i.message}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export const RuleRow = memo(RuleRowComponent);
