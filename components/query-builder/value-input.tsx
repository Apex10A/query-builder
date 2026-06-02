"use client";

import { memo } from "react";
import type { SchemaField, QueryOperator } from "@/lib/types/query";
import {
  operatorNeedsArray,
  operatorNeedsRange,
  operatorNeedsValue,
} from "@/lib/engine/operators";
import { cn } from "@/lib/utils/cn";

interface ValueInputProps {
  field: SchemaField | undefined;
  operator: QueryOperator;
  value: unknown;
  valueTo?: unknown;
  onChange: (value: unknown) => void;
  onChangeTo?: (value: unknown) => void;
  hasError?: boolean;
}

function ValueInputComponent({
  field,
  operator,
  value,
  valueTo,
  onChange,
  onChangeTo,
  hasError,
}: ValueInputProps) {
  if (!operatorNeedsValue(operator)) {
    return (
      <span className="px-2 font-mono text-xs italic text-[var(--fg-subtle)]">
        ∅ no value
      </span>
    );
  }

  const inputClass = cn("lantern-input", hasError && "lantern-input-error");

  if (!field) {
    return (
      <input
        className={inputClass}
        placeholder="Select a field first"
        disabled
      />
    );
  }

  if (operatorNeedsRange(operator)) {
    return (
      <div className="flex min-w-0 w-full flex-wrap items-center gap-2 sm:flex-nowrap">
        <FieldTypedInput
          field={field}
          operator={operator}
          value={value}
          onChange={onChange}
          className={cn(inputClass, "min-w-0 flex-1")}
          placeholder="From"
        />
        <span className="shrink-0 text-xs text-[var(--fg-muted)]">to</span>
        <FieldTypedInput
          field={field}
          operator={operator}
          value={valueTo}
          onChange={onChangeTo ?? (() => {})}
          className={cn(inputClass, "min-w-0 flex-1")}
          placeholder="To"
        />
      </div>
    );
  }

  if (operatorNeedsArray(operator)) {
    return (
      <input
        className={inputClass}
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
        placeholder="ada, grace, alan (comma-separated)"
      />
    );
  }

  return (
    <FieldTypedInput
      field={field}
      operator={operator}
      value={value}
      onChange={onChange}
      className={inputClass}
    />
  );
}

function FieldTypedInput({
  field,
  operator,
  value,
  onChange,
  className,
  placeholder,
}: {
  field: SchemaField;
  operator: QueryOperator;
  value: unknown;
  onChange: (v: unknown) => void;
  className: string;
  placeholder?: string;
}) {
  if (field.type === "enum" && field.enumValues) {
    return (
      <select
        className={className}
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select…</option>
        {field.enumValues.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "boolean") {
    return (
      <select
        className={className}
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value === "true")}
      >
        <option value="">Select…</option>
        <option value="true">True</option>
        <option value="false">False</option>
      </select>
    );
  }

  if (field.type === "date") {
    return (
      <input
        type="date"
        className={className}
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  if (field.type === "number") {
    return (
      <input
        type="number"
        className={className}
        value={value === "" || value === undefined ? "" : String(value)}
        onChange={(e) =>
          onChange(e.target.value === "" ? "" : Number(e.target.value))
        }
        placeholder={placeholder ?? "Value"}
      />
    );
  }

  return (
    <input
      type="text"
      className={className}
      value={String(value ?? "")}
      onChange={(e) => onChange(e.target.value)}
      placeholder={
        operator === "regex"
          ? "Pattern…"
          : placeholder ?? "Value"
      }
    />
  );
}

export const ValueInput = memo(ValueInputComponent);
