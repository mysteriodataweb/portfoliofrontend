"use client";
import { Pencil, Trash2 } from "lucide-react";
import { useLanguage } from "@/i18n";

export interface SurferTool {
  id: string;
  name: string;
  image: string;
}

interface CollectionSurferProps {
  tools: SurferTool[];
  isAdmin?: boolean;
  onEdit?: (tool: SurferTool) => void;
  onDelete?: (tool: SurferTool) => void;
}

const ToolCard = ({
  tool,
  isAdmin,
  onEdit,
  onDelete,
}: {
  tool: SurferTool;
  isAdmin: boolean;
  onEdit?: (tool: SurferTool) => void;
  onDelete?: (tool: SurferTool) => void;
}) => (
  <div className="group/tool relative w-36 shrink-0">
    <div className="flex flex-col items-center justify-center bg-white border border-border rounded-2xl px-4 py-6 card-hover">
      <img
        src={tool.image}
        alt={tool.name}
        loading="lazy"
        className="w-14 h-14 object-contain"
        onError={(e) => {
          e.currentTarget.src = "/placeholder.svg";
        }}
      />
      <span className="mt-3 text-sm font-medium text-foreground text-center leading-snug">
        {tool.name}
      </span>
    </div>
    {isAdmin && (
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover/tool:opacity-100 transition-opacity z-10">
        <button
          type="button"
          className="p-1.5 rounded-lg bg-foreground text-white shadow hover:bg-foreground/80 transition-colors"
          onClick={() => onEdit?.(tool)}
          title="Modifier"
        >
          <Pencil size={12} />
        </button>
        <button
          type="button"
          className="p-1.5 rounded-lg bg-red-500 text-white shadow hover:bg-red-600 transition-colors"
          onClick={() => onDelete?.(tool)}
          title="Supprimer"
        >
          <Trash2 size={12} />
        </button>
      </div>
    )}
  </div>
);

export default function CollectionSurfer({
  tools,
  isAdmin = false,
  onEdit,
  onDelete,
}: CollectionSurferProps) {
  const { t } = useLanguage();
  if (tools.length === 0) {
    return (
      <div className="flex items-center justify-center border border-dashed border-border rounded-3xl py-16">
        <p className="text-[#6B6B6B] text-sm">
          {isAdmin
            ? "Aucun outil pour le moment. Cliquez sur « Ajouter » pour en créer un."
            : t.skills.noTools}
        </p>
      </div>
    );
  }

  const track = [...tools, ...tools];

  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl border bg-background py-10 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
      aria-label={t.skills.tools}
    >
      <div className="flex gap-6 w-max animate-marquee hover:[animation-play-state:paused] px-6">
        {track.map((tool, i) => (
          <ToolCard
            key={`${tool.id}-${i}`}
            tool={tool}
            isAdmin={isAdmin}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
