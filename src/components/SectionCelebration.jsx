import T from "../tokens.js";
import OrganicShape, { sectionShapes } from "./OrganicShape.jsx";

/* ━━━ SectionCelebration ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Pure CSS keyframe celebration:

   0.0-0.9s:  Particles scatter
   0.3-0.7s:  All 5 shapes bounce into a line
   1.4s:      Hero leaps up, arcs to center, lands big
   1.8s+:     Others twirl; whole line snakes up and down
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

// Slot spacing: 20px shape + 14px gap = 34px per slot
// 20px shape + 20px gap = 40px per slot (extra gap avoids collisions at 1.5x scale)
const SLOT = 40;
const CENTER = 2;

export default function SectionCelebration({ heroShapeIndex, intensity = 1 }) {
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

  // How far the hero needs to leap horizontally (in px)
  const heroNatural = heroShapeIndex; // natural slot = shape index
  const heroLeapX = (CENTER - heroNatural) * SLOT;

  return (
    <div style={{ position: "relative", height: 120, marginBottom: 20 }}>
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

      {/* Shape line */}
      <div style={{
        position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
        display: "flex", gap: 20, alignItems: "flex-end",
      }}>
        {sectionShapes.map((shapeIdx, i) => {
          const isHero = shapeIdx === heroShapeIndex;
          return (
            <div key={shapeIdx} style={{
              // Layer 1: bounce into line
              animation: `celebrateBounce 0.7s ${T.ease.spring} ${0.3 + i * 0.08}s both`,
            }}>
              {/* Layer 2: hero leaps to center; others get snake wave */}
              <div style={{
                "--leap-x": `${heroLeapX}px`,
                animation: isHero
                  ? `heroLeap 1.3s ${T.ease.smooth} 1.4s both`
                  : `snakeWave 2.5s ease-in-out ${2.2 + i * 0.25}s infinite`,
              }}>
                {/* Layer 3: twirl (non-hero only) */}
                <div style={{
                  animation: !isHero
                    ? `twirlInPlace 3s ease-in-out ${2.8 + i * 0.15}s infinite`
                    : "none",
                }}>
                  <OrganicShape
                    shapeIndex={shapeIdx}
                    size={20}
                    color={i % 2 === 0 ? T.color.copper : T.color.sage}
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
