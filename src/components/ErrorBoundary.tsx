import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button, Card } from "./ui";
import i18n from "../i18n";

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
                ? i18n.t("error.titleWithFeature", { featureName: this.props.featureName })
                : i18n.t("error.title")}
            </h2>
            <p className="mb-4 text-sm text-text-muted">
              {i18n.t("error.description")}
            </p>
            {this.state.error && (
              <p className="mb-4 rounded-lg bg-kicker-red/10 p-2 text-xs text-kicker-red">
                {this.state.error.message}
              </p>
            )}
            <Button
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              {i18n.t("actions.retry")}
            </Button>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
