'use client';

import { motion } from 'framer-motion';
import type { Easing } from 'framer-motion';
import { ReactNode } from 'react';

const easeOut: Easing = [0.22, 1, 0.36, 1];

const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.98,
    y: 10,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
      transition: {
      duration: 0.4,
      ease: easeOut,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: -10,
    transition: {
      duration: 0.3,
      ease: easeOut,
    },
  },
};

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}