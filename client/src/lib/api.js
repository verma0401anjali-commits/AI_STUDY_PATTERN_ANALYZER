export async function analyzePattern(input) {
  let response;
  try {
    response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  } catch {
    throw new Error("Could not reach the server. Is it running?");
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error(`Server error (${response.status}). Please try again.`);
  }

  if (!response.ok) {
    throw new Error(data.error || "Failed to analyze pattern");
  }

  return data;
}
