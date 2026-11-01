import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react";
import AnimatedSection from "@/components/AnimatedSection";
import ContactLink from "@/components/ContactLink";
import PathTimeline from "@/components/PathTimeline";
import { parcours } from "@/data/parcours";
import { useSkills } from "@/hooks/use-skills";
import { track } from "@/lib/analytics";
import { useLanguage } from "@/i18n";

// The CV as a page, with no PDF to download: each role gets its own version of the CV, sent on request.
// The facts come with the site, so the page shows at once even while the API wakes up.
export default function PublicCVPage() {
  const { lang, t } = useLanguage();
  const { experience, education, skills } = parcours[lang];
  // Certifications are managed from the admin, on the Skills page.
  const { data } = useSkills();
  const certifications = data?.certifications ?? [];

  return (
    <section className="px-4 pb-24 pt-10 md:px-8 md:pb-32 md:pt-16">
      <div className="border-b border-foreground pb-10">
        <p className="eyebrow">{t.cv.eyebrow}</p>
        <h1 className="display-title mt-4">
          {t.cv.titleStart} <span className="text-dutch-orange">{t.cv.titleAccent}</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">{t.cv.intro}</p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        {/* First in the page on a phone, beside the path on a wide screen. */}
        <aside className="lg:order-2 lg:col-span-4">
          <div className="bg-dutch-orange p-6 text-deep-black md:p-8 lg:sticky lg:top-28">
            <h2 className="text-2xl font-black uppercase leading-[0.95] tracking-tighter">{t.cv.requestTitle}</h2>
            <p className="mt-4 leading-relaxed">{t.cv.requestText}</p>
            <ContactLink placement="cv" subject={t.cv.requestSubject} className="btn-ink mt-6">
              {t.cv.request} <ArrowRight size={14} aria-hidden="true" />
            </ContactLink>
          </div>
        </aside>

        <div className="space-y-16 lg:order-1 lg:col-span-8">
          <AnimatedSection>
            <h2 className="section-title">{t.cv.experience}</h2>
            <PathTimeline entries={experience} />
          </AnimatedSection>

          <AnimatedSection>
            <h2 className="section-title">{t.cv.education}</h2>
            <PathTimeline entries={education} />
          </AnimatedSection>

          <AnimatedSection>
            <h2 className="section-title">{t.cv.skills}</h2>
            <p className="mt-3 text-muted-foreground">{t.cv.skillsNote}</p>
            <dl className="mt-4">
              {skills.map((group) => (
                <div key={group.name} className="grid grid-cols-1 gap-2 border-t border-foreground/15 py-5 md:grid-cols-12 md:gap-8">
                  <dt className="font-mono text-xs font-bold uppercase tracking-widest text-foreground md:col-span-3 md:pt-1">{group.name}</dt>
                  <dd className="flex flex-wrap gap-2 md:col-span-9">
                    {group.items.map((item) => (
                      <span key={item} className="border border-foreground/30 px-2 py-1 font-mono text-[11px] uppercase tracking-wider text-foreground">
                        {item}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </AnimatedSection>

          {certifications.length > 0 && (
            <AnimatedSection>
              <h2 className="section-title">{t.cv.certifications}</h2>
              <ul className="mt-4">
                {certifications.map((cert) => (
                  <li key={cert.id} className="flex flex-wrap items-baseline justify-between gap-2 border-t border-foreground/15 py-4">
                    {cert.url ? (
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => track("certification", { nom: cert.name })}
                        className="inline-flex items-center gap-1 font-semibold text-foreground underline-offset-4 hover:underline"
                      >
                        {cert.name} <ArrowUpRight size={12} aria-hidden="true" />
                      </a>
                    ) : (
                      <span className="font-semibold text-foreground">{cert.name}</span>
                    )}
                    <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                      {[cert.org, cert.year].filter(Boolean).join(" · ")}
                    </span>
                  </li>
                ))}
              </ul>
            </AnimatedSection>
          )}
        </div>
      </div>
    </section>
  );
}
