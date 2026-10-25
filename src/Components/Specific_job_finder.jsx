import { useState } from "react";
import ResumeUpload from "./ResumeUpload.jsx";
import Result from "./Result.jsx";
import { matchResumeToJob } from "../Services/jobServices.js";

function SpecificJobFinder({ onBack }) {
  const [resumeText, setResumeText] = useState("");
  const [fileName, setFileName] = useState("");
  const [jobText, setJobText] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleResumeLoaded(text, name) {
    setResumeText(text);
    setFileName(name);
    setResult(null);
    setError("");
  }

  async function handleCompare() {
    if (!resumeText) {
      setError("Upload a resume before comparing.");
      return;
    }
    if (!jobText.trim()) {
      setError("Paste the job description before comparing.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const data = await matchResumeToJob(resumeText, jobText);
      setResult(data);
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
        <div className="eyebrow">TOOL 02 / JOB MATCH</div>
        <h1>Specific Job <em>Finder.</em></h1>
        <p>Paste one job description and see exactly how your resume stacks up against it.</p>
      </div>

      <section className="tool-panel scan-upload-panel">
        <div className="panel-intro">
          <span className="panel-step">01</span>
          <div><h2>Upload your resume</h2><p>Use a text file so the checks can read the contents directly.</p></div>
        </div>
        <ResumeUpload onResumeLoaded={handleResumeLoaded} fileName={fileName} onError={setError} />
      </section>

      <section className="tool-panel scan-upload-panel">
        <div className="panel-intro">
          <span className="panel-step">02</span>
          <div><h2>Paste the job description</h2><p>Copy the role's requirements straight from the posting.</p></div>
        </div>
        <textarea
          className="job-text-input"
          rows={8}
          placeholder="Paste the job description here..."
          value={jobText}
          onChange={(e) => setJobText(e.target.value)}
        />
        {error && <div className="error-message" role="alert">{error}</div>}
        <button className="primary-button" onClick={handleCompare} disabled={!resumeText || !jobText.trim() || loading}>
          {loading ? "Comparing…" : "Compare to This Job"}<span>→</span>
        </button>
      </section>

      {result && (
        <Result
          atsScore={result.score}
          matchedSkills={result.matched}
          missingSkills={result.missing}
          review={result.review}
          title="Job Compatibility Analysis"
        />
      )}
    </main>
  );
}

export default SpecificJobFinder;