import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react";
import ActivityMedia from "@/components/engagements/ActivityMedia";
import { useActivities, useDeleteActivity, useSaveActivity } from "@/hooks/use-activities";
import type { Activity, ActivityInput } from "@/hooks/use-activities";
import { useAdmin } from "@/contexts/AdminContext";
import { mediaLabels, parseMedia } from "@/lib/media";
import { activitiesSection } from "@/data/engagements";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

const ALL = "Tout";
const SUGGESTED_CATEGORIES = ["Sport", "Sortie", "Voyage", "Événement"];

const emptyForm: ActivityInput = { mediaUrl: "", title: "", category: "", date: "", description: "" };

const formatDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

const ActivitiesPage = () => {
  const { isAdmin } = useAdmin();
  const { data: activities = [], isLoading, isError } = useActivities();
  const saveActivity = useSaveActivity();
  const deleteActivity = useDeleteActivity();

  const [category, setCategory] = useState(ALL);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | undefined>();
  const [form, setForm] = useState<ActivityInput>(emptyForm);

  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(activities.map((a) => a.category).filter(Boolean) as string[]))],
    [activities],
  );
  const visible = category === ALL ? activities : activities.filter((a) => a.category === category);
  const detected = form.mediaUrl ? parseMedia(form.mediaUrl) : null;

  const openAdd = () => {
    setEditingId(undefined);
    setForm({ ...emptyForm, date: new Date().toISOString().split("T")[0] });
    setShowForm(true);
  };

  const openEdit = (activity: Activity) => {
    setEditingId(activity.id);
    setForm({
      mediaUrl: activity.mediaUrl,
      title: activity.title,
      category: activity.category || "",
      date: activity.date || "",
      description: activity.description || "",
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    try {
      await saveActivity.mutateAsync({ id: editingId, data: form });
      toast.success(editingId ? "Activité mise à jour" : "Activité publiée");
      setShowForm(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "L'enregistrement a échoué");
    }
  };

  const handleDelete = async (activity: Activity) => {
    if (!confirm(`Supprimer « ${activity.title} » ? Cette action est définitive.`)) return;
    try {
      await deleteActivity.mutateAsync(activity.id);
      toast.success("Activité supprimée");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "La suppression a échoué");
    }
  };

  return (
    <section className="container mx-auto px-6 pb-24 pt-12 md:pt-16">
      <Link
        to="/engagements"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={16} /> Tous les engagements
      </Link>
      <div className="mt-8 flex flex-wrap items-start justify-between gap-6">
        <h1 className="text-3xl font-normal text-foreground">
          {activitiesSection.title}
        </h1>
        {isAdmin && (
          <button onClick={openAdd} className="pill-btn shrink-0 text-sm">
            <Plus className="mr-2 h-4 w-4" /> Publier une activité
          </button>
        )}
      </div>
      <p className="mt-6 max-w-[38ch] text-xl md:text-2xl leading-snug text-muted-foreground">{activitiesSection.pitch}</p>

      {categories.length > 2 && (
        <div
          role="group"
          aria-label="Filtrer par catégorie"
          className="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-b border-foreground/15 pb-5"
        >
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={`text-base font-medium transition-colors ${
                category === c
                  ? "text-foreground underline decoration-foreground decoration-2 underline-offset-8"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <p className="mt-16 text-muted-foreground" aria-busy="true">
          Chargement des activités…
        </p>
      ) : visible.length === 0 ? (
        <div className="mt-16 border-t border-foreground/15 pt-10">
          <p className="font-heading text-2xl font-semibold text-foreground">
            {isError && isAdmin
              ? "Le serveur ne renvoie pas encore les activités. Vérifiez que le backend est à jour."
              : "Rien de publié pour le moment."}
          </p>
          {isAdmin && !isError && (
            <p className="mt-2 text-muted-foreground">
              Collez le lien d'une photo ou d'une vidéo pour publier votre première activité.
            </p>
          )}
        </div>
      ) : (
        <div className="mt-12 columns-1 gap-8 sm:columns-2 lg:columns-3">
          {visible.map((activity) => {
            const media = parseMedia(activity.mediaUrl);
            return (
              <article key={activity.id} className="mb-10 break-inside-avoid">
                {media && <ActivityMedia media={media} title={activity.title} onOpenImage={setLightbox} />}
                <p className="mt-4 flex flex-wrap gap-x-4 text-sm text-muted-foreground">
                  {activity.category && <span className="font-medium text-foreground">{activity.category}</span>}
                  {activity.date && <time dateTime={activity.date}>{formatDate(activity.date)}</time>}
                </p>
                <h2 className="text-2xl font-normal mt-1 text-foreground">
                  {activity.title}
                </h2>
                {activity.description && (
                  <p className="mt-2 leading-relaxed text-muted-foreground">{activity.description}</p>
                )}
                {isAdmin && (
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEdit(activity)}>
                      <Pencil size={14} className="mr-1.5" /> Modifier
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(activity)}>
                      <Trash2 size={14} className="mr-1.5" /> Supprimer
                    </Button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* Photo en grand */}
      <Dialog open={lightbox !== null} onOpenChange={(open) => !open && setLightbox(null)}>
        <DialogContent className="max-w-5xl border-0 bg-transparent p-0 shadow-none">
          <DialogHeader className="sr-only">
            <DialogTitle>Photo agrandie</DialogTitle>
          </DialogHeader>
          {lightbox && <img src={lightbox} alt="" className="max-h-[85vh] w-full rounded-none object-contain" />}
        </DialogContent>
      </Dialog>

      {/* Publier / modifier */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-h-[85vh] max-w-xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Modifier l'activité" : "Publier une activité"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label htmlFor="activity-url" className="text-sm font-medium">
                Lien de la photo ou de la vidéo *
              </label>
              <Input
                id="activity-url"
                type="url"
                placeholder="https://…"
                value={form.mediaUrl}
                onChange={(e) => setForm({ ...form, mediaUrl: e.target.value })}
              />
              <p className="mt-1.5 text-sm text-muted-foreground" aria-live="polite">
                {!form.mediaUrl
                  ? "YouTube, Vimeo, Instagram, TikTok, Google Drive, ou un lien direct vers une image ou une vidéo."
                  : !detected
                    ? "Ce lien n'est pas valide. Il doit commencer par https://"
                    : detected.kind === "embed"
                      ? `Reconnu : ${detected.provider}`
                      : detected.kind === "unknown"
                        ? "Type non reconnu : affiché comme photo si possible, sinon comme lien."
                        : `Reconnu : ${mediaLabels[detected.kind]}`}
              </p>
            </div>
            <div>
              <label htmlFor="activity-title" className="text-sm font-medium">
                Titre *
              </label>
              <Input
                id="activity-title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="activity-category" className="text-sm font-medium">
                  Catégorie
                </label>
                <Input
                  id="activity-category"
                  list="activity-categories"
                  placeholder="Sport, Sortie…"
                  value={form.category || ""}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                />
                <datalist id="activity-categories">
                  {SUGGESTED_CATEGORIES.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>
              <div>
                <label htmlFor="activity-date" className="text-sm font-medium">
                  Date
                </label>
                <Input
                  id="activity-date"
                  type="date"
                  value={form.date || ""}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label htmlFor="activity-description" className="text-sm font-medium">
                Quelques mots (facultatif)
              </label>
              <textarea
                id="activity-description"
                value={form.description || ""}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="h-24 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={saveActivity.isPending || !detected || !form.title.trim()}>
              {saveActivity.isPending ? "Enregistrement…" : editingId ? "Enregistrer" : "Publier"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ActivitiesPage;
