/* ━━━ Design Tokens ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Colors reference CSS custom properties defined in global.css,
   which switch between light and dark palettes automatically
   via prefers-color-scheme media query.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const T = {
  color: {
    bg: "var(--color-bg)",
    bgSubtle: "var(--color-bg-subtle)",
    bgCard: "var(--color-bg-card)",
    text: "var(--color-text)",
    textMuted: "var(--color-text-muted)",
    textLight: "var(--color-text-light)",
    sage: "var(--color-sage)",
    sageSoft: "var(--color-sage-soft)",
    sageBorder: "var(--color-sage-border)",
    copper: "var(--color-copper)",
    copperHover: "var(--color-copper-hover)",
    copperSoft: "var(--color-copper-soft)",
    copperGlow: "var(--color-copper-glow)",
    border: "var(--color-border)",
    borderHover: "var(--color-border-hover)",
    shadow: "var(--color-shadow)",
    shadowMed: "var(--color-shadow-med)",
    shadowDeep: "var(--color-shadow-deep)",
  },
  // Raw hex values for contexts that need string manipulation (alpha concat, etc.)
  // These don't auto-switch with dark mode — use sparingly, only for decorative elements
  raw: {
    copper: "#BF7B5E",
    copperDark: "#D4916F",
    sage: "#7A8B6A",
    sageDark: "#8FA07E",
  },
  ease: {
    smooth: "cubic-bezier(0.22,1,0.36,1)",
    page: "cubic-bezier(0.4,0,0.2,1)",
    settle: "cubic-bezier(0.25,0.46,0.45,0.94)",
    spring: "cubic-bezier(0.34,1.4,0.64,1)",
  },
  font: {
    display: "'Instrument Serif',Georgia,serif",
    body: "'DM Sans',-apple-system,sans-serif",
  },
};

export default T;
