/* ━━━ Cockpit Features ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Stage 2 content. Six Claude capabilities, plain-language
   explanations with analogies. Copy is intentional — edit with
   care.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const cockpitFeatures = [
  {
    id: "models",
    label: "Models",
    heading: "Picking your engine",
    body: "Claude comes in three sizes. Haiku is the scooter: fast, cheap, good for quick errands like reformatting or simple questions. Sonnet is the daily driver: handles most tasks well, from writing to analysis. Opus is the heavy-duty truck: slower and more expensive, but the best choice for complex reasoning, nuanced writing, or tasks that need real depth. For your first build today, Sonnet is the right choice.",
    image: "models.png",
  },
  {
    id: "extended_thinking",
    label: "Extended thinking",
    heading: "Giving Claude time to think",
    body: "There's a toggle that lets Claude reason longer before answering. Think of it like asking a colleague to take five minutes to think it through instead of answering off the top of their head. Turn it on when the problem is complex, like analyzing data or building a strategy. Leave it off for simple, fast tasks.",
    image: "thinking.png",
  },
  {
    id: "research",
    label: "Research",
    heading: "Sending Claude to the library",
    body: "The Research toggle lets Claude search the web before answering. Use it when you need current information: market data, recent news, competitive intelligence, industry trends. A heads up: research takes 10-15 minutes because Claude is actually reading and synthesizing multiple sources. It's doing real work, not just fetching links.",
    image: "research.png",
  },
  {
    id: "projects",
    label: "Projects",
    heading: "Your workspace",
    body: "A Project is a persistent space where Claude remembers your instructions and files every time you come back. Think of it like a shared folder with a colleague who never forgets the brief. Create one for each ongoing workstream: weekly reporting, client research, content drafting. The prompt you build today is a great first thing to save in a Project.",
    image: "projects.png",
  },
  {
    id: "artifacts",
    label: "Artifacts",
    heading: "The document on the right",
    body: "When Claude builds something substantial, like a document, a spreadsheet, a report, or code, it appears in a panel on the right side of the screen. That's an artifact. You can edit it directly, copy it, or download it. It's not just a chat response. It's a working document.",
    image: "artifacts.png",
  },
  {
    id: "memory",
    label: "Memory",
    heading: "Claude remembers (if you want)",
    body: "Claude can remember your preferences across conversations: your writing style, your role, how you like things formatted. You control what it keeps and can clear it anytime. Over time, this means less repeating yourself. It's optional and you're always in charge of it.",
    image: "memory.png",
  },
];

export default cockpitFeatures;
