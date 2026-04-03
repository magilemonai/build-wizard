import { useState, useEffect } from "react";

/* ━━━ Platform detection ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function getModKey() {
  if (typeof navigator === "undefined") return "⌘";
  if (/Mac|iPhone|iPad/.test(navigator.userAgent ?? "")) return "⌘";
  return "Ctrl";
}

const isMobile = () =>
  typeof window !== "undefined" && window.innerWidth < 480;

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
