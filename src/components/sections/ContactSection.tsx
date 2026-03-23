"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useCallback, useState } from "react";
import { Send } from "lucide-react";
import { viewportOnce } from "@/lib/motion";

type FieldErrors = Record<string, string>;

export function ContactSection() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setFormError(null);
      setFieldErrors({});
      setStatus("loading");

      const form = e.currentTarget;
      const fd = new FormData(form);
      const payload = {
        name: String(fd.get("name") ?? ""),
        email: String(fd.get("email") ?? ""),
        company: String(fd.get("company") ?? ""),
        phone: String(fd.get("phone") ?? ""),
        message: String(fd.get("message") ?? ""),
      };

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = (await res.json()) as {
          error?: string;
          fieldErrors?: FieldErrors;
          ok?: boolean;
        };

        if (res.ok && data.ok) {
          setStatus("success");
          form.reset();
          return;
        }

        if (data.fieldErrors && Object.keys(data.fieldErrors).length > 0) {
          setFieldErrors(data.fieldErrors);
        }
        setFormError(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
      } catch {
        setFormError("Network error. Check your connection and try again.");
        setStatus("error");
      }
    },
    [],
  );

  const inputClass = (name: string) =>
    `mt-1.5 w-full rounded-xl border bg-white px-4 py-3 text-slate-900 outline-none transition focus:ring-2 ${
      fieldErrors[name]
        ? "border-red-400 focus:border-red-500 focus:ring-red-200"
        : "border-slate-200 focus:border-brand-teal/50 focus:ring-brand-teal/30"
    }`;

  return (
    <section id="contact" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              You&apos;ve got a vision?{" "}
              <span className="text-brand-teal">
                We have a way to get you there.
              </span>
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Share your goals, stack, and timeline—we&apos;ll reply with next
              steps and a suggested squad shape.
            </p>
            <motion.div
              className="glass-frame relative mt-10 hidden aspect-[4/3] overflow-hidden rounded-2xl shadow-lg sm:block"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
            >
              <Image
                src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=700&q=80"
                alt="Team discussing project at whiteboard"
                fill
                className="object-cover"
                sizes="50vw"
              />
            </motion.div>
          </motion.div>

          <motion.div
            className="glass-panel water-sheen rounded-2xl p-6 sm:p-8"
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              {formError ? (
                <p
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                  role="alert"
                >
                  {formError}
                </p>
              ) : null}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="name"
                    type="text"
                    autoComplete="name"
                    minLength={2}
                    maxLength={120}
                    className={inputClass("name")}
                    placeholder="Robert Tan"
                    aria-invalid={Boolean(fieldErrors.name)}
                    aria-describedby={
                      fieldErrors.name ? "err-name" : undefined
                    }
                  />
                  {fieldErrors.name ? (
                    <p id="err-name" className="mt-1 text-xs text-red-600">
                      {fieldErrors.name}
                    </p>
                  ) : null}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Company
                  </label>
                  <input
                    name="company"
                    type="text"
                    autoComplete="organization"
                    maxLength={200}
                    className={inputClass("company")}
                    placeholder="Acme Inc."
                    aria-invalid={Boolean(fieldErrors.company)}
                    aria-describedby={
                      fieldErrors.company ? "err-company" : undefined
                    }
                  />
                  {fieldErrors.company ? (
                    <p id="err-company" className="mt-1 text-xs text-red-600">
                      {fieldErrors.company}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    className={inputClass("email")}
                    placeholder="you@company.com"
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={
                      fieldErrors.email ? "err-email" : undefined
                    }
                  />
                  {fieldErrors.email ? (
                    <p id="err-email" className="mt-1 text-xs text-red-600">
                      {fieldErrors.email}
                    </p>
                  ) : null}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Phone
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    maxLength={40}
                    className={inputClass("phone")}
                    placeholder="+1 (000) 000 0000"
                    aria-invalid={Boolean(fieldErrors.phone)}
                    aria-describedby={
                      fieldErrors.phone ? "err-phone" : undefined
                    }
                  />
                  {fieldErrors.phone ? (
                    <p id="err-phone" className="mt-1 text-xs text-red-600">
                      {fieldErrors.phone}
                    </p>
                  ) : null}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  rows={4}
                  minLength={10}
                  maxLength={10000}
                  className={`${inputClass("message")} resize-y`}
                  placeholder="Tell us about your product, deadlines, and success metrics."
                  aria-invalid={Boolean(fieldErrors.message)}
                  aria-describedby={
                    fieldErrors.message ? "err-message" : undefined
                  }
                />
                {fieldErrors.message ? (
                  <p id="err-message" className="mt-1 text-xs text-red-600">
                    {fieldErrors.message}
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-slate-500">
                    At least 10 characters.
                  </p>
                )}
              </div>
              {status === "success" ? (
                <motion.p
                  className="rounded-xl bg-brand-mint px-4 py-3 text-sm font-medium text-brand-teal-dark"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="status"
                >
                  Thanks! Your message was sent—we&apos;ll get back to you
                  soon.
                </motion.p>
              ) : null}
              <motion.button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-teal py-3.5 text-sm font-bold text-white shadow-md disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-10"
                whileHover={status === "loading" ? undefined : { scale: 1.03, y: -2 }}
                whileTap={status === "loading" ? undefined : { scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                {status === "loading" ? "Sending…" : "Submit"}
                <Send className="h-4 w-4" aria-hidden />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
