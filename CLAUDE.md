# CLAUDE.md — Build Wizard (Foxfire Launcher)

## What This Is

A work-focused guided experience that takes someone who has never used Claude and walks them through building their first real prompt in under 60 minutes. Originally the "AI Builder Trail," now restructured as "The Launcher" — purpose-built for deploying to non-technical coworkers at a company.

The original Trail is preserved on the `original-trail` branch and `v1-original-trail` tag.

Live at: build.codywymore.com
Domain secured: foxfire.app (migration TBD)

## Architecture

### Stack
- Frontend: Vite + React SPA, deployed to GitHub Pages via GitHub Actions
- AI proxy: Cloudflare Worker (build-wizard-api.codywymore.workers.dev)
- AI model: claude-sonnet-4-20250514 via Anthropic Messages API
- Rate limit: 60 requests/hr/IP, in-memory per Worker isolate (best effort)
- Persistence: localStorage (build-wizard-state, schema v4)
- Analytics: Custom event system, PostHog/Mixpanel-ready schema. In-memory sink that dumps to console on `pagehide`/`beforeunload`; swap for a POST batch later.

### Six-Stage Flow
1. **Orientation** — "What You're Walking Into." Brief framing, no interaction. Decorative falling organic shapes. No celebration.
2. **Cockpit** — Claude feature orientation. Six cards shown one at a time with navigation: Models, Extended Thinking, Research, Projects, Artifacts, Memory. Each card has a screenshot from Claude's UI. SparklyTriangle on section heading. Small celebration (shape 0).
3. **Interview** — "What's Eating Your Time?" One open textarea, AI coach matches to bucket and 2-4 templates (keyword fallback if API down). User picks template, optional scoping question. SparklySquare decoration. Small-medium celebration (shape 1).
4. **Build** — Guided prompt construction. Five sub-steps (Role, Context, Task, Format, Constraints) with coaching text, collapsible examples, and contextual Claude feature tips. Horizontal split: questions on top, live prompt preview on bottom. Full text editing after assembly. SparklyPentagon decoration. BIGGEST celebration (shape 2, high intensity).
5. **Launch** — Copy prompt to clipboard, contextual model recommendation (defaults to Opus), safety policy placeholder, instructions for pasting into Claude. Medium celebration (shape 3).
6. **Keep Going** — Six seed ideas for continued Claude usage. Shareable recap card showing template name, prompt preview, features learned, and time spent. All five shapes dancing. Big finale celebration (shape 4, high intensity).

### Shape-to-Stage Mapping
| Stage | Index | Organic shape | Sparkly decoration | Celebration variant |
|---|---|---|---|---|
| Orientation | — | none (pre-progress) | none | none |
| Cockpit | 0 | triangle | SparklyTriangle (copper) | `small` |
| Interview | 1 | square | SparklySquare (sage) | `small_medium` |
| Build | 2 | pentagon | SparklyPentagon (sage) | `big` |
| Launch | 3 | hexagon | none | `medium` |
| Keep Going | 4 | circle | none | `finale` |

### Step Counts per Stage
Driven by `BASE_STEP_COUNTS` in App.jsx and consumed by `JourneyProgress` for the mini sub-shape row:
- Cockpit: 7 (6 feature cards + anchor)
- Interview: 5 (intro + text input + matching + optional scoping + anchor; actual count drops to 4 when the selected template has no `scopingQuestion`)
- Build: 7 (Role, Context, Task, Format, Constraints, Assembly, Anchor)
- Launch: 3 (intro + handoff + transition)
- Keep Going: 4 (intro + seeds + recap + finale)

### Celebration Variants
`SectionCelebration` takes a `variant` prop (legacy `intensity={1|2|3}` still maps to small/medium/big):
- `small` — 6 particles, 100px tall. Gentle.
- `small_medium` — 10 particles, 110px. Slightly more energy.
- `medium` — 14 particles, 120px. Satisfying.
- `big` — 22 particles + 12 radial burst sparkles + 8 background dust dots, larger hero, 150px tall. The Build assembly climax.
- `finale` — 18 particles + dust, no single hero (every shape dances equally), warm mix, longer ambient float.

### Build Stage Feature Tips
Contextual callouts in Build driven by `selectedTemplate.features`. Each feature maps to one sub-step:
| Feature id | Appears on step |
|---|---|
| `model_selection` | role |
| `research` | context |
| `extended_thinking` | task |
| `artifacts` | format |
| `projects` | assembly |
| `memory` | assembly |

Only features listed on the chosen template render tips. Unknown features are ignored.

### Key Design Decisions
- **No SectionShell for Build stage.** Build owns its own sub-step state and layout because the prompt preview panel must persist across all sub-steps (gotcha #1 from audit).
- **Horizontal split layout in Build.** Questions/conversation on top, prompt preview growing on bottom. Designed for 50% browser width (users split-screen with Claude).
- **AI coach with deterministic fallback.** Interview uses Cloudflare Worker for smart matching. If API is down, falls back to keyword bucket matching silently. User experience is identical minus personalization.
- **No embedded AI for work content.** Users never paste work data through the proxy. The AI coach only handles project scoping during the interview. All real work happens in Claude directly.
- **Celebrations escalate.** Stage 2 small → Stage 3 small-medium → Stage 4 biggest → Stage 5 medium → Stage 6 big finale. Each feels distinct.

### Template System
10 templates in 3 buckets, defined in src/data/templates.js:

**"I'm drowning in information"** (information):
Document Distiller, Feedback Finder, Data Decoder, Researcher

**"I need to produce something"** (production):
Draft Machine, Report Builder, Process Writer, Deck Architect

**"I need to think more clearly"** (thinking):
Meeting Prep Brief, Strategy Brainstorm

Each template contains: id, name, bucket, oneLiner, scopingQuestion (nullable), features array, and promptSteps (role/context/task/format/constraints with question, placeholder, exampleOutput).

Keyword matching uses weighted scoring: high-signal thinking words ("ideas", "brainstorm", "think", "strategy", "decide", "figure", "stuck", "perspective", "weigh") count 3x. Default bucket on tie/zero: production. Scoring uses plain substring `includes()`, so longer words naturally subsume shorter stems (e.g. "challenging" matches both `challenge` and `challenging`).

Prompt assembly in Build: the `role` step's raw input is wrapped with a `"You are "` prefix (unless the user already typed that); all other steps use raw input as-is. Blocks are joined with double newlines into `assembledPrompt`, which becomes fully editable on the assembly step. `exampleOutput` from each template drives the collapsible "See an example" disclosure under each sub-step's textarea.

### State Management
All interview and build state lives in useInterview.js:
- problem, bucket, selectedTemplate, scopeAnswer
- coachResponse, isCoachLoading, coachError (transient — not persisted)
- buildAnswers (5-key object), assembledPrompt
- sessionId for coach API calls
- startedAt — ms timestamp stamped lazily by `markStarted()` the first time the user leaves Orientation. Powers the "Time spent" line on the recap card.

Persistence serializes via `getInterviewState()`, stores `selectedTemplateId` (not the full object), rehydrates from `getTemplateById()` on load. Schema v4. Saved shape:
```
{
  _v: 4,
  screen,
  sessionId,
  visited: [...],
  sectionProgress: { cockpit, interview, build, launch, keep_going },
  sectionSteps:    { cockpit, interview, build, launch, keep_going },
  interview: {
    problem, bucket, selectedTemplateId, scopeAnswer,
    buildAnswers: { role, context, task, format, constraints },
    assembledPrompt,
    startedAt,
  },
}
```
Schema mismatches and parse errors both clear the saved blob so the app fails into a clean state rather than a corrupted one.

### Worker Touchpoints
Front-end passes `touchpoint` in the request body; Worker selects the matching system prompt. Unknown values fall back to default so old Workers stay compatible.

- **`default`** — original project coach prompt (preserved, unused by the Launcher today).
- **`interview_coach`** — returns a strict JSON object, no markdown, no preamble:
  ```json
  {
    "bucket": "information|production|thinking",
    "templates": ["template-id-1", "template-id-2"],
    "message": "warm 1-2 sentence framing",
    "scope_warning": null
  }
  ```
  `interviewCoach.js` is tolerant of light violations (strips ```` ``` ```` fences, extracts first `{…}` from prose) and validates the bucket + template ids against `templates.js`. Any parse/validation failure triggers the silent keyword fallback.

Worker is also guarded by:
- CORS allowlist (`build.codywymore.com`, `localhost:5173`).
- Per-IP rate limit (60/hr, in-memory). Exhaust → 429 with `retry_after_seconds`.
- Required fields: `messages` (non-empty array) + `sessionId` (non-empty string).

### Analytics Events
Fire-and-forget via `track(name, props)` in `services/analytics.js`. Events accumulate in memory and dump to the console on page hide/close. Known events:
- **Lifecycle** — `session_start`, `screen_view`, `session_end`
- **Stage progression** — `step_complete` (section + step_index + time_on_step_ms), `section_start`, `section_complete`
- **Interview** — `bucket_match` (method: `coach`|`fallback`, bucket, template_count, had_scope_warning), `coach_scope_warning`
- **Build** — `prompt_step_complete` (step, step_index), `prompt_assembled`
- **Launch** — `prompt_copy` (section, step_index, had_placeholders), `outcome_choice`
- **Safety** — `safety_complete`
- **API** — `api_call` (touchpoint, latency_ms, success, status, tokens)

`track()` never throws. Unknown event names are accepted silently.

### File Structure
```
src/
  App.jsx — routing, persistence wiring, stage transitions
  main.jsx — entry point
  screens.js — SCREENS enum + STAGES order
  tokens.js — design system tokens (colors, fonts, eases)
  hooks.js — small shared hooks (useIsMobile, getModKey)
  sections/
    Orientation.jsx — Stage 1
    Cockpit.jsx — Stage 2 (feature cards, SparklyTriangle)
    Interview.jsx — Stage 3 (textarea, coach, templates)
    Build.jsx — Stage 4 (prompt construction, PromptPreview)
    Launch.jsx — Stage 5 (clipboard, instructions)
    KeepGoing.jsx — Stage 6 (seeds, recap, finale)
    ThresholdInterstitial.jsx — between-stage transition screen
    WelcomeBack.jsx — resume screen for returning users
  data/
    templates.js — 10 templates with prompt steps
    cockpitFeatures.js — 6 feature card definitions
  services/
    api.js — Worker communication (sendMessage)
    analytics.js — event tracking
    interviewCoach.js — AI coach call with JSON parsing
  hooks/
    useInterview.js — all interview + build state
    usePersistence.js — localStorage with schema versioning
    useProgress.js — progress bar state
  components/
    SectionShell.jsx — step engine wrapper (NOT used by Build)
    SectionCelebration.jsx — celebration animations, named variants
    PromptCard.jsx — prompt display with copy + outcome flow
    SafetyInterstitial.jsx — safety/policy display
    OrganicShape.jsx — base decorative shape (5 clip-paths)
    SparklyShape.jsx — spinning shape + sparkle dots. Exports
                       default SparklyShape plus named wrappers:
                       SparklyTriangle (copper, Cockpit),
                       SparklySquare  (sage,   Interview),
                       SparklyPentagon (sage,  Build).
    JourneyProgress.jsx — top progress bar with 5 stage shapes
    PageTransition.jsx — slide/fade between steps
    BackButton.jsx, ChoiceButton.jsx, ContinueButton.jsx,
    TextInput.jsx, SectionLabel.jsx, GrainOverlay.jsx,
    ErrorBoundary.jsx
  styles/
    global.css — keyframes + reduced-motion handling
public/
  images/cockpit/ — PNG screenshots for the Cockpit cards:
                    models, thinking, research, projects,
                    artifacts, memory. Drop files here; the
                    FeatureCard placeholder shows if any are
                    missing.
worker/
  src/index.js — Cloudflare Worker: CORS, rate limit, system
                 prompt dispatch by touchpoint
  wrangler.toml
```

### Design System
- Fonts: Instrument Serif (headings), DM Sans (body)
- Colors: sage/copper split accent, cream backgrounds
- Grain overlay on all screens
- All layouts must work at ~50% browser width (640px max container, narrow-friendly)

### Writing Rules (from brand foundation)
- No em dashes. Use periods, commas, or restructure.
- No "It's not just X, it's Y" formulations.
- No AI slop: "leverage", "unlock", "delve", "game-changing", "straightforward"
- Tone: warm, casual, friendly. Smart colleague, not corporate training.
- Guide, not guru. Walk alongside, never talk down.

### Gotchas (from the Trail → Launcher rebuild)
- **Build must stay outside SectionShell.** The prompt preview persists across sub-steps; SectionShell's PageTransition would tear it down on each step. Build owns its own `stepIndex` and renders only the top zone inside PageTransition.
- **InputStep needs `key={stepKey}`.** Without it React reuses the same instance across step transitions and the textarea keeps the previous step's typed text. The key forces a fresh mount per step.
- **`useEffect` deps must list every interview field.** `App.jsx`'s persistence effect depends on each piece of interview state individually; `getInterviewState()` alone is object-identity-new every render and would thrash.
- **Narrow-first layout.** Target ~50% browser width. Container max is 640. No side-by-side elements. `useIsMobile` fires under 480; between 480–700 is the split-screen regime where most coworkers will live.
- **Coach JSON is model-dependent.** The interview_coach prompt demands strict JSON, but the parser is still tolerant of stray fences and prose to survive occasional drift.
- **Schema bumps wipe saves.** `loadSavedState()` clears localStorage on any `_v` mismatch or parse error. Bump `SCHEMA_VERSION` when the persisted shape changes.

### Development
- `npm run dev` — local Vite dev server (default port 5173, which is in the Worker's CORS allowlist).
- `window.__restart()` or `Ctrl+Shift+R` (the app-scoped one, preventDefault'd) wipes saved state and returns to Orientation.
- To preview a stage without walking through the preceding ones, set the `build-wizard-state` localStorage key to a minimal object with `_v: 4, screen: "<stage>", interview: { ... }`.
- Drop Cockpit screenshots into `public/images/cockpit/` using the exact filenames above. The `FeatureCard`'s `ScreenshotImage` component degrades to a sage-tinted placeholder on `onerror`.

### Preserved Branches
- `original-trail` branch: the original 5-section AI Builder Trail
- `v1-original-trail` tag: immutable snapshot of the original

## How to Run

```
npm install
npm run dev
```

Worker deployment:

```
cd worker
wrangler deploy
```
