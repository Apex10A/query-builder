export interface DocLink {
  title: string;
  href: string;
  description?: string;
}

export const DOC_LINKS: DocLink[] = [
  {
    title: "Introduction",
    href: "/docs",
    description: "What Lantern is and how it works",
  },
  {
    title: "Getting started",
    href: "/docs/getting-started",
    description: "Your first query in five minutes",
  },
  {
    title: "Query builder",
    href: "/docs/builder-guide",
    description: "Conditions, groups, and operators",
  },
  {
    title: "Validation",
    href: "/docs/validation",
    description: "When a query is valid or blocked",
  },
  {
    title: "Import & export",
    href: "/docs/import-export",
    description: "Save and share query JSON",
  },
  {
    title: "Keyboard shortcuts",
    href: "/docs/shortcuts",
    description: "Speed up your workflow",
  },
];
