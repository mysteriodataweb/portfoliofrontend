import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Pencil, Plus, Save } from "lucide-react";
import ScrollReel, { ReelPanel } from "@/components/engagements/ScrollReel";
import EngagementEventEditor from "@/components/EngagementEventEditor";
import NotFound from "@/pages/NotFound";
import { useAdmin } from "@/contexts/AdminContext";
import { useEngagementData } from "@/hooks/use-engagement-data";
import { engagementChapters, getEngagementChapter } from "@/data/engagements";
import type { EngagementChapter } from "@/data/engagements";

const Chapter = ({ chapter }: { chapter: EngagementChapter }) => {
  const { isAdmin } = useAdmin();
  const { data, isEditing, setIsEditing, save, addEvent, updateEvent, removeEvent } =
    useEngagementData(chapter.slug, chapter.defaults);
  const [adding, setAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const position = engagementChapters.findIndex((c) => c.slug === chapter.slug);
  const next = engagementChapters[(position + 1) % engagementChapters.length];
  const editMode = isAdmin && isEditing;

  return (
    <>
      <header className="container mx-auto px-6 pt-12 md:pt-16">
        <Link
          to="/engagements"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={16} /> Tous les engagements
        </Link>
        <h1 className="display-title mt-8 text-foreground">
          {chapter.title}
        </h1>
        <p className="mt-6 max-w-[38ch] text-xl md:text-2xl leading-snug text-muted-foreground">
          {chapter.pitch}
        </p>
      </header>

      {editMode ? (
        <div className="container mx-auto grid grid-cols-1 gap-8 px-6 py-12 md:grid-cols-2">
          {data.events.map((event, i) =>
            editingIndex === i ? (
              <EngagementEventEditor
                key={i}
                event={event}
                onSave={(e) => {
                  updateEvent(i, e);
                  setEditingIndex(null);
                }}
                onCancel={() => setEditingIndex(null)}
              />
            ) : (
              <div key={i} className="[&>article]:w-full">
                <ReelPanel event={event} index={i} />
                <div className="mt-3 flex gap-4 text-sm">
                  <button onClick={() => setEditingIndex(i)} className="text-foreground hover:underline">
                    Modifier
                  </button>
                  <button onClick={() => removeEvent(i)} className="text-destructive hover:underline">
                    Supprimer
                  </button>
                </div>
              </div>
            ),
          )}
          {adding && (
            <EngagementEventEditor
              event={{ date: "", title: "", description: "", image: null }}
              onSave={(e) => {
                addEvent(e);
                setAdding(false);
              }}
              onCancel={() => setAdding(false)}
            />
          )}
        </div>
      ) : (
        <ScrollReel events={data.events} label={chapter.title} />
      )}

      <div className="container mx-auto px-6 pb-24 pt-8">
        <Link
          to={`/engagements/${next.slug}`}
          className="group flex items-end justify-between gap-6 border-t border-foreground/15 pt-8"
        >
          <span>
            <span className="block text-sm text-muted-foreground">Chapitre suivant</span>
            <span className="mt-1 block text-xl font-semibold text-foreground transition-colors group-hover:underline">
              {next.title}
            </span>
          </span>
          <ArrowRight className="mb-2 h-8 w-8 shrink-0 text-foreground transition-transform group-hover:translate-x-2" />
        </Link>
      </div>

      {isAdmin && !isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="fixed bottom-8 right-8 z-50 flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-black"
        >
          <Pencil size={14} /> Modifier les images
        </button>
      )}

      {editMode && (
        <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3">
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-black"
          >
            <Plus size={14} /> Ajouter
          </button>
          <button
            onClick={() => {
              save(data);
              setAdding(false);
              setEditingIndex(null);
            }}
            className="flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-foreground/80"
          >
            <Save size={14} /> Enregistrer
          </button>
        </div>
      )}
    </>
  );
};

const EngagementChapterPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const chapter = getEngagementChapter(slug);
  if (!chapter) return <NotFound />;
  // Keyed so each chapter gets its own stored data and edit state.
  return <Chapter key={chapter.slug} chapter={chapter} />;
};

export default EngagementChapterPage;
