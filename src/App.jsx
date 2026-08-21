import { useState } from "react";
import ResumeUpload from "./Components/ResumeUpload.jsx";
import JobDesUpload from "./Components/Job_desUpload.jsx";
import Result from "./Components/Result.jsx";

import "./App.css";

function App() {
  // Files
  const [resumeFile, setResumeFile] = useState(null);
  const [jobFile, setJobFile] = useState(null);

  // Results
  const [atsScore, setAtsScore] = useState(null);
  const [matchedSkills, setMatchedSkills] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);
  const [review, setReview] = useState("");

  // Extra UI / debug
  const [debugInfo, setDebugInfo] = useState("");

  // Synonym groups for skills (mainKey: [variations])
  // Keep variations as the common ways people write the skill.
  const synonyms = {
    html: ["html"],
    css: ["css"],
    javascript: ["javascript", "js"],
    react: ["react", "react.js"],
    node: ["node.js", "node"],
    python: ["python", "py"],
    java: ["java"],
    cpp: ["c++", "cpp"],
    c: ["c"],
    mongodb: ["mongodb", "mongo"],
    sql: ["sql"],
    git: ["git", "github"],
    bootstrap: ["bootstrap"],
    express: ["express", "express.js"],
    aws: ["aws", "amazon web services"],
    ml: ["machine learning", "ml"],
    ai: ["artificial intelligence", "ai"],
    angular: ["angular", "angluar"], // include common typo
    php: ["php"],
    swift: ["swift"],
    kotlin: ["kotlin"],
    docker: ["docker"],
    kubernetes: ["kubernetes", "k8s"],
    graphql: ["graphql"],
    firebase: ["firebase"]
  };

  // Utility: escape regex special characters so variations like "c++" or "node.js" are safe
  const escapeRegex = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  // Reset everything
  const resetAll = () => {
    setResumeFile(null);
    setJobFile(null);
    setAtsScore(null);
    setMatchedSkills([]);
    setMissingSkills([]);
    setReview("");
    setDebugInfo("");
  };

  const analyzeResume = async () => {
    // Basic validation
    if (!resumeFile || !jobFile) {
      alert("Please upload both Resume and Job Description files.");
      return;
    }

    try {
      // Read files as text
      const resumeText = await resumeFile.text();
      const jobText = await jobFile.text();

      // Normalize to lowercase for case-insensitive matching
      const resume = resumeText.toLowerCase();
      const jobDescription = jobText.toLowerCase();

      // Prepare result containers
      const matchedSet = new Set();
      const missingSet = new Set();

      // For each skill group, check if any variation appears as a whole word
      Object.keys(synonyms).forEach((skillKey) => {
        // Normalize variations and sort by length descending to prefer longer matches first (optional)
        const variations = synonyms[skillKey]
          .map((v) => v.toLowerCase())
          .sort((a, b) => b.length - a.length);

        // Check resume and job description for any variation (use escaped regex + word boundaries)
        const skillInResume = variations.some((v) => {
          const pattern = `\\b${escapeRegex(v)}\\b`;
          try {
            return new RegExp(pattern).test(resume);
          } catch (e) {
            // If regex fails for any reason, fallback to includes on the raw variation
            return resume.includes(v);
          }
        });

        const skillInJob = variations.some((v) => {
          const pattern = `\\b${escapeRegex(v)}\\b`;
          try {
            return new RegExp(pattern).test(jobDescription);
          } catch (e) {
            return jobDescription.includes(v);
          }
        });

        // If job requires it and resume has it -> matched
        if (skillInJob && skillInResume) {
          matchedSet.add(skillKey);
        }

        // If job requires it but resume doesn't -> missing
        if (skillInJob && !skillInResume) {
          missingSet.add(skillKey);
        }

        // If resume mentions a skill but job doesn't, we ignore it for scoring (optional: you could track extras)
      });

      // Convert sets to arrays (sorted alphabetically for consistent UI)
      const matched = Array.from(matchedSet).sort();
      const missing = Array.from(missingSet).sort();

      // Compute score
      const totalSkills = matched.length + missing.length;
      let score = 0;
      if (totalSkills > 0) {
        score = Math.round((matched.length / totalSkills) * 100);
      } else {
        // If job description didn't contain any of our tracked skills, score is not applicable
        score = 0;
      }

      // Save to state
      setMatchedSkills(matched);
      setMissingSkills(missing);
      setAtsScore(score);

      // Debug info for beginners
      setDebugInfo(
        `Matched: ${matched.join(", ") || "None"} | Missing: ${missing.join(", ") || "None"} | Total tracked: ${totalSkills}`
      );

      // Friendly review messages with clear guidance
      if (totalSkills === 0) {
        setReview(
          "No tracked skills were found in the job description. Try adding more common skills to the tracker or check the job description text."
        );
      } else if (score >= 90) {
        setReview("Outstanding! Your resume is an excellent match for the required skills.");
      } else if (score >= 75) {
        setReview("Great job! You match most required skills. Add a few missing ones to improve further.");
      } else if (score >= 50) {
        setReview(
          "Good start. You have several matching skills. Focus on adding the missing skills listed below to boost your chances."
        );
      } else {
        setReview(
          "Your resume currently has a low match with the job description. Strengthening your profile by learning and adding the missing skills will greatly improve your ATS score and increase your chances of landing the role."
        );
      }
    } catch (error) {
      console.error("Error analyzing files:", error);
      alert("Something went wrong while analyzing the files. Check the console for details.");
    }
  };

  return (
    <div className="main-container">
      <h1>AI Resume Analyzer</h1>

      <p className="description">
        Upload your Resume and Job Description (plain text or .txt) to check your ATS score.
      </p>

      <div className="upload-container">
        <ResumeUpload setResumeFile={setResumeFile} />
        <JobDesUpload setJobFile={setJobFile} />
      </div>

      <div style={{ marginTop: 16 }}>
        <button className="analyze-button" onClick={analyzeResume}>
          Analyze Resume
        </button>

        <button
          className="reset-button"
          onClick={resetAll}
          style={{ marginLeft: 12 }}
        >
          Reset
        </button>
      </div>

      {atsScore !== null && (
        <Result
          atsScore={atsScore}
          matchedSkills={matchedSkills}
          missingSkills={missingSkills}
          review={review}
        />
      )}

      {debugInfo && (
        <div style={{ marginTop: 12 }}>
          <strong>Debug:</strong> <span>{debugInfo}</span>
        </div>
      )}
    </div>
  );
}

export default App;
