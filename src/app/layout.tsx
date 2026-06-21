import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Terra – Your Living Future',
  description: 'The Earth you create is the future you live in.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.variable} min-h-screen`}>
        <a
          href="#page-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-terra-space-950 focus:px-4 focus:py-2 focus:text-sm focus:text-terra-space-50"
        >
          Skip to main content
        </a>
        <ErrorBoundary>
          <div id="page-content">{children}</div>
        </ErrorBoundary>
      </body>
    </html>
  );
}
