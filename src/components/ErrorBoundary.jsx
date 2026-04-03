import { Component } from "react";
import T from "../tokens.js";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null, showDetails: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // Log to console for testing
    console.error("[Build Wizard Error]", error);
    console.error("[Build Wizard Stack]", errorInfo?.componentStack);
  }

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, showDetails } = this.state;
      return (
        <div style={{
          minHeight: "100vh", background: T.color.bg,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: T.font.body, padding: 20,
        }}>
          <div style={{ maxWidth: 500, width: "100%" }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <h2 style={{
                fontFamily: T.font.display, fontSize: 24, fontWeight: 400,
                fontStyle: "italic", color: T.color.text, marginBottom: 12,
              }}>
                Something went wrong.
              </h2>
              <p style={{ fontSize: 15, color: T.color.textMuted, lineHeight: 1.6, marginBottom: 24 }}>
                Try refreshing the page. If it keeps happening, your progress through
                the interview will restart, but the exercises will be the same.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <button
                  onClick={() => window.location.reload()}
                  style={{
                    padding: "12px 24px", background: T.color.copper,
                    color: "#fff", border: "none", borderRadius: 10,
                    fontFamily: T.font.body, fontSize: 15, fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Refresh
                </button>
                <button
                  onClick={() => this.setState({ showDetails: !showDetails })}
                  style={{
                    padding: "12px 24px", background: "transparent",
                    color: T.color.textLight, border: `1px solid ${T.color.border}`,
                    borderRadius: 10, fontFamily: T.font.body, fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  {showDetails ? "Hide details" : "Show details"}
                </button>
              </div>
            </div>

            {showDetails && (
              <div style={{
                background: T.color.bgCard,
                border: `1.5px solid ${T.color.border}`,
                borderRadius: 12,
                padding: "16px 20px",
                marginTop: 16,
                overflow: "auto",
                maxHeight: 400,
              }}>
                <div style={{
                  fontFamily: "'Courier New', Courier, monospace",
                  fontSize: 12,
                  lineHeight: 1.6,
                  color: T.color.text,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}>
                  <div style={{ color: T.color.copper, fontWeight: 600, marginBottom: 8 }}>
                    {error?.toString()}
                  </div>
                  {errorInfo?.componentStack && (
                    <div style={{ color: T.color.textMuted, fontSize: 11 }}>
                      {errorInfo.componentStack}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
