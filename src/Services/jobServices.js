import { parseResume, extractSkills } from "../Utils/resumeParser.js";
import { matchJobs } from "../Utils/jobMatcher.js";
import { analyseResume } from "../Utils/resumeAnalyser.js";
import fallbackJobs from "../../backend/jobs.json";

const API = "/api/jobs";

// Handle API responses
async function handleResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

// Get all jobs (with fallback to local catalog if backend is not running)
export async function getJobs() {
  try {
    const response = await fetch(API);
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    const data = await response.json();
    return data.jobs || [];
  } catch (err) {
    console.warn("Backend server not reached, using local job catalog fallback:", err.message);
    return fallbackJobs.filter(job => job.active !== false);
  }
}

// Add a job
export async function addJob(job) {
  const response = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(job)
  });

  return handleResponse(response);
}

// Update a job
export async function updateJob(id, changes) {
  const response = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(changes)
  });

  return handleResponse(response);
}

// Delete a job
export async function deleteJob(id) {
  const response = await fetch(`${API}/${id}`, {
    method: "DELETE"
  });

  return handleResponse(response);
}

// Rank backend jobs against uploaded resume text
export async function findMatchingJobs(resumeText) {
  const parsed = parseResume(resumeText);
  const jobs = await getJobs();
  return matchJobs(parsed, jobs);
}

// Scan resume for quality, typos, and section checks
export async function scanResume(resumeText) {
  return analyseResume(resumeText);
}

// Compare resume directly against a specific job description
export async function matchResumeToJob(resumeText, jobText) {
  const resumeSkills = new Set(
    (extractSkills(resumeText) || []).map(s => s.toLowerCase().trim())
  );
  const jobSkills = extractSkills(jobText) || [];

  const matched = jobSkills.filter(skill =>
    resumeSkills.has(skill.toLowerCase().trim())
  );
  const missing = jobSkills.filter(skill =>
    !resumeSkills.has(skill.toLowerCase().trim())
  );

  const totalSkills = jobSkills.length;
  const score = totalSkills > 0
    ? Math.round((matched.length / totalSkills) * 100)
    : (matched.length > 0 ? 100 : 0);

  let review = "";
  if (totalSkills === 0) {
    review = "No tracked skills were detected in the job description. Try adding explicit skill keywords.";
  } else if (score >= 90) {
    review = "Outstanding! Your resume shows high alignment with the required skills.";
  } else if (score >= 75) {
    review = "Strong match! You meet most key requirements with only minor skill gaps.";
  } else if (score >= 50) {
    review = "Moderate match. Highlighting the missing skills can boost your chances significantly.";
  } else {
    review = "Low match for this role. Consider acquiring or highlighting the key missing skills.";
  }

  return {
    score,
    matched,
    missing,
    totalSkills: totalSkills || (matched.length + missing.length),
    review
  };
}
