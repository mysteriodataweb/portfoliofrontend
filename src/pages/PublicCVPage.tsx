import { useCVData } from "@/hooks/use-admin-cv";
import { Download, ExternalLink } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { track } from "@/lib/analytics";
import { useLanguage } from "@/i18n";
import { localizeSection } from "@/i18n/content";

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : "/api";

export default function PublicCVPage() {
  const { data: cv, isLoading } = useCVData();
  const { lang, t } = useLanguage();
  // The API builds the HTML and PDF versions in the requested language.
  const langQuery = lang === "en" ? "?lang=en" : "";
  const sections = (cv?.sections ?? []).map((s) => localizeSection(s, lang));

  if (isLoading) {
    return (
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center text-muted-foreground">{t.common.loading}</div>
      </section>
    );
  }

  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection>
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="display-title mb-2">{t.cv.title}</h1>
              <p className="text-muted-foreground">{t.cv.intro}</p>
            </div>
            <div className="flex gap-3">
              <a
                href={`${API_BASE}/cv/html${langQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("cv", { format: "html" })}
                className="pill-btn-outline text-sm"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                {t.cv.viewHtml}
              </a>
              <a href={`${API_BASE}/cv/pdf${langQuery}`} download onClick={() => track("cv", { format: "pdf" })} className="pill-btn text-sm">
                <Download className="h-4 w-4 mr-2" />
                {t.cv.downloadPdf}
              </a>
            </div>
          </div>
        </AnimatedSection>

        <div className="space-y-8">
          {sections.map((section, i) => (
            <AnimatedSection key={section.id} delay={i * 0.05}>
              <div className="bg-white border border-border rounded-none p-6">
                <h2 className="section-title text-foreground mb-6 text-foreground">{section.title}</h2>
                <div className="space-y-6">
                  {section.items?.map((item) => (
                    <div key={item.id} className="relative pl-6 border-l-2 border-border">
                      <div className="absolute left-[-5px] top-1 w-2 h-2 rounded-full bg-foreground" />
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-foreground">{item.title}</h3>
                          {item.subtitle && <p className="text-sm text-foreground">{item.subtitle}</p>}
                          {item.description && <p className="text-sm text-muted-foreground mt-1">{item.description}</p>}
                          {item.highlights?.length > 0 && (
                            <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                              {item.highlights.map((h, j) => (
                                <li key={j} className="flex items-start gap-2">
                                  <span className="text-foreground mt-1">•</span>
                                  {h}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                          {item.date_start}{item.date_end ? ` - ${item.date_end}` : ""}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
