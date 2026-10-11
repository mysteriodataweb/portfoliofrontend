import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Link } from "lucide-react";
import { api } from "@/api/client";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  className?: string;
}

const ImageUpload = ({ value, onChange, className = "" }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState<"upload" | "url">(value.startsWith("http") ? "url" : "upload");
  const [urlInput, setUrlInput] = useState(value.startsWith("http") ? value : "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    try {
      const result = await api.upload<{ url: string }>("/admin/upload/image", formData);
      onChange(result.url);
      toast.success("Image uploadée !");
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      toast.success("URL enregistrée !");
    }
  };

  const handleRemove = () => {
    onChange("");
    setUrlInput("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
            mode === "upload"
              ? "bg-foreground text-white"
              : "bg-foreground/10 text-muted-foreground hover:text-[#171717]"
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          Upload
        </button>
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
            mode === "url"
              ? "bg-foreground text-white"
              : "bg-foreground/10 text-muted-foreground hover:text-[#171717]"
          }`}
        >
          <Link className="w-3.5 h-3.5" />
          URL
        </button>
        {value && (
          <button
            type="button"
            onClick={handleRemove}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Supprimer
          </button>
        )}
      </div>

      {/* Preview */}
      {value && (
        <div className="relative group">
          <img
            src={value}
            alt="Preview"
            className="w-full h-32 object-cover rounded-lg border border-border"
          />
        </div>
      )}

      {/* Upload mode */}
      {mode === "upload" && !value && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleUpload}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-[#E07B39] transition-colors"
          >
            {uploading ? (
              <div className="text-sm text-muted-foreground">Upload en cours...</div>
            ) : (
              <>
                <ImageIcon className="w-8 h-8 mb-2 text-muted-foreground/50" />
                <span className="text-sm text-muted-foreground">Cliquer pour ajouter une image</span>
                <span className="text-xs text-muted-foreground/60 mt-1">JPG, PNG, GIF, WebP (max 5MB)</span>
              </>
            )}
          </label>
        </div>
      )}

      {/* URL mode */}
      {mode === "url" && !value && (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 h-10 px-3 rounded-lg border border-border bg-white text-[#171717] placeholder:text-muted-foreground/50 focus:border-[#E07B39] focus:ring-2 focus:ring-[#E07B39]/10 transition-all outline-none text-sm"
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            disabled={!urlInput.trim()}
            className="px-4 py-2 bg-foreground text-white text-sm font-medium rounded-lg hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Valider
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
