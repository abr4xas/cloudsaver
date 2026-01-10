"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    // Call optional error handler
    this.props.onError?.(error, errorInfo);

    // In production, you might want to log to an error reporting service
    // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-black">
          <div className="max-w-2xl w-full">
            <Alert variant="destructive" className="border-red-500/50 bg-red-950/20">
              <AlertTriangle className="h-5 w-5" />
              <AlertTitle className="text-xl font-semibold mb-2">
                Something went wrong
              </AlertTitle>
              <AlertDescription className="space-y-4">
                <p className="text-sm text-zinc-400">
                  We encountered an unexpected error. Please try refreshing the page or
                  return to the home page.
                </p>

                {process.env.NODE_ENV === "development" && this.state.error && (
                  <div className="mt-4 p-4 bg-zinc-900 rounded-lg border border-zinc-800">
                    <p className="text-xs font-mono text-red-400 mb-2">
                      {this.state.error.toString()}
                    </p>
                    {this.state.errorInfo && (
                      <details className="text-xs font-mono text-zinc-500">
                        <summary className="cursor-pointer hover:text-zinc-400 mb-2">
                          Stack Trace
                        </summary>
                        <pre className="overflow-auto max-h-48 text-[10px]">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </details>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap gap-3 mt-6">
                  <Button
                    onClick={this.handleReset}
                    variant="default"
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Link href="/">
                      <Home className="w-4 h-4" />
                      Go Home
                    </Link>
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Higher-order component to wrap components with Error Boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundaryComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
