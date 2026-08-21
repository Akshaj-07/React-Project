function Job_DesUpload({ setJobFile }) {
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setJobFile(file);
    }
  };

  return (
    <div className="upload-box">
      <h2>Upload Job Description</h2>

      <p>Please upload the Job Description in TXT format.</p>

      <input
        type="file"
        accept=".txt"
        onChange={handleFileChange}
      />
    </div>
  );
}

export default JobDesUpload;
