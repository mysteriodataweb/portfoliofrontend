import { lazy, Suspense, useRef, useState } from "react";
import { Code, Eye, ImagePlus, Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/api/client";

const RichContent = lazy(() => import("./RichContent"));

interface MarkdownEditorProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  /** Height of the text area, as a Tailwind class. */
  heightClass?: string;
  lang?: "fr" | "en";
}

const CODE_PLACEHOLDER = "# Votre code ici";
const CODE_TEMPLATE = `\`\`\`python\n${CODE_PLACEHOLDER}\n\`\`\``;

/**
 * Admin text area for Markdown, with buttons to insert a code block or a screenshot (sent to the image
 * storage, then placed where the cursor is) and a preview of the result as visitors will see it.
 */
const MarkdownEditor = ({ id, value, onChange, heightClass = "h-[300px]", lang }: MarkdownEditorProps) => {
  const area = useRef<HTMLTextAreaElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Puts a block on its own lines at the cursor. The cursor goes after it, or `select` is selected to be typed over.
  const insertBlock = (block: string, select?: string) => {
    const el = area.current;
    // The text as it is now: an image is inserted once its upload ends, and typing may have gone on meanwhile.
    const text = el?.value ?? value;
    const start = el?.selectionStart ?? text.length;
    const end = el?.selectionEnd ?? text.length;
    const before = text.slice(0, start);
    const after = text.slice(end).trim() ? text.slice(end) : "";
    const prefix = before && !before.endsWith("\n\n") ? (before.endsWith("\n") ? "\n" : "\n\n") : "";
    const suffix = !after ? "\n" : after.startsWith("\n\n") ? "" : after.startsWith("\n") ? "\n" : "\n\n";
    onChange(`${before}${prefix}${block}${suffix}${after}`);
    const blockStart = before.length + prefix.length;
    const offset = select ? block.indexOf(select) : -1;
    const [from, to] = offset >= 0 ? [blockStart + offset, blockStart + offset + select!.length] : [blockStart + block.length, blockStart + block.length];
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(from, to);
    });
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);
    try {
      const { url } = await api.upload<{ url: string }>("/admin/upload/image", formData);
      const alt = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").replace(/[[\]]/g, "");
      insertBlock(`![${alt}](${url})`);
      toast.success("Image ajoutée au texte !");
    } catch (err) {
      toast.error(err instanceof Error && err.message ? err.message : "Erreur lors de l'envoi de l'image");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  const button = "inline-flex items-center gap-1.5 border border-border px-2.5 py-1 text-xs font-medium hover:bg-foreground/5 disabled:opacity-50";

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => insertBlock(CODE_TEMPLATE, CODE_PLACEHOLDER)} disabled={preview} className={button}>
          <Code size={14} /> Bloc de code
        </button>
        <button type="button" onClick={() => fileInput.current?.click()} disabled={preview || uploading} className={button}>
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />} Image
        </button>
        <button type="button" onClick={() => setPreview((p) => !p)} aria-pressed={preview} className={`${button} ml-auto`}>
          {preview ? <Pencil size={14} /> : <Eye size={14} />} {preview ? "Modifier" : "Aperçu"}
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="image/png,image/jpeg,image/gif,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadImage(file);
          }}
        />
      </div>
      {preview ? (
        <div className={`${heightClass} overflow-y-auto border border-border bg-background p-4`}>
          {value.trim() ? (
            <Suspense fallback={<p className="text-sm text-muted-foreground">Chargement de l'aperçu…</p>}>
              <RichContent content={value} />
            </Suspense>
          ) : (
            <p className="text-sm text-muted-foreground">Rien à afficher pour l'instant.</p>
          )}
        </div>
      ) : (
        <textarea
          ref={area}
          id={id}
          lang={lang}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${heightClass} w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-foreground`}
        />
      )}
      <p className="mt-1 text-xs text-muted-foreground">
        Markdown : <code>## Titre</code>, <code>**gras**</code>, <code>`code`</code>, listes avec <code>-</code>, liens{" "}
        <code>[texte](https://…)</code>. Bloc de code : ```python puis ``` pour fermer. Image : JPEG, PNG, GIF ou WebP, 5 Mo maximum.
      </p>
    </div>
  );
};

export default MarkdownEditor;
