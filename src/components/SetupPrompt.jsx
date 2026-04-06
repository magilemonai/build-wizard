import T from "../tokens.js";

/* ━━━ Setup Prompt ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function SetupPrompt({ status }) {
  if (status === "ready") return null;

  const linkStyle = {
    color: T.color.copper, fontWeight: 500, textDecoration: "underline",
    textUnderlineOffset: 3,
  };

  return (
    <div style={{ background: T.color.copperSoft, border: `1px solid ${T.color.copperGlow}`, borderRadius: 16, padding: "18px 22px", marginBottom: 24 }}>
      <div style={{ fontSize: 15, fontWeight: 500, color: T.color.copper, marginBottom: 6 }}>
        {status === "need_account" ? "Quick setup needed" : "Open Claude before we start"}
      </div>
      <p style={{ fontSize: 15, color: T.color.textMuted, lineHeight: 1.6, margin: "0 0 10px 0" }}>
        {status === "need_account"
          ? <>Head to <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" style={linkStyle}>claude.ai</a> and create a free account. Takes about 60 seconds. Come back when you're in.</>
          : <>Open <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" style={linkStyle}>claude.ai</a> in another tab so it's ready when we start building.</>}
      </p>
      {status === "need_account" && (
        <p style={{ fontSize: 14, color: T.color.textLight, lineHeight: 1.5, margin: "0 0 10px 0", fontStyle: "italic" }}>
          When you sign up, Claude may walk you through its own setup. You can skip that for now and come back here. We'll guide you from here.
        </p>
      )}
      <p style={{ fontSize: 14, color: T.color.textMuted, lineHeight: 1.5, margin: 0 }}>
        Free accounts work for everything here, but have a daily message limit.
        If you hit it, come back tomorrow and pick up where you left off.
      </p>
    </div>
  );
}
