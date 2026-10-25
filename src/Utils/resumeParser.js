const commonSkills = [
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "Express.js",
  "HTML",
  "CSS",
  "Python",
  "Java",
  "C++",
  "SQL",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Git",
  "REST APIs",
  "AWS",
  "Docker",
  "Kubernetes",
  "Machine Learning",
  "Data Analysis",
  "Pandas",
  "NumPy",
  "TensorFlow",
  "Scikit-learn",
  "Excel",
  "Power BI",
  "Linux",
  "Django",
  "Flask",
  "Spring Boot",
  "Cybersecurity",
  "Software Testing",
  "Selenium"
];

// Extract skills mentioned in resume text
export function extractSkills(text) {
  const normalizedText = (text || "").toLowerCase();

  return commonSkills.filter(skill =>
    normalizedText.includes(skill.toLowerCase())
  );
}

// Read text from an uploaded File object
export async function readTextFile(file, minLength = 20) {
  if (!file) {
    throw new Error("No file provided.");
  }
  const text = await file.text();
  if (!text || text.trim().length < minLength) {
    throw new Error(`File content must be at least ${minLength} characters.`);
  }
  return text;
}

// Extract email address
function extractEmail(text) {
  const match = text.match(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
  );

  return match ? match[0] : null;
}

// Extract phone number (basic international/Indian formats)
function extractPhone(text) {
  const match = text.match(
    /(?:\+?\d[\d\s().-]{7,}\d)/
  );

  return match ? match[0].trim() : null;
}

// Convert resume text into structured data
export function parseResume(text) {
  if (typeof text !== "string" || !text.trim()) {
    throw new Error("Resume text is required");
  }

  return {
    email: extractEmail(text),
    phone: extractPhone(text),
    skills: extractSkills(text)
  };
}
