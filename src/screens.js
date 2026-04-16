export const SCREENS = {
  ORIENTATION: "orientation",
  COCKPIT: "cockpit",
  INTERVIEW: "interview",
  BUILD: "build",
  LAUNCH: "launch",
  KEEP_GOING: "keep_going",
};

/** Ordered list of stages that participate in progress/persistence. */
export const STAGES = [
  SCREENS.ORIENTATION,
  SCREENS.COCKPIT,
  SCREENS.INTERVIEW,
  SCREENS.BUILD,
  SCREENS.LAUNCH,
  SCREENS.KEEP_GOING,
];

/** Stages that have a celebration shape (everything except Orientation). */
export const SHAPED_STAGES = [
  SCREENS.COCKPIT,
  SCREENS.INTERVIEW,
  SCREENS.BUILD,
  SCREENS.LAUNCH,
  SCREENS.KEEP_GOING,
];
