import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button, Card } from "./ui";

interface Props {
  children: ReactNode;
  featureName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class FeatureErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[${this.props.featureName ?? "Feature"}] Error:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-1 items-center justify-center p-6">
          <Card className="max-w-md text-center">
            <div className="mb-3 text-3xl">&#9888;&#65039;</div>
            <h2 className="mb-2 text-lg font-bold text-text">
              {this.props.featureName
                ? `Fehler in ${this.props.featureName}`
                : "Ein Fehler ist aufgetreten"}
            </h2>
            <p className="mb-4 text-sm text-text-muted">
              Dieser Bereich hat einen Fehler verursacht. Die restliche App funktioniert weiterhin.
            </p>
            {this.state.error && (
              <p className="mb-4 rounded-lg bg-kicker-red/10 p-2 text-xs text-kicker-red">
                {this.state.error.message}
              </p>
            )}
            <Button
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Erneut versuchen
            </Button>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
