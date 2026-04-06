import { useState, useEffect } from "react";
import T from "../tokens.js";
import OrganicShape, { sectionShapes } from "./OrganicShape.jsx";

/* ━━━ SectionCelebration ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Staged celebration:
   1. Particles scatter outward (immediate)
   2. All 5 shapes bounce into a line in natural order (staggered)
   3. After settling: hero slides to center + grows, others slide aside
   4. Non-hero shapes twirl gently in place (infinite loop)

   The key: same DOM elements throughout, no re-rendering.
   Phase change only updates transform values; CSS transition handles
   the smooth movement.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const SLOT_WIDTH = 34; // 20px shape + 14px gap

export default function SectionCelebration({ heroShapeIndex, intensity = 1 }) {
  const [rearranged, setRearranged] = useState(false);

  useEffect(() => {
    // Wait for bounce animations to finish, then trigger the rearrangement
    const t = setTimeout(() => setRearranged(true), 1400);
    return () => clearTimeout(t);
  }, []);

  // Particles
  const particleCounts = [6, 10, 14];
  const count = particleCounts[Math.min(intensity - 1, 2)];
  const particles = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + (heroShapeIndex * 0.7);
    const radius = 50 + (i * 13) % 80;
    const x = Math.cos(angle) * radius;
    const y = -30 - (i * 17) % 70;
    const rot = ((i * 47) % 120) - 60;
    const shapeIdx = sectionShapes[i % 5];
    const size = 5 + (i * 3) % 6;
    const alphas = ["", "88", "66"];
    const baseColor = (i % 2 === 0) ? T.raw.copper : T.raw.sage;
    particles.push({ x, y, rot, idx: shapeIdx, size, color: baseColor + alphas[i % 3] });
  }

  // Calculate where each shape needs to slide when rearranged.
  // Natural order: [0, 1, 2, 3, 4] in slots [0, 1, 2, 3, 4]
  // Final order:   [others[0], others[1], HERO, others[2], others[3]]
  const heroNatural = heroShapeIndex; // natural slot index
  const others = sectionShapes.filter((s) => s !== heroShapeIndex);

  function getFinalSlot(shapeIdx) {
    if (shapeIdx === heroShapeIndex) return 2; // center
    const oi = others.indexOf(shapeIdx);
    return oi < 2 ? oi : oi + 1; // skip slot 2
  }

  return (
    <div style={{ position: "relative", height: 120, marginBottom: 20 }}>
      {/* Scatter particles */}
      {particles.map((p, i) => (
        <div key={`s-${i}`} style={{
          position: "absolute", left: "50%", top: "50%",
          "--scatter-to": `translate(${p.x}px, ${p.y}px)`,
          "--scatter-rot": `${p.rot}deg`,
          animation: `celebrateScatter 0.9s ${T.ease.smooth} ${i * 0.03}s both`,
        }}>
          <OrganicShape shapeIndex={p.idx} size={p.size} color={p.color} />
        </div>
      ))}

      {/* Shape line */}
      <div style={{
        position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
        display: "flex", gap: 14, alignItems: "flex-end",
      }}>
        {sectionShapes.map((shapeIdx, naturalSlot) => {
          const isHero = shapeIdx === heroShapeIndex;
          const finalSlot = getFinalSlot(shapeIdx);
          const dx = rearranged ? (finalSlot - naturalSlot) * SLOT_WIDTH : 0;
          const scale = rearranged && isHero ? 2 : 1;
          const liftY = rearranged && isHero ? -8 : 0;

          return (
            <div key={shapeIdx} style={{
              // Bounce in (one-shot, fills forward — stays in final position)
              animation: `celebrateBounce 0.7s ${T.ease.spring} ${0.3 + naturalSlot * 0.08}s both`,
              zIndex: isHero && rearranged ? 2 : 1,
            }}>
              {/* Inner wrapper handles the slide/scale transition separately */}
              <div style={{
                transform: `translateX(${dx}px) translateY(${liftY}px) scale(${scale})`,
                transition: rearranged
                  ? `transform 0.9s ${T.ease.spring}`
                  : "none",
              }}>
                {/* Twirl wrapper: only non-hero shapes twirl, and only after rearranging */}
                <div style={{
                  animation: rearranged && !isHero
                    ? `twirlInPlace 3s ease-in-out ${0.2 * naturalSlot}s infinite`
                    : "none",
                }}>
                  <OrganicShape
                    shapeIndex={shapeIdx}
                    size={20}
                    color={isHero ? T.color.copper : (naturalSlot % 2 === 0 ? T.color.copper : T.color.sage)}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
