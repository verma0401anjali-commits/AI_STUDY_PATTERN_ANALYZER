/**
 * Integration tests against the REAL clusters.json
 * Verifies that each of the 4 clusters is reachable and that
 * correct band / label / tip are returned for realistic inputs.
 */
const path = require("path");
const fs = require("fs");
const { nearestCluster } = require("./nearestCluster");

const clustersData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "clusters.json"), "utf-8")
);

// ── helpers ──────────────────────────────────────────────────────────────────

function analyze(studyHours, sleepHours, breaks, timeOfDay) {
  return nearestCluster({ studyHours, sleepHours, breaks, timeOfDay }, clustersData);
}

// ── cluster reachability ─────────────────────────────────────────────────────

test("Cluster 0 — Morning long-session studier (High)", () => {
  // Inputs that sit very close to center: [5.11, 7.13, 2.12, 0.39 ≈ Morning]
  const result = analyze(5.1, 7.1, 2, "Morning");
  expect(result.band).toBe("High");
  expect(result.label).toBe("Morning long-session studier");
  expect(typeof result.tip).toBe("string");
  expect(result.tip.length).toBeGreaterThan(10);
});

test("Cluster 1 — Evening steady studier (Medium)", () => {
  // Inputs close to center: [5.3, 6.37, 1.16, 1.74 ≈ Afternoon/Evening]
  const result = analyze(5.3, 6.4, 1, "Evening");
  expect(result.band).toBe("Medium");
  expect(result.label).toBe("Evening steady studier");
});

test("Cluster 2 — Morning light-load high performer (High)", () => {
  // Inputs close to center: [3.34, 7.67, 2.13, 0.26 ≈ Morning]
  const result = analyze(3.3, 7.7, 2, "Morning");
  expect(result.band).toBe("High");
  expect(result.label).toBe("Morning light-load high performer");
});

test("Cluster 3 — Night sleep-deprived studier (Low)", () => {
  // Inputs close to center: [3.78, 4.66, 0.35, 2.94 ≈ Night]
  const result = analyze(3.8, 4.7, 0, "Night");
  expect(result.band).toBe("Low");
  expect(result.label).toBe("Night sleep-deprived studier");
});

// ── all 4 bands are reachable ─────────────────────────────────────────────────

test("All 4 clusters are reachable — no dead clusters", () => {
  const inputs = [
    { studyHours: 5.1, sleepHours: 7.1, breaks: 2, timeOfDay: "Morning" },   // → High (c0)
    { studyHours: 5.3, sleepHours: 6.4, breaks: 1, timeOfDay: "Evening" },   // → Medium (c1)
    { studyHours: 3.3, sleepHours: 7.7, breaks: 2, timeOfDay: "Morning" },   // → High (c2)
    { studyHours: 3.8, sleepHours: 4.7, breaks: 0, timeOfDay: "Night"   },   // → Low (c3)
  ];
  const ids = new Set(
    inputs.map((i) => nearestCluster(i, clustersData).label)
  );
  expect(ids.size).toBe(4); // all 4 distinct labels returned
});

// ── response shape ────────────────────────────────────────────────────────────

test("Response always has label, band, tip — no extra fields", () => {
  const result = analyze(4, 7, 2, "Morning");
  const keys = Object.keys(result).sort();
  expect(keys).toEqual(["band", "label", "tip"]);
});

test("band is always one of High / Medium / Low", () => {
  const testCases = [
    { studyHours: 2, sleepHours: 5, breaks: 0, timeOfDay: "Night"      },
    { studyHours: 8, sleepHours: 8, breaks: 5, timeOfDay: "Morning"    },
    { studyHours: 5, sleepHours: 6, breaks: 1, timeOfDay: "Afternoon"  },
    { studyHours: 1, sleepHours: 3, breaks: 0, timeOfDay: "Evening"    },
    { studyHours: 4, sleepHours: 7, breaks: 3, timeOfDay: "Morning"    },
  ];
  const validBands = new Set(["High", "Medium", "Low"]);
  for (const tc of testCases) {
    const { band } = nearestCluster(tc, clustersData);
    expect(validBands.has(band)).toBe(true);
  }
});

// ── edge / boundary inputs ────────────────────────────────────────────────────

test("Minimum values (0 hours study, 0 sleep, 0 breaks, Morning) — returns a result", () => {
  const result = analyze(0, 0, 0, "Morning");
  expect(result.band).toBeDefined();
  expect(result.label).toBeDefined();
});

test("Maximum values (16 study, 12 sleep, 10 breaks, Night) — returns a result", () => {
  const result = analyze(16, 12, 10, "Night");
  expect(result.band).toBeDefined();
  expect(result.label).toBeDefined();
});

test("Each timeOfDay value is accepted without throwing", () => {
  for (const tod of ["Morning", "Afternoon", "Evening", "Night"]) {
    expect(() => analyze(4, 7, 2, tod)).not.toThrow();
  }
});

test("Invalid timeOfDay throws", () => {
  expect(() => analyze(4, 7, 2, "Midnight")).toThrow();
  expect(() => analyze(4, 7, 2, "")).toThrow();
  expect(() => analyze(4, 7, 2, "morning")).toThrow(); // case-sensitive
});

// ── determinism ───────────────────────────────────────────────────────────────

test("Same input always returns same output (deterministic)", () => {
  const input = { studyHours: 4, sleepHours: 7, breaks: 2, timeOfDay: "Morning" };
  const r1 = nearestCluster(input, clustersData);
  const r2 = nearestCluster(input, clustersData);
  const r3 = nearestCluster(input, clustersData);
  expect(r1).toEqual(r2);
  expect(r2).toEqual(r3);
});
