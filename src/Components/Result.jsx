function Result({
  atsScore,
  matchedSkills,
  missingSkills,
  review
}) {
  return (
    <div className="result-container">

      <div className="score-box">
        <h2>ATS Score</h2>

        <h1>{atsScore}%</h1>
      </div>


      <div className="skills-container">

        <div className="matched-box">
          <h2>Matched Skills</h2>

          {matchedSkills.length > 0 ? (
            <ul>
              {matchedSkills.map((skill, index) => (
                <li key={index}>
                  ✓ {skill}
                </li>
              ))}
            </ul>
          ) : (
            <p>No matched skills found.</p>
          )}
        </div>


        <div className="missing-box">
          <h2>Missing Skills</h2>

          {missingSkills.length > 0 ? (
            <ul>
              {missingSkills.map((skill, index) => (
                <li key={index}>
                  ✗ {skill}
                </li>
              ))}
            </ul>
          ) : (
            <p>No missing skills found.</p>
          )}
        </div>

      </div>


      <div className="review-box">
        <h2>Resume Review</h2>

        <p>{review}</p>
      </div>

    </div>
  );
}

export default Result;

