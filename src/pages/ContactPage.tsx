import { useState } from "react";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react";
import { internship } from "@/data/availability";
import AnimatedSection from "@/components/AnimatedSection";
import { toast } from "sonner";
import { useContact } from "@/hooks/use-contact";
import { track } from "@/lib/analytics";
import { getArrival } from "@/lib/attribution";

const ContactPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    website: "",
  });
  const contactMutation = useContact();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const source = getArrival();
    contactMutation.mutate({ ...form, source }, {
      onSuccess: () => {
        track("contact-envoye", source ? { provenance: source } : undefined);
        toast.success(
          "Message envoyé avec succès ! Je vous répondrai rapidement.",
        );
        setForm({ name: "", email: "", subject: "", message: "", website: "" });
      },
      onError: (error) => {
        toast.error(error.message || "Erreur lors de l'envoi du message.");
      },
    });
  };

  return (
    <section className="px-4 pb-24 pt-10 md:px-8 md:pb-32 md:pt-16">
      <div>
        <div className="border-b border-foreground pb-10">
          <p className="eyebrow">(Contact) Une question, un projet, un stage</p>
          <h1 className="display-title mt-4">
            Travaillons <span className="text-dutch-orange">ensemble</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Vous avez un projet ? Une question ? Discutons-en.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-16">
          {/* Form */}
          <AnimatedSection className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block font-mono text-xs font-bold uppercase tracking-widest text-foreground"
                  >
                    Nom *
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    maxLength={100}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="field"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block font-mono text-xs font-bold uppercase tracking-widest text-foreground"
                  >
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    maxLength={254}
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="field"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block font-mono text-xs font-bold uppercase tracking-widest text-foreground"
                >
                  Sujet
                </label>
                <input
                  id="subject"
                  type="text"
                  required
                  maxLength={200}
                  value={form.subject}
                  onChange={(e) =>
                    setForm({ ...form, subject: e.target.value })
                  }
                  className="field"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block font-mono text-xs font-bold uppercase tracking-widest text-foreground"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  required
                  maxLength={5000}
                  rows={6}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  className="field !h-auto min-h-40 py-3"
                />
              </div>
              {/* Anti-spam trap: hidden from people, only bots fill it in. */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label htmlFor="website">Site web</label>
                <input
                  id="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                />
              </div>
              <button
                type="submit"
                disabled={contactMutation.isPending}
                className="btn-ink disabled:opacity-50"
              >
                {contactMutation.isPending ? "Envoi en cours..." : "Envoyer le message"}
                <ArrowRight size={14} aria-hidden="true" />
              </button>
            </form>
          </AnimatedSection>

          {/* Info */}
          <AnimatedSection className="lg:col-span-2" delay={0.2}>
            <dl className="space-y-8 bg-dutch-orange p-6 font-mono text-sm uppercase leading-relaxed text-deep-black md:p-10">
              <div>
                <dt className="text-xs tracking-widest opacity-70">Contact direct</dt>
                <dd className="mt-3 flex flex-col items-start gap-1">
                  <a href="mailto:fredbiam9@gmail.com" className="normal-case underline-offset-4 hover:underline">
                    fredbiam9@gmail.com
                  </a>
                  <a href="https://github.com/mysteriodataweb" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline-offset-4 hover:underline">
                    github.com/mysteriodataweb <ArrowUpRight size={12} aria-hidden="true" />
                  </a>
                  <a href="https://www.linkedin.com/in/alfredbiam" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline-offset-4 hover:underline">
                    linkedin.com/in/alfredbiam <ArrowUpRight size={12} aria-hidden="true" />
                  </a>
                </dd>
              </div>
              <div className="border-t border-deep-black pt-8">
                <dt className="text-xs tracking-widest opacity-70">Disponibilité</dt>
                <dd className="mt-3">
                  Stage de fin d'études, {internship.duration}
                  <br />
                  Missions freelance
                  <br />
                  Réponse sous 24-48 h
                </dd>
              </div>
              <div className="border-t border-deep-black pt-8">
                <dt className="text-xs tracking-widest opacity-70">Localisation</dt>
                <dd className="mt-3">
                  Bouskoura, Casablanca
                  <br />
                  Maroc · mobile · télétravail possible
                </dd>
              </div>
            </dl>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
