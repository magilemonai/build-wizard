/* ━━━ Launcher Templates ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   10 templates in 3 buckets. Each template drives Stage 4 (Build)
   with per-step questions, placeholders, and example output.
   Copy is intentional — edit with care.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const templates = [
  // ── Bucket: information ─────────────────────────────────────────
  {
    id: "document-distiller",
    name: "The Document Distiller",
    bucket: "information",
    bucketLabel: "I'm drowning in information",
    oneLiner: "Take a long document and pull out what matters.",
    scopingQuestion: null,
    features: ["artifacts", "model_selection"],
    promptSteps: {
      role: {
        question: "Who should Claude be for this job?",
        placeholder: "e.g., A senior analyst who's read hundreds of these reports and knows what matters",
        exampleOutput: "You are a senior analyst with deep experience reading and summarizing complex reports.",
      },
      context: {
        question: "What are you giving Claude to work with?",
        placeholder: "e.g., Quarterly business review decks from clients, usually 20-40 slides",
        exampleOutput: "I'm going to give you a quarterly business review deck from a client. It's typically 20-40 slides mixing data visualizations with narrative commentary.",
      },
      task: {
        question: "What do you need back?",
        placeholder: "e.g., A one-page summary with the three most important takeaways and any red flags",
        exampleOutput: "Please analyze this deck and produce a one-page summary that includes: the three most important takeaways, any red flags or concerns, and the key metrics with their trends.",
      },
      format: {
        question: "How should it look?",
        placeholder: "e.g., Bullets, with sections for takeaways, red flags, and metrics. Under 500 words.",
        exampleOutput: "Format the summary as follows:\n- Takeaways (3 bullets, most important first)\n- Red Flags (any concerns, with brief explanation)\n- Key Metrics (metric name, current value, trend direction)\nKeep the total summary under 500 words.",
      },
      constraints: {
        question: "Anything Claude should watch out for?",
        placeholder: "e.g., Don't just list everything. I need judgment calls, not a recap.",
        exampleOutput: "Important: Don't simply list all content. Use your judgment to identify what's most significant. If data in the slides contradicts the narrative text, explicitly flag the discrepancy.",
      },
    },
  },
  {
    id: "feedback-finder",
    name: "The Feedback Finder",
    bucket: "information",
    bucketLabel: "I'm drowning in information",
    oneLiner: "Find patterns in messy qualitative feedback.",
    scopingQuestion: "What kind of feedback are we working with, and roughly how much?",
    features: ["extended_thinking", "artifacts"],
    promptSteps: {
      role: {
        question: "Who should Claude be for this job?",
        placeholder: "e.g., A research analyst who specializes in finding signal in noisy qualitative data",
        exampleOutput: "You are a qualitative research analyst who specializes in identifying patterns and themes in unstructured feedback data.",
      },
      context: {
        question: "What are you giving Claude to work with?",
        placeholder: "e.g., 50 open-ended responses from our quarterly customer satisfaction survey",
        exampleOutput: "I'm going to give you approximately 50 open-ended responses from our quarterly customer satisfaction survey.",
      },
      task: {
        question: "What do you need back?",
        placeholder: "e.g., The top themes, how often each comes up, and specific quotes that illustrate each theme",
        exampleOutput: "Analyze these responses and identify the top themes. For each theme, tell me: how frequently it appears, the overall sentiment, and 2-3 representative quotes.",
      },
      format: {
        question: "How should it look?",
        placeholder: "e.g., A structured report with each theme as a section, plus an executive summary at the top",
        exampleOutput: "Format as a report with:\n- Executive summary (3-4 sentences, top findings)\n- Theme sections (theme name, frequency, sentiment, representative quotes)\n- Ranked by frequency, most common first",
      },
      constraints: {
        question: "Anything Claude should watch out for?",
        placeholder: "e.g., Don't over-count similar complaints as separate themes. Group related issues together.",
        exampleOutput: "Group related concerns into broader themes rather than splitting them into many narrow categories. If a response touches multiple themes, count it under the primary one. Flag any outlier responses that don't fit a pattern but seem important.",
      },
    },
  },
  {
    id: "data-decoder",
    name: "The Data Decoder",
    bucket: "information",
    bucketLabel: "I'm drowning in information",
    oneLiner: "Understand what a spreadsheet or dataset is telling you.",
    scopingQuestion: "What kind of data is it, and roughly how much?",
    features: ["extended_thinking", "artifacts", "research"],
    promptSteps: {
      role: {
        question: "Who should Claude be for this job?",
        placeholder: "e.g., A data analyst who's great at explaining numbers to non-technical people",
        exampleOutput: "You are a data analyst who excels at finding meaningful patterns in data and explaining them in plain language for non-technical stakeholders.",
      },
      context: {
        question: "What are you giving Claude to work with?",
        placeholder: "e.g., A CSV export of our monthly sales by region for the past 6 months",
        exampleOutput: "I'm going to give you a CSV of our monthly sales data broken down by region, covering the last 6 months.",
      },
      task: {
        question: "What do you need back?",
        placeholder: "e.g., Tell me what's trending up, what's trending down, and anything that looks unusual",
        exampleOutput: "Analyze this data and tell me: which regions are trending up and down, any notable anomalies or outliers, and what the overall trajectory looks like.",
      },
      format: {
        question: "How should it look?",
        placeholder: "e.g., A summary I can paste into a Slack message, plus a more detailed breakdown I can attach",
        exampleOutput: "Give me two outputs:\n1. A 3-4 sentence Slack summary of the key findings\n2. A detailed breakdown with each region's trend, notable data points, and any recommended follow-up questions",
      },
      constraints: {
        question: "Anything Claude should watch out for?",
        placeholder: "e.g., Don't assume I know statistical terms. Explain any jargon in plain English.",
        exampleOutput: "Explain all findings in plain language. Avoid statistical jargon, or define it when unavoidable. If the data is insufficient to draw a conclusion, say so rather than speculating.",
      },
    },
  },
  {
    id: "researcher",
    name: "The Researcher",
    bucket: "information",
    bucketLabel: "I'm drowning in information",
    oneLiner: "Get smart on a topic fast with a structured brief.",
    scopingQuestion: "What's the topic, and who's the audience for the brief?",
    features: ["research", "extended_thinking", "artifacts"],
    promptSteps: {
      role: {
        question: "Who should Claude be for this job?",
        placeholder: "e.g., A senior research analyst preparing a briefing for leadership",
        exampleOutput: "You are a senior research analyst preparing a comprehensive briefing document for a leadership audience.",
      },
      context: {
        question: "What's the topic and why does it matter right now?",
        placeholder: "e.g., Our competitors just launched AI features and my VP wants to understand the landscape",
        exampleOutput: "I need research on the competitive landscape for AI features in our industry. This is for a leadership meeting where we'll decide our AI product strategy.",
      },
      task: {
        question: "What angles do you want covered?",
        placeholder: "e.g., Who are the key players, what have they launched, how are customers responding, what's the pricing",
        exampleOutput: "Research and cover the following angles: key competitors and their AI offerings, launch timelines and customer reception, pricing models, and any gaps or opportunities in the market.",
      },
      format: {
        question: "How should the brief look?",
        placeholder: "e.g., An executive brief with sections for each angle, sources cited, and a recommendation section",
        exampleOutput: "Format as an executive research brief with:\n- Executive summary (key findings in 4-5 sentences)\n- Sections for each research angle with source references\n- A 'So What' section with implications and recommended next steps",
      },
      constraints: {
        question: "Anything Claude should watch out for?",
        placeholder: "e.g., Prioritize recent sources. Flag anything that might be outdated or unreliable.",
        exampleOutput: "Prioritize sources from the past 6 months. Clearly flag any information that may be outdated or comes from a single unverified source. Note: research may take 10-15 minutes as Claude reads and synthesizes multiple sources.",
      },
    },
  },

  // ── Bucket: production ──────────────────────────────────────────
  {
    id: "draft-machine",
    name: "The Draft Machine",
    bucket: "production",
    bucketLabel: "I need to produce something",
    oneLiner: "Stop rewriting the same emails from scratch.",
    scopingQuestion: null,
    features: ["projects", "memory"],
    promptSteps: {
      role: {
        question: "Who should Claude be for this job?",
        placeholder: "e.g., A communications specialist who matches my tone perfectly",
        exampleOutput: "You are a communications specialist who writes in a professional but warm tone, matching the voice and style I'll describe.",
      },
      context: {
        question: "What's the recurring message you keep writing?",
        placeholder: "e.g., Weekly client update emails that summarize project progress and next steps",
        exampleOutput: "I regularly send weekly client update emails that summarize what we accomplished this week, any blockers, and what's coming next week.",
      },
      task: {
        question: "What should Claude draft for you?",
        placeholder: "e.g., A complete email draft based on bullet points I give you about this week's progress",
        exampleOutput: "Given bullet points about this week's progress, draft a complete client update email that covers: accomplishments, any issues or blockers, and next week's priorities.",
      },
      format: {
        question: "How should it look?",
        placeholder: "e.g., Professional but not stiff, 3-4 short paragraphs, subject line included",
        exampleOutput: "Write in a professional but conversational tone. Include a subject line. Keep to 3-4 short paragraphs. Use the client's first name in the greeting.",
      },
      constraints: {
        question: "Anything Claude should watch out for?",
        placeholder: "e.g., Never use exclamation points. Always end with a specific next step, not a vague 'let me know.'",
        exampleOutput: "Avoid exclamation points and overly casual language. Always close with a specific, actionable next step rather than a generic sign-off. If I mention a blocker, frame it as something we're handling, not a complaint.",
      },
    },
  },

  {
    id: "report-builder",
    name: "The Report Builder",
    bucket: "production",
    bucketLabel: "I need to produce something",
    oneLiner: "Turn raw notes into something presentable.",
    scopingQuestion: null,
    features: ["artifacts", "projects"],
    promptSteps: {
      role: {
        question: "Who should Claude be for this job?",
        placeholder: "e.g., A sharp executive assistant who turns my messy notes into polished reports",
        exampleOutput: "You are an experienced executive assistant who specializes in transforming rough notes and data into clear, polished reports.",
      },
      context: {
        question: "What kind of raw material will you give Claude?",
        placeholder: "e.g., My scribbled notes from this week's team meetings plus some Slack highlights",
        exampleOutput: "I'm going to give you my rough notes from several team meetings this week, along with some copied Slack messages about key decisions and updates.",
      },
      task: {
        question: "What report do you need?",
        placeholder: "e.g., A weekly team status report I can send to my director",
        exampleOutput: "Synthesize these notes into a weekly team status report suitable for my director. Cover: key accomplishments, decisions made, open issues, and priorities for next week.",
      },
      format: {
        question: "How should it look?",
        placeholder: "e.g., Clean sections with headers, bullets for key items, no more than one page",
        exampleOutput: "Format with clear section headers. Use bullets for individual items. Keep the total length to one page. Lead with the most important information.",
      },
      constraints: {
        question: "Anything Claude should watch out for?",
        placeholder: "e.g., If my notes are vague on a point, flag it as needing clarification rather than making something up",
        exampleOutput: "If my notes are ambiguous or incomplete on any point, flag it with [NEEDS CLARIFICATION] rather than inventing details. Maintain a neutral, factual tone throughout.",
      },
    },
  },
  {
    id: "process-writer",
    name: "The Process Writer",
    bucket: "production",
    bucketLabel: "I need to produce something",
    oneLiner: "Get that process out of your head and into a document.",
    scopingQuestion: null,
    features: ["artifacts"],
    promptSteps: {
      role: {
        question: "Who should Claude be for this job?",
        placeholder: "e.g., A technical writer who's great at making complex processes easy to follow",
        exampleOutput: "You are a technical writer who specializes in creating clear, step-by-step process documentation that anyone can follow without prior context.",
      },
      context: {
        question: "What's the process you need documented?",
        placeholder: "e.g., How we onboard a new client from signed contract to first campaign launch",
        exampleOutput: "I need to document our client onboarding process, from the moment a contract is signed through to the launch of the first campaign.",
      },
      task: {
        question: "What should the document cover?",
        placeholder: "e.g., Every step in order, who's responsible, what tools they use, and what 'done' looks like at each step",
        exampleOutput: "Create a standard operating procedure that covers: each step in chronological order, who is responsible, what tools or systems are involved, expected timeline, and the definition of done for each step.",
      },
      format: {
        question: "How should it look?",
        placeholder: "e.g., Numbered steps with sub-steps, a summary at the top, formatted so someone new could follow it",
        exampleOutput: "Format as numbered steps with sub-steps where needed. Include a brief overview at the top summarizing the full process in 2-3 sentences. Bold the responsible party for each step.",
      },
      constraints: {
        question: "Anything Claude should watch out for?",
        placeholder: "e.g., Don't assume knowledge of our internal tools. Explain any acronyms the first time they appear.",
        exampleOutput: "Don't assume the reader knows our internal tools or jargon. Define acronyms on first use. If I describe a step vaguely, ask me to clarify rather than guessing. Include a 'common mistakes' note for any step where people typically get tripped up.",
      },
    },
  },
  {
    id: "deck-architect",
    name: "The Deck Architect",
    bucket: "production",
    bucketLabel: "I need to produce something",
    oneLiner: "Find the story in your existing slides.",
    scopingQuestion: "Roughly how many slides are you working with, and what's the presentation for?",
    features: ["extended_thinking", "artifacts"],
    promptSteps: {
      role: {
        question: "Who should Claude be for this job?",
        placeholder: "e.g., A presentation strategist who knows how to build a compelling narrative from existing material",
        exampleOutput: "You are a presentation strategist who excels at curating and sequencing existing slide content into a compelling narrative tailored to a specific audience and goal.",
      },
      context: {
        question: "What slides do you have and what's the occasion?",
        placeholder: "e.g., We have a master deck of about 80 slides covering our platform, case studies, and pricing. I need a 25-minute pitch for a retail client.",
        exampleOutput: "I have a master slide library of approximately 80 slides covering our platform overview, case studies across industries, technical capabilities, and pricing options. I need to build a 25-minute pitch deck for a meeting with a retail industry prospect.",
      },
      task: {
        question: "What do you need Claude to produce?",
        placeholder: "e.g., A recommended slide sequence, which slides to cut, and what's missing that I'd need to create",
        exampleOutput: "Review the slide inventory I'll provide and recommend: which slides to include and in what order, which slides to cut, where to place transitions or section breaks, and identify any gaps where new slides need to be created.",
      },
      format: {
        question: "How should the recommendation look?",
        placeholder: "e.g., A numbered sequence with the slide title, why it's included, and notes on any modifications",
        exampleOutput: "Format as a numbered slide sequence with:\n- Slide title/description\n- Why it's included at this point in the narrative\n- Any modifications needed\nThen a separate 'Gaps' section listing slides that need to be created from scratch.",
      },
      constraints: {
        question: "Anything Claude should watch out for?",
        placeholder: "e.g., Keep it under 20 slides. Lead with the client's problem, not our product features.",
        exampleOutput: "The final deck should not exceed 20 slides. Structure the narrative around the client's challenges first, then show how we address them. Don't lead with product features. If multiple case studies could work, recommend the one closest to the client's industry.",
      },
    },
  },

  // ── Bucket: thinking ────────────────────────────────────────────
  {
    id: "meeting-prep-brief",
    name: "The Meeting Prep Brief",
    bucket: "thinking",
    bucketLabel: "I need to think more clearly",
    oneLiner: "Walk into every meeting ready.",
    scopingQuestion: null,
    features: ["research", "artifacts"],
    promptSteps: {
      role: {
        question: "Who should Claude be for this job?",
        placeholder: "e.g., A chief of staff who always has me prepared for any meeting",
        exampleOutput: "You are a chief of staff who prepares thorough, practical meeting briefs that ensure I walk in informed and ready to contribute.",
      },
      context: {
        question: "What's the meeting?",
        placeholder: "e.g., Quarterly business review with our biggest client, their CMO will be there, we're trying to expand the contract",
        exampleOutput: "I have a quarterly business review meeting with our largest client. Their CMO will attend. Our goal is to demonstrate value from the current engagement and build the case for expanding the contract.",
      },
      task: {
        question: "What do you need to walk in with?",
        placeholder: "e.g., Background on the attendees, talking points, potential objections and how to handle them",
        exampleOutput: "Prepare a meeting brief that includes: background context on the client and key attendees, 3-5 talking points aligned with our expansion goal, potential objections or tough questions with suggested responses, and specific questions I should ask.",
      },
      format: {
        question: "How should the brief look?",
        placeholder: "e.g., One page max, scannable, something I can glance at in the elevator",
        exampleOutput: "Keep to one page. Use short bullets, not paragraphs. Organize as: Context (3 bullets), Talking Points, Potential Objections, Questions to Ask. It should be scannable in 2 minutes.",
      },
      constraints: {
        question: "Anything Claude should watch out for?",
        placeholder: "e.g., Don't be generic. If you don't know specifics about the client, say so and I'll fill them in.",
        exampleOutput: "Be specific, not generic. If you lack information about the client or their business, flag it as [NEED INPUT] so I can fill in the details. Prioritize practical, actionable points over general advice.",
      },
    },
  },
  {
    id: "strategy-brainstorm",
    name: "The Strategy Brainstorm",
    bucket: "thinking",
    bucketLabel: "I need to think more clearly",
    oneLiner: "Think through a problem from every angle.",
    scopingQuestion: "What's the decision or question you're trying to work through? (Give me a sentence or two so I can help scope the brainstorm.)",
    features: ["extended_thinking", "model_selection"],
    promptSteps: {
      role: {
        question: "Who should Claude be for this job?",
        placeholder: "e.g., A strategy consultant who pressure-tests ideas from multiple perspectives",
        exampleOutput: "You are a strategy consultant who examines business questions from multiple perspectives, pressure-testing assumptions and surfacing risks that internal teams often miss.",
      },
      context: {
        question: "What's the situation?",
        placeholder: "e.g., We're deciding whether to build an AI feature in-house or partner with a vendor. Timeline is Q3.",
        exampleOutput: "We're evaluating whether to build an AI feature in-house or partner with an external vendor. The target launch is Q3. Our engineering team is already at capacity on core product work.",
      },
      task: {
        question: "What kind of thinking do you need?",
        placeholder: "e.g., Give me the strongest case for each option, the risks of each, and what questions I should be asking that I'm probably not",
        exampleOutput: "For each option (build vs. partner), give me: the strongest case for choosing it, the top 3 risks, estimated timeline and resource implications, and questions I should be asking that I might not have considered.",
      },
      format: {
        question: "How should it look?",
        placeholder: "e.g., Side-by-side comparison, then a recommendation with caveats",
        exampleOutput: "Structure as a side-by-side comparison (Build vs. Partner) with matching categories for easy scanning. Follow with a recommendation that includes caveats and conditions.",
      },
      constraints: {
        question: "Anything Claude should watch out for?",
        placeholder: "e.g., Don't default to 'it depends.' Take a position and defend it, then show me the counter-argument.",
        exampleOutput: "Don't hedge with 'it depends' — take a clear position and defend it, then present the strongest counter-argument. Be direct about trade-offs. If an option has a dealbreaker risk, say so plainly.",
      },
    },
  },
];

export default templates;

/** Return all templates belonging to a bucket. */
export function getTemplatesByBucket(bucket) {
  return templates.filter((t) => t.bucket === bucket);
}

/** Return a single template by id, or undefined. */
export function getTemplateById(id) {
  return templates.find((t) => t.id === id);
}
