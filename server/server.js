const express = require("express");
const fs = require("fs");
const path = require("path");
const createAnalyzeRouter = require("./routes/analyze");

const app = express();
app.use(express.json());

const clustersData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "clusters.json"), "utf-8")
);

// API routes
app.use("/api/analyze", createAnalyzeRouter(clustersData));

// Serve React build in production
if (process.env.NODE_ENV === "production") {
  const clientBuild = path.join(__dirname, "..", "client", "dist");
  app.use(express.static(clientBuild));

  // All non-API routes → return index.html (SPA fallback).
  // Exclude /api/* so unmatched API calls 404 as JSON instead of HTML.
  app.get(/^(?!\/api\/).*/, (req, res) => {
    res.sendFile(path.join(clientBuild, "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
