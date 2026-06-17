'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Factory, Sparkles } from 'lucide-react';
import loginHeroBg from '@/assets/images/login-hero-bg.png';
import { AnimatedCounter } from '@/components/ui/animated-counter';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const STATS = [
  { value: 500, suffix: '+', label: 'Factories Managed' },
  { value: 120, suffix: 'K+', label: 'Production Orders' },
  { value: 99.4, suffix: '%', label: 'System Reliability', decimals: 1 },
  { value: 50, suffix: '+', label: 'Countries Served' },
];

export function LoginHero() {
  const [heroSrc, setHeroSrc] = useState<string | typeof loginHeroBg>(loginHeroBg);

  useEffect(() => {
    fetch('/api/assets/login-hero')
      .then((res) => res.json())
      .then((body: { data?: { url?: string | null } }) => {
        if (body.data?.url) setHeroSrc(body.data.url);
      })
      .catch(() => {
        /* keep local fallback */
      });
  }, []);

  return (
    <section className="relative hidden h-screen w-[60%] shrink-0 overflow-hidden lg:flex lg:flex-col">
      <Image
        src={heroSrc}
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="60vw"
        unoptimized={typeof heroSrc === 'string'}
      />

      {/* Overlay for text readability + smooth fade into login form */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0a1628]/75 via-[#0a1628]/45 to-[#0a1628]/25" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#F8FAFC]/30 to-transparent" />

      <div className="relative z-10 flex h-full flex-col px-10 py-10 xl:px-14 xl:py-12">
        <motion.div
          custom={0}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur-sm">
            <Factory className="h-5 w-5 text-[#2DD4BF]" strokeWidth={2} />
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-white">ForgeOS</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-300">
              Manufacturing ERP
            </p>
          </div>
        </motion.div>

        <motion.div custom={1} initial="hidden" animate="show" variants={fadeUp} className="mt-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#2DD4BF] shadow-sm backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-[#2DD4BF]" />
            Next Generation Manufacturing ERP
          </span>
        </motion.div>

        <motion.h1
          custom={2}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-6 max-w-xl font-display text-4xl font-bold leading-[1.08] tracking-tight text-white xl:text-5xl 2xl:text-[3.25rem]"
        >
          Transform Factory Operations
          <br />
          Into{' '}
          <span className="bg-gradient-to-r from-[#2DD4BF] via-[#14B8A6] to-[#67E8F9] bg-clip-text text-transparent">
            Intelligent Performance
          </span>
        </motion.h1>

        <motion.p
          custom={3}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-5 max-w-lg text-base leading-relaxed text-slate-300 xl:text-[17px]"
        >
          Manage production, inventory, workforce, machine monitoring, and business intelligence
          through one unified platform designed for modern manufacturing enterprises.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="mt-auto border-t border-white/15 pt-6"
        >
          <div className="grid grid-cols-2 gap-6 xl:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-2xl font-bold text-white xl:text-3xl">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    decimals={'decimals' in stat ? stat.decimals : 0}
                  />
                </p>
                <p className="mt-1 text-xs font-medium text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
