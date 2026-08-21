import { useState } from "react";
import ResumeUpload from "./Components/ResumeUpload.jsx";
import JobDesUpload from "./Components/Job_desUpload.jsx";
import Result from "./Components/Result.jsx";

import "./App.css";


function App() {

  // Store Resume File
  const [resumeFile, setResumeFile] = useState(null);

  // Store Job Description File
  const [jobFile, setJobFile] = useState(null);

  // Store ATS Score
  const [atsScore, setAtsScore] = useState(null);

  // Store Matched Skills
  const [matchedSkills, setMatchedSkills] = useState([]);

  // Store Missing Skills
  const [missingSkills, setMissingSkills] = useState([]);

  // Store Review
  const [review, setReview] = useState("");


  // List of skills used in our project
  const skillsList = [
    "html",
    "css",
    "javascript",
    "react",
    "node.js",
    "python",
    "java",
    "mongodb",
    "sql",
    "git",
    "bootstrap",
    "express"
  ];


  const analyzeResume = async () => {

    // Check if both files are uploaded
    if (!resumeFile || !jobFile) {
      return;
    }

    try {

      // Read Resume TXT file
      const resumeText = await resumeFile.text();

      // Read Job Description TXT file
      const jobText = await jobFile.text();


      // Convert both texts to lowercase
      const resume = resumeText.toLowerCase();

      const jobDescription = jobText.toLowerCase();


      // Arrays for storing skills
      let matched = [];

      let missing = [];


      // Check every skill
      skillsList.forEach((skill) => {

        // Check if skill exists in resume
        const skillInResume = resume.includes(skill);

        // Check if skill exists in job description
        const skillInJob = jobDescription.includes(skill);


        // If skill exists in both
        if (skillInResume && skillInJob) {
          matched.push(skill);
        }


        // If skill exists in job description
        // but does not exist in resume
        if (!skillInResume && skillInJob) {
          missing.push(skill);
        }

      });


      // Total Required skills
      const totalSkills =
        matched.length + missing.length;


      // ATS Score
      let score = 0;


      if (totalSkills > 0) {

        score =
          (matched.length / totalSkills) * 100;

      }


      // Round the score
      score = Math.round(score);


      // Save results in state
      setMatchedSkills(matched);

      setMissingSkills(missing);

      setAtsScore(score);


      // Generate simple review
      if (score >= 80) {

        setReview(
          "Excellent! Your resume matches most of the skills required for this job."
        );

      } else if (score >= 50) {

        setReview(
          "Your resume partially matches the job requirements. You should improve the missing skills."
        );

      } else {

        setReview(
          "Your resume has a low match with the job description. Try learning and adding the missing skills."
        );

      }

    } catch (error) {

      console.log(error);


    }

  };

  return (

    <div className="main-container">

      <h1>AI Resume Analyzer</h1>

      <p className="description">
        Upload your Resume and Job Description to check your ATS score.
      </p>


      <div className="upload-container">

        <ResumeUpload
          setResumeFile={setResumeFile}
        />

        <JobDesUpload
          setJobFile={setJobFile}
        />

      </div>


      <button
        className="analyze-button"
        onClick={analyzeResume}
      >
        Analyze Resume
      </button>


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