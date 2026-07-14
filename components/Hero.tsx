'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { AuroraBackground } from './AuroraBackground';
import { BrandEmblem } from './BrandEmblem';
import { scrollToId } from '@/lib/utils';

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Gentle parallax: content drifts up + fades as you scroll past the hero.
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
  };
  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
  };

  return (
    <section
      id="hero"
      ref={ref}
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-24"
    >
      <AuroraBackground />

      <motion.div
        style={{ y, opacity }}
        className="mx-auto w-full max-w-content px-5 sm:px-8"
      >
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8"
        >
          {/* Left — copy */}
          <div className="max-w-2xl">
            <motion.div variants={item}>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-[12px] font-medium text-silver/90 backdrop-blur">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/70 opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
                </span>
                BNSH Studio — digital craft
              </span>
            </motion.div>

            <motion.h1
              variants={item}
              className="mt-7 text-display-xl font-semibold tracking-tightest text-platinum"
            >
              BNSH <span className="text-gradient-platinum">Studio</span>
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-6 max-w-xl font-display text-[1.65rem] leading-[1.2] text-silver sm:text-[2.1rem]"
            >
              <span className="italic">Premium websites &amp; digital&nbsp;products</span>
              <span className="text-silver/40"> — </span>
              <span className="text-gradient-gold italic">crafted with precision.</span>
            </motion.p>

            <motion.p
              variants={item}
              className="mt-6 max-w-xl text-base leading-relaxed text-muted"
            >
              Здесь можно посмотреть мои работы, понять, что и как я делаю, выбрать
              подходящий формат под задачу и написать мне для обсуждения проекта.
            </motion.p>

            <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-3">
              <button
                onClick={() => scrollToId('works')}
                className="group inline-flex items-center gap-2 rounded-full bg-platinum px-6 py-3.5 text-sm font-semibold text-ink-950 transition hover:bg-white focus-ring"
              >
                Смотреть работы
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
              </button>
              <button
                onClick={() => scrollToId('contact')}
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-platinum backdrop-blur transition hover:border-gold/40 hover:bg-white/[0.06] focus-ring"
              >
                Обсудить проект
              </button>
            </motion.div>

            {/* trust strip */}
            <motion.div
              variants={item}
              className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 text-[13px] text-faint"
            >
              <Stat value="Сайты" note="под бизнес" />
              <span className="hidden h-4 w-px bg-white/10 sm:block" />
              <Stat value="Лендинги" note="под заявки" />
              <span className="hidden h-4 w-px bg-white/10 sm:block" />
              <Stat value="Веб-приложения" note="и интерфейсы" />
            </motion.div>
          </div>

          {/* Right — brand emblem */}
          <motion.div variants={item} className="flex justify-center lg:justify-end">
            <BrandEmblem className="mx-auto w-full max-w-[300px] sm:max-w-[400px] lg:max-w-[460px]" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* scroll hint */}
      <motion.button
        onClick={() => scrollToId('works')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 focus-ring rounded-full"
        aria-label="Прокрутить к работам"
      >
        <span className="flex flex-col items-center gap-2 text-[11px] uppercase tracking-overline text-faint">
          Ниже
          <ArrowDown className="h-4 w-4 animate-bounce text-muted" strokeWidth={1.5} />
        </span>
      </motion.button>
    </section>
  );
}

function Stat({ value, note }: { value: string; note: string }) {
  return (
    <span className="flex items-baseline gap-2">
      <span className="font-medium text-silver">{value}</span>
      <span className="text-faint">{note}</span>
    </span>
  );
}
