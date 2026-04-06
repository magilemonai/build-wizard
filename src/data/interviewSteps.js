/* ━━━ Interview Flow (project-first, assessment woven in) ━━━━━━━ */
export default function getInterviewSteps(answers) {
  const steps = [];

  // ── Project conversation first ──
  steps.push({
    id: "fork",
    question: "What would you like to build?",
    subtext: "Work projects teach you things you'll use tomorrow. Personal projects light the spark faster. Both paths cover the same skills.",
    type: "choice",
    options: [
      { value: "work", label: "Something for work" },
      { value: "personal", label: "Something personal" },
    ],
  });

  if (answers.fork === "work") {
    steps.push({
      id: "project_idea",
      question: "What's something you do every week that feels repetitive?",
      subtext: "The best first AI project is a real task you already do. We'll build a tool that handles part of it.",
      type: "textarea", placeholder: "Every Monday I have to...",
    });
  } else if (answers.fork === "personal") {
    steps.push({
      id: "project_idea",
      question: "What's something you're into outside of work?",
      subtext: "A hobby, a side project, something you'd spend a Saturday afternoon on. We'll build around it.",
      type: "textarea", placeholder: "I'm really into...",
    });
  }

  // ── Assessment woven in after investment ──
  steps.push({
    id: "experience",
    question: "How would you describe your experience with AI tools?",
    subtext: "This shapes the pace. We'll meet you where you are.",
    type: "choice",
    options: [
      { value: "never", label: "Haven't really used one" },
      { value: "tried", label: "Tried it a couple of times" },
      { value: "occasional", label: "Use one occasionally" },
      { value: "regular", label: "Use one regularly" },
    ],
  });

  steps.push({
    id: "code_feeling",
    question: 'When you hear the word "code," what\'s your gut reaction?',
    subtext: "Be honest. There's a right answer and it's the true one.",
    type: "choice",
    options: [
      { value: "nervous", label: "Nervous — that's not my world" },
      { value: "curious", label: "Curious — I'd try with guidance" },
      { value: "indifferent", label: "Indifferent — just a tool" },
      { value: "comfortable", label: "Comfortable — I've written some" },
    ],
  });

  steps.push({
    id: "long_output",
    question: "Have you ever asked an AI to produce something longer than a paragraph?",
    subtext: "A document, a plan, a piece of code, anything substantial.",
    type: "choice",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "unsure", label: "Not sure" },
    ],
  });

  // ── Adaptive follow-up ──
  const exp = answers.experience;
  if (exp === "never" || exp === "tried") {
    steps.push({
      id: "followup",
      question: "What made you curious enough to try this?",
      subtext: "Could be something you read, a problem you have, or plain curiosity.",
      type: "textarea", placeholder: "There's no wrong answer here...",
    });
  } else if (exp === "occasional") {
    steps.push({
      id: "followup",
      question: "What have you used AI for so far, and what do you wish it could do better?",
      subtext: "Even a rough sense helps us calibrate. No wrong answers.",
      type: "textarea", placeholder: "I've used it for... but I wish it could...",
    });
  } else if (exp === "regular") {
    steps.push({
      id: "followup",
      question: "What's working for you with AI? What isn't?",
      subtext: "We'll build on the strengths and fill the gaps.",
      type: "textarea", placeholder: "Works well for... but I struggle with...",
    });
  }

  // ── Calibration ──
  steps.push({
    id: "time",
    question: "How much time do you have right now?",
    type: "choice",
    options: [
      { value: "30min", label: "About 30 minutes" },
      { value: "1hr", label: "About an hour" },
      { value: "norush", label: "No rush" },
    ],
  });

  steps.push({
    id: "setup",
    question: "Do you have Claude ready to go?",
    subtext: "You'll need it open in another tab for the building sections. Free accounts work fine.",
    type: "choice",
    options: [
      { value: "ready", label: "Yes, it's open" },
      { value: "have_account", label: "I have an account but need to open it" },
      { value: "need_account", label: "I need to set one up" },
    ],
  });

  return steps;
}
