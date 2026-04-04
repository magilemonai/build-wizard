import { useState } from "react";
import T from "../tokens.js";
import ChoiceButton from "./ChoiceButton.jsx";
import TextInput from "./TextInput.jsx";
import ContinueButton from "./ContinueButton.jsx";

/* ━━━ Interview Question (with gated stagger + contextual notice) ━ */
export default function InterviewQuestion({ question, subtext, type, options, value, onChange, onContinue, placeholder, staggerReady, notice }) {
  // When a notice is present, require the user to see it before continuing
  const [noticeAcknowledged, setNoticeAcknowledged] = useState(false);

  const handleContinue = () => {
    if (notice && !noticeAcknowledged) {
      setNoticeAcknowledged(true);
      return; // Block first Continue click; highlight the notice instead
    }
    onContinue();
  };

  return (
    <div>
      <h2 style={{
        fontFamily: T.font.display, fontSize: "clamp(26px,5vw,34px)",
        fontWeight: 400, lineHeight: 1.3, margin: "0 0 8px 0", color: T.color.text,
      }}>{question}</h2>
      {subtext && <p style={{ fontSize: 16, color: T.color.textMuted, margin: "0 0 28px 0", lineHeight: 1.65 }}>{subtext}</p>}
      {!subtext && <div style={{ height: 28 }} />}

      {type === "choice" && options.map((opt, i) => (
        <ChoiceButton key={opt.value} selected={value === opt.value}
          onClick={() => { onChange(opt.value); setNoticeAcknowledged(false); }}
          delay={i * 70} ready={staggerReady}>
          {opt.label}
        </ChoiceButton>
      ))}

      {/* Contextual notice — appears when a specific selection triggers it */}
      {notice && (
        <div style={{
          marginTop: 16, padding: "16px 20px",
          background: noticeAcknowledged ? "rgba(122,139,106,0.14)" : T.color.sageSoft,
          border: `${noticeAcknowledged ? "2px" : "1px"} solid ${noticeAcknowledged ? T.color.sage : T.color.sageBorder}`,
          borderRadius: 12,
          animation: noticeAcknowledged ? "none" : "fadeInNotice 0.4s ease",
          transition: `border 0.3s ${T.ease.smooth}`,
        }}>
          <div style={{ fontSize: 15, fontWeight: 500, color: T.color.sage, marginBottom: 4 }}>
            {notice.title}
          </div>
          <div style={{ fontSize: 15, color: T.color.textMuted, lineHeight: 1.6 }}>
            {notice.body}
          </div>
          {noticeAcknowledged && (
            <div style={{
              marginTop: 10, fontSize: 13, fontWeight: 500,
              color: T.color.sage,
              animation: "fadeInNotice 0.3s ease",
            }}>
              ✓ Noted. Click Continue again to proceed.
            </div>
          )}
        </div>
      )}

      {type === "text" && <TextInput value={value || ""} onChange={onChange} onSubmit={handleContinue} placeholder={placeholder} />}
      {type === "textarea" && <TextInput value={value || ""} onChange={onChange} onSubmit={handleContinue} placeholder={placeholder} multiline />}
      <ContinueButton onClick={handleContinue} disabled={!value || (typeof value === "string" && !value.trim())} />
    </div>
  );
}
