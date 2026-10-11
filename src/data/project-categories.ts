export const PROJECT_CATEGORIES = [
  { value: "ia", label: "IA" },
  { value: "data-science", label: "Data Science" },
  { value: "data-engineering", label: "Data Engineering" },
  { value: "data-analyst", label: "Data Analyst" },
  { value: "web-app", label: "Dev Web & App" },
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number]["value"];

export const categoryLabel = (value: string): string =>
  PROJECT_CATEGORIES.find((c) => c.value === value)?.label ?? value;

const chip = "bg-card text-foreground border-border";

export const categoryColors: Record<string, string> = {
  ia: chip,
  "data-science": chip,
  "data-engineering": chip,
  "data-analyst": chip,
  "web-app": chip,
};
