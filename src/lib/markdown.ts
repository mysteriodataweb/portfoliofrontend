export interface Heading {
  id: string;
  text: string;
  /** Line of the heading in the Markdown text (from 1), which the rendered heading carries too. */
  line: number;
}

// Markup that should not show in the summary: emphasis, inline code, and links reduced to their text.
const plainText = (text: string) =>
  text
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`~]/g, "")
    .trim();

/** The "## " headings of a Markdown text, outside code blocks, for the summary of an article. */
export function extractHeadings(markdown: string): Heading[] {
  const headings: Heading[] = [];
  let fence: string | null = null;
  markdown.split("\n").forEach((raw, index) => {
    const line = raw.trimEnd();
    const marker = /^\s{0,3}(`{3,}|~{3,})/.exec(line)?.[1];
    if (marker) {
      // A block opened with ``` closes with a fence of the same character at least as long.
      if (!fence) fence = marker;
      else if (marker[0] === fence[0] && marker.length >= fence.length) fence = null;
      return;
    }
    if (fence) return;
    const match = /^\s{0,3}##\s+(.+?)(?:\s+#+)?$/.exec(line);
    if (match) headings.push({ id: `section-${headings.length + 1}`, text: plainText(match[1]), line: index + 1 });
  });
  return headings;
}
