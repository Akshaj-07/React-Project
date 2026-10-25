import { extractSkills } from "./resumeParser.js";

// Alias extractSkills as detectSkills for backward compatibility
export const detectSkills = extractSkills;

function normalize(skill) {
  return String(skill).toLowerCase().trim();
}

export function matchJobs(resume, jobs) {
  const resumeSkills = new Set(
    (resume?.skills || []).map(normalize)
  );

  const results = jobs
    .filter(job => job.active !== false)
    .map(job => {
      const required = job.requiredSkills || [];
      const preferred = job.preferredSkills || [];

      const matchedRequired = required.filter(skill =>
        resumeSkills.has(normalize(skill))
      );

      const matchedPreferred = preferred.filter(skill =>
        resumeSkills.has(normalize(skill))
      );

      const missingRequired = required.filter(skill =>
        !resumeSkills.has(normalize(skill))
      );

      const requiredScore = required.length
        ? matchedRequired.length / required.length
        : 1;

      const preferredScore = preferred.length
        ? matchedPreferred.length / preferred.length
        : 0;

      // Required skills matter more than preferred skills.
      const score = Math.round(
        (requiredScore * 80) + (preferredScore * 20)
      );

      const allMatched = [
        ...matchedRequired,
        ...matchedPreferred
      ];

      return {
        id: job.id,
        jobId: job.id,
        title: job.title,
        company: job.company,
        location: job.location || "Not specified",
        score,
        matchScore: score,
        matched: allMatched,
        matchedSkills: allMatched,
        missing: missingRequired,
        missingRequiredSkills: missingRequired
      };
    });

  return results.sort(
    (a, b) => b.score - a.score
  );
}