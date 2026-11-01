import { AnchorHTMLAttributes } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/i18n";
import { track } from "@/lib/analytics";
import { getArrival } from "@/lib/attribution";
import { CONTACT_EMAIL, mailtoHref } from "@/lib/contact";

interface ContactLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  /** Where the link sits ("en-tete", "pop-up"…), recorded with the click. */
  placement: string;
  /** Subject of the new message; a general one when left out. */
  subject?: string;
}

/**
 * "Contact" opens the visitor's email app. Many people read their mail in the browser and have no
 * email app set up, so the address also shows in a notice, with a button to copy it.
 */
const ContactLink = ({ placement, subject, onClick, children, ...rest }: ContactLinkProps) => {
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
    <a
      {...rest}
      href={mailtoHref(subject ?? t.contact.mailSubject)}
      onClick={(e) => {
        onClick?.(e);
        const source = getArrival();
        track("contact-email", source ? { emplacement: placement, provenance: source } : { emplacement: placement });
        toast(t.contact.opening, {
          description: t.contact.openingHint(CONTACT_EMAIL),
          action: { label: t.contact.copy, onClick: copyAddress },
          duration: 10_000,
        });
      }}
    >
      {children}
    </a>
  );
};

export default ContactLink;
