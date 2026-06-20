import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        terra: {
          green: {
            50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0',
            300: '#6ee7b7', 400: '#34d399', 500: '#10b981',
            600: '#059669', 700: '#047857', 800: '#065f46', 900: '#064e3b',
          },
          blue: {
            50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe',
            300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6',
            600: '#2563eb', 700: '#1d4ed8',
          },
          aurora: { pink: '#f472b6', purple: '#a78bfa', cyan: '#22d3ee', green: '#4ade80' },
          warm: { 50: '#fffbeb', 300: '#fcd34d', 500: '#f59e0b', 700: '#b45309' },
          danger: { 300: '#fca5a5', 500: '#ef4444', 700: '#b91c1c' },
          space: {
            50: '#f9fafb', 200: '#e5e7eb', 400: '#9ca3af',
            600: '#374151', 700: '#1f2937', 800: '#111827',
            900: '#0a0f1a', 950: '#030712',
          },
        },
      },
      fontFamily: {
        display: ['Cal Sans', 'SF Pro Display', 'system-ui'],
        body: ['Inter', 'SF Pro Text', 'system-ui'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: { hero: ['5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }] },
      backgroundImage: {
        'gradient-earth': 'linear-gradient(135deg, #059669, #0284c7, #7c3aed)',
        'gradient-aurora': 'linear-gradient(135deg, #f472b6, #a78bfa, #22d3ee)',
        'gradient-sunset': 'linear-gradient(135deg, #f59e0b, #ef4444, #a855f7)',
      },
      boxShadow: {
        'glow-green': '0 0 30px rgba(16, 185, 129, 0.3)',
        'glow-aurora': '0 0 40px rgba(167, 139, 250, 0.2)',
        card: '0 8px 32px rgba(0, 0, 0, 0.3)',
        float: '0 20px 60px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 120s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(16, 185, 129, 0.5)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
