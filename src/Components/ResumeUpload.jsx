import { useState } from "react";
import { readTextFile } from "../Utils/resumeParser.js";

function ResumeUpload({ onResumeLoaded = () => {}, fileName = "", onError = () => {} }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [validationError, setValidationError] = useState("");
  const [loading, setLoading] = useState(false);

  async function processFile(file) {
    if (!file) return;

    setValidationError("");
    onError?.("");

    if (!file.name.toLowerCase().endsWith(".txt")) {
      setValidationError("Please select a .txt resume file.");
      return;
    }

    if (file.size > 1024 * 1024) {
      setValidationError("File size must be under 1 MB.");
      return;
    }

    setSelectedFile(file);
    setLoading(true);

    try {
      const text = await readTextFile(file, 20);
      onResumeLoaded?.(text, file.name);
      onError?.("");
      setValidationError("");
    } catch (error) {
      setValidationError(error.message);
      onError?.(error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(event) {
    const file = event.target.files[0];
    if (!file) return;
    processFile(file);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setValidationError("");

    if (!selectedFile) {
      setValidationError("Please choose your resume first.");
      return;
    }

    processFile(selectedFile);
  }

  return (
    <form className="upload-control" onSubmit={handleSubmit} noValidate>
      <div className="upload-control-heading">
        <span className="upload-symbol">↑</span>

        <div>
          <h3>Upload your resume</h3>
          <p>
            Choose a .txt file containing at least 20 characters.
            Maximum file size: 1 MB.
          </p>
        </div>
      </div>

      <label
        className="file-input-label"
        htmlFor="resume-file-input"
      >
        Choose resume
      </label>

      <input
        id="resume-file-input"
        className="visually-hidden-input"
        type="file"
        accept=".txt,text/plain"
        onChange={handleFileChange}
        aria-invalid={Boolean(validationError)}
        aria-describedby={
          validationError ? "resume-validation-error" : undefined
        }
        aria-required="true"
      />

      <div
        className={`selected-file ${
          selectedFile || fileName ? "has-file" : ""
        }`}
      >
        <span className="selected-file-dot" />
        <span>
          {selectedFile?.name || fileName || "No resume selected yet"}
        </span>
      </div>

      {validationError && (
        <p
          id="resume-validation-error"
          className="upload-validation-error"
          role="alert"
        >
          {validationError}
        </p>
      )}

      <button
        className="primary-button upload-submit-button"
        type="submit"
        disabled={loading}
      >
        {loading ? "Validating resume…" : "Validate & Upload Resume"}
        {!loading && <span>→</span>}
      </button>
    </form>
  );
}

export default ResumeUpload;