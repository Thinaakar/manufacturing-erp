'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';

type AnimatedCounterProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
};

export function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 80, damping: 28 });
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (isInView) motionValue.set(value);
  }, [isInView, motionValue, value]);

  useEffect(() => {
    const unsub = spring.on('change', (v) => {
      setDisplay(v.toFixed(decimals));
    });
    return unsub;
  }, [spring, decimals]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {Number(display).toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}
