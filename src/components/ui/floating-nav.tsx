'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/earth', icon: '🌍', label: 'Earth' },
  { href: '/simulator', icon: '🔮', label: 'What If' },
  { href: '/future-memories', icon: '⏳', label: 'Future' },
  { href: '/ecoscan', icon: '📸', label: 'Scan' },
  { href: '/village', icon: '🏘️', label: 'Village' },
];

export function FloatingNav() {
  const pathname = usePathname();

  return (
   <motion.nav initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
      <div className="glass px-2 py-2 flex gap-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`relative px-4 py-2 rounded-xl flex flex-col items-center gap-0.5 transition-colors ${active ? 'bg-terra-green-600/20' : 'hover:bg-white/5'}`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-[10px] text-terra-space-400">{item.label}</span>
                {active && <motion.div layoutId="nav-indicator" className="absolute -bottom-1 w-1 h-1 rounded-full bg-terra-green-400" />}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
