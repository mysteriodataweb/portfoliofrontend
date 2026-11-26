import { describe, it, expect } from "vitest";
import { extractHeadings } from "@/lib/markdown";

describe("extractHeadings", () => {
  it("lists the level-2 headings with their line, in plain text", () => {
    const text = "Intro\n\n## Les **données**\n\nTexte\n\n### Détail\n\n## Le `modèle` et [l'API](https://x.dev)";
    expect(extractHeadings(text)).toEqual([
      { id: "section-1", text: "Les données", line: 3 },
      { id: "section-2", text: "Le modèle et l'API", line: 9 },
    ]);
  });

  it("ignores what looks like a heading inside a code block", () => {
    const text = "## Avant\n\n```python\n## un commentaire\nprint(1)\n```\n\n~~~\n## encore du code\n~~~\n\n## Après";
    expect(extractHeadings(text).map((h) => h.text)).toEqual(["Avant", "Après"]);
  });

  it("keeps a block open until a long enough fence closes it", () => {
    const text = "````md\n```\n## dans l'exemple\n```\n````\n\n## Vrai titre";
    expect(extractHeadings(text).map((h) => h.text)).toEqual(["Vrai titre"]);
  });
});
