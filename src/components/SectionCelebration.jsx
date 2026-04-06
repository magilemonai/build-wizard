import T from "../tokens.js";
import OrganicShape, { sectionShapes } from "./OrganicShape.jsx";

/* ━━━ SectionCelebration ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Celebration animation for section anchors. The section's own shape
   gets hero sizing (center, largest). Other shapes support.

   heroShapeIndex: the shape that "owns" this section (0-4)
   intensity: escalating particle count (1=light, 2=medium, 3=heavy)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function SectionCelebration({ heroShapeIndex, intensity = 1 }) {
  // Scatter particles: more particles at higher intensity
  const particleCounts = [6, 10, 14];
  const count = particleCounts[Math.min(intensity - 1, 2)];

  const particles = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + (i * 0.3);
    const radius = 50 + Math.random() * 80;
    const x = Math.cos(angle) * radius;
    const y = -30 - Math.random() * 70;
    const rot = (Math.random() - 0.5) * 120;
    const shapeIdx = sectionShapes[i % 5];
    const size = 5 + Math.random() * 6;
    const isCopper = i % 2 === 0;
    const alpha = Math.random() > 0.5 ? "" : (Math.random() > 0.5 ? "88" : "66");
    const baseColor = isCopper ? T.raw.copper : T.raw.sage;
    particles.push({ x, y, rot, idx: shapeIdx, size, color: baseColor + alpha });
  }

  // Bottom row: all 5 shapes, hero shape is biggest and centered
  const bottomShapes = sectionShapes.map((shapeIdx, i) => {
    const isHero = shapeIdx === heroShapeIndex;
    return {
      idx: shapeIdx,
      size: isHero ? 36 : 20,
      color: i % 2 === 0 ? T.color.copper : T.color.sage,
      isHero,
    };
  });

  return (
    <div style={{ position: "relative", height: 100, marginBottom: 20 }}>
      {particles.map((p, i) => (
        <div key={`s-${i}`} style={{
          position: "absolute", left: "50%", top: "60%",
          "--scatter-to": `translate(${p.x}px, ${p.y}px)`,
          "--scatter-rot": `${p.rot}deg`,
          animation: `celebrateScatter 0.9s ${T.ease.smooth} ${i * 0.03}s both`,
        }}>
          <OrganicShape shapeIndex={p.idx} size={p.size} color={p.color} />
        </div>
      ))}
      <div style={{
        position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
        display: "flex", gap: 14, alignItems: "flex-end",
      }}>
        {bottomShapes.map((s, i) => (
          <div key={s.idx} style={{
            animation: `celebrateBounce ${s.isHero ? "0.9s" : "0.7s"} ${T.ease.spring} ${0.3 + i * 0.08}s both, celebrateFloat ${s.isHero ? "3s" : "4s"} ease-in-out ${1.2 + i * 0.3}s infinite`,
          }}>
            <OrganicShape shapeIndex={s.idx} size={s.size} color={s.color} />
          </div>
        ))}
      </div>
    </div>
  );
}
