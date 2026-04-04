import { useState, useEffect, useRef } from "react";
import T from "../tokens.js";

/* ━━━ Page Transition (direction-aware, race-safe) ━━━━━━━━━━━━━━ */
export default function PageTransition({ children, transitionKey, type = "page", direction = 1, onEntered }) {
  const [displayChild, setDisplayChild] = useState(children);
  const [phase, setPhase] = useState("visible");
  const prevKey = useRef(transitionKey);
  const timers = useRef([]);
  const transitioning = useRef(false);
  const latestChildren = useRef(children);
  latestChildren.current = children;

  // Handle transition key changes only
  useEffect(() => {
    if (transitionKey !== prevKey.current) {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      prevKey.current = transitionKey;
      transitioning.current = true;
      setPhase("exiting");

      const t1 = setTimeout(() => {
        setDisplayChild(latestChildren.current);
        setPhase("entering");
        const t2 = setTimeout(() => {
          setPhase("visible");
          transitioning.current = false;
          onEntered?.();
        }, 40);
        timers.current.push(t2);
      }, 280);
      timers.current.push(t1);
    }
  }, [transitionKey]);

  // Update children when NOT mid-transition
  useEffect(() => {
    if (!transitioning.current) {
      setDisplayChild(children);
    }
  }, [children]);

  // Cleanup on unmount only
  useEffect(() => {
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const dir = direction;
  const styles = {
    page: {
      exiting:  { opacity: 0, transform: `translateX(${-50 * dir}px) scale(0.97)`, transition: `all 0.28s ${T.ease.page}` },
      entering: { opacity: 0, transform: `translateX(${50 * dir}px) scale(0.97)`, transition: "none" },
      visible:  { opacity: 1, transform: "translateX(0) scale(1)", transition: `all 0.45s ${T.ease.smooth}` },
    },
    rise: {
      exiting:  { opacity: 0, transform: "scale(0.94)", transition: `all 0.28s ${T.ease.page}` },
      entering: { opacity: 0, transform: "translateY(36px) scale(0.96)", transition: "none" },
      visible:  { opacity: 1, transform: "translateY(0) scale(1)", transition: `all 0.55s ${T.ease.spring}` },
    },
  };

  return <div style={styles[type]?.[phase] || styles.page[phase]}>{displayChild}</div>;
}
