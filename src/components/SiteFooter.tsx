"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";

export function SiteFooter() {
  return (
    <footer className="glass-footer text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <Reveal as="div" className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3">
              <motion.span
                className="relative block overflow-hidden rounded-2xl ring-2 ring-white/15"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
              >
                <Image
                  src="/logo.png"
                  alt="Robert RM TechAgency"
                  width={44}
                  height={44}
                  className="h-10 w-10 object-contain"
                />
              </motion.span>
              <span className="text-lg font-bold text-white">
                Robert<span className="text-brand-accent">RM</span>
              </span>
            </Link>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">
              Outsourcing and software development agency focused on UI/UX, web
              and mobile products, SaaS, CRM, automation, and AI integration.
            </p>
          </Reveal>
          <Reveal as="div" delay={0.08}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Company
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href="#services"
                  className="transition-colors hover:text-brand-teal-light"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#certifications"
                  className="transition-colors hover:text-brand-teal-light"
                >
                  Certifications
                </a>
              </li>
              <li>
                <a
                  href="#value"
                  className="transition-colors hover:text-brand-teal-light"
                >
                  Why RobertRM
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="transition-colors hover:text-brand-teal-light"
                >
                  Contact
                </a>
              </li>
            </ul>
          </Reveal>
          <Reveal as="div" delay={0.12}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Reach us
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" />
                <a
                  href="mailto:business@robertrmdev.com"
                  className="hover:text-white"
                >
                  business@robertrmdev.com
                </a>
              </li>
              <li className="flex gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" />
                <a href="tel:+15413139367" className="hover:text-white">
                  +1 (541) 313 9367
                </a>
              </li>
              <li className="flex gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" />
                <span>Remote-first · Global delivery</span>
              </li>
            </ul>
          </Reveal>
        </div>
        <motion.div
          className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-center text-xs text-slate-500 sm:flex-row sm:text-left"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <p>© {new Date().getFullYear()} RobertRM. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-300">
              Privacy
            </a>
            <a href="#" className="hover:text-slate-300">
              Terms
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
