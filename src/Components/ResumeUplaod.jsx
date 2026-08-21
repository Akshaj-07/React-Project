function ResumeUpload({ setResumeFile }) {
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setResumeFile(file);
    }
  };

  return (
    <div className="upload-box">
      <h2>Upload Resume</h2>

      <p>Please upload your resume in TXT format.</p>

      <input
        type="file"
        accept=".txt"
        onChange={handleFileChange}
      />
    </div>
  );
}

export default ResumeUpload;

