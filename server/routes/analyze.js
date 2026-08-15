const express = require("express");
const { nearestCluster } = require("../lib/nearestCluster");

function createAnalyzeRouter(clustersData) {
  const router = express.Router();

  router.post("/", (req, res) => {
    const { studyHours, sleepHours, breaks, timeOfDay } = req.body || {};

    if (
      typeof studyHours !== "number" ||
      typeof sleepHours !== "number" ||
      typeof breaks !== "number" ||
      typeof timeOfDay !== "string"
    ) {
      return res.status(400).json({ error: "Missing or invalid fields" });
    }

    if (
      Number.isNaN(studyHours) || studyHours < 0 || studyHours > 16 ||
      Number.isNaN(sleepHours) || sleepHours < 0 || sleepHours > 12 ||
      Number.isNaN(breaks) || breaks < 0 || breaks > 10
    ) {
      return res.status(400).json({ error: "Fields out of range" });
    }

    try {
      const result = nearestCluster({ studyHours, sleepHours, breaks, timeOfDay }, clustersData);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  return router;
}

module.exports = createAnalyzeRouter;
