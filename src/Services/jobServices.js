import { parseResume, extractSkills } from "../Utils/resumeParser.js";
import { matchJobs } from "../Utils/jobMatcher.js";
import { analyseResume } from "../Utils/resumeAnalyser.js";

const API = "/api/jobs";

// Handle API responses
async function handleResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

// Get all jobs
export async function getJobs() {
  const response = await fetch(API);
  const data = await handleResponse(response);

  return data.jobs;
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

  return {
    score,
    matched,
    missing,
    totalSkills: totalSkills || (matched.length + missing.length)
  };
}
