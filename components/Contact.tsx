'use client';

import { Send, Instagram, Mail, ArrowUpRight } from 'lucide-react';
import { Reveal } from './Reveal';
import { Overline } from './SectionHeading';
import { ContactForm } from './ContactForm';
import { siteConfig } from '@/lib/site';

const channels = [
  {
    label: 'Telegram',
    value: siteConfig.contacts.telegramHandle,
    href: siteConfig.contacts.telegram,
    icon: Send,
  },
  {
    label: 'Instagram',
    value: siteConfig.contacts.instagramHandle,
    href: siteConfig.contacts.instagram,
    icon: Instagram,
  },
  {
    label: 'E-mail',
    value: siteConfig.contacts.email,
    href: `mailto:${siteConfig.contacts.email}`,
    icon: Mail,
  },
];

export function Contact() {
  return (
    <section id="contact" className="relative scroll-mt-24 border-t border-white/[0.05] py-16 sm:py-24 lg:py-32">
      {/* soft glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 bg-radial-fade" aria-hidden="true" />

      <div className="mx-auto max-w-content px-5 sm:px-8">
        <div className="grid gap-10 sm:gap-14 lg:grid-cols-12">
          {/* Left: pitch + channels */}
          <div className="lg:col-span-5">
            <Reveal>
              <Overline>Contact</Overline>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-5 text-display-md font-semibold text-platinum">
                Расскажите о проекте — я предложу лучший формат сайта.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-md text-base leading-relaxed text-silver/75">
                Опишите задачу в двух словах. Отвечу, задам пару вопросов и предложу
                подходящий формат, сроки и смету.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-8 space-y-3">
                {channels.map((c) => (
                  <a
                    key={c.label}
                    href={c.href}
                    target={c.href.startsWith('http') ? '_blank' : undefined}
                    rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="group flex items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.02] px-5 py-4 transition-all duration-300 hover:border-gold/30 hover:bg-white/[0.04] focus-ring"
                  >
                    <span className="flex items-center gap-3.5">
                      <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-silver transition-colors group-hover:border-gold/40 group-hover:text-gold-soft">
                        <c.icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
                      </span>
                      <span className="flex flex-col">
                        <span className="text-[11px] uppercase tracking-overline text-faint">{c.label}</span>
                        <span className="text-sm font-medium text-platinum">{c.value}</span>
                      </span>
                    </span>
                    <ArrowUpRight
                      className="h-4 w-4 text-faint transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold-soft"
                      strokeWidth={1.75}
                    />
                  </a>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-7">
            <Reveal delay={0.1}>
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
