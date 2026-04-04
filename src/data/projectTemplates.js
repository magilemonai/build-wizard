/* ━━━ Project Scoping Lookup Table ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const projectTemplates = {
  personal: [
    { keywords: ["cook", "food", "meal", "recipe", "dinner", "kitchen", "bak"],
      name: "A meal planner that thinks like you do",
      desc: "Generates weekly menus matched to your dietary preferences, what's in season, and how much time you actually have. Today we're getting it to produce one week of dinners you'd genuinely eat.",
      learns: "Prompting with constraints, structured output (formatted meal plans), iteration, and how to check that AI suggestions are actually practical." },
    { keywords: ["writ", "blog", "essay", "journal", "story", "content", "novel", "fiction"],
      name: "A writing partner that sharpens your drafts",
      desc: "A tool that helps you brainstorm, outline, and refine your writing. Not a replacement for your voice — a sounding board that pushes back. Today we'll get it drafting and revising one real piece.",
      learns: "Iterative prompting, system prompts for tone and voice, multi-step workflows (draft → critique → revise), and spotting when AI output drifts from your intent." },
    { keywords: ["fit", "workout", "gym", "exercise", "run", "train", "lift", "yoga"],
      name: "A workout builder matched to your goals",
      desc: "Creates training plans based on your equipment, schedule, and what you're working toward. Today we build one that generates a full week of sessions you'd actually do.",
      learns: "Providing personal context to AI, structured output (exercise tables), iterating on specificity, and verifying that fitness advice is sound." },
    { keywords: ["read", "book", "novel", "library"],
      name: "A reading list curator with taste",
      desc: "Recommends books based on what you've loved, explains why each pick fits, and organizes your to-read queue. Today we get it producing recommendations that genuinely surprise you.",
      learns: "Prompting with examples (teaching AI your taste), structured output, and evaluating recommendation quality." },
    { keywords: ["music", "guitar", "piano", "song", "band", "drum", "instrument", "practic"],
      name: "A practice companion that knows where you are",
      desc: "Generates exercises, suggests songs at your level, and helps you structure focused practice sessions. Today we build one session plan tailored to your instrument and goals.",
      learns: "Domain-specific prompting, structured output for practice plans, and how to iterate when AI gets musical details wrong." },
    { keywords: ["budget", "financ", "money", "saving", "invest", "spend", "expense"],
      name: "A budget tracker that surfaces what you'd miss",
      desc: "Categorizes your spending, spots patterns, and helps you build rules that stick. Today we get it analyzing a sample month and producing insights you'd act on.",
      learns: "Working with your data, structured output (tables and summaries), and the critical habit of verifying AI's math." },
    { keywords: ["game", "d&d", "dnd", "rpg", "dungeon", "campaign", "tabletop"],
      name: "An encounter generator for your campaign",
      desc: "Builds balanced combat encounters, NPCs with personality, and plot hooks matched to your party's level and story. Today we create one full encounter ready to run.",
      learns: "Creative prompting, system prompts for world-building context, structured output, and guiding AI toward specific creative constraints." },
    { keywords: ["travel", "trip", "vacation", "itinerary", "flight", "destination"],
      name: "A trip planner that goes beyond the obvious",
      desc: "Builds itineraries based on your interests, pace, and budget — not just top-10 tourist lists. Today we plan one real day in a place you want to go.",
      learns: "Providing rich context, structured output (itineraries), verifying AI's factual claims about real places, and iterating on specificity." },
    { keywords: ["photo", "camera", "edit", "lightroom", "image"],
      name: "A photo workflow assistant",
      desc: "Helps you organize, tag, and develop editing strategies for your photography. Today we build a tool that suggests edits for a specific style you're after.",
      learns: "Describing visual concepts to AI, iterative refinement, system prompts for creative direction, and knowing the limits of text-based AI with visual tasks." },
    { keywords: ["garden", "plant", "grow", "seed", "soil"],
      name: "A garden planner for your actual space",
      desc: "Plans what to plant, when, and where based on your climate, space, and what you want to grow. Today we get it producing a seasonal plan for your setup.",
      learns: "Location-specific prompting, structured output (planting calendars), verifying AI's horticultural claims, and iterating with real constraints." },
  ],
  work: [
    { keywords: ["email", "messag", "reply", "draft", "respond", "inbox", "slack"],
      name: "An email drafting assistant in your voice",
      desc: "Handles recurring message formats — status updates, follow-ups, responses — in a tone that sounds like you, not like a robot. Today we get it drafting three real messages you'd actually send.",
      learns: "System prompts for voice and tone, structured templates, iteration, and reviewing AI output before it represents you." },
    { keywords: ["report", "data", "spreadsheet", "excel", "csv", "analys", "number", "metric", "dashboard"],
      name: "A data summarizer for stakeholder updates",
      desc: "Pulls insights from your spreadsheets and formats them into clear narratives for the people who need them. Today we build one that turns raw data into a summary your team would value.",
      learns: "Working with uploaded data, structured output, prompting for specific analytical angles, and verifying AI's numerical claims." },
    { keywords: ["meeting", "note", "agenda", "minute", "standup", "sync", "action"],
      name: "A meeting prep and follow-up tool",
      desc: "Generates agendas from context, captures notes into structured formats, and tracks action items. Today we build the agenda + action-item workflow for one real meeting.",
      learns: "Multi-step workflows (prep → capture → follow-up), templates, system prompts for meeting context, and structured output." },
    { keywords: ["present", "slide", "deck", "powerpoint", "pitch"],
      name: "A presentation outline builder",
      desc: "Takes your rough ideas and structures them into clear, persuasive slide outlines with speaker notes. Today we outline one real presentation you need to give.",
      learns: "Prompting for structure, iterative refinement, system prompts for audience context, and knowing when AI's framing needs your judgment." },
    { keywords: ["code", "program", "develop", "bug", "script", "automat", "python", "javascript"],
      name: "A coding assistant for your workflow",
      desc: "Helps you write, debug, and automate scripts for tasks you do repeatedly. Today we build one automation that saves you real time this week.",
      learns: "Code-oriented prompting, review-before-run as a core habit, iterating on technical output, and understanding what AI-generated code is actually doing." },
    { keywords: ["write", "document", "policy", "procedure", "manual", "guide", "sop"],
      name: "A documentation assistant that cuts through the blank page",
      desc: "Drafts, structures, and refines internal documents from your rough notes and knowledge. Today we turn one real set of notes into a polished first draft.",
      learns: "Providing domain context, multi-step workflows (outline → draft → revise), system prompts for organizational voice, and verifying factual accuracy." },
    { keywords: ["custom", "client", "support", "ticket", "help", "service"],
      name: "A customer response helper",
      desc: "Drafts responses to common questions in your team's voice, with the right level of detail. Today we build templates for your three most frequent request types.",
      learns: "Template-based prompting, system prompts for brand voice, structured output, and the critical line between AI-drafted and human-reviewed." },
    { keywords: ["hire", "recruit", "resume", "interview", "job", "candidate"],
      name: "A hiring workflow assistant",
      desc: "Helps you write job descriptions, screen resumes for relevant experience, and generate structured interview questions. Today we build one job description and a matching interview guide.",
      learns: "Prompting with specific criteria, structured output, bias awareness in AI-assisted hiring, and the importance of human judgment in people decisions." },
  ],
  fallback: {
    personal: {
      name: "Your personal AI project",
      desc: "We'll build a custom tool around what you described — scoped to something you can finish today and keep using tomorrow.",
      learns: "Prompting with precision, running code, structured output, reviewing AI work, and the safety habits that tie it all together.",
    },
    work: {
      name: "Your AI-powered work assistant",
      desc: "We'll build a tool that handles part of the recurring task you described — scoped to a working first version you can use this week.",
      learns: "Prompting with precision, structured output, multi-step workflows, reviewing AI work, and data handling habits for the workplace.",
    },
  },
};

export default projectTemplates;

export function matchProject(input, type) {
  const lower = (input || "").toLowerCase();
  const templates = projectTemplates[type] || [];
  // Score each template by number of keyword hits (not just first match)
  let bestMatch = null;
  let bestScore = 0;
  for (const t of templates) {
    const score = t.keywords.filter((kw) => lower.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = t;
    }
  }
  if (bestMatch) return bestMatch;
  return projectTemplates.fallback[type] || projectTemplates.fallback.personal;
}

export function derivePathCard(answers) {
  const levelMap = { never: "Newcomer", tried: "Newcomer", occasional: "Explorer", regular: "Practitioner" };
  const timeMap = { "30min": "~25 min", "1hr": "~45 min", norush: "~60 min" };
  const setupMap = { ready: "Ready", have_account: "Open Claude →", need_account: "Sign up free →" };

  const type = answers.fork === "work" ? "work" : "personal";
  const matched = matchProject(answers.project_idea, type);
  const isFallback = matched === projectTemplates.fallback[type] || matched === projectTemplates.fallback.personal;
  const idea = (answers.project_idea || "").trim();

  const hasBuiltLong = answers.long_output === "yes";
  const learns = hasBuiltLong
    ? matched.learns.replace("Prompting with precision, running code for the first time, ", "Structured output, system prompts, multi-step workflows, ")
    : matched.learns;

  // Personalize fallback description with user's actual input
  const projectDescription = isFallback && idea
    ? `We'll build a tool around "${idea}" — scoped to something you can finish today and keep improving tomorrow. The prompts in each section will use your exact project idea.`
    : matched.desc;

  return {
    projectName: isFallback && idea ? `Your ${type === "work" ? "work" : "personal"} project: ${idea.length > 40 ? idea.slice(0, 40) + "..." : idea}` : matched.name,
    projectDescription,
    level: levelMap[answers.experience] || "Explorer",
    time: timeMap[answers.time] || "~1 hour",
    setup: setupMap[answers.setup] || "Ready",
    learns,
  };
}
