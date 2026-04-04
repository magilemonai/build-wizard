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
    InterviewQuestion.jsx # With governance notice gating
    JourneyProgress.jsx  # Shape-based progress bar (responsive)
    OrganicShape.jsx     # CSS clip-path shape system
    PageTransition.jsx   # Direction-aware animated content swapper
    PathCard.jsx         # Project plan card
    PromptCard.jsx       # Copy-to-clipboard with outcome feedback
    SafetyInterstitial.jsx # Multi-step "While we're at it" safety lessons
    SectionLabel.jsx
    SectionShell.jsx     # Shared navigation/transition wrapper for all sections
    SetupPrompt.jsx      # Claude setup with clickable link
    TextInput.jsx
  sections/
    WelcomeScreen.jsx    # With clickable claude.ai link
    ThresholdInterstitial.jsx  # Auto-advancing section transition
    IceBreaker.jsx       # Section 2: exercises + safety + models intro
    Foundation.jsx       # Section 3: prompting, structured output, context
    PowerUp.jsx          # Section 4: system prompts, workflows, roast, tools
    Ship.jsx             # Section 5: review, save/share, reflection, next steps
  data/
    interviewSteps.js    # Adaptive question flow
    projectTemplates.js  # 18 templates + matching + path card derivation
  styles/
    global.css           # Reset, keyframes, celebrations, prefers-reduced-motion
public/
  favicon.svg            # Copper triangle
```

---

## Design System

### Typography
- **Display:** Instrument Serif (italic for headlines). Loaded via `<link>` in index.html.
- **Body:** DM Sans. Clean, legible, good weight range.
- **Do not substitute.** These were chosen specifically.
- **Sizing:** Headlines use `clamp(26px,5vw,34px)`. Body text is 16px. Hints and secondary text are 15px. Labels are 13px. Base body font-size is 16px. No sub-13px text except progress bar indicators.

### Color — Split Accent System
- **Sage (#7A8B6A):** Environmental accent. Selection states, focus rings, past-progress markers, safety interstitials, checkmarks.
- **Copper (#BF7B5E):** Action accent. Primary buttons, active progress, CTAs, skill labels.
- **Background:** Warm cream (#F7F5F0) with SVG noise grain overlay (fixed position, rendered once by GrainOverlay).
- **Text:** Near-black warm (#2C2925), muted (#6B665F), light (#9E9890).
- **Borders/shadows:** All use text color at low opacity. No pure gray.

### Layout
- **Max content width:** 680px, centered.
- **Side padding:** 20px.
- **Section anchors:** Back button left-aligned, celebration shapes and text centered.
- **Final screen:** Fully centered with scroll-triggered staged animation.

### The Shape System
Organic CSS shapes using `clip-path` with hand-wobbled polygon coordinates. Progression: triangle(3) → square(4) → pentagon(5) → hexagon(6) → circle(inf). Maps to the five sections.

Shapes appear in: welcome screen falling animation, journey progress bar, welcome journey pills, section anchor celebrations (scatter + bounce + float), and the final Ship screen (biggest celebration as climax).

---

## Animation Architecture

### Reduced Motion
All animations respect `prefers-reduced-motion: reduce` via a CSS media query in global.css that sets `animation-duration` and `transition-duration` to near-zero.

### Three Motion Types
1. **"page"** — Horizontal slide with slight scale. Used within sections.
2. **"rise"** — Float up with spring easing. Used for reveals (path card).
3. **"threshold"** — Scale with blur effect. Used for section transitions.

### Celebration Animations
Section anchors use a three-part celebration sequence:
1. **Scatter** — Shapes explode outward from center, rotating and fading (`celebrateScatter`)
2. **Bounce** — Shapes spring up from below with weighty 5-stage overshoot (`celebrateBounce`)
3. **Float** — Landed shapes gently bob with rotation (`celebrateFloat`, infinite loop)

The finale (Ship) is a staged cinematic version: IntersectionObserver waits for 60% visibility, then plays scatter → bounce → text reveal → buttons over 3.2 seconds. Shapes are 36-48px (vs 20-26px in section anchors).

### PageTransition Component
Effect 1 watches `transitionKey` only, owns animation timers. Effect 2 watches `children`, updates display child only when NOT mid-transition. A `transitioning` ref prevents interference.

**Critical:** PromptCard must have a `key` prop (exercise id or prompt text) to prevent state bleeding.

---

## Section Architecture

### SectionShell Pattern
All four build sections (IceBreaker, Foundation, PowerUp, Ship) use a shared `SectionShell` component that handles step navigation, transitions, progress reporting, and BackButton rendering.

### Safety Interstitials — Multi-Step Acknowledgment
SafetyInterstitial supports a `points[]` prop for multi-step acknowledgment. Each click of Continue reveals the next point with a checkmark on the previous one. Button label changes from "Next point" to "Got it" on the last point. Applied to:
- **IceBreaker S2:** 3 points for work (privacy, data, models), 2 for personal (privacy, models)
- **PowerUp S4:** 2 points (permission scoping, prompt injection)
- **Ship S5:** 2 points (scaling habits, monthly audit)

### Governance Notice Gating
When "Something for work" is selected in the interview, clicking Continue the first time is blocked. The notice background darkens and "Noted. Click Continue again to proceed" appears. Forces acknowledgment of workplace AI policies. Resets if selection changes.

### Section Transitions
Auto-advancing ThresholdInterstitial screens between sections. Config stored in `SECTION_TRANSITIONS` lookup in App.jsx. Transitions are skipped on re-entry (tracked via a `visited` Set ref).

### Cross-Section Back Navigation
BackButton appears on every screen, including the first step of each section. Clicking Back on step 0 calls `onBack`, which navigates to the previous section.

---

## Screen Flow

```
welcome → transition → interview (8 questions) → pathcard
  → icebreaker-transition → icebreaker (5 steps)
  → foundation-transition → foundation (6 steps)
  → powerup-transition → powerup (6 steps)
  → ship-transition → ship (5 steps)
```

App.jsx manages: `screen`, `answers`, `sectionProgress` (one object, stable updaters via useMemo), `visited` (Set). Document title updates per screen via SECTION_TITLES lookup.

---

## Interview Flow — Deviations from PDD

### Restructured Question Order
**fork → project idea → assessment → adaptive follow-up → calibration.** Project conversation comes first because the welcome screen promises "We'll figure out what you want to make."

### What Each Answer Drives
- `fork`: Project prompts throughout (work vs personal); safety interstitial variants; governance notice
- `project_idea`: Keyword-matched for path card; interpolated into every prompt in Sections 2-5
- `experience`: Exercise difficulty, anchor text adaptation, follow-up question variant, path card level
- `code_feeling`: Section 4 tools step (Claude Code vs capabilities overview); next steps
- `long_output`: Path card "what you'll learn" text
- `time`: Path card duration estimate (30min→~45min, 1hr→~60min)
- `setup`: Setup prompt with clickable claude.ai link and free/paid note

---

## Section Details

### Section 2: Ice Breaker
3 exercises + safety (multi-step with models intro) + anchor.

Exercises adapt by experience level:
- **Novice:** Plain-language prompts, no code execution assumed
- **Experienced:** Artifact-producing prompts ("present as an artifact I can see")

Exercise 3 explicitly asks Claude to build an interactive artifact so users end the section with something tangible.

Safety (multi-step checkmarks): data privacy → work data handling (work only) → models intro (Haiku/Sonnet/Opus + extended thinking).

Anchor adapts: novices see "You just built something with AI," experienced see "You just wrote code."

All exercises show "Claude may take a moment" thinking note.

### Section 3: Foundation
Conversation continuity note (with copyable catch-up prompt) → 3 guided builds + safety + anchor.

Skills: prompting well, structured output, adding personal context. Each prompt adapts for work/personal.

`showThinkingNote` on prompting and context steps.

Safety: hallucination awareness (both paths). Data handling moved to S2 for work users.

### Section 4: Power Up
4 guided builds + safety (multi-step) + anchor.

Skills: system prompts, multi-step workflows, roast (labeled "Quick break"), tools/Claude Code.

Roast prompt includes "Don't tell me to stop building and just use it" to avoid generic meta-advice. Tools step references the roast to connect the playful exercise to capabilities.

`showThinkingNote` on the workflow step.

Safety (multi-step): permission scoping + prompt injection.

### Section 5: Ship
Review → safety (multi-step: habits + monthly audit) → save/share → reflection → next steps.

Save & Share: numbered instructions mentioning "Publish" from artifact dropdown for shareable URLs.

Reflection: static skills checklist. Personalized message based on experience level and fork.

Next steps: personalized (Claude Code for coders, model comparison for others, agents/APIs/MCP for practitioners). Final screen: staged celebration (scatter → bounce → float → text → "Open Claude" + "Start over" + "Share with a friend").

---

## Component Notes

### PromptCard
- Copy-to-clipboard with navigator.clipboard API
- Detects `[placeholder]` brackets; shows warning on copy with 4s display. Instruction text adapts: "Fill in the [brackets], paste into Claude..."
- Outcome choices contextual via `outcomeLabels` prop
- "Need to iterate" shows tip with manual "Ready to continue" button + "Take me back" button (returns to prompt card for re-copy)
- "Skip" has distinct message and timing from success
- **Must have a `key` prop** to prevent state bleeding

### GuidedStep
Teach-then-do component. Structure: skill label (copper, 13px) → headline → explanation → PromptCard → optional thinking note → hint (italic, 15px).

The "The move:" tip callout was removed to reduce visual clutter. Explanation + prompt card is sufficient.

### SafetyInterstitial
Sage-tinted "While we're at it" pattern. Supports two modes:
- **Children mode:** Single continue button, renders children as content
- **Points mode:** `points[]` prop enables multi-step click-through with checkmarks. Each point has title + body. Button changes from "Next point" to "Got it" on last point.

### PathCard
Clean "Your Project" card (dropped the "Boarding Pass" metaphor after alpha testing found it unclear). Shows project name, description, duration, setup status, and skills.

---

## Project Template Lookup Table

18 pre-written templates (10 personal, 8 work). Client-side keyword matching via `input.toLowerCase().includes(keyword)`.

**When Claude API is integrated:** The API's job narrows to "pick the best template and personalize the framing."

---

## Testing & Development

### Restart
- **Keyboard:** Ctrl+Shift+R resets all state to welcome screen
- **Console:** `window.__restart()` for programmatic reset

### Error Handling
- ErrorBoundary wraps the entire app
- "Show details" toggle reveals error message and component stack trace
- Errors logged to console with `[Build Wizard Error]` prefix

### Testing Checklist
Test three paths: newcomer/personal, experienced/work, fallback/obscure. Check:
- Adaptive content (exercise difficulty, prompt framing, safety variants, anchor text)
- Navigation (back works everywhere including cross-section, transitions skip on re-entry)
- Safety multi-step checkmarks work on all three interstitials
- Governance notice blocks first Continue on work path
- Progress bar fills across all sections (no text collision)
- Tab title updates per section
- Copy + placeholder warning behavior
- Celebration animations at each section anchor
- Final screen shapes + Open Claude + Start over + Share links
- Models/thinking note visible in Section 2

Log bugs in `testing-notes.md` with format: `- [ ] [Section] Description`

---

## Responsive Behavior

- **Breakpoint:** 480px (single breakpoint, `useIsMobile` hook)
- **Below 480px:** Journey progress collapses to dots + active label. Mobile callout recommends desktop.
- **Above 480px:** Full journey progress. Clickable "Open claude.ai" link above CTA button on welcome screen.

---

## Known Issues & Watch-Fors

- Keyword matching is substring-based (`includes`), not word-boundary. Low-risk given the domain but fragile.
- The grain overlay SVG filter may cause performance issues on low-end mobile.
- Section prompts assume conversational continuity in Claude. Foundation has a catch-up prompt but no technical enforcement.
- Cross-section back navigation lands on step 0 of the previous section, not on the anchor. Would need per-section step persistence to fix.
- Progress bar uses solid background through 70% then fades. Content can still peek through the bottom 30% fade zone on very long scrolls.

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

Prioritize findings as P0 (blocking), P1 (important), P2 (quality), P3 (polish). Implement in order. This process caught significant issues in every round, including:
- PromptCard state bleeding between exercises (missing `key` prop)
- Novice path claiming "You just wrote code" when they only chatted
- Safety lesson about reading code that didn't apply to non-coders
- "Claude may take a moment" showing on fast prompts
- Dead outcomes state that made the reflection checklist always show everything completed
- Cross-section back navigation missing entirely
- Governance notice background that didn't visually change (identical ternary)
- Safety interstitials too easy to click through without reading
- Celebration shapes too small and easily missed
- "Bonus round" label on a required step

### Alpha Testing Protocol
Test three paths (newcomer/personal, experienced/work, fallback/obscure). Log findings in `testing-notes.md` with section prefixes. Check console for `[Build Wizard Error]` messages. Use Ctrl+Shift+R to reset between runs.

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
