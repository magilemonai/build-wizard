import T from "../tokens.js";
import OrganicShape, { sectionShapes } from "./OrganicShape.jsx";

/* ━━━ SectionCelebration ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Celebration animation for section anchors. The section's own shape
   arcs dramatically into center position. Supporting shapes orbit
   and dance around it.

   heroShapeIndex: the shape that "owns" this section (0-4)
   intensity: escalating particle count (1=light, 2=medium, 3=heavy)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function SectionCelebration({ heroShapeIndex, intensity = 1 }) {
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

  // Supporting shapes: all section shapes except the hero, orbiting around center
  const supporters = sectionShapes.filter((s) => s !== heroShapeIndex);

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

      {/* Supporting shapes: orbit around center */}
      {supporters.map((shapeIdx, i) => {
        const orbitRadius = 40 + i * 6;
        const startDelay = 0.4 + i * 0.12;
        return (
          <div key={`o-${shapeIdx}`} style={{
            position: "absolute",
            left: "50%", top: "50%",
            marginLeft: -10, marginTop: -10,
            "--orbit-r": `${orbitRadius}px`,
            opacity: 0,
            animation: `celebrateBounce 0.7s ${T.ease.spring} ${startDelay}s both, orbitDance 8s linear ${startDelay + 0.7}s infinite`,
          }}>
            <OrganicShape
              shapeIndex={shapeIdx}
              size={18}
              color={i % 2 === 0 ? T.color.sage : T.color.copper}
            />
          </div>
        );
      })}

      {/* Hero shape: dramatic arc into center */}
      <div style={{
        position: "absolute",
        left: "50%", top: "50%",
        marginLeft: -20, marginTop: -20,
        animation: `heroArc 1.2s ${T.ease.spring} 0.2s both`,
        zIndex: 2,
      }}>
        <OrganicShape
          shapeIndex={heroShapeIndex}
          size={40}
          color={T.color.copper}
        />
      </div>
    </div>
  );
}
