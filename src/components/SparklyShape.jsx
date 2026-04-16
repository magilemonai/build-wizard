import T from "../tokens.js";
import OrganicShape from "./OrganicShape.jsx";

/* ━━━ SparklyShape ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Slow-spinning organic shape with two pulsing sparkle dots.
   Decorative accent used throughout the Launcher. Uses gentleSpin
   and sparkle keyframes from global.css.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function SparklyShape({
  shapeIndex = 0,
  color,
  size = 32,
  container = 36,
  spinDuration = 12,
  sparkleOffset = 0,
}) {
  const fill = color || T.color.copper;
  return (
    <div style={{
      position: "relative", width: container, height: container,
      display: "inline-block", verticalAlign: "middle",
      flexShrink: 0,
    }}>
      <div style={{
        animation: `gentleSpin ${spinDuration}s linear infinite`,
        animationDelay: `${sparkleOffset}s`,
        lineHeight: 0,
        width: container, height: container,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <OrganicShape shapeIndex={shapeIndex} size={size} color={fill} />
      </div>
      {[
        { top: -4, right: -2, delay: 0 },
        { bottom: -2, left: 2, delay: 0.6 },
      ].map((pos, i) => (
        <div key={i} style={{
          position: "absolute",
          top: pos.top, right: pos.right, bottom: pos.bottom, left: pos.left,
          width: 5, height: 5,
          borderRadius: "50%", background: fill,
          animation: `sparkle 2s ease-in-out ${pos.delay + sparkleOffset}s infinite`,
        }} />
      ))}
    </div>
  );
}

/** Copper triangle variant — used throughout the Cockpit stage. */
export function SparklyTriangle(props) {
  return <SparklyShape shapeIndex={0} color={T.color.copper} {...props} />;
}

/** Sage square variant — used throughout the Interview stage. */
export function SparklySquare(props) {
  return <SparklyShape shapeIndex={1} color={T.color.sage} {...props} />;
}

/** Sage pentagon variant — used throughout the Build stage. */
export function SparklyPentagon(props) {
  return <SparklyShape shapeIndex={2} color={T.color.sage} {...props} />;
}
