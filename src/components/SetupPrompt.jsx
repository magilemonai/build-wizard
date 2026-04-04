import T from "../tokens.js";

/* ━━━ Setup Prompt ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function SetupPrompt({ status }) {
  if (status === "ready") return null;

  const linkStyle = {
    color: T.color.copper, fontWeight: 500, textDecoration: "underline",
    textUnderlineOffset: 3,
  };

  return (
    <div style={{ background: T.color.copperSoft, border: `1px solid rgba(191,123,94,0.18)`, borderRadius: 14, padding: "18px 22px", marginBottom: 24 }}>
      <div style={{ fontSize: 15, fontWeight: 500, color: T.color.copper, marginBottom: 6 }}>
        {status === "need_account" ? "Quick setup needed" : "One more thing"}
      </div>
      <p style={{ fontSize: 15, color: T.color.textMuted, lineHeight: 1.6, margin: "0 0 10px 0" }}>
        {status === "need_account"
          ? <>Head to <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" style={linkStyle}>claude.ai</a> and create a free account. Takes about 60 seconds. Come back when you're in.</>
          : <>Open <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" style={linkStyle}>claude.ai</a> in another tab so it's ready when we start building.</>}
      </p>
      <p style={{ fontSize: 14, color: T.color.textMuted, lineHeight: 1.5, margin: 0 }}>
        Free accounts work for everything here, but have limited daily usage.
        If you hit a limit, you can wait a few hours or upgrade to Pro.
      </p>
    </div>
  );
}
