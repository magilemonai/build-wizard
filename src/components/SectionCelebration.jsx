import { useState, useEffect } from "react";
import T from "../tokens.js";
import OrganicShape, { sectionShapes } from "./OrganicShape.jsx";

/* ━━━ SectionCelebration ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Staged celebration:
   1. Particles scatter outward
   2. All 5 shapes bounce into a line (natural order)
   3. Hero shape jumps to center, others shuffle to make room
   4. Supporters twirl in place on either side

   heroShapeIndex: the shape that "owns" this section (0-4)
   intensity: escalating particle count (1=light, 2=medium, 3=heavy)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function SectionCelebration({ heroShapeIndex, intensity = 1 }) {
  const [phase, setPhase] = useState(0); // 0=initial bounce, 1=rearranged
  useEffect(() => {
    const t = setTimeout(() => setPhase(1), 1200); // after initial bounce settles
    return () => clearTimeout(t);
  }, []);

  const particleCounts = [6, 10, 14];
  const count = particleCounts[Math.min(intensity - 1, 2)];

  // Deterministic particles (seeded by heroShapeIndex)
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

  // Phase 0: natural order (0,1,2,3,4) with uniform sizes
  // Phase 1: hero in center (position 2), others arranged around it
  const heroIdx = sectionShapes.indexOf(heroShapeIndex);

  // Build final arrangement: hero center, others flanking
  const others = sectionShapes.filter((_, i) => i !== heroIdx);
  const finalOrder = [others[0], others[1], heroShapeIndex, others[2], others[3]];

  return (
    <div style={{ position: "relative", height: 110, marginBottom: 20 }}>
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
        {phase === 0 ? (
          // Phase 0: natural order, bounce in
          sectionShapes.map((shapeIdx, i) => (
            <div key={`p0-${shapeIdx}`} style={{
              animation: `celebrateBounce 0.7s ${T.ease.spring} ${0.3 + i * 0.08}s both`,
            }}>
              <OrganicShape
                shapeIndex={shapeIdx}
                size={20}
                color={i % 2 === 0 ? T.color.copper : T.color.sage}
              />
            </div>
          ))
        ) : (
          // Phase 1: hero grows in place via heroArc scale, others twirl
          finalOrder.map((shapeIdx, i) => {
            const isHero = shapeIdx === heroShapeIndex;
            return (
              <div key={`p1-${shapeIdx}`} style={{
                animation: isHero
                  ? `heroArc 0.9s ${T.ease.spring} 0.1s both`
                  : `twirlInPlace 3s ease-in-out ${0.3 + i * 0.2}s infinite`,
              }}>
                <OrganicShape
                  shapeIndex={shapeIdx}
                  size={20}
                  color={isHero ? T.color.copper : (i % 2 === 0 ? T.color.sage : T.color.copper)}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
