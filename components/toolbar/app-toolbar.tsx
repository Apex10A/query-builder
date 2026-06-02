"use client";

import { useCallback, useRef, useState } from "react";
import { useQueryStore } from "@/lib/store/query-store";
import { createInitialRoot } from "@/lib/utils/tree";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export function AppToolbar() {
  const theme = useQueryStore((s) => s.theme);
  const setTheme = useQueryStore((s) => s.setTheme);
  const pushHistory = useQueryStore((s) => s.pushHistory);
  const restoreHistory = useQueryStore((s) => s.restoreHistory);
  const history = useQueryStore((s) => s.history);
  const presets = useQueryStore((s) => s.presets);
  const savePreset = useQueryStore((s) => s.savePreset);
  const loadPreset = useQueryStore((s) => s.loadPreset);
  const deletePreset = useQueryStore((s) => s.deletePreset);
  const exportJson = useQueryStore((s) => s.exportJson);
  const importJson = useQueryStore((s) => s.importJson);
  const setRoot = useQueryStore((s) => s.setRoot);

  const fileRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [presetName, setPresetName] = useState("");

  const cycleTheme = useCallback(() => {
    const order: Array<"light" | "dark" | "system"> = ["light", "dark", "system"];
    const idx = order.indexOf(theme);
    setTheme(order[(idx + 1) % order.length]);
  }, [theme, setTheme]);

  const handleExport = useCallback(() => {
    const json = exportJson();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `query-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [exportJson]);

  const handleImport = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          importJson(String(reader.result));
          setImportError(null);
        } catch (e) {
          setImportError(e instanceof Error ? e.message : "Import failed");
        }
      };
      reader.readAsText(file);
    },
    [importJson]
  );

  const handleSavePreset = useCallback(() => {
    const name = presetName.trim() || `Preset ${presets.length + 1}`;
    savePreset(name);
    setPresetName("");
  }, [presetName, presets.length, savePreset]);

  const selectClass = "qb-select h-8 max-w-[140px] text-xs";

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-elevated)_85%,transparent)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-3 lg:px-8">
        <div className="mr-auto flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-muted)] font-mono text-sm font-bold text-[var(--accent)]"
            aria-hidden
          >
            Q
          </div>
          <div>
            <h1 className="font-display text-lg font-bold tracking-tight sm:text-xl">
              Query Atelier
            </h1>
            <p className="hidden text-[0.65rem] tracking-wide text-[var(--fg-subtle)] sm:block">
              Visual filter composer
            </p>
          </div>
        </div>

        <Button size="sm" variant="secondary" onClick={() => pushHistory()}>
          Snapshot
        </Button>

        {history.length > 0 && (
          <select
            className={selectClass}
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) restoreHistory(e.target.value);
              e.target.value = "";
            }}
            aria-label="Query history"
          >
            <option value="">History…</option>
            {history.map((h) => (
              <option key={h.id} value={h.id}>
                {h.label}
              </option>
            ))}
          </select>
        )}

        <input
          type="text"
          placeholder="Preset name"
          value={presetName}
          onChange={(e) => setPresetName(e.target.value)}
          className="qb-input h-8 w-28 text-xs sm:w-32"
        />
        <Button size="sm" variant="secondary" onClick={handleSavePreset}>
          Save
        </Button>

        {presets.length > 0 && (
          <select
            className={cn(selectClass, "max-w-[120px]")}
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) loadPreset(e.target.value);
              e.target.value = "";
            }}
          >
            <option value="">Presets…</option>
            {presets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        )}

        {presets.length > 0 && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              const last = presets[presets.length - 1];
              if (last) deletePreset(last.id);
            }}
            title="Delete last preset"
          >
            Del
          </Button>
        )}

        <Button size="sm" variant="secondary" onClick={handleExport}>
          Export
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => fileRef.current?.click()}
        >
          Import
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleImport(f);
            e.target.value = "";
          }}
        />

        <Button
          size="sm"
          variant="ghost"
          onClick={() => setRoot(createInitialRoot())}
          title="Reset query (Ctrl+Shift+R)"
        >
          Reset
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={cycleTheme}
          title="Toggle theme"
          className="font-mono text-base"
        >
          {theme === "dark" ? "◐" : theme === "light" ? "○" : "◎"}
        </Button>
      </div>
      {importError && (
        <p className="px-6 pb-2 text-xs text-[var(--danger)]">{importError}</p>
      )}
    </header>
  );
}
