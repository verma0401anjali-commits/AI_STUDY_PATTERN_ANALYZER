const express = require("express");
const fs = require("fs");
const path = require("path");
const createAnalyzeRouter = require("./routes/analyze");

const app = express();
app.use(express.json());

const clustersData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "clusters.json"), "utf-8")
);

app.use("/api/analyze", createAnalyzeRouter(clustersData));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
