import { useState } from "react";
import Home from "./Components/Home.jsx";
import QuickScan from "./Components/Quick_Scan.jsx";
import JobFinder from "./Components/Job_Finder.jsx";
import SpecificJobFinder from "./Components/Specific_job_finder.jsx";
import "./App.css";

function App() {
  const [mode, setMode] = useState("home");

  const handleSelectMode = (selectedMode) => {
    setMode(selectedMode);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setMode("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app-root">
      {mode === "home" && (
        <Home onSelectMode={handleSelectMode} />
      )}

      {mode === "quick-scan" && (
        <QuickScan onBack={handleBack} />
      )}

      {mode === "job-finder" && (
        <JobFinder onBack={handleBack} />
      )}

      {mode === "specific-job" && (
        <SpecificJobFinder onBack={handleBack} />
      )}
    </div>
  );
}

export default App;
