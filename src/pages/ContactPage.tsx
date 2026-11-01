import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react";
import { toast } from "sonner";
import { useLanguage } from "@/i18n";
import AnimatedSection from "@/components/AnimatedSection";
import ContactLink from "@/components/ContactLink";
import { CONTACT_EMAIL } from "@/lib/contact";

// No form: visitors write from their own mailbox. The page stays for links already shared to /contact.
const ContactPage = () => {
  const { t } = useLanguage();

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      toast.success(t.contact.copied);
    } catch {
      toast.error(t.contact.copyFailed);
    }
  };

  return (
    <section className="px-4 pb-24 pt-10 md:px-8 md:pb-32 md:pt-16">
      <div>
        <div className="border-b border-foreground pb-10">
          <p className="eyebrow">{t.contact.eyebrow}</p>
          <h1 className="display-title mt-4">
            {t.contact.titleStart} <span className="text-dutch-orange">{t.contact.titleAccent}</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            {t.contact.intro}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-16">
          <AnimatedSection className="lg:col-span-3">
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-foreground">{t.contact.addressLabel}</p>
            <ContactLink
              placement="page-contact-adresse"
              className="mt-4 inline-block break-all text-3xl font-black tracking-tighter transition-colors hover:text-dutch-orange md:text-5xl"
            >
              {CONTACT_EMAIL}
            </ContactLink>
            <div className="mt-10 flex flex-wrap gap-3">
              <ContactLink placement="page-contact" className="btn-ink">
                {t.contact.writeEmail} <ArrowRight size={14} aria-hidden="true" />
              </ContactLink>
              <button type="button" onClick={copyAddress} className="btn-paper">
                {t.contact.copy}
              </button>
            </div>
          </AnimatedSection>

          <AnimatedSection className="lg:col-span-2" delay={0.2}>
            <dl className="space-y-8 bg-dutch-orange p-6 font-mono text-sm uppercase leading-relaxed text-deep-black md:p-10">
              <div>
                <dt className="text-xs tracking-widest opacity-70">{t.contact.elsewhere}</dt>
                <dd className="mt-3 flex flex-col items-start gap-1">
                  <a href="https://github.com/mysteriodataweb" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline-offset-4 hover:underline">
                    github.com/mysteriodataweb <ArrowUpRight size={12} aria-hidden="true" />
                  </a>
                  <a href="https://www.linkedin.com/in/alfredbiam" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline-offset-4 hover:underline">
                    linkedin.com/in/alfredbiam <ArrowUpRight size={12} aria-hidden="true" />
                  </a>
                </dd>
              </div>
              <div className="border-t border-deep-black pt-8">
                <dt className="text-xs tracking-widest opacity-70">{t.contact.availability}</dt>
                <dd className="mt-3">
                  {t.contact.availabilityLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </dd>
              </div>
              <div className="border-t border-deep-black pt-8">
                <dt className="text-xs tracking-widest opacity-70">{t.contact.location}</dt>
                <dd className="mt-3">
                  {t.contact.locationLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
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
