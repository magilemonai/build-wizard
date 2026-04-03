import { Component } from "react";
import T from "../tokens.js";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh", background: T.color.bg,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: T.font.body, padding: 20,
        }}>
          <div style={{ textAlign: "center", maxWidth: 400 }}>
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
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
