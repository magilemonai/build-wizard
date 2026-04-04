# Testing Notes — Alpha Round 2

Browser: Chrome Version 146.0.7680.178 (Official Build) (64-bit)
Device / screen size: Lenovo ThinkPad browser screen size 1536

## What this round is for

Round 1 surfaced real issues. Claude Code fixed them and ran a self-critique pass. This round verifies those fixes landed, tests things round 1 skipped (mobile, Safari, keyword matching), and pressure-tests the areas where Claude's feedback flagged structural questions (outcome buttons, celebration moments, pacing of the build sections).

---

# Run 1: The Newcomer (Verify Fixes)

Same path as round 1. Focus on whether the flagged issues are resolved.

## Welcome screen

Load fresh. Watch the entrance.

- [x] Shapes fall and bounce (same as before, should still work)
- [x] Circle has more separation from triangle (was overlapping in round 1)
- [x] "Open claude.ai" context is more prominent than before (was too small/easy to miss)

**Is the Claude desktop note readable now? Does it register without competing with the button?**
Yes, but it does look like the button is pointing to this pill now because of the right-arrow

**Notes:**


## "Let's go" → Threshold → Interview

- [x] Threshold auto-advances, no stuck screen

Select **Something personal**. Continue. Type **cooking**. Continue.

## Assessment questions

Select: Haven't really used one → Nervous → No

- [x] Text and UI elements feel larger than round 1 (was flagged as too small across the board)

**Is the overall text size comfortable now on your laptop screen?**


## Follow-up → Time (30 min) → Setup (Yes, it's open) → Path card

- [ ] Duration shows something honest (round 1 showed ~45 min instead of ~30 min; CLAUDE.md says adjusted estimates)
- [ ] "What you'll learn" framing fits a newcomer who's never run code

**What does the duration say?**
~45 min

**Does the path card feel like it communicates something useful, or is the boarding pass metaphor still unclear?**
The boarding pass metaphor is still very unclear, this was still very small: "What you'll pick up along the way

Prompting with constraints, structured output (formatted meal plans), iteration, and how to check that AI suggestions are actually practical."

**Notes:**


## Section 2: Ice Breaker

This section had the most feedback in round 1. Go through carefully.

### Exercise 1

- [x] Prompt card has shaded/distinct background (was requested: "different font helps, maybe take it further with shading")
- [x] Text is larger and fills more screen real estate

**Notes:**
The shading could be even more extreme, it's very subtle right now

### After Exercise 1

- [x] No "read before you run" safety lesson for nervous/newcomer path (was flagged: asking non-coders to read code doesn't land)

**What safety content appears here instead? Does it feel appropriate?**
**Check before you trust.**  AI output sounds confident whether it's right or wrong. Before you act on anything that matters (a fact, a recommendation, a piece of advice), verify it. That habit is the difference between using AI well and using it carelessly.

This feels much better

### Exercise 2

- [ ] After completing, any instruction text ("Try asking it a few more questions...") is prominent, not small add-on text

**Notes:**
This is still too small and easy to miss.

### Exercise 3

- [x] Prompt references cooking/meal planning (personalized)
- [ ] This exercise results in the user actually producing something that could be called "code" or a working tool (was flagged: "You just wrote code" felt unearned when exercises were just chatbot input/output)

**Does the user actually build something tangible by the end of this section?**
No not yet. I think we need to adjust the prompt of exercise 3 to ensure that some code is created.

### Outcome buttons

Round 1 flagged: "not sure what the various buttons do... most just seem to be different ways to advance."

- [ ] "It worked!" / "Need to iterate" / "Skip" produce visibly different behavior
- [x] "Need to iterate" shows a helpful tip before advancing (CLAUDE.md says: "Try telling Claude what went wrong...")
- [x] Iteration tip gives the user enough to actually try again, not just acknowledge and move on
- [ ] "Skip" behavior is distinct from "It worked!"

**Do the buttons feel meaningfully different, or still like three flavors of "next"?** Skip and "It worked!" do the same thing, which is advance to the next card. I need more time to read their flavor text before proceeding.
For "Need to iterate" I now get a helpful tip. But the card auto-advances too soon before I can read it. Give the user a button here to advance because they will want to use the tip to go back to claude and try again.


### Celebration / anchor

- [ ] Celebration beat is more than a brief pause (round 1 requested confetti, disco ball, something visible)
- [x] Anchor text says "You just built something with AI" (NOT "You just wrote code" for the newcomer/nervous path)

**How does the celebration feel? Is there any visual delight, or is it still just text?**
There's absolutely no visual delight. It's better anchor text but there are NO nice visual fun moments here.

**Notes:**


### Model introduction

Round 1 requested: "This is a great place to introduce the concept of different models and settings like extended thinking."

- [ ] There's some mention of models or model selection during Section 2

**Is this addressed? If not, note where it would fit naturally.**


## Section 3: Foundation

### Conversation continuity

- [x] Opens with a note about keeping the same Claude conversation
- [x] Catch-up prompt is available for users who lost their thread

**Notes:**
I almost didn't see the catch-up prompt, this needs to be more prominent

### "Claude may take a moment" note

CLAUDE.md says this shows on prompting and context steps (the ones that produce long responses).

- [x] Note appears on appropriate steps (not on fast ones)
- [x] It's reassuring, not alarming ("Claude often needs time to write" energy)

**Notes:**
I missed this entirely until this section which specifically asked me to look for it. It was completely hidden - I basically didn't see it at all.

### Output looks good / Need to iterate

Round 1 flagged: "both seemed to advance to the next part. If I need to iterate, maybe I need help there."

- [x] "Need to iterate" produces genuinely different behavior than "Output looks good"
- [ ] The iteration guidance is specific enough to act on

**What happens when you click "Need to iterate"? Is it useful?**
I get a good tip but it disappears too fast. There likely needs to be more context-specific tips as well.

### Safety interstitial

- [x] Hallucination awareness appears for personal path
- [x] Work-only data handling interstitial does NOT appear (this is the personal path)

**Notes:**


## Section 4: Power Up

### Roast exercise

- [x] Still gets a genuine laugh (this worked well in round 1)
- [x] Tools step after the roast references it ("That roast probably surfaced some real weaknesses...")

### Tools step

- [x] Shows general capabilities overview, NOT Claude Code (code_feeling was nervous)

**Notes:**


### Safety interstitials

- [x] Permission scoping appears
- [x] Prompt injection awareness appears

**Notes:**


## Section 5: Ship

### Review

- [x] Back button present
- [x] Review prompt asks Claude to walk through what was built

### Save & Share

- [x] Numbered instructions for saving work
- [x] Callout about publishing Claude artifacts and sharing URLs

**Is this the "users should be able to share their projects" moment? Does it feel sufficient?**
This feels weird. I don't know if saving Claude conversations in a doc is the right advice here. I think also artifacts are typically able to be published as a dropdown on the "copy" button. "Publish Artifact".

### Reflection

- [x] Skills checklist shows all six skills
- [x] Personalized message based on newcomer/personal path
- [x] "This wasn't **just** a Claude tutorial" (round 1 flagged the missing "just")

**Notes:**


### Final screen

- [ ] Shapes return with staggered animation
- [ ] "Open Claude" link works
- [ ] This celebration is BIGGER than the section-end celebrations (round 1: "the last celebration should be BIG")

**How does the ending feel? Does it land?**
The shapes return with staggered animation but they animate in below the fold when the page loads, so I miss it as a user unless I scroll down really fast. Let's wait until the user scrolls down, then let's roll all of the shapes in from the far left side offscreen until they slow down and stop in the center.

There is no celebration I can see here.

**Notes:**


## Cross-section back navigation

CLAUDE.md says BackButton appears on every screen including step 0, and clicking Back on step 0 navigates to the previous section.

- [x] From Section 3 step 0, Back takes you to Section 2
- [x] From Section 4 step 0, Back takes you to Section 3
- [x] From Section 5 step 0, Back takes you to Section 4
- [x] Navigation is smooth, no crashes or stuck states

**Round 1 noted: "I can't reverse through sections." Does this work now?**
This does work.

## Run 1 Summary

**Fixes verified (check if resolved):**
- [x] Text/UI size increased
- [x] Circle shape separated from triangle
- [ ] Claude desktop note more prominent
- [x] "You just wrote code" replaced with appropriate anchor text for newcomers
- [x] Safety lesson adapted for non-coders
- [x] Cross-section back navigation works

**Still broken or not addressed:**
- No celebrations
- Claude desktop note still not prominent enough
- 

**New issues found:**
- 
- 

---

# Run 2: The Experienced Worker (Verify Adaptations)

Ctrl+Shift+R to restart.

Fork: Work → "writing meeting summaries" → Use one regularly → Comfortable → Yes → (anything) → No rush → Yes, it's open

## Governance notice

- [ ] Appears when selecting "Something for work"
- [ ] More prominent than round 1 (was flagged as too small and too passive)

**Does it register now? Or still easy to miss?**
This pops up and then I can immediately skip it. Maybe as I user I should hit "Continue" once and then be "denied" the ability to proceed while this governance notice pops up. Then I'll have to hit "continue" again after I've had to confront the notice.

## Path card

- [ ] "A meeting prep and follow-up tool"
- [ ] Level: Practitioner
- [ ] Duration: ~75 min (or adjusted honest estimate)

**Notes:**


## Section 2 differences

- [x] Prompts include Python/code framing (experienced path)
- [ ] Anchor text says "You just wrote code" (NOT "built something with AI," because this user is comfortable with code)
- [ ] Safety interstitial includes "Think before you paste work data" (work path)

**Notes:**
This still results in Claude running code secretly away from the user. We should make it present an artifact.
The safety interstitial included: "**Check before you trust.**  AI output sounds confident whether it's right or wrong. Before you act on anything that matters (a fact, a recommendation, a piece of advice), verify it. That habit is the difference between using AI well and using it carelessly."

## Section 3: Foundation


**Notes:**
Now I got "**Think before you paste work data.**  Before sharing real work data with Claude, check: does your company have an AI policy? What plan are you on? Is your data covered by any agreements? If you don't know, that's fine. Ask your IT team or manager."

I think this should be in Section 2 and "Check before you trust" should be here in Section 3

## Section 4: Tools step

- [x] Shows Claude Code introduction (code_feeling was comfortable)
- [x] Content makes sense for someone using Claude in a chat window, not just Claude Code app (round 1: user was in claude.ai, not the Claude Code terminal)

**Notes:**


## Section 5: Next steps

- [ ] Personalized for practitioner/work path
- [ ] Recommends appropriate next capabilities (agents, APIs, MCP, Claude Code if not already shown)

**Notes:**
I don't think any of these next capabilities were reviewed "Agents, APIs, MCP"


## Run 2 Summary

**Bugs:**
- 
- 

**Adaptation issues (same content appeared for both paths when it shouldn't have):**
- 
- 

**New issues:**
- 
- 

---

# Run 3: The Fallback + Setup Flow

Ctrl+Shift+R. Fork: Personal → something obscure → Use one occasionally → Curious → anything → About an hour → I need to set one up

## Path card

- [ ] Generic fallback name ("Your personal AI project")
- [ ] Description references what you typed (round 1: it did NOT echo the user's input, just said generic text)
- [ ] Setup prompt appears with account creation instructions
- [ ] Free vs paid account note is present (round 1 flagged: "might be good to check if user is paid or free")

**Does the description reference your specific input now?**


## Sections walkthrough (quick pass)

- [ ] Prompts feel right for an occasional user who's curious about code
- [ ] Section 3 structured output prompt doesn't produce Claude advising the user about their subject instead of building the tool (round 1: Claude gave a "4 weeks to kelp fluency" plan instead of reshaping the project output)

**Notes:**


## Run 3 Summary

**Bugs:**
- 

**Notes:**
- 

---

# Keyword Spot Checks

Quick passes through just the interview. Stop at the path card.

| Input | Path | Expected project name | Got it? |
|---|---|---|---|
| email | Work | An email drafting assistant in your voice | |
| guitar | Personal | A practice companion that knows where you are | |
| budget | Personal | A budget tracker that surfaces what you'd miss | |
| data spreadsheet | Work | A data summarizer for stakeholder updates | |
| D&D | Personal | An encounter generator for your campaign | |
| travel | Personal | A trip planner that goes beyond the obvious | |
| code automation | Work | A coding assistant for your workflow | |

**Any mismatches or unexpected fallbacks?**


---

# Mobile Test (375px or real phone)

Do one full run on a small screen. Personal/cooking/newcomer path is fine.

- [ ] Welcome shapes animate with bounce
- [ ] clip-path shapes render (triangle looks like a triangle)
- [ ] Journey progress: dots + active section name, no overlapping text
- [ ] Keyboard hint hidden (no ⌘/Ctrl + Enter)
- [ ] Continue button is reachable below textareas without scrolling forever
- [ ] Copper mobile callout appears recommending desktop (CLAUDE.md mentions this)
- [ ] Path card is readable, notches align with background
- [ ] PromptCard copy button is tappable (not too small)
- [ ] Nothing overflows horizontally at any point
- [ ] Safety interstitials are readable
- [ ] Final screen shapes and "Open Claude" link work

**Overall mobile experience:**


**Anything that breaks or is unusable?**


---

# Safari Test (if available)

- [ ] Welcome shapes animate with bounce (not static)
- [ ] clip-path polygons render correctly
- [ ] All transitions play smoothly
- [ ] No layout differences from Chrome
- [ ] Copy-to-clipboard works on PromptCards

**Notes:**


---

# Console Check

After all runs, review the console.

- [ ] No red errors
- [ ] No React warnings (keys, effects, props)
- [ ] No `[Build Wizard Error]` messages
- [ ] Fonts loaded without errors
- [ ] No unhandled promise rejections

**Anything in the console?**


---

# Overall Impressions — Round 2

**Which round 1 issues feel resolved?**


**Which round 1 issues are still present?**


**New issues that weren't there before?**


**Celebration moments: do they land yet? What's missing?**


**The outcome buttons (worked / iterate / skip): do they feel purposeful now?**


**Cross-section navigation: smooth, or does it create confusion?**


**Biggest single improvement you'd make before showing this to someone else?**


