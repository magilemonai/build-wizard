import T from "../tokens.js";
import OrganicShape, { sectionShapes } from "./OrganicShape.jsx";

/* ━━━ SectionCelebration ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Section's hero shape arcs dramatically into center of a line.
   Supporting shapes bounce in on either side and twirl in place.
   Scatter particles burst outward.

   heroShapeIndex: the shape that "owns" this section (0-4)
   intensity: escalating particle count (1=light, 2=medium, 3=heavy)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function SectionCelebration({ heroShapeIndex, intensity = 1 }) {
  const particleCounts = [6, 10, 14];
  const count = particleCounts[Math.min(intensity - 1, 2)];

  // Generate scatter particles (seeded by heroShapeIndex for stability)
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
    const alpha = alphas[i % 3];
    const baseColor = isCopper ? T.raw.copper : T.raw.sage;
    particles.push({ x, y, rot, idx: shapeIdx, size, color: baseColor + alpha });
  }

  // Build the line: supporters on sides, hero in center
  // Order: 2 left supporters | hero | 2 right supporters
  const allShapes = sectionShapes.slice();
  const heroPos = allShapes.indexOf(heroShapeIndex);
  const supporters = allShapes.filter((s) => s !== heroShapeIndex);
  const lineOrder = [
    { idx: supporters[0], size: 18, color: T.color.sage, isHero: false },
    { idx: supporters[1], size: 20, color: T.color.copper, isHero: false },
    { idx: heroShapeIndex, size: 40, color: T.color.copper, isHero: true },
    { idx: supporters[2], size: 20, color: T.color.sage, isHero: false },
    { idx: supporters[3], size: 18, color: T.color.copper, isHero: false },
  ];

  return (
    <div style={{ position: "relative", height: 110, marginBottom: 20 }}>
      {/* Scatter particles: burst outward */}
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

      {/* Shape line: bounce in then twirl */}
      <div style={{
        position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
        display: "flex", gap: 14, alignItems: "flex-end",
      }}>
        {lineOrder.map((s, i) => (
          <div key={`l-${i}`} style={{
            animation: s.isHero
              ? `heroArc 1.1s ${T.ease.spring} 0.2s both`
              : `celebrateBounce 0.7s ${T.ease.spring} ${0.3 + i * 0.08}s both, twirlInPlace 3s ease-in-out ${1.2 + i * 0.25}s infinite`,
          }}>
            <OrganicShape shapeIndex={s.idx} size={s.size} color={s.color} />
          </div>
        ))}
      </div>
    </div>
  );
}
