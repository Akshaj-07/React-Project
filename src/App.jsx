import { useState } from "react";
import ResumeUpload from "./Components/ResumeUpload.jsx";
import Result from "./Components/Result.jsx";
import "./App.css";

function App() {

  const [resumeFile, setResumeFile] = useState(null);
  const [jobFile, setJobFile] = useState(null);
  const [atsScore, setAtsScore] = useState(null);
  const [matchedSkills, setMatchedSkills] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);
  const [review, setReview] = useState("");
  const [debugInfo, setDebugInfo] = useState("");

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
    angular: ["angular", "angluar"],
    php: ["php"],
    swift: ["swift"],
    kotlin: ["kotlin"],
    docker: ["docker"],
    kubernetes: ["kubernetes", "k8s"],
    graphql: ["graphql"],
    firebase: ["firebase"]
  };

  const escapeRegex = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  
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
  
    if (!resumeFile || !jobFile) {
      alert("Please upload both Resume and Job Description files.");
      return;
    }

    try {
      
      const resumeText = await resumeFile.text();
      const jobText = await jobFile.text();

      
      const resume = resumeText.toLowerCase();
      const jobDescription = jobText.toLowerCase();

    
      const matchedSet = new Set();
      const missingSet = new Set();

      Object.keys(synonyms).forEach((skillKey) => {
        const variations = synonyms[skillKey]
          .map((v) => v.toLowerCase())
          .sort((a, b) => b.length - a.length);

        const skillInResume = variations.some((v) => {
          const pattern = `\\b${escapeRegex(v)}\\b`;
          try {
            return new RegExp(pattern).test(resume);
          } catch (e) {
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

        if (skillInJob && skillInResume) {
          matchedSet.add(skillKey);
        }

        if (skillInJob && !skillInResume) {
          missingSet.add(skillKey);
        }

      });

      const matched = Array.from(matchedSet).sort();
      const missing = Array.from(missingSet).sort();

      const totalSkills = matched.length + missing.length;
      let score = 0;
      if (totalSkills > 0) {
        score = Math.round((matched.length / totalSkills) * 100);
      } else {
        score = 0;
      }

      setMatchedSkills(matched);
      setMissingSkills(missing);
      setAtsScore(score);

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

      
    </div>
  );
}

export default App;
