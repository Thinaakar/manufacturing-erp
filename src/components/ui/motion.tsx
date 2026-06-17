'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

type StaggerProps = {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section';
};

export function StaggerContainer({ children, className, as = 'div' }: StaggerProps) {
  const Comp = motion[as];
  return (
    <Comp variants={container} initial="hidden" animate="show" className={className}>
      {children}
    </Comp>
  );
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={item} className={cn(className)}>
      {children}
    </motion.div>
  );
}

export function PageTransition({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
