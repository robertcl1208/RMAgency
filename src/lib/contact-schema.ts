import { z } from "zod";

const emptyToUndef = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? undefined : v;

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(120, "Name is too long."),
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Enter a valid email address."),
  company: z.preprocess(
    emptyToUndef,
    z.string().trim().max(200, "Company name is too long.").optional(),
  ),
  phone: z.preprocess(
    emptyToUndef,
    z.string().trim().max(40, "Phone is too long.").optional(),
  ),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters.")
    .max(10000, "Message is too long."),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export function formatZodFieldErrors(
  err: z.ZodError,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && out[key] === undefined) {
      out[key] = issue.message;
    }
  }
  return out;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildContactEmailHtml(data: ContactFormValues): string {
  const lines = [
    ["Name", data.name],
    ["Email", data.email],
    ["Company", data.company],
    ["Phone", data.phone],
    ["Message", data.message],
  ] as const;
  const rows = lines
    .filter(([, v]) => v != null && String(v).length > 0)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px;border:1px solid #e2e8f0;font-weight:600;vertical-align:top">${escapeHtml(k)}</td><td style="padding:8px 12px;border:1px solid #e2e8f0">${k === "Message" ? escapeHtml(v as string).replace(/\n/g, "<br/>") : escapeHtml(String(v))}</td></tr>`,
    )
    .join("");
  return `<table style="border-collapse:collapse;font-family:system-ui,sans-serif;font-size:14px;color:#0f172a">${rows}</table><p style="margin-top:16px;font-size:12px;color:#64748b">Sent from RobertRM website contact form. Reply goes to the visitor&apos;s email (Reply-To).</p>`;
}
