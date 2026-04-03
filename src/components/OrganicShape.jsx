import T from "../tokens.js";

/* ━━━ Organic Shape System ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
// Hand-wobbled clip-paths give each shape a slightly imperfect, human feel.
// The progression: triangle(3) → square(4) → pentagon(5) → hexagon(6) → circle(∞)
export const shapeClips = [
  "polygon(50% 4%, 96% 88%, 6% 84%)",
  "polygon(8% 6%, 94% 8%, 92% 94%, 6% 92%)",
  "polygon(50% 3%, 97% 38%, 80% 95%, 20% 95%, 3% 38%)",
  "polygon(50% 2%, 95% 26%, 95% 74%, 50% 98%, 5% 74%, 5% 26%)",
  null, // circle — uses border-radius: 50%
];

const shapeRadius = ["4px", "5px", "4px", "4px", "50%"];

export const sectionShapes = [0, 1, 2, 3, 4];

export default function OrganicShape({ shapeIndex, size = 10, color, style = {} }) {
  return (
    <div style={{
      width: size, height: size, background: color,
      clipPath: shapeClips[shapeIndex] || "none",
      borderRadius: shapeClips[shapeIndex] ? shapeRadius[shapeIndex] : "50%",
      transition: `all 0.5s ${T.ease.smooth}`,
      ...style,
    }} />
  );
}
