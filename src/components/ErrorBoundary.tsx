import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Only log to console in development mode
    if (import.meta.env.DEV) {
      console.error('Uncaught error:', error, errorInfo);
    }

    // In production, you would send this to an error tracking service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 text-center">
            <div className="text-6xl mb-6">⚠️</div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-white/60 mb-6 text-sm">
              {import.meta.env.DEV
                ? this.state.error?.message
                : 'An unexpected error occurred. Please try again.'}
            </p>
            {import.meta.env.DEV && this.state.error?.stack && (
              <details className="text-left mb-6 text-xs text-white/40">
                <summary className="cursor-pointer hover:text-white/60 mb-2">
                  Error Details (Dev Only)
                </summary>
                <pre className="overflow-auto max-h-40 bg-black/20 p-3 rounded-lg">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            <button
              onClick={this.handleReset}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full text-white font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              Go Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
