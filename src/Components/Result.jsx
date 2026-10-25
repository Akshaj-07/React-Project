import { getMatchLabel } from "../Utils/resumeAnalyser.js";

function SkillList({ skills, type, emptyText }) {
  if (skills.length === 0) {
    return <p className="empty-skills">{emptyText}</p>;
  }

  return (
    <div className="skill-chips">
      {skills.map((skill) => (
        <span className={`skill-chip ${type}`} key={skill}>
          {skill}
        </span>
      ))}
    </div>
  );
}

function Result({
  atsScore,
  matchedSkills,
  missingSkills,
  review,
  title = "Match overview"
}) {
  return (
    <section className="result-section">
      <div className="result-section-heading">
        <div>
          <div className="eyebrow">ANALYSIS COMPLETE</div>
          <h2>{title}</h2>
        </div>
        <span className="result-state">Rule-based result</span>
      </div>

      <div className="result-score-card">
        <div className="score-number">{atsScore}%</div>

        <div className="score-explanation">
          <strong>{getMatchLabel(atsScore)}</strong>
          <p>{review}</p>
        </div>

        <div className="score-track">
          <span style={{ width: `${atsScore}%` }} />
        </div>
      </div>

      <div className="skills-result-grid">
        <div className="skills-result-card">
          <div className="skills-card-heading">
            <span className="skill-status matched-status">✓</span>
            <h3>Matched skills</h3>
          </div>

          <SkillList
            skills={matchedSkills}
            type="matched"
            emptyText="No tracked skills matched yet."
          />
        </div>

        <div className="skills-result-card">
          <div className="skills-card-heading">
            <span className="skill-status missing-status">＋</span>
            <h3>Skills to strengthen</h3>
          </div>

          <SkillList
            skills={missingSkills}
            type="missing"
            emptyText="No missing tracked skills were found."
          />
        </div>
      </div>

      <p className="score-disclaimer">
        This percentage reflects supported skill-keyword overlap.
        It is not a hiring prediction.
      </p>
    </section>
  );
}

export default Result;