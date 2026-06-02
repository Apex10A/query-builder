"use client";

import { useCallback, useRef, useState } from "react";
import { useQueryStore } from "@/lib/store/query-store";
import { createInitialRoot } from "@/lib/utils/tree";
import { Button } from "@/components/ui/button";

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

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-3">
        <h1 className="mr-auto text-base font-bold tracking-tight sm:text-lg">
          Visual Query Builder
        </h1>

        <Button size="sm" variant="secondary" onClick={() => pushHistory()}>
          Save snapshot
        </Button>

        {history.length > 0 && (
          <select
            className="h-8 max-w-[140px] rounded-lg border border-zinc-300 bg-white px-2 text-xs dark:border-zinc-600 dark:bg-zinc-900"
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
          className="h-8 w-24 rounded-lg border border-zinc-300 px-2 text-xs dark:border-zinc-600 dark:bg-zinc-900 sm:w-32"
        />
        <Button size="sm" variant="secondary" onClick={handleSavePreset}>
          Save preset
        </Button>

        {presets.length > 0 && (
          <select
            className="h-8 max-w-[120px] rounded-lg border border-zinc-300 bg-white px-2 text-xs dark:border-zinc-600 dark:bg-zinc-900"
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
            Del preset
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

        <Button size="sm" variant="ghost" onClick={cycleTheme} title="Toggle theme">
          {theme === "dark" ? "🌙" : theme === "light" ? "☀️" : "◐"}
        </Button>
      </div>
      {importError && (
        <p className="px-4 pb-2 text-xs text-red-600">{importError}</p>
      )}
    </header>
  );
}
