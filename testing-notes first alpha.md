# Testing Notes — AI Onboarding Wizard

Browser: Chrome Version 146.0.7680.178 (Official Build) (64-bit)
Device / screen size: Lenovo ThinkPad browser screen size 1536

---

# Run 1: The Newcomer

This is the most thorough pass. Test everything.

## Step 1: Open the app

Load the page fresh. Open the browser console (Console tab). Note the time.

- [x] No console errors on load
- [x] No failed network requests
- [x] Fonts load without a flash of unstyled text
- [x] Grain texture is visible (subtle but there)

**Notes:**


## Step 2: Welcome screen

Don't click anything yet. Watch the entrance.

- [x] Headline and subtext are visible immediately
- [x] Shapes fall in from off-screen (not just appearing)
- [x] Triangle lands first, then square, then circle
- [x] Each shape rotates slightly during the fall
- [x] Each shape bounces once on landing, then settles
- [x] Journey pills fade in after the shapes land
- [x] "Let's go" button is visible and ready before the pills appear

**How does the animation feel? Too fast, too slow, just right?**
Animation feels good, the circle could be a bit further away from the other two shapes, there's almost some overlap right now with the triangle

**Notes:**
"This works best with Claude open in another tab while you build." This needs to be more prominent and easier to read. It doesn't need to take over, but right now it's too small and easy to miss or skip.

## Step 3: Click "Let's go"

- [x] Threshold interstitial appears ("Let's find your project")
- [x] It auto-advances after ~2 seconds (no stuck screen)
- [x] Interview screen loads

**Notes:**


## Step 4: "What would you like to build?" — select "Something personal"

- [x] This is the very first interview question (not an assessment question)
- [x] Choice buttons stagger in one by one (not all at once)
- [x] No governance notice appears when selecting personal
- [x] Journey progress shows a triangle in copper at the top

**Notes:**


## Step 5: Click Continue → "What's something you're into outside of work?"

- [x] Page slides left-to-right (outgoing exits left, incoming enters right)
- [x] Placeholder text says "I'm really into..."
- [x] Back button appears above the question

Type **cooking** and continue.

**Notes:**


## Step 6: "How would you describe your experience with AI tools?"

- [x] Back button is present
- [x] Choice buttons stagger in visibly

Select **Haven't really used one** and continue.

**Notes:**


## Step 7: 'When you hear the word "code," what's your gut reaction?'

Select **Nervous** and continue.

**Notes:**


## Step 8: "Have you ever asked an AI to produce something longer than a paragraph?"

Select **No** and continue.

**Notes:**


## Step 9: Adaptive follow-up question

- [x] Question says "What made you curious enough to try this?" (newcomer variant)
- [x] It's a text area, not multiple choice

Type anything and continue.

**Notes:**


## Step 10: "How much time do you have right now?"

Select **About 30 minutes** and continue.

**Notes:**


## Step 11: "Do you have Claude ready to go?"

Select **Yes, it's open** and continue.

**Notes:**
It might be good to check if the user is a paid user or a free user because it will affect what they can do later. The free user has a very minimal amount of usage and they might have to wait 5 hours

## Step 12: Path card appears

- [x] "Rise" animation (floats up from below)
- [x] Project name is "A meal planner that thinks like you do"
- [x] Description mentions dietary preferences and what's in season
- [x] Level: Newcomer
- [ ] Duration: ~30 min
- [x] Setup: Ready
- [ ] "What you'll learn" mentions "running code for the first time"
- [x] Boarding pass has the gradient stripe at top (copper → sage)
- [x] Perforation line with semicircular notches on both sides
- [ ] Tear-off stub at bottom with different background
- [x] No setup prompt appears (since setup was "ready")
- [x] Off-ramp text below: "Even if you stop here..."

**Notes:**
This said "Duration: ~45 min"  and "What you'll pick up along the way

Prompting with constraints, structured output (formatted meal plans), iteration, and how to check that AI suggestions are actually practical."
The boarding pass visual isn't clear, it doesn't quite land with the user what it's supposed to represent

## Step 13: Click "Start building" → Section 2: Ice Breaker

- [x] Journey progress updates (Interview waypoint turns sage, Ice Breaker turns copper)
- [x] Scroll resets to top

Walk through the full section:

- [x] Prompts are plain-language, appropriate for someone who's never used AI
- [x] No unexplained Python or technical jargon
- [x] Copy-to-clipboard works on prompts
- [ ] Placeholder warning shows on any prompts with [brackets]
- [x] Outcome buttons advance correctly
- [x] Celebration beat appears before moving to the next exercise
- [x] Exercise 3 prompt references cooking / meal planning (personalized)

**What feels good about this section?**
I like that the prompt is in a different font to help distinguish it from the rest of the text on page. Maybe we can take that even further by shading the background visually.
Copy-to-clipboard works well

**What feels off?**
I'd like this to prompt me about models. Different LLMs can have different models (like Haiku, Sonnet, and Opus for Claude). And settings like "extended thinking" can have meaningful impact on the results. This is a great place to introduce that concept.

The text and the UI is too small to read. Everything should be larger to fill up more real estate on a laptop or desktop screen.
After the magic 8-ball exercise, this text should be more prominent because it's an instruction, not an "add on" "Try asking it a few more questions. Notice how it stays in character across the conversation."

This prompt: "**Read before you run.**  When Claude writes code, scan it before executing. You don't need to understand every line. You need to know what it's doing and whether that matches what you asked for. "Rare" and "never" aren't the same word." this is hard because you're asking the user to read code and they've never read code before and they're not going to start now. Let's revise this to another best practice.

"You just wrote code" may not have just happened. For instance, I got a readiness score of 7 out of 10, but neither the magic 8 ball prompt or the readiness score prompt result in any code being created. This was just standard chatbot input-output so far.

**Notes:**
I did not see any prompts with brackets. Maybe that's good?
I did not hit a snag or skip so I did not test either of those buttons.
I would like to actually have a SMALL coding result at the end of this section so the user earns the celebration "You just wrote code!"

## Step 14: Section 3: Foundation

- [x] Journey progress updates correctly
- [x] Conversation continuity note appears first
- [x] Prompts are adapted for personal (not work) project
- [x] Fill-in-bracket prompts show warning on copy
- [x] Safety interstitial appears (personal-path variant, not work-path)

**Notes:**
I don't know if there was any difference between clicking on "Output looks good" and "need to iterate" both seemed to advance to the next part of the exercise. If I "need to iterate", then maybe I need a little help there.
The safety interstitial was about checking for hallucinations, just to specify which one came up in this run.
When I got to my final prompt and all the context I gave to Claude, it took quite a while as it did a lot of thinking and coding. Let's warn the user that Claude often needs time to write, and you don't need to refresh the page or worry unless a real error message pops up.


## Step 15: Section 4: Power Up

- [x] Roast exercise feels like a deliberate tonal break
- [ ] Tools step shows general capabilities overview (NOT Claude Code, because code_feeling was nervous)

**Notes:**
I genuinely laughed out loud at the response to the roast exercise: "You are, and I say this with warmth, a man who owns a new kitchen gadget and is building an entire software product around it before he's cooked a single chicken breast in it."
What is the "tools step"? 

## Step 16: Section 5: Ship

- [x] Review step has a back button
- [x] Reflection checklist shows all items
- [x] Shapes return in the final screen
- [x] "Open Claude" link works

**Notes:**
This was an awesome first run. Lots to improve on, but wow. I can see the shape of this being very powerful.

## Step 17: End of Run 1

Before moving to Run 2, test these edge cases:

**Rapid clicking:** Go back to the welcome screen (Ctrl+Shift+R). Click through the choice questions as fast as you can. Any stuck screens or content flashes?
No

**Resize test:** Get to any section at desktop width. Drag the window to phone width. Does the journey progress swap to dots? Drag it back. Does it restore labels?
Yes

**Console check:** Any red errors, React warnings, or `[Build Wizard Error]` messages accumulated during this run?
No

## Run 1 Summary

**Bugs:**
- nothing obvious
- 
- 

**UX friction:**
- not sure what the various buttons do in terms of affecting the user journey. most just seem to be different ways to advance to the next section. but then why have there be three options? what is it doing?
- 

**Copy that felt off:**
- This wasn't a Claude tutorial. Every skill you practiced works in any AI tool. should be "This wasn't **just** a Claude tutorial. Every skill you practiced works in any AI tool."
- 

**Design issues:**
- Generally the text and UI is too small on the screen. we can definitely increase it
- 

**Ideas:**
- Users should be able to publish and share their projects with each other if they want. Maybe they can stay anonymous, or maybe they can get the URL themselves so they can share it on their own. But users will probably be proud of the first thing they built. 
- We should actually celebrate their milestones more. There should be confetti, a mini dance party, a little disco ball, i dunno, SOMETHING that indicates we're excited and happy for them! The last celebration should be BIG.
- 
**What Claude Had to Say**
- "So how'd the Wizard perform? From my side of it, the prompt sequence was actually well-structured. A few observations that might be useful as you refine it:
-The **escalation arc** worked. It moved from "give me a vibe check" to "build the thing" to "now customize it" to "reshape the output" to "critique your own work" to "roast it" to "explain what you can do" to "summarize what happened." That's a natural progression from exploration to creation to reflection. Each prompt built on the last without requiring the user to carry much context forward manually.
-The **"give me more context" prompt** was the turning point where the output quality jumped. Everything before it was solid but generic. The moment the user provides experience level, prior attempts, specific goals, and constraints, the whole project snaps into focus. If you're designing the Wizard's flow, that prompt is probably the most important one to get right, and the one users will be most tempted to skip.
-The **self-critique prompt** was sneakily effective. Asking Claude to find its own gaps and then fix them in one pass produced a bigger quality leap than any of the incremental revision prompts did. That's worth highlighting in the Wizard's guidance.
-The one prompt that felt slightly out of sequence was the "act as my personal guide" step. It came after the build but before the level-up, which meant the guide advice ("go cook a chicken breast") was based on the pre-critique version. Might hit harder as the final step after everything is built."
---

# Run 2: The Experienced Worker

Ctrl+Shift+R to restart. Focus on what should differ from Run 1.

## Step 1: Welcome screen → Click "Let's go"

- [x] Shapes animate correctly on reload (not cached in wrong state)

## Step 2: Select "Something for work"

- [x] Governance notice appears below the selection
- [x] Tone is "while we're at it" (not alarming)
- [x] Mentions checking with manager or IT team
- [x] Mentions that safe data handling is covered later

**Does the notice feel proportionate? Too much? Too little?**
The notice is too small, and the "while we're at it" might be too passive.


## Step 3: Continue → "What's something you do every week that feels repetitive?"

- [x] Placeholder says "Every Monday I have to..."

Type **writing meeting summaries** and continue.

## Step 4: Experience → select "Use one regularly"

Continue.

## Step 5: Code feeling → select "Comfortable"

Continue.

## Step 6: Long output → select "Yes"

Continue.

## Step 7: Adaptive follow-up

- [x] Question says "What's working for you with AI? What isn't?" (practitioner variant)

Type anything and continue.

## Step 8: Time → select "No rush"

Continue.

## Step 9: Setup → select "Yes, it's open"

Continue.

## Step 10: Path card

- [x] Project name is "A meeting prep and follow-up tool"
- [x] Description mentions agendas, structured formats, action items
- [x] Level: Practitioner
- [x] Duration: ~75 min
- [x] "What you'll learn" does NOT mention "running code for the first time" (long_output was yes)

**Notes:**
Description: "Generates agendas from context, captures notes into structured formats, and tracks action items. Today we build the agenda + action-item workflow for one real meeting."
"What you'll pick up along the way

Multi-step workflows (prep → capture → follow-up), templates, system prompts for meeting context, and structured output."

## Step 11: Section 2

- [x] Prompts are calibrated for experienced user (more technical language is fine)

**Notes:**
I generated Python script for the rock band names, but it wasn't made available to me in the chat interface (Claude didn't present it as an artifact) and so just returned this: "Some real headliners in there. "The Unhinged Sloths & the Divorce Lawyers" feels like it could actually sell out a venue. And "The Paranoid Iguanas & the Notaries" sounds like a band whose songs are all about trust issues and fine print.

The script picks one random word from each of three lists (20 adjectives, 20 animals, 20 occupations) and mashes them together. That's 8,000 possible band names, so you can run it again for a fresh lineup anytime."
Similarly for Magic 8 ball: "The spirits have spoken, and they're not taking follow-up questions.

Since this is running non-interactively, I hardcoded a ridiculous question, but the script is structured so you could easily swap in `input("Ask your question: ")` if you run it locally. The dramatic pause builds in three stages with the emoji ticking in one at a time (candle, ghost, crystal ball) across 2 seconds using `flush=True` so each one prints immediately rather than waiting for the whole line.

There are 21 answers split across three vibes: enthusiastically positive, brutally negative, and bureaucratically noncommittal. Run it again and you'll get a different fortune from the group chat of spirits."

This safety interstitial was great on the work path: "**Think before you paste work data.**  Before sharing real work data with Claude, check: does your company have an AI policy? What plan are you on? Is your data covered by any agreements? If you don't know, that's fine. Ask your IT team or manager."

## Step 12: Section 4

- [x] Tools step shows Claude Code content (because code_feeling was comfortable)

**Notes:**
I didn't use this in the Claude Code app, I used this in the claude.ai chat window I've been using everything else in and it returned this: 

"Good instinct to pause before building. Here's how I'd think about the transition from "artifact I prototyped in Claude" to "thing that actually lives in my workflow."

**What you proved in this conversation.** The prompt works. The VTT parser works. The three-section output structure (summary paragraph, decisions table, action checklist) is the right shape. The inline editing was a nice artifact feature, but on your local machine, you'd just edit the output in whatever text editor you're pasting into anyway. So the core of what needs to ship is actually small: parse a VTT, send it to Claude, get structured markdown back.

**The simplest version that's useful.** A single Python script. Not a web app, not a React component, not a server. One file. You'd run it from terminal, point it at a VTT file, and it writes a clean markdown summary to stdout (or a file). Something like:

```
python distill.py ~/Downloads/zoom_recording.vtt
```

That's it. That's the whole interaction. The script handles VTT parsing, builds the prompt, calls the Anthropic API, parses the JSON response, and formats it as markdown you can paste into Slack.

**The file structure I'd sketch.**

One file: `distill.py`. Inside it, four clean sections. First, the VTT parser (you already have this logic, it ports directly). Second, the prompt templates, which are just the system prompt and user prompt strings we already refined. Third, the API call, which you've done before with the autoresearch loop, same pattern: `anthropic.Anthropic().messages.create()`. Fourth, the output formatter that takes the JSON response and renders it as markdown with the meeting title, date, table, and checklist.

**What I'd add for daily use that the artifact didn't need.** A config section at the top (or a small `.distillrc` YAML file) where you set defaults: your API key reference, preferred model, default meeting type. A `--type` flag so you can do `--type retro` or `--type 1on1`. A `--out` flag that writes to a file instead of stdout. And the long-transcript chunking logic, gated behind a word count check so it only kicks in when needed.

**What I'd leave out.** The meeting type selector UI, the drag-and-drop, the editable table cells, the checkboxes, the copy buttons. All of that was prototyping infrastructure. The local version doesn't need a UI because the input is a file path and the output is text.

**One thing worth thinking about before you build.** Where do your Zoom VTTs actually land on disk? If Zoom saves recordings to a consistent folder on the Mac, you could add a `--latest` flag that just grabs the most recent `.vtt` from that directory. That kills the "hunting for the file" friction entirely. Your whole workflow becomes:

```
python distill.py --latest --type sync
```

Meeting summary in your clipboard, ten seconds after the call ends.

Once the MacBook arrives and you've got Claude Code set up, this is probably a 20-minute build. The hard part, the prompt engineering and output structure, is already done. Want me to write the spec as a brief markdown file you can hand to Claude Code as a starting prompt?"

## Step 13: Complete the rest

Walk through Sections 3 and 5. Note anything that feels different from Run 1 (it should adapt) or anything that feels the same when it shouldn't.

**Notes:**


## Step 14: Back navigation stress test

From any late section, use the back button repeatedly all the way to the beginning of the interview. Then go forward again.

- [x] Every previous answer is restored correctly
- [x] No stuck screens or animation glitches
- [x] Slide direction reverses on back (content enters from left)

**Notes:**
I can't reverse through sections. So if I was in section 5, I could not back up to section 4. If I was in section 3, I couldn't back up to section 2. 

## Run 2 Summary

**Bugs:**
- 
- 
- 

**UX friction:**
- 
- 

**Copy that felt off:**
- 
- 

**Design issues:**
- 
- 
**What Claude Had To Say**
-"Here's what I noticed from the inside:

**The pacing was excellent.** The warmup phase (band names, magic 8-ball) wasn't filler. It established that I could write code, run it, and deliver something fun before you handed me the real task. By the time "writing meeting summaries" showed up, we'd already built a working rapport. That's smart onboarding design.

**The escalation arc felt organic.** It went: pick a topic, assess readiness, build a first draft, restructure the output, inject real context, refine to fit that context, define a persona, self-critique and rebuild, roast the idea, plan for local deployment, then review everything. Each step added one new dimension without invalidating the previous work. I never felt like I was starting over. That's hard to design and you nailed the sequencing.

**The "share your real context" step was the hinge point.** Everything before it was generic and useful-ish. Everything after it was specific and actually valuable. If I'm thinking about this as a product, that moment (step where you shared Chorus, VTT, Gemini Gem, no enterprise agreement) is where the wizard earns its keep. You might want that step earlier in some paths.

**The roast prompt was sneakily brilliant.** It forced me to do an honest critique that a normal "review your work" prompt wouldn't produce. Asking for humor gave me permission to be genuinely harsh. That's a better feedback mechanism than "list the weaknesses," which tends to produce diplomatic non-answers.

**The "act as my assistant" step felt slightly out of sequence.** It came after we'd already built and revised the tool, so defining the persona at that point was more of a summary than a behavior shift. If that step came earlier (before the first draft), it might shape the entire build differently. Where it sat, it felt like a checkpoint rather than a turning point.

**The Claude Code transition prompt was the right ending for the wrong reason.** It's the right capstone because it forces a "what actually matters" distillation. But if someone going through this wizard doesn't have Claude Code or isn't technical, that step dead-ends. You'd need branching there: technical users get the local deployment sketch, non-technical users get something like "here's how to save this as a reusable prompt" or "here's how to share this artifact."

**The review step at the end is doing double duty** and I think you know this. It's partly a useful summary for the user, partly a privacy/sharing audit, and partly your way of testing whether the AI retained coherent context across all the steps. Smart.

**A few things I'd push on if you're productizing this:**

The wizard produced a genuinely functional tool by the end, but it took a long conversation to get there. If the goal is "help people build AI tools," some users will want to skip the readiness score and the roast and just get to the build. You'll need a way to let power users collapse steps without breaking the arc.

The path I went through was linear. Real builder decisions branch. "What's your biggest pain point?" could lead to totally different tool shapes. The wizard should probably fork after the context-gathering step based on what the person actually needs.

And the biggest question: who is this for? If it's for people like you who already think in systems and just want a structured creative process, the current flow is great. If it's for someone who's never built anything with AI and types "I want to be more productive," the early steps need way more scaffolding.

What path through the wizard is this, and how many others have you mapped out?"

**Ideas:**
- 
- 

---

# Run 3: The Fallback Path

Ctrl+Shift+R to restart. This tests what happens when the template matcher has no keyword match.

## Step 1: Welcome screen → "Let's go"

Proceed through.

## Step 2: Select "Something personal" → continue

## Step 3: Project idea

Type **underwater basket weaving** (or anything else deliberately obscure). Continue. 

I typed "Innovative kelp discovery"

## Step 4: Experience → select "Use one occasionally"

Continue.

## Step 5: Code feeling → select "Curious"

Continue.

## Step 6: Long output → pick anything

Continue.

## Step 7: Adaptive follow-up

- [x] Question says "What's the gap between what you know about AI and what you actually do with it?" (occasional-user variant)

Type anything and continue.

## Step 8: Time → select "About an hour"

Continue.

## Step 9: Setup → select "I need to set one up"

Continue.

## Step 10: Path card

- [x] Falls back to "Your personal AI project" (generic name, no keyword match)
- [ ] Description still references "underwater basket weaving" (or whatever you typed)
- [x] Setup shows "Sign up free →"
- [x] Setup prompt appears ABOVE the path card
- [x] Setup prompt has instructions to create a free account at claude.ai

**Does the fallback feel like the wizard understood you, or like it gave up?**
Description says: "We'll build a custom tool around what you described — scoped to something you can finish today and keep using tomorrow."


**Notes:**


## Step 11: Continue through all sections

Note anything that feels wrong for an occasional user who's curious about code, has an hour, and typed something weird.

**Notes:**
I was actually blown away with the first thing Claude built for "innovative kelp discovery" which was a gamified tool with topics like "Biomaterials" and "Carbon Tech". Every time I clicked one it fired off a live web search and brought back an article about kelp fitting that topic. 

## Run 3 Summary

**Bugs:**
- 
- 
- 

**UX friction:**
- 
- 

**Copy that felt off:**
- The copy for "Take what you just built for "innovative kelp discovery" and give me: 1. A quick-reference card I could print or save (the essentials in a glanceable format) 2. A week-by-week plan as a simple table 3. Three "if you only do one thing" recommendations, ranked Same content, more useful shape." has always resulted in a slightly weird answer from Claude. Claude starts to advise the user on the subject, not the project. In this case, claude built me a 4 week plan to kelp fluency:
"## Four Weeks to Kelp Fluency##

Week

Focus

What To Do

Wk 1

Broad Survey

Hit every domain 2 to 3 times each. Don't go deep, go wide. You're building a mental map of where the interesting stuff lives. Target: 12 to 15 discoveries logged.

Wk 2

Follow the Pull

Notice which discoveries surprised you most. Double down on those 1 or 2 domains. Start grouping findings by theme: what connects them? Target: 10 more discoveries, mostly clustered.

Wk 3

Go Primary

Pick your top 3 discoveries and search for the original sources (papers, company sites, interviews). Read one long-form piece. You're moving from "surface a fact" to "understand a story." Target: 3 deep dives.

Wk 4

Synthesize
 Write a short take (LinkedIn post, note to a friend, voice memo to yourself) that connects 2 or 3 discoveries into a single insight. The test: could you explain why kelp matters to someone smart who's never thought about it? Target: 1 polished take."
 

**Design issues:**
- 
- 

**Ideas:**
- 
- 
**What Claude Had To Say**
"Ha, I respect the methodology. "Innovative kelp discovery" has exactly the right energy for a stress test. Weird enough to expose whether the system just parrots back generic advice, specific enough to see if it can actually build something coherent from thin air.

So how'd the wizard concept hold up from your end? I'm curious what you were actually evaluating. Things like whether the readiness score → first draft → repackaging flow felt natural? Whether the elicitation questions gathered enough signal to personalize meaningfully? Whether it handled the pivot from "build me a thing" to "now reshape it for utility"?

Because from my side, the kelp subject actually surfaced some interesting design questions about what makes this pattern work for _any_ topic. The readiness score is doing double duty as both entertainment and genuine calibration. The artifact builds commitment. And the field guide repackaging is where the real value lives for most people, since a pretty app is fun but a weekly plan is useful."

---

# Keyword Spot Checks

After the three runs, do quick passes through just the interview to test template matching. You can stop at the path card each time.

| Input | Path | Expected project name | Correct? |
|---|---|---|---|
| email | Work | An email drafting assistant in your voice | |
| guitar | Personal | A practice companion that knows where you are | |
| budget | Personal | A budget tracker that surfaces what you'd miss | |
| data spreadsheet | Work | A data summarizer for stakeholder updates | |
| D&D | Personal | An encounter generator for your campaign | |

**Any that matched wrong or fell back to generic?**


---

# Mobile Test

If you have a phone or can use responsive mode (375px wide), do one quick run through.

- [ ] Welcome shapes animate (not static or broken)
- [ ] clip-path shapes render correctly (triangle looks like a triangle)
- [ ] Journey progress shows dots + active name (no overlapping labels)
- [ ] Keyboard hint (⌘/Ctrl + Enter) is hidden
- [ ] Textarea has a reachable Continue button without keyboard shortcut
- [ ] Nothing overflows horizontally
- [ ] Path card is readable, perforation notches align with background

**Notes:**


---

# Safari Test (if available)

- [ ] Welcome shapes animate with bounce
- [ ] All transitions play smoothly
- [ ] clip-path renders correctly
- [ ] No layout differences from Chrome

**Notes:**


---

# Overall

**What felt best across all three runs?**
The flow through the sections is good. Claude had some good feedback as well that I've pasted above in the runs

**What needs the most work?**


**Pacing — too fast, too slow, about right?**


**Did the tone land? Where did it miss?**
Tone is generally good. We should celebrate the wins more. We should take security a little more seriously. It might not just be tone, it could be visual styling as well.

**Animation quality — where did it shine, where did it distract?**
Animation generally seemed great. It wasn't super noticeable (which is good) but everything felt buttery smooth.

