import { useState } from "react";
import { Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImageUpload from "@/components/ImageUpload";
import type { TimelineEvent } from "@/hooks/use-engagement-data";

interface Props {
  event: TimelineEvent;
  onSave: (event: TimelineEvent) => void;
  onCancel: () => void;
}

export default function EngagementEventEditor({ event, onSave, onCancel }: Props) {
  const [form, setForm] = useState(event);

  return (
    <div className="bg-card border border-border rounded-none p-6">
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground">Date</label>
          <Input
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            placeholder="Ex: Mars 2026 · Abidjan"
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Titre</label>
          <Input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full h-28 px-3 py-2 mt-1 rounded-md border border-border bg-background text-foreground text-sm resize-none"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Image (optionnel)</label>
          <ImageUpload
            value={form.image || ""}
            onChange={(url) => setForm({ ...form, image: url })}
          />
        </div>
        <div className="flex gap-2 pt-2">
          <Button size="sm" onClick={() => onSave(form)}>
            <Save size={14} className="mr-1" /> Enregistrer
          </Button>
          <Button size="sm" variant="outline" onClick={onCancel}>
            <X size={14} className="mr-1" /> Annuler
          </Button>
        </div>
      </div>
    </div>
  );
}
