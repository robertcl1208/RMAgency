"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Bot,
  CloudCog,
  LayoutTemplate,
  MonitorSmartphone,
  Smartphone,
  Users,
  Workflow,
} from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";

const services = [
  {
    title: "UI/UX Design",
    description:
      "Research-backed interfaces, design systems, and prototypes that convert—aligned with your brand and built for accessibility.",
    icon: LayoutTemplate,
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80",
    alt: "Designer working on UI layouts",
  },
  {
    title: "Web Development",
    description:
      "Performant marketing sites, dashboards, and portals using modern stacks—SEO-ready, secure, and easy to maintain.",
    icon: MonitorSmartphone,
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80",
    alt: "Developer at workstation with code on screen",
  },
  {
    title: "Mobile App Development",
    description:
      "Native-quality experiences on iOS and Android with shared logic where it makes sense—offline-first when you need it.",
    icon: Smartphone,
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80",
    alt: "Hands holding smartphones",
  },
  {
    title: "SaaS App Development",
    description:
      "Multi-tenant architecture, billing hooks, admin tooling, and analytics so you can scale recurring revenue confidently.",
    icon: CloudCog,
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80",
    alt: "Abstract technology and globe visualization",
  },
  {
    title: "CRM",
    description:
      "Implement and customize CRM workflows, pipelines, and integrations so sales and support stay in sync.",
    icon: Users,
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80",
    alt: "Team meeting and collaboration",
  },
  {
    title: "Automation Tools",
    description:
      "Connect your stack with reliable automations—fewer manual tasks, clearer handoffs, and audit-friendly logs.",
    icon: Workflow,
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80",
    alt: "Server room representing automation infrastructure",
  },
  {
    title: "AI Integration",
    description:
      "Embeddings, chat assistants, document workflows, and guardrails—practical AI that fits your product and compliance needs.",
    icon: Bot,
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80",
    alt: "Abstract AI neural network visualization",
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal as="div" className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Our <span className="text-brand-teal">Services</span>
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Full-spectrum product capabilities—from first pixel to production
            AI features.
          </p>
        </Reveal>

        <motion.div
          className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
        >
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <motion.article
                key={s.title}
                variants={staggerItem}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
                className="glass-card water-sheen group flex flex-col overflow-hidden rounded-2xl transition-shadow hover:shadow-xl hover:ring-2 hover:ring-brand-teal/20"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={s.image}
                    alt={s.alt}
                    fill
                    className="object-cover transition duration-700 ease-out group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="glass-chip absolute left-3 top-3 flex h-11 w-11 items-center justify-center rounded-xl text-brand-teal transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-bold text-slate-900">{s.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                    {s.description}
                  </p>
                  <motion.a
                    href="#contact"
                    className="mt-4 inline-flex items-center text-sm font-semibold text-brand-teal"
                    whileHover={{ x: 4 }}
                  >
                    Discuss this service →
                  </motion.a>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
