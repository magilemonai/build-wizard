import { useState, useEffect } from "react";
import T from "../tokens.js";
import OrganicShape, { sectionShapes } from "./OrganicShape.jsx";

/* ━━━ SectionCelebration ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Staged celebration:
   1. Particles scatter outward
   2. All 5 shapes bounce into a line (natural order)
   3. Hero leaps from its position to center, grows large
      Other shapes slide aside to make room, then twirl in place

   heroShapeIndex: 0=triangle, 1=square, 2=pentagon, 3=hexagon, 4=circle
   intensity: 1=light, 2=medium, 3=heavy (particle count)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

// Each slot is ~34px apart (20px shape + 14px gap)
const SLOT_WIDTH = 34;

export default function SectionCelebration({ heroShapeIndex, intensity = 1 }) {
  const [phase, setPhase] = useState(0); // 0=bouncing in, 1=rearranging
  useEffect(() => {
    const t = setTimeout(() => setPhase(1), 1200);
    return () => clearTimeout(t);
  }, []);

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
    const isCopper = i % 2 === 0;
    const alphas = ["", "88", "66"];
    const baseColor = isCopper ? T.raw.copper : T.raw.sage;
    particles.push({ x, y, rot, idx: shapeIdx, size, color: baseColor + alphas[i % 3] });
  }

  const heroNaturalPos = heroShapeIndex; // 0-4, position in the line
  const centerPos = 2;

  // In rearranged state: hero at center, others fill remaining slots
  // Calculate how each shape needs to shift
  function getTransform(shapeIdx, slotIdx) {
    if (phase === 0) return { x: 0, scale: 1 };

    const isHero = shapeIdx === heroShapeIndex;
    if (isHero) {
      // Hero leaps from its natural position to center
      const dx = (centerPos - heroNaturalPos) * SLOT_WIDTH;
      return { x: dx, scale: 2, isHero: true };
    }

    // Non-hero: figure out where this shape needs to go in the final arrangement
    // Final order: [others[0], others[1], HERO, others[2], others[3]]
    const others = sectionShapes.filter((s) => s !== heroShapeIndex);
    const otherIdx = others.indexOf(shapeIdx);
    const finalSlot = otherIdx < 2 ? otherIdx : otherIdx + 1; // skip center slot
    const dx = (finalSlot - slotIdx) * SLOT_WIDTH;
    return { x: dx, scale: 1 };
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

      {/* Shape line: same elements, just animated with CSS transforms */}
      <div style={{
        position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
        display: "flex", gap: 14, alignItems: "flex-end",
      }}>
        {sectionShapes.map((shapeIdx, i) => {
          const t = getTransform(shapeIdx, i);
          const isHero = shapeIdx === heroShapeIndex;
          return (
            <div key={shapeIdx} style={{
              // Phase 0: bounce in
              animation: phase === 0
                ? `celebrateBounce 0.7s ${T.ease.spring} ${0.3 + i * 0.08}s both`
                : (!isHero ? `twirlInPlace 3s ease-in-out ${0.3 + i * 0.2}s infinite` : "none"),
              // Phase 1: slide/scale to final position
              transform: `translateX(${t.x}px) translateY(${isHero && phase === 1 ? "-6px" : "0"}) scale(${t.scale})`,
              transition: phase === 1 ? `all 0.8s ${T.ease.spring}` : "none",
              zIndex: isHero ? 2 : 1,
            }}>
              <OrganicShape
                shapeIndex={shapeIdx}
                size={20}
                color={isHero && phase === 1 ? T.color.copper : (i % 2 === 0 ? T.color.copper : T.color.sage)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
