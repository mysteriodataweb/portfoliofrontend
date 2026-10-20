import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Github, Linkedin, Pencil, Save, Twitter, X } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import ScrollRevealText from "@/components/ScrollRevealText";
import { useAdmin } from "@/contexts/AdminContext";
import { usePublicProfile } from "@/hooks/use-public-profile";
import { useUpdateProfile } from "@/hooks/use-admin-profile";
import { useCVData } from "@/hooks/use-admin-cv";
import { useStats } from "@/hooks/use-stats";
import { activitiesSection, engagementChapters } from "@/data/engagements";
import { internship } from "@/data/availability";
import { toast } from "sonner";
import profilePhoto from "@/assets/profile-photo.jpg";

const MANIFESTO =
  "Un modèle qui reste dans un notebook n'aide personne. Ce qui m'intéresse vient après : l'API, l'interface, et la personne qui s'en sert un lundi matin.";

const SEED_BIO =
  "Passionné par la data science et le développement web, je crée des solutions innovantes alliant IA et performance.";

const FALLBACK_BIO = [
  "Je suis Data & AI Engineer, en dernière année d'études. Concrètement, je construis toute la chaîne : collecter et nettoyer les données, entraîner un modèle ou brancher un LLM, puis livrer l'API et l'interface qui le rendent utilisable par quelqu'un d'autre que moi.",
  "Ce profil est un choix. Un modèle n'existe vraiment que lorsqu'il tourne en production et qu'une personne s'en sert, alors j'ai appris à construire la suite plutôt que de m'arrêter au notebook.",
  "Je suis basé à Casablanca, mobile et ouvert au télétravail. Je conçois des outils sobres, qui tiennent avec une connexion moyenne et répondent à un besoin que j'ai pu observer.",
  `Je cherche un stage de fin d'études de ${internship.duration} à partir de ${internship.start}, avec une embauche possible ensuite, et j'accepte des missions freelance. Le reste du temps, j'écris ce que j'apprends, je participe à des compétitions et j'accompagne des étudiants qui débutent.`,
];

const motivations = [
  {
    title: "Des systèmes qui apprennent",
    desc: "Entraîner un modèle, comprendre pourquoi il se trompe, recommencer. Je ne m'en lasse pas.",
  },
  {
    title: "Des décisions mieux informées",
    desc: "Une bonne analyse change une décision. Sinon, ce n'est qu'un joli graphique.",
  },
  {
    title: "Des outils pensés pour ici",
    desc: "Connexion instable, téléphones modestes, usages réels : je conçois pour le terrain que je connais.",
  },
  {
    title: "Quelqu'un qui s'en sert",
    desc: "Je juge un projet à ce qu'il change pour la personne qui l'utilise, pas à sa technique.",
  },
];

const workflow = [
  {
    title: "Comprendre",
    desc: "Je reformule le problème avec la personne qui le vit. Souvent, le vrai sujet n'est pas celui du brief.",
  },
  {
    title: "Explorer",
    desc: "Je regarde les données avant de choisir un modèle, et je prototype deux ou trois pistes.",
  },
  {
    title: "Construire",
    desc: "Une architecture simple, et du code que quelqu'un d'autre pourra reprendre.",
  },
  {
    title: "Tester",
    desc: "Je mesure, je montre tôt, et j'observe ce que les premiers utilisateurs en font.",
  },
  {
    title: "Améliorer",
    desc: "Une mise en ligne est un début. J'itère à partir de l'usage réel.",
  },
];

const plural = (n: number, one: string, many: string) => (n > 1 ? many : one);

const AboutPage = () => {
  const { isAdmin } = useAdmin();
  const { data: profile } = usePublicProfile();
  const { data: cv } = useCVData();
  const { data: stats } = useStats();
  const updateProfile = useUpdateProfile();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ full_name: "", title: "", bio: "", photo: "" });

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.fullName || "",
        title: profile.title || "",
        bio: profile.bio && profile.bio !== SEED_BIO ? profile.bio : FALLBACK_BIO.join("\n\n"),
        photo: profile.photo || "",
      });
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync({
        fullName: form.full_name,
        title: form.title,
        bio: form.bio,
        photo: form.photo,
      });
      toast.success("Profil mis à jour !");
      setEditing(false);
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  // The database still holds the one-line bio it was seeded with; until it is edited, show the full text.
  const hasOwnBio = Boolean(profile?.bio) && profile?.bio !== SEED_BIO;
  const bioParagraphs = hasOwnBio ? profile!.bio.split(/\n\s*\n/).filter(Boolean) : FALLBACK_BIO;
  const cvSections = cv?.sections?.filter((s) => s.items?.length > 0) ?? [];

  const figures = stats
    ? [
        { value: stats.yearsExperience, label: plural(stats.yearsExperience, "an d'expérience", "ans d'expérience") },
        { value: stats.projectsCount, label: plural(stats.projectsCount, "projet réalisé", "projets réalisés") },
        { value: stats.articlesCount, label: plural(stats.articlesCount, "article publié", "articles publiés") },
        { value: stats.clientsCount, label: plural(stats.clientsCount, "client accompagné", "clients accompagnés") },
      ].filter((f) => f.value > 0)
    : [];

  const socials = [
    { label: "GitHub", href: profile?.github || "https://github.com/mysteriodataweb", icon: Github },
    { label: "LinkedIn", href: profile?.linkedin || "https://www.linkedin.com/in/alfredbiam", icon: Linkedin },
    { label: "Twitter / X", href: profile?.twitter, icon: Twitter },
  ].filter((s) => s.href);

  return (
    <>
      {/* Ouverture */}
      <section className="container mx-auto px-6 pt-12 md:pt-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <h1 className="text-3xl font-normal text-foreground">
              Je fais passer la donnée et l'IA du notebook à la production.
            </h1>
            <p className="mt-8 text-lg text-muted-foreground">
              {profile?.fullName || "Alfred BIAM"}
              <span className="mx-2 text-foreground/25">/</span>
              {profile?.title || "Data & AI Engineer"}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {socials.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="rounded-md bg-foreground/5 p-2.5 text-foreground transition-colors hover:bg-foreground hover:text-background"
                >
                  <Icon size={18} />
                </a>
              ))}
              {isAdmin && !editing && (
                <button onClick={() => setEditing(true)} className="pill-btn-outline !px-5 !py-2 text-sm">
                  <Pencil className="mr-2 h-4 w-4" /> Modifier le profil
                </button>
              )}
            </div>
          </div>
          <div className="md:col-span-4">
            {editing ? (
              <div className="space-y-2">
                <label className="text-sm font-medium">Photo de profil</label>
                <ImageUpload value={form.photo} onChange={(url) => setForm({ ...form, photo: url })} />
              </div>
            ) : (
              <img
                src={profile?.photo || profilePhoto}
                alt={profile?.fullName || "Alfred BIAM"}
                className="aspect-[4/5] w-full max-w-sm rounded-none object-cover md:ml-auto"
              />
            )}
          </div>
        </div>
      </section>

      {/* Manifeste */}
      <section className="container mx-auto px-6 py-24 md:py-40">
        <ScrollRevealText
          text={MANIFESTO}
          className="max-w-[34ch] text-[clamp(1.5rem,3vw,2.5rem)] font-normal leading-[1.25] tracking-tight text-foreground"
        />
      </section>

      {/* Biographie */}
      <section className="container mx-auto grid grid-cols-1 gap-8 px-6 pb-24 md:grid-cols-12">
        <h2 className="text-2xl font-normal text-foreground md:col-span-4">
          Qui je suis
        </h2>
        <div className="md:col-span-8">
          {editing ? (
            <div className="space-y-4">
              <label className="text-sm font-medium" htmlFor="bio">
                Biographie (une ligne vide sépare deux paragraphes)
              </label>
              <textarea
                id="bio"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="h-64 w-full rounded-none border border-border bg-white px-4 py-3 text-foreground"
              />
              <div className="flex gap-2">
                <button onClick={handleSave} disabled={updateProfile.isPending} className="pill-btn text-sm">
                  <Save className="mr-2 h-4 w-4" /> Enregistrer
                </button>
                <button onClick={() => setEditing(false)} className="pill-btn-outline text-sm">
                  <X className="mr-2 h-4 w-4" /> Annuler
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-[64ch] space-y-6">
              {bioParagraphs.map((p, i) => (
                <p key={i} className="text-lg leading-[1.75] text-foreground/80">
                  {p}
                </p>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Ce qui me fait avancer */}
      <section className="container mx-auto px-6 pb-24">
        <h2 className="text-2xl font-normal text-foreground">
          Ce qui me fait avancer
        </h2>
        <dl className="mt-10">
          {motivations.map((m) => (
            <div
              key={m.title}
              className="grid grid-cols-1 gap-2 border-t border-foreground/15 py-7 md:grid-cols-12 md:gap-8"
            >
              <dt className="text-lg font-semibold text-foreground md:col-span-6">
                {m.title}
              </dt>
              <dd className="max-w-[48ch] text-lg leading-relaxed text-muted-foreground md:col-span-6">{m.desc}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Parcours */}
      {cvSections.length > 0 && (
        <section className="container mx-auto px-6 pb-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-2xl font-normal text-foreground">Mon parcours</h2>
            <Link to="/cv" className="link-arrow">
              Voir le CV complet <ArrowRight size={16} />
            </Link>
          </div>
          {cvSections.map((section) => (
            <div key={section.id} className="mt-12">
              <h3 className="font-heading text-xl font-semibold text-foreground">{section.title}</h3>
              <ol className="mt-4">
                {section.items.map((item) => (
                  <li
                    key={item.id}
                    className="grid grid-cols-1 gap-2 border-t border-foreground/15 py-6 md:grid-cols-12 md:gap-8"
                  >
                    <p className="text-sm tabular-nums text-muted-foreground md:col-span-3 md:pt-1">
                      {item.date_start}
                      {item.date_end ? ` – ${item.date_end}` : ""}
                    </p>
                    <div className="md:col-span-9">
                      <h4 className="font-heading text-xl font-semibold text-foreground">{item.title}</h4>
                      {item.subtitle && <p className="text-foreground">{item.subtitle}</p>}
                      {item.description && (
                        <p className="mt-2 max-w-[64ch] leading-relaxed text-muted-foreground">{item.description}</p>
                      )}
                      {item.highlights?.length > 0 && (
                        <ul className="mt-3 max-w-[64ch] list-disc space-y-1 pl-5 text-muted-foreground marker:text-foreground">
                          {item.highlights.map((h, j) => (
                            <li key={j}>{h}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </section>
      )}

      {/* Méthode */}
      <section className="bg-foreground text-background">
        <div className="container mx-auto px-6 py-24">
          <h2 className="text-2xl font-normal">
            Cinq étapes, toujours dans cet ordre.
          </h2>
          <ol className="mt-12">
            {workflow.map((step, i) => (
              <li
                key={step.title}
                className="grid grid-cols-[3rem_1fr] gap-x-4 gap-y-1 border-t border-background/15 py-6 md:grid-cols-12 md:gap-8"
              >
                <span className="font-mono text-sm tabular-nums text-background/60 md:col-span-1">
                  {i + 1}
                </span>
                <h3 className="text-lg font-semibold md:col-span-4">
                  {step.title}
                </h3>
                <p className="col-start-2 max-w-[48ch] text-lg leading-relaxed text-background/70 md:col-span-7 md:col-start-auto">
                  {step.desc}
                </p>
              </li>
            ))}
          </ol>

          {figures.length > 0 && (
            <dl className="mt-20 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-background/15 pt-12 md:grid-cols-4">
              {figures.map((f) => (
                <div key={f.label} className="flex flex-col-reverse">
                  <dt className="mt-1 text-background/70">{f.label}</dt>
                  <dd className="text-3xl font-medium tabular-nums">
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </section>

      {/* Hors du code */}
      <section className="container mx-auto px-6 py-24">
        <h2 className="text-2xl font-normal text-foreground">Hors du code</h2>
        <ul className="mt-10">
          {[
            ...engagementChapters.map((c) => ({ ...c, path: `/engagements/${c.slug}` })),
            { ...activitiesSection, slug: "hors-ecran" },
          ].map((chapter) => (
            <li key={chapter.slug}>
              <Link
                to={chapter.path}
                className="group grid grid-cols-1 gap-2 border-t border-foreground/15 py-7 md:grid-cols-12 md:items-baseline md:gap-8"
              >
                <span className="text-lg font-semibold text-foreground transition-colors group-hover:underline md:col-span-5">
                  {chapter.title}
                </span>
                <span className="max-w-[48ch] text-lg leading-relaxed text-muted-foreground md:col-span-6">
                  {chapter.pitch}
                </span>
                <ArrowUpRight className="hidden h-6 w-6 justify-self-end text-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 md:col-span-1 md:block" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Suite */}
      <section className="container mx-auto px-6 pb-24">
        <div className="flex flex-col gap-8 border-t border-foreground/15 pt-12 md:flex-row md:items-end md:justify-between">
          <p className="max-w-[30ch] text-2xl md:text-3xl font-normal tracking-tight text-foreground">
            Un projet data, IA ou web en tête ?
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link to="/contact" className="pill-btn">
              Me contacter
            </Link>
            <Link to="/projets" className="pill-btn-outline">
              Voir mes projets
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
