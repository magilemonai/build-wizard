import T from "../tokens.js";
import OrganicShape, { sectionShapes } from "./OrganicShape.jsx";

/* ━━━ SectionCelebration ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Pure CSS celebration. Each shape gets a custom --move-x property
   that tells it where to slide after the initial bounce.

   The hero slides to center and grows. Other shapes shift to fill
   around it, avoiding collisions. Then everyone snakes and twirls.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const SLOT = 40; // 20px shape + 20px gap

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

  // Calculate final slot for each shape after rearrangement.
  // Goal: hero goes to center (slot 2), others fill remaining slots in order.
  const heroNatural = heroShapeIndex;
  const others = sectionShapes.filter((s) => s !== heroShapeIndex);
  // Final arrangement: [others[0], others[1], HERO, others[2], others[3]]

  function getMoveX(shapeIdx, naturalSlot) {
    if (shapeIdx === heroShapeIndex) {
      return (2 - naturalSlot) * SLOT; // hero → center
    }
    const oi = others.indexOf(shapeIdx);
    const finalSlot = oi < 2 ? oi : oi + 1; // skip slot 2 (hero's spot)
    return (finalSlot - naturalSlot) * SLOT;
  }

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
          const moveX = getMoveX(shapeIdx, i);

          return (
            <div key={shapeIdx} style={{
              // Layer 1: bounce into line
              animation: `celebrateBounce 0.7s ${T.ease.spring} ${0.3 + i * 0.08}s both`,
            }}>
              {/* Layer 2: slide to final position (hero AND others) */}
              <div style={{
                "--move-x": `${moveX}px`,
                animation: isHero
                  ? `heroLeap 1.4s ${T.ease.smooth} 1.4s both`
                  : `shapeSlide 1s ${T.ease.smooth} 1.6s both`,
              }}>
                {/* Layer 3: ambient motion after rearrangement */}
                <div style={{
                  animation: isHero
                    ? "none"
                    : `snakeWave 2.5s ease-in-out ${3.0 + i * 0.25}s infinite, twirlInPlace 3.5s ease-in-out ${3.0 + i * 0.2}s infinite`,
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
