# CLAUDE.md — AI Onboarding Wizard

This file captures every design decision, technical pattern, and implementation detail. The PDD (`ai-onboarding-wizard-pdd.md`) describes the vision. This file describes what we actually built, where we deviated, and why.

Read both files before making changes. When they conflict, this file wins.

---

## Project Structure

Vite + React SPA. All five sections built. No external routing library; screen state managed in App.jsx.

```
src/
  App.jsx              # Screen router, interview state, section progress
  tokens.js            # Design tokens (colors, easing, fonts)
  hooks.js             # useIsMobile, usePrefersReducedMotion, getModKey
  main.jsx             # React root + ErrorBoundary
  components/
    BackButton.jsx
    ChoiceButton.jsx     # Stagger-gated selection button
    ContinueButton.jsx   # Copper action button
    ErrorBoundary.jsx    # Crash recovery with "Show details" for testing
    GrainOverlay.jsx     # SVG noise texture
    GuidedStep.jsx       # Teach-then-do pattern for build sections
    InterviewQuestion.jsx
    JourneyProgress.jsx  # Shape-based progress bar (responsive)
    OrganicShape.jsx     # CSS clip-path shape system
    PageTransition.jsx   # Direction-aware animated content swapper
    PathCard.jsx         # Boarding pass layout
    PromptCard.jsx       # Copy-to-clipboard with outcome feedback
    SafetyInterstitial.jsx # "While we're at it" safety lessons
    SectionLabel.jsx
    SectionShell.jsx     # Shared navigation/transition wrapper for sections
    SetupPrompt.jsx
    TextInput.jsx
  sections/
    WelcomeScreen.jsx
    ThresholdInterstitial.jsx  # Auto-advancing section transition
    IceBreaker.jsx       # Section 2: exercises + safety
    Foundation.jsx       # Section 3: prompting, structured output, context
    PowerUp.jsx          # Section 4: system prompts, workflows, tools
    Ship.jsx             # Section 5: review, reflection, next steps
  data/
    interviewSteps.js    # Adaptive question flow
    projectTemplates.js  # 18 templates + matching + path card derivation
  styles/
    global.css           # Reset, keyframes, prefers-reduced-motion
public/
  favicon.svg            # Copper triangle
```

---

## Design System

### Typography
- **Display:** Instrument Serif (italic for headlines). Loaded via `<link>` in index.html (not @import, which caused FOUT).
- **Body:** DM Sans. Clean, legible, good weight range.
- **Do not substitute.** These were chosen specifically.

### Color — Split Accent System
- **Sage (#7A8B6A):** Environmental accent. Selection states, focus rings, past-progress markers, safety interstitials.
- **Copper (#BF7B5E):** Action accent. Primary buttons, active progress, CTAs, skill labels.
- **Background:** Warm cream (#F7F5F0) with SVG noise grain overlay (fixed position, rendered once by GrainOverlay).
- **Text:** Near-black warm (#2C2925), muted (#6B665F), light (#9E9890).
- **Borders/shadows:** All use text color at low opacity. No pure gray.

### The Shape System
Organic CSS shapes using `clip-path` with hand-wobbled polygon coordinates. Progression: triangle(3) → square(4) → pentagon(5) → hexagon(6) → circle(inf). Maps to the five sections.

Shapes appear in: welcome screen falling animation, journey progress bar, welcome journey pills, and the final Ship screen (shapes return as visual climax).

---

## Animation Architecture

### Reduced Motion
All animations respect `prefers-reduced-motion: reduce` via a CSS media query in global.css that sets `animation-duration` and `transition-duration` to near-zero. A `usePrefersReducedMotion` hook is available in hooks.js for any JS-side checks needed.

### Three Motion Types
1. **"page"** — Horizontal slide with slight scale. Used within sections.
2. **"rise"** — Float up with spring easing. Used for reveals (path card).
3. **"threshold"** — Scale with blur effect. Used for section transitions.

### PageTransition Component
Effect 1 watches `transitionKey` only, owns animation timers. Effect 2 watches `children`, updates display child only when NOT mid-transition. A `transitioning` ref prevents interference. Cleanup runs on unmount only.

### Stagger Gating
ChoiceButton animations are gated by `ready` prop. Parent sets `false` during transitions, `true` via `onEntered` callback. Without this, staggers play behind the parent's opacity:0 state.

---

## Section Architecture

### SectionShell Pattern
Sections 3-5 use a shared `SectionShell` component that handles:
- Step index state and direction tracking
- Forward/back navigation with progress reporting
- PageTransition wrapping
- BackButton rendering

Each section provides a step sequence array and a render function. This eliminated ~150 lines of duplicated navigation boilerplate.

### Step Sequence Pattern
Every section defines steps as an array of `{ type, index? }` objects. Types include: `"exercise"`, `"build"`, `"safety"`, `"anchor"`, `"continuity"`, `"review"`, `"reflection"`, `"nextsteps"`. The section's render function switches on type.

### Section Transitions
Auto-advancing ThresholdInterstitial screens between sections. Config stored in `SECTION_TRANSITIONS` lookup in App.jsx. Transitions are skipped on re-entry (tracked via a `visited` Set ref).

---

## Screen Flow

```
welcome → transition → interview (8 questions) → pathcard
  → icebreaker-transition → icebreaker (5 steps)
  → foundation-transition → foundation (6 steps)
  → powerup-transition → powerup (6 steps)
  → ship-transition → ship (4 steps)
```

App.jsx manages: `screen` (current screen), `answers` (accumulated interview data), `sectionProgress` (one object for all sections), `visited` (Set of sections seen).

Document title updates per screen via SECTION_TITLES lookup.

---

## Interview Flow — Deviations from PDD

### Restructured Question Order
PDD: assessment → fork → project scoping → calibration.
We changed to: **fork → project idea → assessment → adaptive follow-up → calibration.**
Project conversation comes first because the welcome screen promises "We'll figure out what you want to make."

### What Each Answer Drives
- `fork`: Project prompts throughout all sections (work vs personal framing)
- `project_idea`: Keyword-matched for path card; interpolated into every prompt in Sections 2-5
- `experience`: Ice Breaker exercise difficulty (novice gets plain-language, experienced gets Python), follow-up question variant, path card level label
- `code_feeling`: Section 4 tools step (comfortable users get Claude Code intro, others get capabilities overview); next steps personalization
- `long_output`: Adjusts "what you'll learn" text on path card
- `time`: Path card duration estimate (adjusted to be honest: 30min→~45min, 1hr→~60min)
- `setup`: Setup prompt on path card screen

---

## Section Details

### Section 2: Ice Breaker
3 exercises + 1 safety interstitial + anchor. Exercises adapt by experience level:
- **Novice:** Plain-language prompts, no code execution assumed
- **Experienced:** Python scripts with "run it" framing

Safety lessons consolidated into one card after exercise 2 (data privacy + review-before-run). Exercises 1-2 flow uninterrupted to build momentum.

Exercise 3 bridges to the user's project idea from Section 1.

### Section 3: Foundation
Conversation continuity note → 3 guided builds + safety + anchor.

Skills: prompting well, structured output, adding personal context. Each prompt adapts for work/personal and interpolates the user's project idea.

Opens with a continuity note explaining to keep the same Claude conversation open.

Safety: hallucination awareness (all users) + data handling (work users only).

### Section 4: Power Up
4 guided builds + safety + anchor.

Skills: system prompts, multi-step workflows (draft-critique-revise), tools/Claude Code.

Includes a "roast your project" exercise between workflows and tools as a playful break that secretly reinforces the critique pattern.

Tools step adapts based on `code_feeling`.

Safety: permission scoping (valet keys analogy) + prompt injection awareness.

### Section 5: Ship
Review → safety (the long game) → reflection → next steps.

Review: one final prompt asking Claude to walk through what was built.

Reflection: dynamic skills checklist (skipped items shown with strikethrough). Personalized message based on experience level and fork.

Next steps: personalized recommendations based on interview data. Final screen: organic shapes return with staggered animation + "Open Claude" link.

---

## Component Notes

### PromptCard
- Copy-to-clipboard with navigator.clipboard API
- Detects `[placeholder]` brackets in prompt text; shows "fill in the [brackets] before pasting" warning on copy with extended 4s display
- Outcome choices are contextual via `outcomeLabels` prop: "It worked!" for exercises, "Output looks good" for guided builds, "Review done" for review
- Brief celebration/acknowledgment beat before advancing (800ms for success, 400ms for others)

### GuidedStep
The teach-then-do component for Sections 3-4. Structure: skill label (copper) → headline → explanation → "The move:" tip callout → PromptCard → hint.

### SafetyInterstitial
Sage-tinted "While we're at it" pattern. Used across all sections with varying content. The label "While we're at it" is consistent; the title and content change.

---

## Project Template Lookup Table

18 pre-written templates (10 personal, 8 work). Client-side keyword matching via `input.toLowerCase().includes(keyword)`.

**When Claude API is integrated:** The API's job narrows to "pick the best template and personalize the framing." The lookup table becomes the template library the API selects from.

---

## Testing & Development

### Restart
- **Keyboard:** Ctrl+Shift+R resets all state to welcome screen
- **Console:** `window.__restart()` for programmatic reset
- Useful for testing different interview paths without hard refresh

### Error Handling
- ErrorBoundary wraps the entire app
- "Show details" toggle reveals error message and component stack trace
- Errors logged to console with `[Build Wizard Error]` prefix
- Friendly recovery UI with Refresh button

### Testing Checklist
Test three paths: newcomer/personal, experienced/work, fallback/obscure project idea. Check:
- Adaptive content (exercise difficulty, prompt framing, safety variants)
- Navigation (back works everywhere, transitions skip on re-entry)
- Progress bar fills across all sections
- Tab title updates per section
- Copy + placeholder warning behavior
- Final screen shapes + Open Claude link

Log bugs in `testing-notes.md` with format: `- [ ] [Section] Description`

---

## Responsive Behavior

- **Breakpoint:** 480px (single breakpoint, `useIsMobile` hook)
- **Below 480px:** Journey progress collapses to dots + active label. Textarea keyboard hint hidden. Mobile users see copper-tinted callout on welcome screen recommending desktop.
- **Above 480px:** Full journey progress with labels. Desktop note is a subtle text line.

---

## Known Issues & Watch-Fors

- Path card notch circles use `background: T.color.bg` to fake the perforation cutout. Breaks over different backgrounds. Would need CSS mask for robustness.
- Keyword matching is substring-based (`includes`), not word-boundary. "recipe" matches "prescribe." Low-risk given the domain but fragile.
- The grain overlay SVG filter may cause performance issues on low-end mobile. Consider a static PNG noise tile as fallback.
- Section prompts assume conversational continuity in Claude (each builds on the previous). Foundation opens with a note about this, but there's no technical enforcement.

---

## Not Yet Built

- Claude API integration for adaptive interview and project scoping
- Progress persistence (localStorage for pause-and-return)
- Quick Path variant (compressed version for 30-minute users)
- Clickable journey progress bar for section navigation

---

## Development Workflow

### Self-Critique Pattern
After building a feature, run a structured critique through five lenses before shipping:
1. **Code:** Architecture, duplication, performance, error handling
2. **Design:** Visual consistency, rhythm, monotony, climax
3. **UX:** Navigation, friction, assumptions, dead ends
4. **Product:** Promise vs delivery, unused data, broken contracts
5. **Alpha user:** Tab-switching fatigue, delight curve, pacing, confusion

Prioritize findings as P0 (blocking), P1 (important), P2 (quality), P3 (polish). Implement in order. This process caught significant issues in every round.

---

## Deployment Plan

- **Static hosting:** GitHub Pages serves the Vite build output (`dist/`)
- **CDN:** Cloudflare in front of GitHub Pages
- **API proxy:** Cloudflare Worker handles Claude API calls, keeps API key server-side
- **Cost:** ~$0.15-$0.50 per user for API calls (see PDD Section 7)

---

## Style Rules for This Project

The user prefers:
- Analogies when explaining concepts
- No em-dashes in writing deliverables
- No "It's not just X, it's Y" formulations
- Clean, direct prose
