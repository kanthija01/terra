'use client';
import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate, useReducedMotion } from 'framer-motion';

export function AnimatedCounter({ value, className }: { value: number; className?: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const controls = animate(count, value, {
      duration: shouldReduceMotion ? 0 : 1.2,
      ease: 'easeOut',
    });
    return controls.stop;
  }, [count, shouldReduceMotion, value]);

  return <motion.span className={className}>{rounded}</motion.span>;
}
