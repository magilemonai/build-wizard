import { useState, useEffect } from "react";

/* ━━━ Platform detection ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function getModKey() {
  if (typeof navigator === "undefined") return "⌘";
  if (/Mac|iPhone|iPad/.test(navigator.userAgent ?? "")) return "⌘";
  return "Ctrl";
}

const isMobile = () =>
  typeof window !== "undefined" && window.innerWidth < 480;

/* ━━━ Reduced motion detection ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const h = (e) => setReduced(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return reduced;
}

/* ━━━ Responsive hook ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function useIsMobile() {
  const [mobile, setMobile] = useState(isMobile);
  useEffect(() => {
    const h = () => setMobile(isMobile());
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return mobile;
}
