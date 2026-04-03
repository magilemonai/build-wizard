import { useState } from "react";
import T from "../tokens.js";
import { useIsMobile, getModKey } from "../hooks.js";

/* ━━━ Text Input ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function TextInput({ value, onChange, onSubmit, placeholder, multiline }) {
  const [focused, setFocused] = useState(false);
  const Tag = multiline ? "textarea" : "input";
  const mobile = useIsMobile();
  return (
    <div style={{ marginTop: 8 }}>
      <Tag
        value={value} onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !multiline) { e.preventDefault(); onSubmit?.(); }
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && multiline) { e.preventDefault(); onSubmit?.(); }
        }}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        placeholder={placeholder} rows={multiline ? 4 : undefined}
        style={{
          width: "100%", padding: "14px 18px", background: T.color.bgCard,
          border: `1.5px solid ${focused ? T.color.sage : T.color.border}`,
          borderRadius: 12, fontFamily: T.font.body, fontSize: 15,
          color: T.color.text, outline: "none",
          transition: `border-color 0.3s ${T.ease.smooth}, box-shadow 0.3s ${T.ease.smooth}`,
          resize: multiline ? "vertical" : "none", lineHeight: 1.6,
          boxShadow: focused ? `0 0 0 3px ${T.color.sageSoft}` : "none",
          boxSizing: "border-box",
        }}
      />
      {multiline && !mobile && (
        <div style={{ marginTop: 6, fontSize: 12, color: T.color.textLight, textAlign: "right" }}>
          {getModKey()} + Enter to continue
        </div>
      )}
    </div>
  );
}
