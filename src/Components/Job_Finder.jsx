import { useState } from "react";
import ResumeUpload from "./ResumeUpload.jsx";
import { findMatchingJobs } from "../Services/jobServices.js";

function JobFinder({ onBack }) {
  const [resumeText, setResumeText] = useState("");
  const [fileName, setFileName] = useState("");
  const [rankedJobs, setRankedJobs] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleResumeLoaded(text, name) {
    setResumeText(text);
    setFileName(name);
    setRankedJobs(null);
    setError("");
  }

  async function handleFind() {
    if (!resumeText) {
      setError("Upload a resume before searching.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const results = await findMatchingJobs(resumeText);
      setRankedJobs(results);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="tool-page page-width">
      <button className="back-link" onClick={onBack}>← Back to Analyze</button>
      <div className="tool-title-block">
        <div className="eyebrow">TOOL 03 / JOB FINDER</div>
        <h1>Find My Best-Matching <em>Jobs.</em></h1>
        <p>Upload your resume once — we'll rank it against every job saved on the server.</p>
      </div>

      <section className="tool-panel scan-upload-panel">
        <div className="panel-intro">
          <span className="panel-step">01</span>
          <div><h2>Upload your resume</h2><p>Use a text file so the checks can read the contents directly.</p></div>
        </div>
        <ResumeUpload onResumeLoaded={handleResumeLoaded} fileName={fileName} onError={setError} />
        {error && <div className="error-message" role="alert">{error}</div>}
        <button className="primary-button" onClick={handleFind} disabled={!resumeText || loading}>
          {loading ? "Searching…" : "Find Matching Jobs"}<span>→</span>
        </button>
      </section>

      {rankedJobs && (
        <section className="scan-results">
          <div className="section-heading result-list-heading">
            <div><div className="eyebrow">RANKED RESULTS</div><h2>{rankedJobs.length} jobs compared</h2></div>
          </div>

          {rankedJobs.map((job) => (
            <div className="tool-panel job-result-card" key={job.id}>
              <div className="job-result-top">
                <div>
                  <h3>{job.title}</h3>
                  <p className="job-company">{job.company}</p>
                </div>
                <div className="scan-score-number small">{job.score}<span>%</span></div>
              </div>

              <div className="skill-chips">
                {(job.matched || []).map((skill) => <span className="skill-chip positive" key={skill}>{skill}</span>)}
                {(job.missing || []).map((skill) => <span className="skill-chip negative" key={skill}>{skill}</span>)}
              </div>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}

export default JobFinder;