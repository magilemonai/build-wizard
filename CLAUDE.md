# CLAUDE.md — AI Onboarding Wizard

This file captures every design decision, technical pattern, and implementation detail established during prototyping. The PDD (`ai-onboarding-wizard-pdd.md`) describes the vision. This file describes what we actually built, where we deviated, and why.

Read both files before making changes. When they conflict, this file wins — it reflects tested decisions.

---

## Project Structure

Vite + React SPA. All five sections built. Screen routing via string constants in `screens.js`. Optional Cloudflare Worker in `worker/` proxies Claude API calls server-side.

```
src/
  App.jsx              # Screen router and section orchestration only
  screens.js           # SCREENS enum (prevents magic string typos)
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
    JourneyProgress.jsx  # Shape-based progress bar (responsive) + "Start over" link
    LivePromptPanel.jsx  # Optional "Try it here" panel inside PromptCard (Sections 3-4)
    OrganicShape.jsx     # CSS clip-path shape system
    PageTransition.jsx   # Direction-aware animated content swapper (page, rise)
    PathCard.jsx         # Project plan card
    ProjectCoachCard.jsx # API-backed personalized coach note under PathCard
    PromptCard.jsx       # Copy-to-clipboard with outcome feedback; hosts LivePromptPanel
    SafetyInterstitial.jsx # Multi-step "While we're at it" safety lessons
    SectionLabel.jsx
    SectionShell.jsx     # Shared navigation/transition wrapper for all sections
    SetupPrompt.jsx      # Claude setup with clickable link
    TextInput.jsx
  sections/
    WelcomeScreen.jsx    # With clickable claude.ai link
    WelcomeBack.jsx      # Resume screen for returning users with saved state
    ThresholdInterstitial.jsx  # Auto-advancing section transition
    IceBreaker.jsx       # Section 2: exercises + safety + models intro
    Foundation.jsx       # Section 3: prompting, structured output, context
    PowerUp.jsx          # Section 4: system prompts, workflows, roast, tools
    Ship.jsx             # Section 5: review, save/share, reflection, next steps
  hooks/
    useInterview.js      # Owns all interview state + derived values (see below)
    useProgress.js       # Per-section progress, step positions, visited set
    useAnalytics.js      # Legacy localStorage event hook (see Known Issues)
    usePersistence.js    # localStorage schema v2 for saved state
  services/
    api.js               # sendMessage + isApiAvailable client for the Worker
    apiAvailability.js   # Shared session-scoped cache for isApiAvailable
    analytics.js         # In-memory event sink + beforeunload console dump
  data/
    interviewSteps.js    # Adaptive question flow
    projectTemplates.js  # 18 templates + multi-keyword scoring + path card derivation
  styles/
    global.css           # Reset, keyframes, celebrations, prefers-reduced-motion, sagePulse
public/
  favicon.svg            # Copper triangle
  og-image.svg           # Editable source for social share image
  og-image.png           # 1200x630 PNG for Open Graph/social platforms
  CNAME                  # build.codywymore.com
worker/                  # Cloudflare Worker — Claude API proxy
  src/index.js           # POST /api/chat, CORS, rate limit, system prompt
  wrangler.toml          # Worker name, compat date, secret binding reference
  package.json           # wrangler dev dependency
  README.md              # Setup, secrets, dev, deploy
```

### `useInterview` hook

App.jsx is routing + orchestration only. All interview-related state and derived values live in `useInterview`:

- **State**: `stepIndex`, `answers`, `currentValue`, `direction`, `staggerReady`, `showFirstLabel`, `currentStep`, `totalSteps`, `sessionId`
- **Actions**: `setCurrentValue`, `navigateForward`, `navigateBack`, `handleTransitionEntered`, `resetInterview`, `ensureSessionId` (lazy UUID generator, persisted via `usePersistence`)
- **Derived**: `isWork` (fork === "work"), `isQuickPath` (time === "30min"), `pathCard` (memoized `derivePathCard(answers)`), `forkNotice` (governance notice shown on work-fork selection)

Principle: don't persist what you can compute. `pathCard` is derived, not stored. Sections that need experience-level variants derive their own from multiple signals — there is no single `experienceLevel` tier because that would create two sources of truth.

---

## Design System

### Typography
- **Display:** Instrument Serif (italic for headlines). Loaded via `<link>` in index.html.
- **Body:** DM Sans. Clean, legible, good weight range.
- **Do not substitute.** These were chosen specifically.
- **Sizing:** 7 sizes only:
  - 12px: progress bar labels (the only sub-13 allowed)
  - 13px: uppercase labels (SectionLabel, skill labels, SafetyInterstitial label)
  - 15px: secondary body, hints, card metadata, all interactive text
  - 16px: primary body text
  - 24px: sub-headings (SafetyInterstitial title, PathCard name)
  - `clamp(26px,5vw,34px)`: section headlines
  - `clamp(38px,8vw,56px)`: hero only

### Color — Split Accent System
- **Sage (#7A8B6A):** Environmental accent. Selection states, focus rings, past-progress markers, safety interstitials, checkmarks.
- **Copper (#BF7B5E):** Action accent. Primary buttons, active progress, CTAs, skill labels.
- **Background:** Warm cream (#F7F5F0) with SVG noise grain overlay (fixed position, rendered once by GrainOverlay).
- **Text:** Near-black warm (#2C2925), muted (#6B665F), light (#9E9890).
- **Borders/shadows:** All use text color at low opacity. No pure gray.

### Layout
- **Max content width:** 680px, centered.
- **Side padding:** 20px.
- **Border-radius:** Two values: 12px for compact elements, 16px for cards. PathCard uses 20px (hero card exception).
- **Section anchors:** Back button left-aligned, celebration shapes and text centered.
- **Final screen:** Fully centered with scroll-triggered staged animation + summary card.

### The Shape System
Organic CSS shapes using `clip-path` with hand-wobbled polygon coordinates. Progression: triangle(3) → square(4) → pentagon(5) → hexagon(6) → circle(inf). Maps to the five sections.

Shapes appear in: welcome screen falling animation (all 5, arranged 3-over-2), journey progress bar, welcome journey pills, section anchor celebrations (scatter + bounce + float), and the final Ship screen (biggest celebration as climax).

---

## Animation Architecture

### Reduced Motion
All animations respect `prefers-reduced-motion: reduce` via a CSS media query in global.css that sets `animation-duration` and `transition-duration` to near-zero. A `usePrefersReducedMotion` hook is available in hooks.js for JS-side checks.

### Two Motion Types
1. **"page"** — Horizontal slide with slight scale. Used within sections.
2. **"rise"** — Float up with spring easing. Used for reveals (path card).

Dead "morph" and "threshold" types were removed. ThresholdInterstitial handles its own animation.

### Entrance Animations
All content reveals use the same pattern: 80ms delay, 12px translateY, smooth easing. PathCard uses 200ms (intentionally slower for featured card).

### Celebration Animations
Section anchors use a three-part celebration sequence:
1. **Scatter** — Shapes explode outward from center, rotating and fading (`celebrateScatter`). Escalating count: 6 → 8 → 12 → 16.
2. **Bounce** — Shapes spring up from below with weighty 5-stage overshoot (`celebrateBounce`)
3. **Float** — Landed shapes gently bob with rotation (`celebrateFloat`, infinite loop)

The finale (Ship) is a staged cinematic version: IntersectionObserver (with fallback) waits for 60% visibility, then plays scatter → bounce → text reveal → summary card → buttons over 3.2 seconds. Shapes are 36-48px (vs 20-26px in section anchors).

### Timer Cleanup
All setTimeout calls in useEffect have proper cleanup returns. PromptCard and CatchUpPrompt use refs for timers in useCallback with cleanup useEffect on unmount.

### PageTransition Component
Effect 1 watches `transitionKey` only, owns animation timers. Effect 2 watches `children`, updates display child only when NOT mid-transition. A `transitioning` ref prevents interference.

**Critical:** PromptCard must have a `key` prop (exercise id or prompt text) to prevent state bleeding.

---

## Section Architecture

### Screen Constants
All screen names are defined in `src/screens.js` as a `SCREENS` enum object. App.jsx imports and uses these constants for all setScreen calls, comparisons, and config lookups. Prevents magic string typos.

### SectionShell Pattern
All four build sections (IceBreaker, Foundation, PowerUp, Ship) use a shared `SectionShell` component that handles step navigation, transitions, progress reporting, and BackButton rendering.

### Safety Interstitials — Multi-Step Acknowledgment
SafetyInterstitial supports a `points[]` prop for multi-step acknowledgment. Each click of Continue reveals the next point with a checkmark on the previous one. Unrevealed points at 0.45 opacity so users see the structure. Button label changes from "Next point" to "Got it" on the last point. Applied to:
- **IceBreaker S2:** 3 points for work (privacy, data, models), 2 for personal (privacy, models)
- **PowerUp S4:** 2 points (permission scoping, prompt injection)
- **Ship S5:** 2 points (scaling habits, monthly audit)

### Governance Notice Gating
When "Something for work" is selected in the interview, clicking Continue the first time is blocked. The notice background darkens and "Noted. Click Continue again to proceed" appears. Forces acknowledgment of workplace AI policies. Resets if selection changes.

### Section Transitions
Auto-advancing ThresholdInterstitial screens between sections. Config stored in `SECTION_TRANSITIONS` lookup in App.jsx. Transitions are skipped on re-entry (tracked via a `visited` Set ref).

### Cross-Section Back Navigation
BackButton appears on every screen, including the first step of each section. Clicking Back on step 0 calls `onBack`, which navigates to the previous section.

### Skip Option for Experienced Users
IceBreaker shows "Already comfortable with AI? Skip to Foundation →" on the first exercise when `experience === "regular"` AND `code_feeling === "comfortable"`. Calls onComplete directly, bypassing all exercises but still having seen the path card.

### Conversation Continuity Recovery
Foundation opens with a dedicated continuity screen with a copyable catch-up prompt. PowerUp and Ship have expandable `<details>` hints ("Lost your Claude conversation?") on their first step with the same catch-up template.

---

## Screen Flow

```
welcome → transition → interview (8 questions) → pathcard
  → icebreaker-transition → icebreaker (5 steps)
  → foundation-transition → foundation (6 steps)
  → powerup-transition → powerup (6 steps)
  → ship-transition → ship (5 steps)
```

App.jsx manages: `screen` (via SCREENS constants), `answers`, `sectionProgress` (one object, stable updaters via useMemo), `visited` (Set). Document title updates per screen via SECTION_TITLES lookup.

---

## Interview Flow — Deviations from PDD

### Restructured Question Order
**fork → project idea → assessment → adaptive follow-up → calibration.** Project conversation comes first because the welcome screen promises "We'll figure out what you want to make."

### What Each Answer Drives
- `fork`: Project prompts throughout (work vs personal); safety interstitial variants; governance notice
- `project_idea`: Multi-keyword scored for path card; interpolated into every prompt in Sections 2-5; echoed in fallback path card
- `experience`: Exercise difficulty, anchor text adaptation, skip option, follow-up question variant, path card level
- `code_feeling`: Section 4 tools step (Claude Code vs capabilities overview); skip option; next steps
- `long_output`: Path card "what you'll learn" text
- `time`: Path card duration estimate (30min→~25min, 1hr→~45min, norush→~60min)
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

Experienced users (`regular` + `comfortable`) see a "Skip to Foundation" option on the first exercise.

### Section 3: Foundation
Conversation continuity note (with copyable catch-up prompt + copy button) → 3 guided builds + safety + anchor.

Skills: prompting well, structured output, adding personal context. Each prompt adapts for work/personal.

`showThinkingNote` on prompting and context steps.

Safety: hallucination awareness (both paths). Data handling moved to S2 for work users.

### Section 4: Power Up
4 guided builds + safety (multi-step) + anchor. Expandable conversation recovery hint on first step.

Skills: system prompts (with live test, not just positioning), multi-step workflows, roast (labeled "Quick break"), tools/Claude Code.

System prompt exercise tests the role with a real task ("produce a ready-to-share version" for work, "what should I do with 30 free minutes" for personal).

Roast prompt includes "Don't tell me to stop building and just use it" to avoid generic meta-advice. Tools step references the roast to connect the playful exercise to capabilities.

`showThinkingNote` on the workflow step.

Safety (multi-step): permission scoping + prompt injection.

### Section 5: Ship
Review → safety (multi-step: habits + monthly audit) → save/share → reflection → next steps. Expandable conversation recovery hint on review step.

Save & Share: numbered instructions mentioning "Publish" from artifact dropdown for shareable URLs.

Reflection: static skills checklist. Personalized message based on experience level and fork.

Next steps: personalized (Claude Code for coders, model comparison for others, agents/APIs/MCP for practitioners). Final screen: staged celebration (scatter → bounce → float → text → summary card with project idea → "Open Claude" + "Start over" + "Share with a friend").

---

## Component Notes

### PromptCard
- Copy-to-clipboard with navigator.clipboard API (timer refs with cleanup)
- Detects `[placeholder]` brackets; shows warning on copy with 4s display. Instruction text adapts: "Fill in the [brackets], paste into Claude..."
- Outcome choices contextual via `outcomeLabels` prop
- "Need to iterate" shows tip with manual "Ready to continue" button + "Show prompt again" button (returns to prompt card for re-copy)
- "Skip (next step builds on this)" warns about downstream impact
- **Must have a `key` prop** to prevent state bleeding

### GuidedStep
Teach-then-do component. Structure: skill label (copper, 13px) → headline → explanation → PromptCard → optional thinking note (background box with hourglass) → hint (italic, 15px).

### SafetyInterstitial
Sage-tinted "While we're at it" pattern. Supports two modes:
- **Children mode:** Single continue button, renders children as content
- **Points mode:** `points[]` prop enables multi-step click-through with checkmarks. Each point has title + body. Unrevealed points at 0.45 opacity. Button changes from "Next point" to "Got it" on last point.

### PathCard
Clean "Your Project" card. Shows project name, description, duration, setup status, and skills. Fallback templates echo the user's exact input: "Your personal project: [their words]" with personalized description.

---

## Project Template Lookup Table

18 pre-written templates (10 personal, 8 work). Multi-keyword scoring: each template scored by how many of its keywords appear in the user's input. Highest score wins. Falls back to personalized generic template that echoes the user's exact input.

The API's job is narrow: pick the best template (already handled client-side via keyword scoring) and layer personalized framing on top via `ProjectCoachCard`. The templates remain the source of truth for the plan; the API only writes the 2-3 sentence human note.

---

## API Integration

The wizard is fully usable without the API. When the Worker is unreachable, every API-backed affordance self-hides and the user sees the existing copy-and-paste experience unchanged.

### Architecture

- **Cloudflare Worker** (`worker/src/index.js`) deployed as `build-wizard-api`. Frontend calls it at `VITE_WORKER_URL` (falls back to `http://localhost:8787` in dev).
- **Single endpoint**: `POST /api/chat` takes `{ messages, sessionId }`, forwards to Anthropic Messages API (`claude-sonnet-4-20250514`, `max_tokens: 1024`), returns `{ response, usage: { input_tokens, output_tokens } }`.
- **System prompt** is a constant inside `worker/src/index.js` — never sent by the frontend. Frames Claude as a concise, non-condescending learning coach, <150 words, no em-dashes, no "not X but Y" phrasing. If you change the coaching voice, that's where to do it.
- **API key** lives as a Worker secret (`wrangler secret put ANTHROPIC_API_KEY`). Never in source. Never in the browser.
- **No streaming**. Simple request/response.

### CORS

Allow-list: `https://build.codywymore.com` and `http://localhost:5173` (Vite dev server). The Worker reflects the matching Origin; unknown origins get the production origin as a safe default. `OPTIONS` preflight handled explicitly.

### Rate limiting

60 requests per hour per IP. In-memory `Map` scoped to a single Worker isolate. Opportunistic TTL sweep (5% of requests trigger a cleanup pass). Best-effort — a Map is per-isolate, so traffic spread across isolates or an IP rotation can exceed the cap. Good enough as a cost cap against accidental loops; not a hard limit against abuse. Upgrade path: swap Map for KV or a Durable Object.

### Frontend contract

`src/services/api.js`:

- `sendMessage(messages, sessionId, meta?)` — returns `{ response, usage }` on success, `{ response: null, error }` on any failure. Never throws. 30-second `AbortController` timeout. The optional `meta.touchpoint` arg labels the call for analytics (`"coach"`, `"live_prompt"`, `"healthcheck"`, default `"unknown"`); it does not change the request body.
- `isApiAvailable()` — sends a minimal ping through `sendMessage`, returns a boolean. Costs ~10 tokens per session (see "Not Yet Built" for the `/health` endpoint plan).

`src/services/apiAvailability.js`:

- `getApiAvailability()` — session-scoped Promise cache. First caller triggers the ping; every later caller awaits the same result. Prevents `LivePromptPanel` from re-checking per render.

### Session id lifecycle

- Lazy-generated by `useInterview.ensureSessionId()` on the first API call (UUID via `crypto.randomUUID`, or a timestamp+random fallback).
- Persisted in the `localStorage` save payload (`usePersistence` schema v2), so the same id survives refresh and is shared across `ProjectCoachCard` and `LivePromptPanel`.
- Reset by `resetInterview` (Ctrl+Shift+R, `window.__restart()`, or the mid-experience "Start over" link).
- Distinct from the analytics session id (see below) and from the cookie-less Worker rate-limit key (which uses IP).

### Graceful degradation

Both API touchpoints share the same rule: **if the API is unavailable or a call fails, the feature becomes invisible**. No error UI, no empty card, no layout shift, no indication that another option ever existed.

- `ProjectCoachCard`: returns `null` when `isApiAvailable` is false or `sendMessage` fails. The PathCard screen renders identically to the pre-API flow.
- `LivePromptPanel`: one-time availability check on mount (shared cache). Returns `null` when unavailable. On click failure, silently reverts to idle so the user can retry or fall back to copy. Errors go to `console.warn("[Build Wizard API] …")` only.

All API failures are caught at `sendMessage`'s boundary. Nothing throws. The wizard never shows a raw error to the user.

---

## Analytics

Lightweight in-memory event sink designed to be PostHog/Mixpanel-compatible with a one-line flush swap.

### Event shape

```
{
  seq:         monotonically increasing integer,
  ts:          ISO-8601 timestamp (when track() was called),
  session_id:  analytics-only session id (UUID, separate from API sessionId),
  event:       event name (string),
  properties:  shallow JSON-safe object
}
```

Both PostHog (`capture(event, properties)`) and Mixpanel (`track(event, properties)`) accept this as-is. Moving to a real backend is replacing `flushToConsole` with a batched POST.

### `track()` contract

`track(eventName, properties)` in `src/services/analytics.js`:

- Appends to an in-memory array with auto-generated `seq` and `ts`.
- Lazy-generates `analyticsSessionId` on first call. This is **separate** from the API `sessionId` (it's for grouping events in a future backend, not for passing to the Worker).
- Every public entry point is `try/catch` wrapped. `track()` silently no-ops on bad input or any internal throw. **Analytics must never break the wizard.**

`getEvents()` returns a copy of the array for debugging.

### Flush behavior

On `pagehide` or `beforeunload`, `flushToConsole`:

1. Appends a `session_end` event with `total_duration_ms`, `furthest_screen`, `total_steps_completed`, `total_api_calls`.
2. Logs a `[Build Wizard Analytics] session_end — events:N duration_ms:… furthest:… steps_completed:… api_calls:…` summary line.
3. Logs the full event array as JSON.

Both `pagehide` and `beforeunload` are registered — `pagehide` is more reliable on iOS/Safari, `beforeunload` covers desktop close/refresh.

### Free-text exclusion

User free-text input (project description, followup text) is **never** recorded as an event property. `interview_answer` includes `answer_value` only when `currentStep.type === "choice"`. Textarea questions still emit the event (so drop-off is measurable) but with `question_id` only. If you add a new textarea step, leave `type: "textarea"` and this rule applies automatically.

### Instrumented events

| Event | Where | Properties |
|---|---|---|
| `session_start` | App mount | `referrer`, `viewport_width`, `is_mobile`, `is_returning_user` |
| `screen_view` | every `setScreen` | `screen`, `previous_screen` |
| `interview_answer` | `useInterview.navigateForward` | `question_id`, `answer_value` (choices only) |
| `template_match` | on setup completion | `template_id`, `match_score`, `was_fallback` |
| `step_complete` | `SectionShell.advance` | `section`, `step_index`, `time_on_step_ms` (ref-based timer, reset on stepIndex change) |
| `prompt_copy` | `PromptCard.handleCopy` | `section`, `step_index`, `had_placeholders` |
| `prompt_live_try` | `LivePromptPanel.handleTryHere` | `section`, `step_index` |
| `api_call` | inside `sendMessage` | `touchpoint`, `latency_ms`, `success`, `input_tokens`, `output_tokens` |
| `outcome_choice` | PromptCard outcome buttons | `section`, `step_index`, `outcome` |
| `safety_complete` | SafetyInterstitial "Got it" | `section`, `points_count` |
| `artifact_download` | Ship share button | `format` (`native_share` or `clipboard_link`) |
| `session_end` | `flushToConsole` on unload | `total_duration_ms`, `furthest_screen`, `total_steps_completed`, `total_api_calls` |

See Known Issues for the `snag` vs `iterate` naming discrepancy and the legacy `useAnalytics` hook that still coexists.

---

## Testing & Development

### Restart
- **Keyboard:** Ctrl+Shift+R resets all state to welcome screen
- **Console:** `window.__restart()` for programmatic reset

### Error Handling
- ErrorBoundary wraps the entire app
- "Show details" toggle reveals error message and component stack trace
- Errors logged to console with `[Build Wizard Error]` prefix
- IntersectionObserver has fallback for unsupported browsers

### Testing Checklist
Test three paths: newcomer/personal, experienced/work, fallback/obscure. Check:
- Adaptive content (exercise difficulty, prompt framing, safety variants, anchor text)
- Skip option appears for experienced/comfortable users
- Navigation (back works everywhere including cross-section, transitions skip on re-entry)
- Safety multi-step checkmarks work on all three interstitials
- Governance notice blocks first Continue on work path
- Progress bar fills across all sections (no text collision)
- Tab title updates per section
- Copy + placeholder warning behavior
- Conversation recovery hints in PowerUp and Ship
- Celebration animations at each section anchor (escalating)
- Final screen: shapes + summary card + Open Claude + Start over + Share links
- Models/thinking note visible in Section 2

Log bugs in `testing-notes.md` with format: `- [ ] [Section] Description`

---

## Responsive Behavior

- **Breakpoint:** 480px (single breakpoint, `useIsMobile` hook)
- **Below 480px:** Journey progress collapses to dots + active label. Mobile callout recommends desktop.
- **Above 480px:** Full journey progress. Clickable "Open claude.ai" link above CTA button on welcome screen.

---

## Known Issues & Watch-Fors

- The grain overlay SVG filter may cause performance issues on low-end mobile.
- Cross-section back navigation lands on step 0 of the previous section, not on the anchor. Would need per-section step persistence to fix.
- Progress bar uses solid background through 70% then fades. Content can still peek through the bottom 30% fade zone on very long scrolls.
- Work vs personal content is mostly noun-swapping in build sections. Deeper differentiation would require substantially different section content per path.
- JS-side timeouts in entrance animations don't check `usePrefersReducedMotion()` (CSS handles it, but the delays still fire).
- **Outcome event naming drift**: the analytics `outcome_choice` event records `worked` / `snag` / `skip` (the UI labels), while the original spec called for `worked` / `iterate` / `skip`. Kept the UI value so events mirror what the user saw. If "iterate" is preferred for reporting, relabel in `PromptCard.jsx` and pass through to the event in one step.
- **Two analytics systems coexist**: the legacy `useAnalytics` hook (localStorage-based, emits `section_start`, `section_complete`, `exercise_outcome`, `interview_complete`, `session_resume`, `quick_path_activated`) still runs alongside the new `services/analytics.js` (in-memory, PostHog-ready shape). App.jsx still imports the hook for its existing call sites. A future cleanup should migrate those sites to `track()` directly and delete the hook. Until then, expect some event duplication in intent (not in event names — they don't overlap).

---

## Not Yet Built

- Quick Path variant (compressed version for 30-minute users)
- Clickable journey progress bar for section navigation
- WCAG contrast audit (sage on cream may not pass AA)
- Community gallery for sharing published artifacts
- Analytics backend wiring (events are recorded — see "Analytics" section — but nothing uploads them yet)
- `/health` endpoint on the Worker so `isApiAvailable()` can ping at zero token cost (currently costs ~10 tokens per session)
- Prompt caching (`cache_control: ephemeral`) for the Worker's static system prompt — free win we haven't taken yet
- Softer fallback messaging when "Try it here" fails. Today the panel silently returns to idle per spec; users get no feedback that their click did anything. A quiet "couldn't reach Claude — copy above instead" line would help without surfacing raw errors.
- Cleanup: remove the legacy `useAnalytics` hook (see Known Issues) and migrate its remaining call sites in `App.jsx` to `track()` from `services/analytics.js` directly.

---

## Deployment

### Frontend

- **Live at:** `build.codywymore.com`
- **Hosting:** GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`)
- **Trigger:** Auto-deploys on push to `main` branch
- **DNS:** Cloudflare CNAME `build` → `magilemonai.github.io`
- **SSL:** GitHub Pages auto-provisions, HTTPS enforced
- **Build:** `npm ci && npm run build` → serves `dist/`
- **Social:** Open Graph + Twitter Card meta tags in index.html, PNG image at `/og-image.png`

### Worker (Claude API proxy)

Lives in `worker/`. Deployed separately from the frontend via Wrangler.

```bash
cd worker
npm install
npx wrangler login                          # one-time
npx wrangler secret put ANTHROPIC_API_KEY   # paste key when prompted
npm run dev                                 # local dev at http://localhost:8787
npm run deploy                              # deploy to Cloudflare
```

- **Worker name:** `build-wizard-api` (configured in `worker/wrangler.toml`)
- **Secret:** `ANTHROPIC_API_KEY` is a Worker secret, never committed
- **CORS allow-list:** `https://build.codywymore.com`, `http://localhost:5173`
- **Rate limit:** 60 req/hr per IP, per-isolate in-memory (see "API Integration")

### Environment variables

| Var | Where | Purpose |
|---|---|---|
| `VITE_WORKER_URL` | Frontend build env (`.env.production`, GitHub Actions secret, or local `.env`) | Points `src/services/api.js` at the deployed Worker. Falls back to `http://localhost:8787` when unset. |
| `ANTHROPIC_API_KEY` | Worker secret | Anthropic API key. Set via `wrangler secret put`. |

### To deploy frontend changes:
1. Merge branch to `main`
2. GitHub Actions runs automatically
3. Site updates in ~30 seconds

### To deploy Worker changes:
1. `cd worker && npm run deploy`
2. No automation yet — this is manual per commit

### Cost note

- ~$0.15–$0.50 per user for API calls at current models/usage (see PDD Section 7)
- `isApiAvailable` currently costs ~10 input tokens per session; a `/health` endpoint would zero this out (see "Not Yet Built")

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
- Template matching giving "email" for "social media posts" (substring too loose)
- setTimeout leaks in 6+ components (no cleanup returns)
- Stale closure in answer preloading (missing dependency)
- System prompt exercise testing a positioning statement, not a real task

### Alpha Testing Protocol
Test three paths (newcomer/personal, experienced/work, fallback/obscure). Log findings in `testing-notes.md` with section prefixes. Check console for `[Build Wizard Error]` messages. Use Ctrl+Shift+R to reset between runs. Three alpha personas to consider: Sarah (marketing, 30 min, nervous), Marcus (engineer, no rush, comfortable), Elena (business owner, 1 hour, curious).

---

## Style Rules for This Project

The user prefers:
- Analogies when explaining concepts
- No em-dashes in writing deliverables
- No "It's not just X, it's Y" formulations
- Clean, direct prose
