'use client';

import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[app] Uncaught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-terra-space-950 p-6 text-center">
          <section className="max-w-md rounded-2xl border border-terra-danger-500/30 bg-white/5 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-terra-danger-500">
              Something went wrong
            </p>
            <h2 className="mt-3 text-xl font-semibold text-terra-space-50">
              The app hit an unexpected error.
            </h2>
            <p className="mt-2 text-sm text-terra-space-400">
              Please refresh the page or try again.
            </p>
            <button
              type="button"
              onClick={this.handleReset}
              className="mt-4 rounded-xl bg-gradient-earth px-4 py-2 text-sm font-medium text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-terra-green-400"
            >
              Try again
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
