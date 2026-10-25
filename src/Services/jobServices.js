
const API = "/api/jobs";

// Handle API responses
async function handleResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

// Get all jobs
export async function getJobs() {
  const response = await fetch(API);
  const data = await handleResponse(response);

  return data.jobs;
}

// Add a job
export async function addJob(job) {
  const response = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(job)
  });

  return handleResponse(response);
}

// Update a job
export async function updateJob(id, changes) {
  const response = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(changes)
  });

  return handleResponse(response);
}

// Delete a job
export async function deleteJob(id) {
  const response = await fetch(`${API}/${id}`, {
    method: "DELETE"
  });

  return handleResponse(response);
}
