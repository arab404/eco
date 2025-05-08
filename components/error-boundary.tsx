"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo })
    console.error("Error caught by ErrorBoundary:", error, errorInfo)

    // In a production app, you might want to log this to a service
    // logErrorToService(error, errorInfo);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4 max-w-md">
            We're sorry, but there was an error loading this content. Please try again or contact support if the problem
            persists.
          </p>
          <div className="space-x-4">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
            <Button
              className="bg-rose-500 hover:bg-rose-600"
              onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
            >
              Try Again
            </Button>
          </div>
          {process.env.NODE_ENV !== "production" && this.state.error && (
            <div className="mt-6 p-4 bg-gray-100 rounded-md text-left overflow-auto max-w-full">
              <p className="font-mono text-sm text-red-500">{this.state.error.toString()}</p>
              {this.state.errorInfo && (
                <pre className="mt-2 font-mono text-xs text-gray-700 overflow-auto">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </div>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
