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
- Persistence: localStorage (build-wizard-state, schema v4)
- Analytics: Custom event system, PostHog/Mixpanel-ready schema

### Six-Stage Flow
1. **Orientation** — "What You're Walking Into." Brief framing, no interaction. Decorative falling organic shapes. No celebration.
2. **Cockpit** — Claude feature orientation. Six cards shown one at a time with navigation: Models, Extended Thinking, Research, Projects, Artifacts, Memory. Each card has a screenshot from Claude's UI. SparklyTriangle on section heading. Small celebration (shape 0).
3. **Interview** — "What's Eating Your Time?" One open textarea, AI coach matches to bucket and 2-4 templates (keyword fallback if API down). User picks template, optional scoping question. SparklySquare decoration. Small-medium celebration (shape 1).
4. **Build** — Guided prompt construction. Five sub-steps (Role, Context, Task, Format, Constraints) with coaching text, collapsible examples, and contextual Claude feature tips. Horizontal split: questions on top, live prompt preview on bottom. Full text editing after assembly. SparklyPentagon decoration. BIGGEST celebration (shape 2, high intensity).
5. **Launch** — Copy prompt to clipboard, contextual model recommendation (defaults to Opus), safety policy placeholder, instructions for pasting into Claude. Medium celebration (shape 3).
6. **Keep Going** — Six seed ideas for continued Claude usage. Shareable recap card showing template name, prompt preview, features learned, and time spent. All five shapes dancing. Big finale celebration (shape 4, high intensity).

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

Keyword matching uses weighted scoring: high-signal thinking words ("ideas", "brainstorm", "think", "strategy", "decide", "figure", "stuck", "perspective", "weigh") count 3x. Default bucket on tie/zero: production.

### State Management
All interview and build state lives in useInterview.js:
- problem, bucket, selectedTemplate, scopeAnswer
- coachResponse, isCoachLoading, coachError
- buildAnswers (5-key object), assembledPrompt
- sessionId for coach API calls

Persistence serializes via getInterviewState(), stores selectedTemplateId (not full object), rehydrates from getTemplateById() on load. Schema v4.

### Worker Touchpoints
- "default" — original project coach (preserved)
- "interview_coach" — returns JSON: bucket, templates[], message, scope_warning. Strict JSON, no markdown.

### Analytics Events
bucket_match (method, bucket, template_count, had_scope_warning), coach_scope_warning, prompt_step_complete, prompt_assembled, section_start, section_complete, step_complete

### File Structure
```
src/
  sections/
    Orientation.jsx — Stage 1
    Cockpit.jsx — Stage 2 (feature cards, SparklyTriangle)
    Interview.jsx — Stage 3 (textarea, coach, templates)
    Build.jsx — Stage 4 (prompt construction, PromptPreview)
    Launch.jsx — Stage 5 (clipboard, instructions)
    KeepGoing.jsx — Stage 6 (seeds, recap, finale)
  data/
    templates.js — 10 templates with prompt steps
    cockpitFeatures.js — 6 feature card definitions
  services/
    api.js — Worker communication
    analytics.js — event tracking
    interviewCoach.js — AI coach call with JSON parsing
  hooks/
    useInterview.js — all interview + build state
    usePersistence.js — localStorage with schema versioning
    useProgress.js — progress bar state
  components/
    SectionShell.jsx — step engine wrapper
    SectionCelebration.jsx — celebration animations
    PromptCard.jsx — prompt display (used in Launch)
    SafetyInterstitial.jsx — safety/policy display
    OrganicShape.jsx — decorative shapes
    SparklyTriangle.jsx — Cockpit decoration
    SparklySquare.jsx — Interview decoration
    SparklyPentagon.jsx — Build decoration
    JourneyProgress.jsx — progress bar with 5 shapes
    (other UI components)
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
