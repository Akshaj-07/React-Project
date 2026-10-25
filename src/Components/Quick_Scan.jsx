import { useState } from "react";
import ResumeUpload from "./ResumeUpload.jsx";
import { scanResume } from "../Services/jobServices.js";
import { getScanLabel } from "../Utils/resumeAnalyser.js";

function QuickScan({ onBack }) {
  const [resumeText, setResumeText] = useState("");
  const [fileName, setFileName] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleResumeLoaded(text, name) {
    setResumeText(text);
    setFileName(name);
    setScanResult(null);
    setError("");
  }

  async function handleScan() {
    if (!resumeText) {
      setError("Upload a resume before starting the scan.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await scanResume(resumeText);
      setScanResult(result);
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
        <div className="eyebrow">TOOL 01 / RESUME QUALITY</div>
        <h1>Quick <em>Scan.</em></h1>
        <p>Run a few clear checks to see whether your resume has the basics covered.</p>
      </div>

      <section className="tool-panel scan-upload-panel">
        <div className="panel-intro">
          <span className="panel-step">01</span>
          <div><h2>Start with your resume</h2><p>For this version, use a text file so the checks can read the contents directly.</p></div>
        </div>
        <ResumeUpload onResumeLoaded={handleResumeLoaded} fileName={fileName} onError={setError} />
        {error && <div className="error-message" role="alert">{error}</div>}
        <button className="primary-button" onClick={handleScan} disabled={!resumeText || loading}>
          {loading ? "Scanning resume…" : "Run Quick Scan"}<span>→</span>
        </button>
      </section>

      {scanResult && (
        <section className="scan-results">
          <div className="scan-score-panel">
            <div className="scan-score-number">{scanResult.score}<span>%</span></div>
            <div><div className="eyebrow">RESUME BASICS</div><h2>{getScanLabel(scanResult.score)}</h2><p>{scanResult.wordCount} words found in the uploaded file.</p></div>
          </div>

          <div className="section-heading result-list-heading"><div><div className="eyebrow">CHECKLIST</div><h2>What we found</h2></div><span className="result-state">{scanResult.checklist.filter((item) => item.passed).length} of {scanResult.checklist.length} checks passed</span></div>
          <div className="checklist-grid">
            {scanResult.checklist.map((item) => (
              <div className={`checklist-item ${item.passed ? "check-passed" : "check-failed"}`} key={item.label}>
                <span className="checklist-icon">{item.passed ? "✓" : "!"}</span>
                <div><h3>{item.label}</h3><p>{item.detail}</p></div>
              </div>
            ))}
          </div>

          <div className="scan-detail-grid">
            <div className="tool-panel scan-detail-panel">
              <h3>Suggestions</h3>
              {scanResult.suggestions.length ? <ul className="suggestion-list">{scanResult.suggestions.map((suggestion) => <li key={suggestion}>{suggestion}</li>)}</ul> : <p className="success-note">All current checks passed. Give the resume a final human review too.</p>}
            </div>
            <div className="tool-panel scan-detail-panel">
              <h3>Possible typos</h3>
              {scanResult.typoIssues.length ? <div className="scan-issue-list">{scanResult.typoIssues.map((item) => <span className="issue-chip" key={item.found}>{item.found} → {item.suggestion}</span>)}</div> : <p className="empty-skills">No words from the small built-in typo list were found.</p>}
              <h3 className="subsection-title">Repeated words</h3>
              {scanResult.repeatedWords.length ? <div className="scan-issue-list">{scanResult.repeatedWords.map((word) => <span className="issue-chip" key={word}>{word}</span>)}</div> : <p className="empty-skills">No adjacent repeated words detected.</p>}
            </div>
          </div>

          <div className="tool-panel detected-skills-panel">
            <h3>Recognized skills</h3>
            {scanResult.detectedSkills.length ? <div className="skill-chips">{scanResult.detectedSkills.map((skill) => <span className="skill-chip neutral" key={skill}>{skill}</span>)}</div> : <p className="empty-skills">No skills from the built-in list were detected.</p>}
          </div>
        </section>
      )}
    </main>
  );
}

export default QuickScan;