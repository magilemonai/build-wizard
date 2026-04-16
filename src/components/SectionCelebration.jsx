import T from "../tokens.js";
import OrganicShape, { sectionShapes } from "./OrganicShape.jsx";

/* ━━━ SectionCelebration ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Pure CSS celebration. Five organic shapes line up at the bottom;
   a chosen "hero" leaps to center; scatter particles fly outward.

   Variants set the overall feel:
     - small        : Cockpit. Gentle, few particles. "Nice work."
     - small_medium : Interview. Slightly more energy, more particles.
     - medium       : Launch. Satisfying confirmation.
     - big          : Build assembly. Climax. Big hero leap, burst,
                      lots of scatter. "Holy shit, I did that."
     - finale       : Keep Going send-off. No single hero; every
                      shape dances equally. Warmer color mix, longer
                      ambient motion. The curtain call.

   Legacy: `intensity={1|2|3}` still works and maps to small/medium/
   big for any callers that haven't migrated to named variants.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const VARIANTS = {
  small: {
    particles: 6,
    scatterRadiusBase: 46, scatterRadiusRange: 70,
    heroSize: 18, lineSize: 18,
    heroScale: 1.4,
    burst: false,
    allEqual: false,
    containerHeight: 100,
    sparkleDusting: false,
  },
  small_medium: {
    particles: 10,
    scatterRadiusBase: 52, scatterRadiusRange: 90,
    heroSize: 20, lineSize: 20,
    heroScale: 1.5,
    burst: false,
    allEqual: false,
    containerHeight: 110,
    sparkleDusting: false,
  },
  medium: {
    particles: 14,
    scatterRadiusBase: 56, scatterRadiusRange: 100,
    heroSize: 22, lineSize: 20,
    heroScale: 1.6,
    burst: false,
    allEqual: false,
    containerHeight: 120,
    sparkleDusting: false,
  },
  big: {
    particles: 22,
    scatterRadiusBase: 70, scatterRadiusRange: 160,
    heroSize: 30, lineSize: 24,
    heroScale: 1.9,
    burst: true,           // extra radial burst sparkles
    allEqual: false,
    containerHeight: 150,
    sparkleDusting: true,  // small background dots
  },
  finale: {
    particles: 18,
    scatterRadiusBase: 62, scatterRadiusRange: 130,
    heroSize: 24, lineSize: 22,
    heroScale: 1.2,        // de-emphasize the hero; everyone dances
    burst: false,
    allEqual: true,        // no single hero; each shape gets its own gentle dance
    containerHeight: 140,
    sparkleDusting: true,
    warm: true,            // balanced copper/sage mix
    longFloat: true,
  },
};

const LEGACY_INTENSITY = { 1: "small", 2: "medium", 3: "big" };

const SLOT = 30; // 20px shape + 10px gap

export default function SectionCelebration({ heroShapeIndex = 0, intensity, variant }) {
  const variantKey = variant || LEGACY_INTENSITY[intensity] || "small";
  const cfg = VARIANTS[variantKey] || VARIANTS.small;

  // ── Scatter particles ─────────────────────────────────────────
  const particles = [];
  for (let i = 0; i < cfg.particles; i++) {
    const angle = (i / cfg.particles) * Math.PI * 2 + (heroShapeIndex * 0.7);
    const radius = cfg.scatterRadiusBase + ((i * 13) % cfg.scatterRadiusRange);
    const x = Math.cos(angle) * radius;
    const y = -30 - (i * 17) % 70;
    const rot = ((i * 47) % 120) - 60;
    const shapeIdx = sectionShapes[i % 5];
    const size = 5 + (i * 3) % 6;
    const alphas = ["", "88", "66"];
    // Finale: alternate evenly so neither copper nor sage dominates
    const baseColor = cfg.warm
      ? (i % 2 === 0 ? T.raw.copper : T.raw.sage)
      : (i % 2 === 0 ? T.raw.copper : T.raw.sage);
    particles.push({
      x, y, rot, idx: shapeIdx, size,
      color: baseColor + alphas[i % 3],
      delay: i * 0.025,
    });
  }

  // ── Burst particles (big variant only) ────────────────────────
  // Extra sparkles that fly out further, on a slightly different
  // timing. Gives "big" a visibly more explosive feel.
  const burstParticles = [];
  if (cfg.burst) {
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 + 0.3;
      const radius = 140 + (i * 11) % 60;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * 0.7 - 20;
      burstParticles.push({
        x, y,
        rot: (i * 37) % 180 - 90,
        size: 4 + (i * 2) % 4,
        color: (i % 2 === 0 ? T.raw.copper : T.raw.sage) + "aa",
        delay: 0.15 + i * 0.03,
      });
    }
  }

  // ── Background dusting (big + finale) ─────────────────────────
  const dustParticles = [];
  if (cfg.sparkleDusting) {
    for (let i = 0; i < 8; i++) {
      dustParticles.push({
        x: ((i * 53) % 200) - 100,
        y: -((i * 29) % 80) - 10,
        size: 3,
        delay: 0.4 + (i * 0.15),
        color: (i % 2 === 0 ? T.raw.copper : T.raw.sage) + "66",
      });
    }
  }

  // ── Shape line arrangement ────────────────────────────────────
  const others = sectionShapes.filter((s) => s !== heroShapeIndex);
  const HERO_PADDING = 12;

  function getMoveX(shapeIdx, naturalSlot) {
    if (cfg.allEqual) return 0; // finale: everyone stays in their natural slot
    if (shapeIdx === heroShapeIndex) {
      return (2 - naturalSlot) * SLOT; // hero → center
    }
    const oi = others.indexOf(shapeIdx);
    const finalSlot = oi < 2 ? oi : oi + 1;
    const base = (finalSlot - naturalSlot) * SLOT;
    if (finalSlot < 2) return base - HERO_PADDING;
    if (finalSlot > 2) return base + HERO_PADDING;
    return base;
  }

  const floatDuration = cfg.longFloat ? 3.6 : 2.5;
  const twirlDuration = cfg.longFloat ? 4.6 : 3.5;

  return (
    <div style={{
      position: "relative",
      height: cfg.containerHeight,
      marginBottom: 20,
    }}>
      {/* Scatter particles */}
      {particles.map((p, i) => (
        <div key={`p-${i}`} style={{
          position: "absolute", left: "50%", top: "50%",
          "--scatter-to": `translate(${p.x}px, ${p.y}px)`,
          "--scatter-rot": `${p.rot}deg`,
          animation: `celebrateScatter 0.9s ${T.ease.smooth} ${p.delay}s both`,
        }}>
          <OrganicShape shapeIndex={p.idx} size={p.size} color={p.color} />
        </div>
      ))}

      {/* Burst particles (big only) */}
      {burstParticles.map((p, i) => (
        <div key={`b-${i}`} style={{
          position: "absolute", left: "50%", top: "50%",
          "--scatter-to": `translate(${p.x}px, ${p.y}px)`,
          "--scatter-rot": `${p.rot}deg`,
          animation: `celebrateScatter 1.3s ${T.ease.smooth} ${p.delay}s both`,
        }}>
          <div style={{
            width: p.size, height: p.size, borderRadius: "50%",
            background: p.color,
          }} />
        </div>
      ))}

      {/* Background dusting */}
      {dustParticles.map((d, i) => (
        <div key={`d-${i}`} style={{
          position: "absolute", left: "50%", top: "50%",
          transform: `translate(${d.x}px, ${d.y}px)`,
          width: d.size, height: d.size, borderRadius: "50%",
          background: d.color,
          animation: `sparkle 2.4s ease-in-out ${d.delay}s infinite`,
        }} />
      ))}

      {/* Shape line */}
      <div style={{
        position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
        display: "flex", gap: 10, alignItems: "flex-end",
      }}>
        {sectionShapes.map((shapeIdx, i) => {
          const isHero = !cfg.allEqual && shapeIdx === heroShapeIndex;
          const moveX = getMoveX(shapeIdx, i);

          return (
            <div key={shapeIdx} style={{
              animation: `celebrateBounce 0.7s ${T.ease.spring} ${0.3 + i * 0.08}s both`,
            }}>
              <div style={{
                "--move-x": `${moveX}px`,
                transformOrigin: isHero ? "bottom center" : "center",
                animation: isHero
                  ? `heroLeap 2s linear 1.4s both`
                  : `shapeSlide 1.2s ${T.ease.smooth} 1.6s both`,
              }}>
                <div style={{
                  transformOrigin: "center center",
                  animation: isHero
                    ? `heroSpin 4s ease-in-out 3.8s infinite`
                    : `snakeWave ${floatDuration}s ease-in-out ${3.0 + i * 0.25}s infinite, twirlInPlace ${twirlDuration}s ease-in-out ${3.0 + i * 0.2}s infinite`,
                }}>
                  <OrganicShape
                    shapeIndex={shapeIdx}
                    size={isHero ? cfg.heroSize : cfg.lineSize}
                    color={cfg.warm
                      ? (i % 2 === 0 ? T.color.copper : T.color.sage)
                      : (i % 2 === 0 ? T.color.copper : T.color.sage)}
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
