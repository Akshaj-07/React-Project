import { detectSkills } from "./jobMatcher.js";

// A small typo dictionary. Easy to extend: add more "wrong": "right" pairs.
const COMMON_TYPOS = {
  recieve: "receive",
  recieved: "received",
  managment: "management",
  acheive: "achieve",
  acheived: "achieved",
  seperate: "separate",
  experiance: "experience",
  responsibile: "responsible",
  definately: "definitely",
  occured: "occurred",
  succesful: "successful",
  enviroment: "environment",
  teh: "the",
  langauge: "language",
  developement: "development"
};

function countWords(text) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  return words.length;
}

// Finds known typos and returns [{ found, suggestion }].
function findTypos(text) {
  const words = text.toLowerCase().match(/[a-z]+/g) || [];
  const seen = new Set();
  const issues = [];

  words.forEach((word) => {
    if (COMMON_TYPOS[word] && !seen.has(word)) {
      seen.add(word);
      issues.push({ found: word, suggestion: COMMON_TYPOS[word] });
    }
  });
  return issues;
}

// Finds the same word written twice in a row ("the the", "and and").
function findRepeatedWords(text) {
  const matches = text.match(/\b([a-zA-Z]{3,})\s+\1\b/gi) || [];
  return [...new Set(matches.map((m) => m.toLowerCase()))];
}

// Runs every check and returns the object Quick_Scan.jsx displays.
export function analyseResume(text) {
  const lower = text.toLowerCase();
  const wordCount = countWords(text);

  const checklist = [
    {
      label: "Contact email",
      passed: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(text),
      detail: "An email address makes it easy for recruiters to reach you."
    },
    {
      label: "Phone number",
      passed: /(\+?\d[\d\s-]{8,}\d)/.test(text),
      detail: "Add a phone number with at least 10 digits."
    },
    {
      label: "Education section",
      passed: /\beducation\b/.test(lower),
      detail: "Include a section named Education with your degree and year."
    },
    {
      label: "Skills section",
      passed: /\bskills?\b/.test(lower),
      detail: "List your technical skills under a Skills heading."
    },
    {
      label: "Experience or projects",
      passed: /\b(experience|projects?|internship)\b/.test(lower),
      detail: "Show at least one project or internship."
    },
    {
      label: "Bullet points",
      passed: /(^|\n)\s*[-•*]\s+\S/.test(text),
      detail: "Bullets are easier to scan than long paragraphs."
    },
    {
      label: "Measurable results",
      passed: /\d+\s?%|\b\d{2,}\b/.test(text),
      detail: "Numbers (users, percentages, speed-ups) make achievements concrete."
    },
    {
      label: "Reasonable length",
      passed: wordCount >= 150 && wordCount <= 700,
      detail: `${wordCount} words. Aim for roughly 150 to 700.`
    }
  ];

  const typoIssues = findTypos(text);
  const repeatedWords = findRepeatedWords(text);
  const detectedSkills = detectSkills(text);

  // Suggestions are generated from the checks that failed.
  const suggestions = checklist
    .filter((item) => !item.passed)
    .map((item) => `${item.label}: ${item.detail}`);

  if (typoIssues.length) suggestions.push("Fix the possible typos listed on this page.");
  if (repeatedWords.length) suggestions.push("Remove repeated words.");
  if (detectedSkills.length < 4) suggestions.push("List more of your technical skills.");

  const passedCount = checklist.filter((item) => item.passed).length;
  const score = Math.round((passedCount / checklist.length) * 100);

  return { score, wordCount, checklist, suggestions, typoIssues, repeatedWords, detectedSkills };
}

// The headline shown next to the big score number.
export function getScanLabel(score) {
  if (score >= 90) return "Excellent basics";
  if (score >= 75) return "Strong resume";
  if (score >= 50) return "Good start";
  return "Needs work";
}