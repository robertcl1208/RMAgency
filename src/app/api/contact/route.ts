import { Resend } from "resend";
import { NextResponse } from "next/server";
import {
  buildContactEmailHtml,
  contactFormSchema,
  formatZodFieldErrors,
} from "@/lib/contact-schema";

const DEFAULT_TO = "business@robertrmdev.com";

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body.", fieldErrors: {} },
      { status: 400 },
    );
  }

  const parsed = contactFormSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please fix the highlighted fields.",
        fieldErrors: formatZodFieldErrors(parsed.error),
      },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Email is not configured yet. Add RESEND_API_KEY on the server (see .env.example).",
        fieldErrors: {},
      },
      { status: 503 },
    );
  }

  const to = process.env.CONTACT_TO_EMAIL?.trim() || DEFAULT_TO;
  const from =
    process.env.RESEND_FROM_EMAIL?.trim() ||
    "RobertRM Website <onboarding@resend.dev>";

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: data.email,
    subject: `Contact form: ${data.name}`,
    html: buildContactEmailHtml(data),
  });

  if (error) {
    return NextResponse.json(
      {
        error: "Could not send your message. Please try again or email us directly.",
        fieldErrors: {},
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
