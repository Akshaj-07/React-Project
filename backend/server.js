import express from "express";
import { readFile, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "100kb" }));

const file = new URL("./jobs.json", import.meta.url);

// Read jobs from JSON
async function getJobs() {
  const data = await readFile(file, "utf8");
  const jobs = JSON.parse(data);

  if (!Array.isArray(jobs)) {
    throw new Error("jobs.json must contain an array");
  }

  return jobs;
}

// Save jobs to JSON
async function saveJobs(jobs) {
  await writeFile(file, JSON.stringify(jobs, null, 2), "utf8");
}

// Validate job data
function validateJob(data, isUpdate = false) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return "Request body must be a JSON object";
  }

  if (!isUpdate || data.title !== undefined) {
    if (typeof data.title !== "string" || !data.title.trim()) {
      return "A valid job title is required";
    }
  }

  if (!isUpdate || data.company !== undefined) {
    if (typeof data.company !== "string" || !data.company.trim()) {
      return "A valid company name is required";
    }
  }

  if (!isUpdate || data.requiredSkills !== undefined) {
    if (
      !Array.isArray(data.requiredSkills) ||
      !data.requiredSkills.every(
        skill => typeof skill === "string" && skill.trim()
      )
    ) {
      return "requiredSkills must be an array of strings";
    }
  }

  if (
    data.preferredSkills !== undefined &&
    (!Array.isArray(data.preferredSkills) ||
      !data.preferredSkills.every(
        skill => typeof skill === "string" && skill.trim()
      ))
  ) {
    return "preferredSkills must be an array of strings";
  }

  if (
    data.experienceYears !== undefined &&
    (!Number.isFinite(data.experienceYears) || data.experienceYears < 0)
  ) {
    return "experienceYears must be a non-negative number";
  }

  if (
    data.active !== undefined &&
    typeof data.active !== "boolean"
  ) {
    return "active must be true or false";
  }

  return null;
}

// Server health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Resume Analyser backend is running!"
  });
});

// Get all active jobs
app.get("/api/jobs", async (req, res, next) => {
  try {
    const jobs = await getJobs();
    const activeJobs = jobs.filter(job => job.active === true);

    res.json({
      success: true,
      total: activeJobs.length,
      jobs: activeJobs
    });
  } catch (error) {
    next(error);
  }
});

// Get one job by ID
app.get("/api/jobs/:id", async (req, res, next) => {
  try {
    const jobs = await getJobs();
    const job = jobs.find(
      item => item.id === req.params.id && item.active === true
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Active job not found"
      });
    }

    res.json({ success: true, job });
  } catch (error) {
    next(error);
  }
});

// Add a job
app.post("/api/jobs", async (req, res, next) => {
  try {
    const validationError = validateJob(req.body);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError
      });
    }

    const jobs = await getJobs();

    const newJob = {
      ...req.body,
      id: randomUUID(),
      title: req.body.title.trim(),
      company: req.body.company.trim(),
      active: true
    };

    jobs.push(newJob);
    await saveJobs(jobs);

    res.status(201).json({
      success: true,
      message: "Job added successfully",
      job: newJob
    });
  } catch (error) {
    next(error);
  }
});

// Update a job
app.put("/api/jobs/:id", async (req, res, next) => {
  try {
    const jobs = await getJobs();
    const index = jobs.findIndex(
      job => job.id === req.params.id
    );

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    const updates = { ...req.body };

    // Prevent clients from changing IDs through the request body
    delete updates.id;

    const validationError = validateJob(updates, true);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError
      });
    }

    jobs[index] = {
      ...jobs[index],
      ...updates,
      id: jobs[index].id
    };

    await saveJobs(jobs);

    res.json({
      success: true,
      message: "Job updated successfully",
      job: jobs[index]
    });
  } catch (error) {
    next(error);
  }
});

// Delete a job
app.delete("/api/jobs/:id", async (req, res, next) => {
  try {
    const jobs = await getJobs();
    const updatedJobs = jobs.filter(
      job => job.id !== req.params.id
    );

    if (updatedJobs.length === jobs.length) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    await saveJobs(updatedJobs);

    res.json({
      success: true,
      message: "Job deleted successfully"
    });
  } catch (error) {
    next(error);
  }
});

// Handle invalid JSON requests
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON request body"
    });
  }

  next(error);
});

// Handle other errors
app.use((error, req, res, next) => {
  console.error("API error:", error.message);

  res.status(500).json({
    success: false,
    message: "An internal server error occurred"
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
