# AI Onboarding Wizard — Product Design Document

**Version 1.0 | April 2026**
*Working document. Iterate freely.*

---

## 1. Vision & Purpose

This is an interactive web experience that gets people building something real with AI within minutes. It is built to share with friends, colleagues, and anyone who has been circling AI tools but hasn't found their way in yet.

The whole thing rests on one insight: people don't learn tools by studying them. They learn by wanting something and figuring out how to make it. The wizard's job is to find what you want, hand you the tools, teach you what to watch out for, and get out of the way.

This should feel like sitting down with someone who says: "Okay, what do you actually want to make? Cool, let's build that. Oh, and while we're at it, let me show you the stuff you need to know so you don't get burned."

> **Core Promise:** You will build something real. Something that matters to you. By the time you're done, you'll understand how AI works, how to use it safely, and how to keep going on your own.

**Tool stance:** Claude-forward. Exercises and examples reference Claude and Claude Code specifically, but every concept is framed as transferable. If someone ends up using GPT, Gemini, or whatever comes next, everything they learned here still applies.

---

## 2. Audience

Center of gravity: people who follow AI, understand the broad strokes, but haven't gotten their hands dirty. They might know what an agent is conceptually but have never built one. They often carry a belief: "The real power requires coding, and I don't code."

### Tier 1: The Curious Newcomer
Has heard of ChatGPT, maybe poked at it. No real mental model for what's happening. May feel intimidated or think this isn't for them. Needs orientation, demystification, and a fast path to "oh, I can do this."

### Tier 2: The Informed Observer (Primary Focus)
Reads about AI regularly, follows the conversation. Knows words like "prompting," maybe "agent" or "MCP." Hasn't built real habits. Knows about it more than knows how to do it. Needs a bridge from knowing to doing, delivered so fast they don't have time to talk themselves out of it.

### Tier 3: The Hesitant Practitioner
Uses AI tools but inconsistently, without a framework. Worries about doing it wrong, exposing data, looking foolish. Needs structure, validation, and the safety/evaluation habits that build real confidence.

---

## 3. Design Principles

### Project-Driven From Minute One
The wizard doesn't teach concepts and then apply them. It identifies something the user cares about and teaches everything through building it. The project is the curriculum. Concepts, safety, evaluation skills, and even "coding" are all delivered in the context of making your thing.

### Code From the Jump
Users are writing and running code in the first few minutes. It starts silly, small, and weird. A random band name generator. A Magic 8-Ball. Something that makes you laugh. The point is to cross the line so early and so casually that "writing code" stops being a category in your brain. We redefine it: you've been writing instructions for machines since your first search query. Prompting is instructions. Structured prompting is better instructions. Claude Code is instructions with more leverage. It's a spectrum, not a cliff.

### Safety as Companion, Not Gotcha
Every safety and security concept is attached to a moment of doing. The tone is "while we're at it, here's something to note" — a friend tapping your shoulder, never a teacher catching you. The content is visceral and concrete: real risks, real examples, real stakes. We tell people plainly what can go wrong. We don't ruin the party; we make sure everyone gets home safe.

### Honest About the Edges
This technology fabricates sources, leaks your data if you're careless, and tells you things that are completely wrong with total confidence. We say that plainly. That's not a reason to avoid AI. It's a reason to learn how it works.

---

## 4. Visual Design Direction

### Aesthetic: Refined Calm

The experience should feel like a beautifully designed product from a company that cares about craft. The word is *ease*. Everything breathes. Nothing crowds. The design communicates competence and calm before a single word is read.

This is **not**: flashy startup-landing-page energy, dark-mode hacker aesthetic, corporate training portal, or gamified with badges and confetti. It is refined, smooth, warm, and quietly stunning.

### Typography
A distinctive, warm display face for headings paired with a clean, highly legible body font. Something with character that says "a person designed this," not "a template generated this." Generous line heights. Text never feels cramped. Type scale creates clear hierarchy without shouting.

### Color
Restrained palette: two or three colors max, with most of the page in warm neutrals and whitespace. One accent color used sparingly for interactive elements and moments of emphasis. Light theme, airy. The experience should feel like opening a window.

### Motion & Animation
This is where the experience becomes memorable. The animations are the personality.

- **Easing is everything.** Every transition uses custom cubic-bezier curves. Nothing snaps. Nothing pops. Elements arrive and depart with intention, like they're being placed by a steady hand.
- **Morphing and shape transitions.** Content areas ease from one shape into another. A card softens its corners as it expands. A section breathes wider as you scroll into it. Shapes are alive, gently.
- **Staggered reveals.** When a section loads, elements arrive in sequence with slight delays. A choreographed entrance, like musicians joining in.
- **Scroll-driven motion.** Subtle parallax, elements that ease into position as you scroll. Not aggressive scroll-jacking. Gentle presence.
- **Page transitions.** Moving between sections feels like turning a page in a beautiful book. Crossfades, slides, or morphs between states.

The goal: someone using this wizard should *feel* the quality before they consciously notice it. The animations create a sense of care that makes the user trust the content more.

### Layout & Spatial Design
Generous whitespace. Content centered, never edge-to-edge. Single-column for reading. Interactive elements given their own visual space. Responsive, mobile-first. The pace of the layout matches the pace of learning: unhurried, focused, one thing at a time.

### Visual Details
Subtle background texture or grain (not flat white, just enough to feel material). Soft shadows and layering for depth without heaviness. Illustrations or diagrams where they aid understanding, editorial in style rather than generic vector clipart. Progress visualization that feels spatial rather than numerical: "you're here on a journey," not "67% complete."

### Reference Points (mood, not imitation)
Stripe's documentation (confidence, spacing), Linear's marketing site (motion quality, restraint), Notion's onboarding (warmth, friendliness), and the pacing of a well-designed independent magazine.

---

## 5. Content Architecture

Five sections. Each 10–15 minutes. Natural break points between sections so users can pause and return. Total experience: 50–75 minutes. Each section is designed to deliver a standalone, useful takeaway even if the user never comes back.

---

### Section 1: The Interview (10–15 min)

An adaptive form experience powered by the Claude API. Mix of multiple choice, short-form text, and long-form answers. Branching logic ensures no two users see identical paths. The interview does three things: assesses where you are, identifies what you're going to build, and scopes that project to something completable.

#### Part A: Where Are You Right Now?

Entry routing via multiple choice, then adaptive follow-ups in short-form text.

**Entry questions:**
- "How would you describe your experience with AI tools?" — Never used one / Tried it a couple times / Use it occasionally / Use it regularly
- "When you hear the word 'code,' what's your gut reaction?" — Nervous / Curious / Indifferent / Comfortable
- "Have you ever asked an AI to produce something longer than a paragraph?" — Yes / No / Not sure

**Branching follow-ups (adaptive, short-form text):**
- *Newcomer path:* "What have you heard about AI that interests you?" / "What made you want to try this?"
- *Informed observer path:* "What's the gap between what you know and what you do with AI?" / "Is there a specific capability you've read about but haven't tried?"
- *Practitioner path:* "What's working for you? What isn't?" / "What do you wish you understood better?"

#### Part B: The Fork

One critical question: **"Can you use AI for your work, or would you prefer to start with something personal?"**

**Path A — Work Project:** The wizard helps identify a real, recurring task that's a good candidate for AI. "What's something you do every week that feels repetitive?" "If AI could handle one part of your job tomorrow, what would it be?" Guides them to a specific, bounded build: an automation, a template generator, a data workflow.

**Path B — Personal Project:** The wizard helps find something they're passionate about. A hobby, interest, or side project. The goal is to spark the "oh my god, this is amazing" feeling that drives them through the rest of the experience. Inspiration examples surface based on answers: encounter generators, meal planners, budget trackers, workout builders, writing tools, reading list curators.

#### Part C: Project Scoping (AI-Powered)

The Claude API takes freeform responses and produces a bounded, completable project definition. Draws from a curated library of 15–20 pre-validated starter project templates, customized to the user's input. This narrows the AI's job from "invent from scratch" to "pick the best template and personalize the framing."

"Here's what we're going to build today: [specific first version]. You can make it fancier later. Today we're getting the core working."

#### Part D: Calibration
- "How much time do you have?" (30 min / 1 hour / no rush)
- "Do you have Claude open, or do you need to set up an account?"

#### Interview Output
A personalized path card: "Here's your plan." Shows assessed level, project description, estimated time, and what they'll learn. Feels like a boarding pass, not a report card.

> **Standalone value if they stop here:** A personalized project brief — what to build, why it suits them, and a clear first step. Useful even if they never open Section 2.

---

### Section 2: The Ice Breaker (10–15 min)

Get code running. Make it fun. Establish the safety awareness reflex.

#### Warm-Up Exercises

Users do 2–3 of these. Curated from a library of 8–10 options, selected based on interview vibe. Quick, silly, satisfying. Each follows: prompt → Claude writes code → user runs it → delight.

**Exercise ideas:**
- "Ask Claude to write a script that generates random band names. Run it."
- "Let's build a Magic 8-Ball in 30 seconds."
- "Make a compliment generator that's weirdly specific."
- "Build a random excuse generator for leaving meetings early."
- "Ask Claude to create a tiny quiz about a topic you love."

#### Safety Interstitials (between exercises, not inside them)

> **After the first exercise:**
> "While we're having fun: everything you just typed went to a server somewhere. With Claude Pro, your conversations aren't used for training by default. But that's not true for every tool or every plan. The settings matter. Let's take 30 seconds to check yours." → Guided walkthrough of checking data/privacy settings. "If you're using a different tool, look for similar settings. They all have them, and they're all in different places."

> **After the second exercise:**
> "One more thing: that code Claude just wrote? It worked great. As we build more complex stuff, you'll want a habit: read through what it wrote before you run it. Not because AI is malicious. Because running anything you haven't looked at is how surprises happen."

**Section anchor:** "You just wrote code. It was easy. Hold onto that feeling. Now let's build something that matters."

> **Standalone value if they stop here:** They ran code, they learned the two most important safety habits (data awareness and review-before-run), and they have a project plan from Section 1.

---

### Section 3: Build — Foundation (10–15 min)

Start the real project. Every skill is taught through building it.

#### Core Skills Delivered Through the Project

**Prompting well:** Context, specificity, constraints, and iteration as the actual skill. Your first prompt is a rough draft, always. "Try it, read the output, refine, try again. That loop is the whole game."

**Structured output:** Requesting tables, templates, JSON, specific formats. Framed as: "You're just telling it what shape you want the answer in. This is the same skill as prompting. It just looks a little more like code."

**Working with your data:** Uploading documents, pasting content, providing domain context. Teaching the model about your specific world.

#### Safety Interstitials

> **Hallucination awareness** (triggered naturally when the model gets something wrong during the build):
> "See that? It looked right and sounded confident. And it was wrong. This is called a hallucination. These models fill gaps with plausible fiction and never flag it. Your job: verify anything that matters. That's not a limitation of the tool; that's the skill of using it well."

> **Data handling** (Path A / Work Project only):
> "You're about to use real work data. Before you do: does your company have an AI policy? What plan are you on? Is your data covered by any agreements? If you don't know, that's okay. Here are the questions to ask your IT team or manager..."

> **Standalone value if they stop here:** A working first draft of their project. Core prompting skills. Hallucination awareness and data handling habits established.

---

### Section 4: Build — Power Up (10–15 min)

The project gets more capable.

#### Skills Delivered Through the Project

**System prompts and custom instructions:** Teaching Claude who it's working for and what it knows about the project.

**Multi-step workflows:** Breaking the project into phases: draft → review → revise → finalize. Using AI to critique and improve its own work.

**Tool use and integrations:** Connecting AI to files, the web, code execution. What it means when AI can "do things" beyond text.

**Claude Code introduction** (if appropriate to their project): "Same thing you've been doing, but it can see your files and build things directly on your computer." Framed as the natural next step on the spectrum.

**Agents concept:** What it means for AI to take actions, not just produce text. Why that changes everything.

#### Safety Interstitials

> **Permission scoping:**
> "You're giving this tool access to something. Like handing keys to a valet: competent, sure, but you wouldn't leave your wallet on the seat. Give access to what the task needs. Nothing more. Review what it's about to do before it does it."

> **Prompt injection:**
> "When AI agents process external content — a web page, an uploaded document, an email — that content can contain hidden instructions that hijack what the AI does next. This is real, this is active, and this is why blanket permissions and unreviewed actions are off the table."

---

### Section 5: Build — Ship & Sustain (10–15 min)

Finish the project. Reflect. Build habits.

#### Activities
Final build and polish. Test with real data or a real scenario. A "code review" walkthrough: understand what each piece does, what it has access to, what could go sideways. Export, save, or deploy as appropriate.

#### The Review Habit
> "Before this goes live, let's walk through it together. You don't need to understand every line of code. But you should understand what it does, what it has access to, and what could go wrong. Every time. Not paranoia. Just practice."

#### Reflection
"Here's what you just did: you prompted, iterated, structured output, ran code, used tools, reviewed AI work, and built something real. That's the whole game. Everything from here is refinement and ambition." Map what they did to the broader principles: this was not a Claude tutorial, these are transferable skills.

#### Ongoing Practice
- Evaluating and comparing models: try the same task in Claude, GPT, Gemini. Notice the differences.
- Staying current without drowning: where to follow, what to ignore, how to filter signal from noise.
- The learning loop: try → evaluate → refine → expand.
- Knowing when you need a human: AI augments judgment, it doesn't replace it.

#### The Long Game
> "Your usage will grow. Your data footprint grows with it. Monthly audit: check what tools have access to what. Review your settings. Make sure your practices match your current risk level, not the one from six months ago."

#### Personalized Next Steps
Based on interview data and project type: extension ideas, new tools to try, deeper capabilities (agents, APIs, MCP, Claude Code), and team/organizational policy considerations for those bringing AI practices to their workplace.

---

## 6. Section Rhythm & Mechanics

### Repeating Pattern
Every section follows this rhythm:
1. **The Hook** — Why this matters to your project, right now.
2. **The Build** — Hands-on: do the thing.
3. **The Interstitial** — Safety/security lesson, "while we're at it" tone.
4. **The Anchor** — One portable takeaway sentence you carry forward.

### Navigation
Users can skip ahead at any time. Bookmark-and-return for longer exercises. Progress framed as project completion, not module completion. Each section break includes an explicit off-ramp: "Good stopping point. You built X. Come back when you're ready."

### Quick Path Option
For users with 30 minutes: Sections 1 and 2 plus a compressed build phase. Core safety content preserved; advanced topics deferred.

### Embedded vs. Linked Experiences
- Section 2 warm-ups: ideally embedded (in-page sandbox or chat window)
- Sections 3–5 project work: linked out (open Claude in a new tab, return to wizard for guidance)
- Safety settings walkthroughs: guided with screenshots for specific tools

---

## 7. Technical Architecture

### Overview: Static Site + API for Intelligence

The wizard is a React single-page application with pre-written content for the bulk of the experience. The Claude API powers the adaptive interview and project scoping. Everything else (content, exercises, safety interstitials, navigation, animations) is client-side.

### Frontend
React SPA. All section content, exercises, and navigation are client-side. Animations handled with CSS transitions and a lightweight motion approach (Framer Motion or CSS-only). Responsive, mobile-first.

### API Layer
Calls to the Anthropic Messages API for: interpreting freeform interview answers, generating adaptive follow-up questions, and producing bounded project definitions from user input. Proxied through a lightweight serverless function (Vercel Edge Functions or Netlify Functions) to keep the API key off the client.

### Model Choice
Claude Sonnet 4.6 ($3 input / $15 output per million tokens). Best balance of quality and cost for interview interpretation and project scoping. Haiku 4.5 ($1/$5) available as fallback.

### Cost Model

| Component | Est. Tokens | Est. Cost |
|---|---|---|
| Interview (8 exchanges) | ~16K total | ~$0.10 |
| Project scoping | ~4K total | ~$0.05 |
| Personalized guidance (optional) | ~10K total | ~$0.15–$0.35 |
| **Total per user** | | **$0.15–$0.50** |
| **100 users** | | **$15–$50** |

Sustainable indefinitely as a personal project. Prompt caching can reduce costs further for repeated system prompts.

### Hosting
Static hosting via Vercel or Netlify. Free tier sufficient for expected traffic. API key stored in environment variables, never exposed client-side.

### Content Architecture for Maintainability
Content separated into two layers:
- **Principles layer** (how prompting works, what hallucinations are, why permission scoping matters): durable, rarely needs updating. Annual review.
- **Implementation layer** (specific settings locations, screenshots, tool-specific steps): modular, swappable components. Each block carries a "last verified" date. Quarterly review.

---

## 8. Tone & Voice Guide

Casual, direct, and warm. A knowledgeable friend sitting next to you, not a teacher at a podium.

- "We" and "let's" when exploring together. "You" when it's the user's move.
- Concrete always beats abstract. Every concept earns its way in with an example or analogy.
- Honest about uncertainty. "Nobody has all the answers here" gets said out loud.
- Respects intelligence. We translate; we never talk down.
- Jargon is earned. Every term is explained before or as it's used.
- Names the feeling: "If you feel like everyone else already knows this stuff, they don't. Most people are figuring it out in real time."
- Safety content is warm, not scolding. "While we're at it" energy. A friend tapping your shoulder.

---

## 9. Risks & Mitigations

### Shelf Life / Maintenance Burden
**Risk:** AI tools change interfaces, capabilities, and settings constantly. Exercises referencing specific UI elements have a half-life measured in months.
**Mitigation:** Two-layer content architecture. Version-stamp implementation blocks with "last verified" dates. Quarterly review for implementation; annual for principles.

### Interview Quality / Project Scoping
**Risk:** The interview carries enormous weight. If it fails to produce a compelling, well-scoped project, the wizard stalls.
**Mitigation:** Curated library of 15–20 pre-validated starter projects. AI's job narrows from "invent from scratch" to "pick the best template and personalize." Test the 5 most common paths thoroughly. Maintain inspiration prompts and fallback options.

### Completion / Drop-Off
**Risk:** 50–75 minutes is substantial. The primary audience may start but not finish.
**Mitigation:** Each section delivers standalone value. Explicit off-ramps at section breaks. Quick Path option for 30-minute sessions. Bookmark-and-return functionality.

### Engineering Scope
**Risk:** Polished React app with API integration, adaptive branching, and custom animations is significant for a two-person team (one of whom doesn't persist between sessions).
**Mitigation:** Phased build. Ship Sections 1–2 first. Sections 3–5 start as guided content pages, upgraded later. Strict, small design system. Blueprint document as shared context across sessions.

### Distribution / Discovery
**Risk:** Effort-to-reach ratio may be low without clear channels.
**Mitigation:** LinkedIn as primary channel. The build process, design decisions, and user reactions all become content (5–10 posts). Personal website as evergreen host. Workplace distribution framed as "a resource for getting started." End-of-wizard share prompt for organic referral.

### Empowerment vs. Appropriate Caution
**Risk:** Too much caution creates anxiety. Too little creates risk.
**Mitigation:** Frame caution as competence, not anxiety. Every safety moment is attached to a skill ("here's how to check") rather than a warning ("be careful"). Review-before-run taught as professional practice, not fear response.

---

## 10. Phased Build Plan

### Phase 1: Foundation (Weeks 1–2)
Establish the design system and build the core interactive experience.
- **Design system:** Color palette, typography, spacing scale, animation patterns. Small, strict component library: one card style, one button, one form input, one transition pattern, one reveal pattern. Constrain first, expand only when needed.
- **Interview prototype:** Build Section 1 as a working adaptive form. Implement branching logic. Integrate Claude API for freeform interpretation and project scoping. Test the scoping prompt extensively.
- **Ice breaker prototype:** Build Section 2 with 4–5 warm-up exercises and both safety interstitials. Polish transitions between exercises and interstitials.
- **Deliverable:** Working, visually polished Sections 1 + 2. Testable with real people.

### Phase 2: Core Build Sections (Weeks 3–4)
Build the project-driven learning sections, initially as guided content pages.
- **Section 3 (Foundation):** Guided content with links out to Claude. Prompting exercises, structured output examples, safety interstitials. Pre-written but personalized with interview data (project name, domain context).
- **Section 4 (Power Up):** Guided content for system prompts, multi-step workflows, tool use, agents. Safety interstitials for permission scoping and prompt injection.
- **Section 5 (Ship & Sustain):** Reflection, ongoing practice guidance, personalized next steps.
- **Deliverable:** Complete end-to-end wizard. Sections 3–5 content-rich but lighter on interactivity than Sections 1–2.

### Phase 3: Polish & Test (Week 5)
- Run 3–5 real people through the full wizard. Watch them use it. Note where they hesitate, skip, get confused, or light up.
- Iterate on interview flow based on scoping quality.
- Polish animations, transitions, responsive behavior.
- Write the Quick Path variant for 30-minute sessions.
- **Deliverable:** Ship-ready v1. Published to personal site. First LinkedIn post drafted.

### Phase 4: Distribution & Iteration (Ongoing)
- LinkedIn content series: the build story, design decisions, user reactions, safety philosophy.
- Share with colleagues. Frame as "a resource for getting started with AI."
- Quarterly implementation content review.
- Collect feedback, iterate on weak sections, expand exercise library.

### v2 Aspirations (Future)
- Voice-driven interview (Web Speech API or Whisper + Claude interpretation)
- Embedded Claude chat window for exercises (API-powered in-page sandbox)
- Richer interactivity in Sections 3–5 (in-page code execution, live previews)
- Persistent user profiles (resume where you left off)
- Community layer (share your project, see what others built)

---

## 11. Distribution Strategy

### LinkedIn (Primary Channel)
The wizard and the build process are content. Each section maps to a potential post. Target 5–10 posts from this single project, each driving traffic to the wizard.

Sample post angles:
- "I got my friend writing Python in 4 minutes. Here's how."
- "Most AI safety training is boring. I tried making it visceral."
- "The one question that determines your entire AI learning path."
- "I built an AI onboarding wizard. Here's what I'd change."

### Personal Website
The wizard lives as a flagship project demonstrating the core skill: translating complex technical systems into accessible, well-designed experiences. Permanent home, evergreen traffic.

### Workplace
Positioned as a resource for colleagues who've been asked to "start using AI" but don't know where to begin. Low-pressure, helpful framing.

### Organic Referral
End-of-wizard prompt: "Know someone who'd benefit from this? Share it." Simple URL, no friction.

---

*This is the build blueprint. We work from this.*
