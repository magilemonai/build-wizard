import { useState } from "react";
import T from "../tokens.js";
import { useIsMobile } from "../hooks.js";
import OrganicShape, { sectionShapes } from "./OrganicShape.jsx";

function HoverShape({ shapeIndex, size, color, active, clickable }) {
  const [hovered, setHovered] = useState(false);
  const scale = active ? 1.3 : (hovered && clickable) ? 1.2 : 1;
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transition: `all 0.3s ${T.ease.smooth}`,
        transform: `scale(${scale})`,
        lineHeight: 0,
      }}
    >
      <OrganicShape shapeIndex={shapeIndex} size={size} color={color} />
    </div>
  );
}

/* ━━━ Journey Progress (responsive, clickable) ━━━━━━━━━━━━━━━━━ */
export const journeySteps = [
  { key: "interview", label: "Interview" },
  { key: "icebreaker", label: "Ice Breaker" },
  { key: "foundation", label: "Foundation" },
  { key: "powerup", label: "Power Up" },
  { key: "ship", label: "Ship" },
];

export default function JourneyProgress({ currentSection, questionProgress, onSectionClick, stepCount, currentStep }) {
  const idx = journeySteps.findIndex((s) => s.key === currentSection);
  const mobile = useIsMobile();

  const isClickable = (i) => onSectionClick && (i < idx || i === idx);

  if (mobile) {
    return (
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: `linear-gradient(to bottom, ${T.color.bg} 60%, ${T.color.bg}00 100%)`,
        padding: "14px 20px 20px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {journeySteps.map((s, i) => (
              <div
                key={s.key}
                onClick={isClickable(i) ? () => onSectionClick(s.key) : undefined}
                style={{ cursor: isClickable(i) ? "pointer" : "default" }}
              >
                <HoverShape shapeIndex={sectionShapes[i]} size={i === idx ? 14 : 10} color={i < idx ? T.color.sage : i === idx ? T.color.copper : T.color.border} active={i === idx} clickable={isClickable(i)} />
              </div>
            ))}
          </div>
          <span style={{
            fontFamily: T.font.body, fontSize: 12, fontWeight: 500,
            letterSpacing: "0.04em", color: T.color.copper,
          }}>
            {journeySteps[idx]?.label}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: `linear-gradient(to bottom, ${T.color.bg} 70%, ${T.color.bg}00 100%)`,
      padding: "14px 0 40px",
    }}>
      <div style={{
        maxWidth: 500, margin: "0 auto", padding: "0 24px",
        display: "flex", alignItems: "center",
      }}>
        {journeySteps.map((step, i) => {
          const active = i === idx, past = i < idx;
          const clickable = isClickable(i);
          return (
            <div key={step.key} style={{
              display: "flex", alignItems: "center",
              flex: i < journeySteps.length - 1 ? 1 : "none",
            }}>
              <div
                onClick={clickable ? () => onSectionClick(step.key) : undefined}
                style={{
                  position: "relative",
                  cursor: clickable ? "pointer" : "default",
                  pointerEvents: "auto",
                }}
                title={clickable && past ? `Jump to ${step.label}` : undefined}
              >
                <HoverShape shapeIndex={sectionShapes[i]} size={active ? 14 : 10} color={past ? T.color.sage : active ? T.color.copper : T.color.border} active={active} clickable={isClickable(i)} />
                <div style={{
                  position: "absolute", top: "100%", left: "50%",
                  transform: "translateX(-50%)", marginTop: 8, whiteSpace: "nowrap",
                  fontFamily: T.font.body, fontSize: 11, fontWeight: active ? 500 : 400,
                  letterSpacing: "0.03em",
                  color: active ? T.color.copper : past ? T.color.sage : T.color.textLight,
                  opacity: active || past ? 1 : 0.45,
                  transition: `all 0.5s ${T.ease.smooth}`,
                  pointerEvents: "auto",
                }}>{step.label}</div>
              </div>
              {i < journeySteps.length - 1 && (
                <div style={{ flex: 1, margin: "0 6px", position: "relative" }}>
                  <div style={{
                    height: 1.5,
                    background: past ? T.color.sage : T.color.border,
                    borderRadius: 1, position: "relative", overflow: "hidden",
                  }}>
                    {active && (
                      <div style={{
                        position: "absolute", left: 0, top: 0, bottom: 0,
                        width: `${questionProgress * 100}%`,
                        background: T.color.copper, borderRadius: 1,
                        transition: `width 0.6s ${T.ease.smooth}`,
                      }} />
                    )}
                  </div>
                  {/* Sub-progress: mini section shapes under active bar */}
                  {active && stepCount > 1 && (
                    <div style={{
                      position: "absolute", top: 8, left: 0, right: 0,
                      display: "flex", justifyContent: "center", gap: 4,
                      lineHeight: 0,
                    }}>
                      {Array.from({ length: stepCount }, (_, si) => (
                        <div key={si} style={{
                          transition: `all 0.3s ${T.ease.smooth}`,
                          opacity: si <= currentStep ? 1 : 0.35,
                          transform: si === currentStep ? "scale(1.3)" : "scale(1)",
                        }}>
                          <OrganicShape
                            shapeIndex={sectionShapes[i]}
                            size={5}
                            color={si < currentStep ? T.color.sage : si === currentStep ? T.color.copper : T.color.border}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
