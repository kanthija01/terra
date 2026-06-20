'use client';
import { motion } from 'framer-motion';

export function GaiaAvatar({ speaking = false }: { speaking?: boolean }) {
  return (
    <motion.div
      animate={speaking ? { scale: [1, 1.1, 1] } : {}}
      transition={{ duration: 1.5, repeat: speaking ? Infinity : 0 }}
      className="relative w-12 h-12"
    >
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute inset-0 rounded-full bg-terra-aurora-purple/30 blur-md"
      />
      <div className="absolute inset-1 rounded-full bg-gradient-to-br from-terra-aurora-purple via-terra-green-400 to-terra-aurora-cyan flex items-center justify-center">
        <span className="text-lg">🌱</span>
      </div>
    </motion.div>
  );
}
