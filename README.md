# Visual Query Builder

An interactive visual query builder built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**. Construct nested filter logic visually, preview SQL/MongoDB/GraphQL output in real time, and run queries against a mock dataset.

## Live demo

Deploy via [Vercel](https://vercel.com): import this repository (no subdirectory config needed).

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run test    # Vitest unit & component tests
npm run build   # Production build
```

## Features

| Area | Implementation |
|------|----------------|
| Rule builder | Field / operator / value rows with schema-aware inputs |
| Nested groups | Unlimited depth, AND/OR, collapsible, drag-and-drop reorder |
| Schema-driven UI | Per-type operators, enums, dates, numbers, booleans |
| Live preview | SQL, MongoDB filter JSON, GraphQL-style filters |
| Execution simulator | Mock users/orders datasets, pagination, sorting |
| Validation | Operator/type rules, empty groups, regex & range checks |
| Advanced UX | DnD, keyboard shortcuts, history, presets, import/export, themes |

### Keyboard shortcuts

- **Ctrl+S** — save query snapshot to history  
- **Ctrl+E** — copy export JSON to clipboard  
- **Ctrl+Shift+R** — reset query tree  

## Architecture

### Folder structure

```
├── app/                 # Next.js App Router pages
├── components/
│   ├── query-builder/   # Recursive ConditionGroup + RuleRow
│   ├── preview/         # Live query preview
│   ├── results/         # Simulator & table
│   └── toolbar/         # History, presets, import/export, theme
├── lib/
│   ├── types/           # QueryNode, schema, validation types
│   ├── engine/          # Generators, validation, executor
│   ├── store/           # Zustand normalized state
│   ├── schema/          # Data source definitions
│   ├── data/            # Mock datasets
│   └── utils/           # Immutable tree helpers, import/export
└── hooks/               # Global keyboard shortcuts
```

### Recursive rendering strategy

The query tree is a **discriminated union** (`QueryRule | QueryGroup`). `ConditionGroup` renders itself recursively for each child group while `RuleRow` handles leaf nodes. Each node is keyed by stable `id` (nanoid) to minimize reconciliation churn. Groups own a local `@dnd-kit` context for sortable children only (isolated DnD scope per group).

### State management

**Zustand** holds:

- `schemaId` + immutable `QueryRoot` tree  
- Derived `validationIssues` recomputed on every `setRoot`  
- Persisted history, presets, theme, preview format  

Tree mutations go through pure helpers in `lib/utils/tree.ts` (`cloneRoot`, `updateNodeInTree`, `reorderChildren`, etc.) so updates stay predictable and testable.

### Query engine

| Module | Role |
|--------|------|
| `operators.ts` | Maps field types → allowed operators |
| `validation.ts` | Walks tree, surfaces per-node errors |
| `sql-generator.ts` | Parameterized-style SQL strings (escaped literals) |
| `mongo-generator.ts` | `$and` / `$or` filter documents |
| `graphql-generator.ts` | Nested `_and` / `_or` filter shape |
| `executor.ts` | Evaluates tree against in-memory mock records |

### Performance techniques

- `memo()` on `RuleRow`, `ConditionGroup`, panels  
- Selective Zustand selectors (`useQueryStore(s => s.root)`)  
- Immutable tree updates (structural sharing via clone + patch)  
- DnD scoped per group (smaller sortable lists)  
- Preview computed with `useMemo` from root + format  

### Trade-offs

- **Client-only execution** — fast iteration for the challenge; swap `executor.ts` for an API route in production.  
- **JSON clone for immutability** — simple and sufficient for UI-scale trees; use a structural library if trees become huge.  
- **SQL dialect** — generic SQL-like strings, not engine-specific.  

## Git workflow (challenge requirement)

Use feature branches and PRs into `main` (minimum **7 PRs**). Suggested split:

1. Core types, tree utils, operators  
2. Validation + query generators  
3. Zustand store + mock data  
4. Recursive query builder UI  
5. Preview, results simulator, toolbar  
6. DnD, keyboard shortcuts, theme, import/export  
7. Tests, README, Vercel deployment  

## Testing

Vitest + React Testing Library cover:

- SQL generation (including nested OR/AND)  
- Validation rules  
- Executor filtering  
- Tree CRUD utilities  
- Safe import/export  
- `ConditionGroup` render smoke test  

## Security

- SQL string literals escaped (`'` → `''`)  
- Import validates version, depth, and node shapes  
- Max tree depth / node count enforced on import  

## License

MIT
