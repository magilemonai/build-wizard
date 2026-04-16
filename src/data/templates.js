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

  // ── Remaining 5 templates (report-builder, process-writer,
  //    deck-architect, meeting-prep-brief, strategy-brainstorm)
  //    will be added in the next task. ─────────────────────────────
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
