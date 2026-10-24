import { useMutation } from "@tanstack/react-query";
import { api } from "@/api/client";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  /** Anti-spam trap, always empty when a person fills in the form. */
  website: string;
  /** How the visitor first found the site, e.g. "LinkedIn, arrivé sur /projets". */
  source?: string;
  /** Language of the page, so the API answers in it. */
  lang?: "fr" | "en";
}

interface ContactResponse {
  success: boolean;
  message: string;
}

export function useContact() {
  return useMutation({
    mutationFn: (data: ContactFormData) => api.post<ContactResponse>("/contact", data),
  });
}
