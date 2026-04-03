# CLAUDE.md — AI Onboarding Wizard

This file captures every design decision, technical pattern, and implementation detail established during prototyping. The PDD (`ai-onboarding-wizard-pdd.md`) describes the vision. This file describes what we actually built, where we deviated, and why.

Read both files before making changes. When they conflict, this file wins — it reflects tested decisions.

---

## Project Structure

Vite + React SPA. Single-page app, client-side routing between sections.

```
src/
  App.jsx              # Main app shell, screen routing, state management
  tokens.js            # Design tokens (colors, easing, fonts)
  components/          # Shared UI components
  sections/            # Section 1 (Interview), Section 2 (Ice Breaker), etc.
  data/                # Interview flow definitions, project templates
  styles/              # Global CSS with keyframe animations
```

The prototype is currently a single JSX file. Split it along these boundaries when scaffolding. The component APIs are already clean enough to extract directly.

---

## Design System

### Typography
- **Display:** Instrument Serif (italic for headlines). Warm, editorial, slightly imperfect. Loaded via Google Fonts with preconnect hints.
- **Body:** DM Sans. Clean, legible, good weight range.
- **Do not substitute.** These were chosen specifically. Inter, Roboto, system fonts are explicitly off-limits per the design direction.

### Color — Split Accent System
The PDD says "one accent color." We split it into two roles after testing showed a single sage accent was too quiet for action elements.

- **Sage (#7A8B6A):** Environmental accent. Selection states, section labels, text input focus rings, past-progress markers, the "where you've been" color.
- **Copper (#BF7B5E):** Action accent. Primary buttons, active progress waypoint, emphasis moments, CTAs. The "where you're going" color.
- **Background:** Warm cream (#F7F5F0) with a subtle SVG noise grain overlay rendered as a fixed-position element (not per-screen background — this avoids frame drops during transitions).
- **Text:** Near-black warm (#2C2925), muted (#6B665F), light (#9E9890).
- **Borders/shadows:** All use the text color at low opacity for warmth. No pure gray.

### Spacing & Layout
- Max content width: 600px, centered.
- Side padding: 20px (mobile-safe on 375px screens).
- Single-column for all reading/interaction. Never edge-to-edge.

### The Shape System
A visual motif that runs through the entire experience. Organic CSS shapes using `clip-path` with hand-wobbled polygon coordinates. Not SVG. Not mathematically precise. They should feel slightly hand-drawn.

**The shapes:**
- **Triangle** (index 0): `clip-path: polygon(50% 4%, 96% 88%, 6% 84%)` — one side slightly longer
- **Square** (index 1): `clip-path: polygon(8% 6%, 94% 8%, 92% 94%, 6% 92%)` — subtle lean
- **Pentagon** (index 2): `clip-path: polygon(50% 3%, 97% 38%, 80% 95%, 20% 95%, 3% 38%)`
- **Hexagon** (index 3): `clip-path: polygon(50% 2%, 95% 26%, 95% 74%, 50% 98%, 5% 74%, 5% 26%)`
- **Circle** (index 4): No clip-path; uses `border-radius: 50%`

**Progression metaphor:** Complexity increases (3 sides → 4 → 5 → 6 → infinite). Maps to the five sections: Interview (triangle) → Ice Breaker (square) → Foundation (pentagon) → Power Up (hexagon) → Ship (circle).

**Where shapes appear:**
- Welcome screen: Triangle, square, circle fall into place as the hero motif. CSS `@keyframes` animation, not transitions (transitions don't animate on mount).
- Journey progress bar: Each section waypoint is its corresponding shape. Active shape scales up 1.3x in copper; past shapes turn sage; future shapes use border color.
- Welcome screen journey pills: Small shapes inline with section labels.

---

## Animation Architecture

### Three Motion Types
Every transition in the app uses one of three patterns. Never mix them within a single context.

1. **"page"** — Horizontal slide with slight scale. Used for question-to-question transitions within a section. Outgoing content exits left, incoming enters from right (reversed when navigating back). This is the most-used motion.

2. **"rise"** — Float up from below with spring easing. Used for reveals: the path card appearing, section introductions. Has overshoot via `cubic-bezier(0.34, 1.4, 0.64, 1)`.

3. **"morph"** — Vertical compress/expand. Reserved for section-to-section transitions (not yet implemented, but the pattern exists in PageTransition).

### Easing Curves
```js
smooth: "cubic-bezier(0.22, 1, 0.36, 1)"    // General purpose, slightly decelerated
page:   "cubic-bezier(0.4, 0, 0.2, 1)"      // Exit animations, quick out
settle: "cubic-bezier(0.25, 0.46, 0.45, 0.94)" // Physical settling
spring: "cubic-bezier(0.34, 1.4, 0.64, 1)"  // Overshoot for playful moments
```

### Welcome Screen Falling Shapes
Uses CSS `@keyframes` (not React state transitions). Three custom animations:
- `fallBounce`: Triangle falls from upper-left, tilted -40°, one bounce, settle.
- `fallBounceRight`: Square falls from upper-right, tilted +35°, opposite arc.
- `fallBounceStraight`: Circle falls nearly vertical, gentle tilt.

Each shape: fast fall to landing (0-55% of timeline), one upward bounce of ~12-14px (55-70%), gentle settle to rest (70-100%). Easing: `cubic-bezier(0.12, 0, 0.25, 1)` — front-loaded speed, slow finish.

Stagger: 0.3s, 0.9s, 1.5s delays. Text and button are visible immediately. Journey pills fade in after shapes land (~2.6s).

**Critical:** The previous approach using CSS `transition` with React state changes did not work because transitions don't animate from an initial state on mount. Always use `@keyframes` for entrance animations.

### PageTransition Component — Architecture Notes
The `PageTransition` component manages animated content swaps. Key implementation detail: the effect that handles key-change transitions and the effect that handles child content updates MUST be separate. If `children` is in the transition effect's dependency array, React's cleanup function kills the transition timers mid-flight when parent state changes cause re-renders.

Pattern:
- Effect 1: watches `transitionKey` only, owns all animation timers
- Effect 2: watches `children`, updates display child only when NOT mid-transition
- A `transitioning` ref prevents the two from interfering
- Cleanup runs on unmount only

### Stagger Gating
Choice buttons have staggered entrance animations. These MUST be gated by the page transition completing, otherwise the stagger plays behind the parent's opacity:0 state and is invisible. The `ChoiceButton` component accepts a `ready` prop; the parent sets this to `false` during transitions and `true` via `onEntered` callback.

---

## Interview Flow — Deviations from PDD

### Restructured Question Order
The PDD describes: assessment questions (Part A) → fork (Part B) → project scoping (Part C) → calibration (Part D).

We changed this to: **fork → project idea → assessment → adaptive follow-up → calibration.**

The project conversation comes first because the welcome screen promises "We'll figure out what you want to make." Putting three assessment questions before the fork broke that promise. Assessment now weaves in after the user is emotionally invested in their project. This was the single most impactful structural change in the prototype.

### Question Inventory (in order)
1. **fork** (choice): Work or personal?
2. **project_idea** (textarea): What specifically? (Question text varies by fork)
3. **experience** (choice): AI tool experience level
4. **code_feeling** (choice): Reaction to the word "code"
5. **long_output** (choice): Ever produced something substantial with AI?
6. **followup** (textarea): Adaptive based on experience level (3 variants)
7. **time** (choice): How much time do you have?
8. **setup** (choice): Do you have Claude ready?

### What Each Answer Drives
- `fork`: Determines project_idea question text, project template matching, path card framing
- `project_idea`: Keyword-matched against template library for path card
- `experience`: Determines follow-up question variant, path card level label
- `long_output`: Adjusts "what you'll learn" text on path card (users who've built long things skip the "running code for the first time" framing)
- `setup`: Drives the setup prompt on the path card screen (ready / open Claude / sign up)

### Work Governance Notice
When the user selects "Something for work" on the fork question, a sage-tinted contextual notice appears below the choices with the "While we're at it" tone. It flags that their workplace may have AI policies and suggests checking with IT/manager. Uses the PDD's "friend tapping your shoulder" framing, not anxiety-inducing. The notice component is generic (`notice` prop on `InterviewQuestion`) and can be reused for safety interstitials throughout.

---

## Project Template Lookup Table

The PDD describes AI-powered project scoping via the Claude API. Until that's wired up, we have a client-side keyword matching system with 18 pre-written templates (10 personal, 8 work).

Each template has: `keywords` (array of partial-match strings), `name` (specific, not generic), `desc` (what gets built today), `learns` (skills delivered).

**Personal templates:** cooking/meal planning, writing/blogging, fitness/workout, reading/books, music/instruments, budget/finance, gaming/D&D/RPG, travel/itinerary, photography, gardening.

**Work templates:** email/drafting, data/reports/spreadsheets, meetings/notes, presentations/slides, coding/automation, documentation/SOPs, customer support, hiring/recruiting.

**Matching:** Simple `input.toLowerCase().includes(keyword)` against the user's project_idea text. First match wins. Falls back to a generic template if no keywords match.

**When the Claude API is integrated:** The API's job narrows from "invent from scratch" to "pick the best template and personalize the framing" — which is what the PDD prescribes. The lookup table becomes the template library the API selects from.

---

## Component Inventory

### Built and Working
- `OrganicShape` — CSS clip-path shape with wobbled coordinates
- `ChoiceButton` — Selection button with stagger entrance, sage selection state
- `TextInput` — Text/textarea with sage focus ring, platform-aware keyboard hint
- `ContinueButton` — Copper action button with hover lift and arrow animation
- `BackButton` — Subtle "← Back" link, appears on all questions after the first
- `SectionLabel` — Uppercase sage label, shown only on first question of each section
- `JourneyProgress` — Responsive shape-based progress (full labels desktop, dots+name mobile)
- `PageTransition` — Direction-aware animated content swapper (page/morph/rise types)
- `InterviewQuestion` — Composite: headline + subtext + input type + notice + continue button
- `PathCard` — Boarding pass layout with perforation, gradient stripe, tear-off stub
- `SetupPrompt` — Copper-tinted callout for users who need to set up Claude
- `ThresholdInterstitial` — Self-advancing transitional screen between welcome and interview
- `WelcomeScreen` — Hero with falling shapes, static text, journey pills

### Not Yet Built (from PDD)
- Section 2: Ice Breaker (warm-up exercises, safety interstitials)
- Section 3: Foundation (prompting skills, hallucination awareness)
- Section 4: Power Up (system prompts, agents, Claude Code intro)
- Section 5: Ship & Sustain (reflection, ongoing practice, next steps)
- Claude API integration for adaptive interview and project scoping
- Embedded code execution sandbox
- Quick Path variant (30-minute compressed version)
- Bookmark-and-return / progress persistence

---

## Responsive Behavior

- **Breakpoint:** 480px (single breakpoint, detected via `window.innerWidth` with resize listener)
- **Below 480px:** Journey progress collapses to dots + active label. Textarea keyboard hint hidden (no modifier keys on mobile). Side padding 20px.
- **Above 480px:** Full journey progress with labels. Keyboard hint shows platform-appropriate modifier.

---

## Tone & Voice Reminders

From the PDD, reinforced by testing:
- "While we're at it" energy for all safety/governance notices. Never scolding.
- Placeholder text in textareas does real work: it models the kind of answer that's useful. ("The thing I keep meaning to try is..." not "Type your answer here")
- The path card off-ramp line ("Even if you stop here...") honors standalone value without expecting the user to quit.
- Section labels and progress indicators orient without nagging. Show once, then let the journey shapes handle it.

---

## Known Issues & Watch-Fors

- The path card notch circles use `background: T.color.bg` to fake the perforation cutout. If the card ever renders over a different background, the illusion breaks. Would need CSS mask for a robust solution.
- The `useMemo` for interview steps depends on a serialized key string (`fork|experience`). If branching logic ever depends on additional answer keys, update the key string.
- Font loading via `@import` inside a style tag can cause FOUT. Consider self-hosting fonts or adding `font-display: swap` for production.
- The grain overlay SVG filter may cause performance issues on low-end mobile during animations. Test on real devices. Consider a static PNG noise tile as fallback.

---

## Deployment Plan

- **Static hosting:** GitHub Pages serves the Vite build output (`dist/` folder)
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
