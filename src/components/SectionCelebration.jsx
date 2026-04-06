import T from "../tokens.js";
import OrganicShape, { sectionShapes } from "./OrganicShape.jsx";

/* ━━━ SectionCelebration ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Pure CSS keyframe celebration. No React state changes, no phase
   swaps, no re-renders. Everything is a single render with staggered
   animation delays:

   0.0s-1.0s:  Particles scatter outward
   0.3s-0.7s:  All 5 shapes bounce into a line (natural order)
   1.5s:       Hero shape grows + lifts (CSS keyframe on the element)
               Other shapes begin gentle twirl

   heroShapeIndex: 0-4 (which shape owns this section)
   intensity: 1-3 (particle count)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function SectionCelebration({ heroShapeIndex, intensity = 1 }) {
  const particleCounts = [6, 10, 14];
  const count = particleCounts[Math.min(intensity - 1, 2)];

  // Deterministic particles
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

  return (
    <div style={{ position: "relative", height: 110, marginBottom: 20 }}>
      {/* Scatter particles */}
      {particles.map((p, i) => (
        <div key={`p-${i}`} style={{
          position: "absolute", left: "50%", top: "50%",
          "--scatter-to": `translate(${p.x}px, ${p.y}px)`,
          "--scatter-rot": `${p.rot}deg`,
          animation: `celebrateScatter 0.9s ${T.ease.smooth} ${i * 0.03}s both`,
        }}>
          <OrganicShape shapeIndex={p.idx} size={p.size} color={p.color} />
        </div>
      ))}

      {/* Shape line: all 5 shapes, hero gets special treatment */}
      <div style={{
        position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
        display: "flex", gap: 14, alignItems: "flex-end",
      }}>
        {sectionShapes.map((shapeIdx, i) => {
          const isHero = shapeIdx === heroShapeIndex;
          return (
            <div key={shapeIdx} style={{
              // Step 1: bounce into line (all shapes)
              animation: `celebrateBounce 0.7s ${T.ease.spring} ${0.3 + i * 0.08}s both`,
            }}>
              {/* Step 2: hero grows after bounce settles; others twirl */}
              <div style={{
                animation: isHero
                  ? `heroGrow 0.8s ${T.ease.spring} 1.4s both`
                  : `twirlInPlace 3s ease-in-out ${1.6 + i * 0.15}s infinite`,
              }}>
                <OrganicShape
                  shapeIndex={shapeIdx}
                  size={20}
                  color={i % 2 === 0 ? T.color.copper : T.color.sage}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
