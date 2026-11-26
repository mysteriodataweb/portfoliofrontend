import { Children, isValidElement, useMemo, useRef, useState, type ReactNode } from "react";
import Markdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import css from "highlight.js/lib/languages/css";
import dockerfile from "highlight.js/lib/languages/dockerfile";
import go from "highlight.js/lib/languages/go";
import java from "highlight.js/lib/languages/java";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import markdown from "highlight.js/lib/languages/markdown";
import plaintext from "highlight.js/lib/languages/plaintext";
import python from "highlight.js/lib/languages/python";
import r from "highlight.js/lib/languages/r";
import scala from "highlight.js/lib/languages/scala";
import shell from "highlight.js/lib/languages/shell";
import sql from "highlight.js/lib/languages/sql";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import yaml from "highlight.js/lib/languages/yaml";
import { toast } from "sonner";
import { useLanguage } from "@/i18n";
import { extractHeadings } from "@/lib/markdown";

// Languages coloured in code blocks (```python … ```). Any other name still shows, without colours.
// Only these are bundled: the full highlight.js weighs several times more.
const LANGUAGES = { bash, css, dockerfile, go, java, javascript, json, markdown, plaintext, python, r, scala, shell, sql, typescript, xml, yaml };
const ALIASES: Record<string, string[]> = {
  bash: ["sh", "zsh"],
  javascript: ["js", "jsx"],
  markdown: ["md"],
  plaintext: ["text", "txt"],
  python: ["py"],
  shell: ["console"],
  typescript: ["ts", "tsx"],
  xml: ["html"],
  yaml: ["yml"],
};
Object.entries(LANGUAGES).forEach(([name, language]) => hljs.registerLanguage(name, language));
Object.entries(ALIASES).forEach(([name, aliases]) => hljs.registerAliases(aliases, { languageName: name }));

const languageOf = (className?: string) => /language-([\w+-]+)/.exec(className ?? "")?.[1];

const isExternal = (href?: string) => !!href && /^https?:\/\//.test(href);

/** A code block with its language and a button that copies the code. */
const CodeBlock = ({ children }: { children?: ReactNode }) => {
  const { t } = useLanguage();
  const pre = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const code = Children.toArray(children).find(isValidElement) as { props?: { className?: string } } | undefined;
  const language = languageOf(code?.props?.className);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(pre.current?.innerText.replace(/\n$/, "") ?? "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t.common.copyCodeFailed);
    }
  };

  return (
    <div className="code-block">
      <div className="code-block-bar">
        <span>{language ?? t.common.code}</span>
        <button type="button" onClick={copy} aria-live="polite" className="uppercase tracking-widest transition-colors hover:text-dutch-orange">
          {copied ? t.common.codeCopied : t.common.copyCode}
        </button>
      </div>
      <pre ref={pre}>{children}</pre>
    </div>
  );
};

interface RichContentProps {
  content: string;
  className?: string;
}

/**
 * Articles and free-form project pages, written in Markdown: headings, lists, links, tables, images and
 * code blocks. Raw HTML in the text is not rendered and unsafe links are dropped, so the text cannot run scripts.
 */
const RichContent = ({ content, className = "" }: RichContentProps) => {
  // Same ids as the article summary, which reads the headings from the text.
  const headingIds = useMemo(() => new Map(extractHeadings(content).map((h) => [h.line, h.id])), [content]);

  const components: Components = useMemo(
    () => ({
      h2: ({ node, children }) => <h2 id={headingIds.get(node?.position?.start.line ?? -1)}>{children}</h2>,
      a: ({ href, children }) =>
        isExternal(href) ? (
          <a href={href} target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        ) : (
          <a href={href}>{children}</a>
        ),
      // An image with a title ( ![text](link "caption") ) shows the title as its caption.
      img: ({ src, alt, title }) => (
        <span className="rich-figure">
          <img src={typeof src === "string" ? src : undefined} alt={alt ?? ""} loading="lazy" />
          {title && <span className="rich-caption">{title}</span>}
        </span>
      ),
      pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
      // Inline code has no language and stays as it is. highlight.js escapes the code before adding its colour
      // spans, so the HTML it returns holds nothing from the text but escaped characters.
      code: ({ className, children }) => {
        const language = languageOf(className);
        if (!language || !hljs.getLanguage(language)) return <code className={className}>{children}</code>;
        const { value } = hljs.highlight(String(children).replace(/\n$/, ""), { language, ignoreIllegals: true });
        return <code className={className} dangerouslySetInnerHTML={{ __html: value }} />;
      },
      table: ({ children }) => (
        <div className="rich-table">
          <table>{children}</table>
        </div>
      ),
    }),
    [headingIds],
  );

  return (
    <div className={`rich-content ${className}`}>
      <Markdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </Markdown>
    </div>
  );
};

export default RichContent;
