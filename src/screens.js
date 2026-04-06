export const SCREENS = {
  WELCOME: "welcome",
  TRANSITION: "transition",
  INTERVIEW: "interview",
  PATHCARD: "pathcard",
  ICEBREAKER: "icebreaker",
  FOUNDATION: "foundation",
  POWERUP: "powerup",
  SHIP: "ship",
};

/** Ordered list of build sections (used for progress, navigation, persistence) */
export const BUILD_SECTIONS = [
  SCREENS.ICEBREAKER, SCREENS.FOUNDATION, SCREENS.POWERUP, SCREENS.SHIP,
];
