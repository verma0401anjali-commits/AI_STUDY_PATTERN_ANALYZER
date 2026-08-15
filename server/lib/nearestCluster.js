const TIME_MAP = Object.assign(Object.create(null), {
  Morning: 0,
  Afternoon: 1,
  Evening: 2,
  Night: 3,
});

function encodeTimeOfDay(timeOfDay) {
  if (!Object.prototype.hasOwnProperty.call(TIME_MAP, timeOfDay)) {
    throw new Error(`Unknown timeOfDay: ${timeOfDay}`);
  }
  return TIME_MAP[timeOfDay];
}

function euclideanDistance(a, b) {
  return Math.sqrt(a.reduce((sum, val, i) => sum + (val - b[i]) ** 2, 0));
}

/**
 * Standardize a raw feature vector using per-feature mean/scale, i.e.
 * (value - mean[i]) / scale[i]. This mirrors the StandardScaler transform
 * applied to the training data before K-Means was fit, so distances
 * computed on standardized vectors agree with the true training-time
 * cluster assignment (unlike distances computed in raw feature-unit
 * space, which disagree with training assignment on a meaningful
 * fraction of realistic inputs).
 */
function standardize(vector, scaler) {
  return vector.map((val, i) => (val - scaler.mean[i]) / scaler.scale[i]);
}

/**
 * Find the nearest cluster to `input` in standardized (scaled) feature
 * space.
 *
 * @param {{studyHours: number, sleepHours: number, breaks: number, timeOfDay: string}} input
 * @param {{clusters: Array<{id: number, label: string, band: string, center: number[], tip: string}>, scaler: {mean: number[], scale: number[]}}} clustersData
 *   The full parsed clusters.json object — both the clusters array AND the
 *   scaler object are required so that the input point and every cluster
 *   center can be standardized the same way before distance is computed.
 * @returns {{label: string, band: string, tip: string}}
 */
function nearestCluster(input, clustersData) {
  const { clusters, scaler } = clustersData;

  const rawPoint = [
    input.studyHours,
    input.sleepHours,
    input.breaks,
    encodeTimeOfDay(input.timeOfDay),
  ];

  const scaledPoint = standardize(rawPoint, scaler);

  let best = null;
  let bestDist = Infinity;
  for (const cluster of clusters) {
    const scaledCenter = standardize(cluster.center, scaler);
    const dist = euclideanDistance(scaledPoint, scaledCenter);
    if (dist < bestDist) {
      bestDist = dist;
      best = cluster;
    }
  }

  if (!best) {
    throw new Error("No matching cluster found");
  }

  return { label: best.label, band: best.band, tip: best.tip };
}

module.exports = { nearestCluster, encodeTimeOfDay };
