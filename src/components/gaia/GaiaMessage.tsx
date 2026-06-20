'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { GaiaAvatar } from './GaiaAvatar';

interface GaiaMessageProps {
  message: string;
  visible: boolean;
  onDismiss?: () => void;
}

export function GaiaMessage({ message, visible, onDismiss }: GaiaMessageProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 20 }}
          className="fixed bottom-32 left-4 right-4 z-40 max-w-md mx-auto"
          onClick={onDismiss}
        >
          <div className="glass glow-aurora p-4 flex items-start gap-3">
            <GaiaAvatar speaking />
            <div className="flex-1">
              <div className="text-xs text-terra-aurora-purple font-semibold mb-1">Gaia</div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-terra-space-200 italic leading-relaxed"
              >
                &quot;{message}&quot;
              </motion.p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
