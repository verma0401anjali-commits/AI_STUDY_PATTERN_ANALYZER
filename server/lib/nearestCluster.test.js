const { nearestCluster, encodeTimeOfDay } = require("./nearestCluster");

// Sample cluster centers (raw feature units), same profiles as the
// design brief's fixtures: [studyHours, sleepHours, breaks, timeEncoded].
const sampleClusters = [
  { id: 0, label: "Morning balanced studier", band: "High",
    center: [4.2, 7.5, 2.1, 0], tip: "Morning study with good sleep tends to pay off." },
  { id: 1, label: "Late-night studier", band: "Low",
    center: [3.8, 4.9, 1.0, 3], tip: "Low sleep is likely capping your output." },
  { id: 2, label: "Long-session grinder", band: "Medium",
    center: [5.5, 6.2, 0.8, 1], tip: "Adding more breaks could boost your output." },
];

// A sample scaler (mean/scale per feature) roughly consistent with the
// spread of the three centers above, so standardizing is meaningful
// rather than a no-op. This mirrors the shape Task 1 actually exports
// in clusters.json: { mean: [...], scale: [...] }.
const sampleScaler = {
  mean: [4.5, 6.2, 1.3, 1.3],
  scale: [1.2, 1.3, 0.8, 1.2],
};

const sampleClustersData = { clusters: sampleClusters, scaler: sampleScaler };

test("encodeTimeOfDay maps known values", () => {
  expect(encodeTimeOfDay("Morning")).toBe(0);
  expect(encodeTimeOfDay("Afternoon")).toBe(1);
  expect(encodeTimeOfDay("Evening")).toBe(2);
  expect(encodeTimeOfDay("Night")).toBe(3);
});

test("encodeTimeOfDay throws on unknown value", () => {
  expect(() => encodeTimeOfDay("Whenever")).toThrow();
});

test("encodeTimeOfDay throws on prototype-chain properties (regression guard)", () => {
  // "toString", "constructor", "valueOf", "hasOwnProperty", and "__proto__"
  // all exist on Object.prototype, so a naive `timeOfDay in TIME_MAP` check
  // would incorrectly treat them as known values and then return a function
  // (or undefined) instead of a number, poisoning downstream distance math.
  expect(() => encodeTimeOfDay("toString")).toThrow();
  expect(() => encodeTimeOfDay("constructor")).toThrow();
  expect(() => encodeTimeOfDay("valueOf")).toThrow();
  expect(() => encodeTimeOfDay("hasOwnProperty")).toThrow();
  expect(() => encodeTimeOfDay("__proto__")).toThrow();
});

test("nearestCluster matches an input close to cluster 0's raw-unit profile", () => {
  const input = { studyHours: 4.3, sleepHours: 7.6, breaks: 2, timeOfDay: "Morning" };
  const result = nearestCluster(input, sampleClustersData);
  expect(result).toEqual({ label: "Morning balanced studier", band: "High",
    tip: "Morning study with good sleep tends to pay off." });
});

test("nearestCluster matches an input close to cluster 1's raw-unit profile", () => {
  const input = { studyHours: 3.9, sleepHours: 4.8, breaks: 1, timeOfDay: "Night" };
  const result = nearestCluster(input, sampleClustersData);
  expect(result).toEqual({ label: "Late-night studier", band: "Low",
    tip: "Low sleep is likely capping your output." });
});

test("nearestCluster matches an input close to cluster 2's raw-unit profile", () => {
  const input = { studyHours: 5.6, sleepHours: 6.1, breaks: 1, timeOfDay: "Afternoon" };
  const result = nearestCluster(input, sampleClustersData);
  expect(result).toEqual({ label: "Long-session grinder", band: "Medium",
    tip: "Adding more breaks could boost your output." });
});

test("nearestCluster throws on unknown timeOfDay", () => {
  const input = { studyHours: 4, sleepHours: 7, breaks: 1, timeOfDay: "Whenever" };
  expect(() => nearestCluster(input, sampleClustersData)).toThrow();
});

test("nearestCluster scales both input and centers consistently (regression guard)", () => {
  // This input was found by brute-force search to be a case where
  // nearest-cluster-by-RAW-Euclidean-distance disagrees with
  // nearest-cluster-by-SCALED-Euclidean-distance:
  //   raw distances    -> c1 ("Late-night studier") is nearest
  //   scaled distances -> c2 ("Long-session grinder") is nearest
  // (verified numerically against sampleClusters/sampleScaler above).
  // If the implementation computed distance in raw units, or scaled
  // only the input point but not the cluster centers (or vice versa),
  // this test would fail by returning the raw-space answer ("Late-night
  // studier") instead of the correct scaled-space answer. This is
  // exactly the class of bug the scaler fix exists to prevent.
  const input = { studyHours: 3, sleepHours: 4.5, breaks: 0.5, timeOfDay: "Morning" };
  const result = nearestCluster(input, sampleClustersData);
  expect(result.label).toBe("Long-session grinder");
});
