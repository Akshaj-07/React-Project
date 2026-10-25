

import React from "react";
import "../App.css";
const features = [
  {
    id: "quick-scan",
    number: "01",
    title: "Quick Scan",
    description:
      "Check your resume for spelling mistakes, formatting issues, missing sections, and areas that need improvement.",
    label: "RESUME HEALTH CHECK",
    icon: "✳",
    action: "Analyze resume",
  },
  {
    id: "job-finder",
    number: "02",
    title: "Job Finder",
    description:
      "Discover suitable opportunities and get a ranked list of jobs based on the skills and experience in your resume.",
    label: "PERSONALIZED JOB MATCHING",
    icon: "⌕",
    action: "Find matching jobs",
  },
  {
    id: "specific-job",
    number: "03",
    title: "Specific Job Finder",
    description:
      "Compare your resume against a specific job description to identify matching skills and missing requirements.",
    label: "TARGETED JOB ANALYSIS",
    icon: "◎",
    action: "Check job compatibility",
  },
];

function AnalyzeHome({ onSelectMode }) {
  return (
    <main className="analyze-page">
      <header className="analyze-header">
        <a className="brand" href="#home" aria-label="Recruiter Vision home">
          <span className="brand-mark">R</span>
          <span>
            Recruiter<span className="brand-light">Vision</span>
          </span>
        </a>

        <div className="header-status">
          <span className="status-dot" />
          YOUR CAREER WORKSPACE
        </div>
      </header>

      <section className="analyze-hero">
        <div className="eyebrow">
          <span className="eyebrow-line" />
          YOUR NEXT OPPORTUNITY STARTS HERE
        </div>

        <h1>
          Make your resume
          <br />
          <span>work for you.</span>
        </h1>

        <p className="hero-description">
          Understand your strengths, discover relevant opportunities,
          and prepare your resume for the roles you want.
        </p>

        <div className="section-heading">
          <div>
            <p className="section-kicker">CHOOSE YOUR WORKFLOW</p>
            <h2>What would you like to do?</h2>
          </div>

          <span className="workflow-count">03 TOOLS</span>
        </div>

        <div className="feature-grid">
          {features.map((feature) => (
            <button
              key={feature.id}
              type="button"
              className="feature-card"
              onClick={() => onSelectMode?.(feature.id)}
            >
              <div className="card-top">
                <span className="feature-icon">{feature.icon}</span>
                <span className="feature-number">{feature.number}</span>
              </div>

              <p className="feature-label">{feature.label}</p>

              <h3>{feature.title}</h3>

              <p className="feature-description">
                {feature.description}
              </p>

              <div className="card-action">
                <span>{feature.action}</span>
                <span className="action-arrow" aria-hidden="true">
                  ↗
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="privacy-note">
          <span aria-hidden="true">◇</span>
          <p>
            Built to help you make more informed career decisions.
            Your results will be based on the analysis performed by each tool.
          </p>
        </div>
      </section>

      <footer className="analyze-footer">
        <span>RECRUITER VISION</span>
        <span>YOUR SKILLS. YOUR NEXT MOVE.</span>
      </footer>
    </main>
  );
}

export default AnalyzeHome;