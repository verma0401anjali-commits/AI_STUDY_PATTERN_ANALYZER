import mascotHigh from "../assets/processed/mascot-high.png";
import mascotMedium from "../assets/processed/mascot-medium.png";
import mascotLow from "../assets/processed/mascot-low.png";

const MASCOTS = {
  High: mascotHigh,
  Medium: mascotMedium,
  Low: mascotLow,
};

const BAND_COLORS = {
  High: "#4caf7d",
  Medium: "#e8a33d",
  Low: "#e0637a",
};

export default function ResultCard({ result }) {
  if (!result) return null;

  const { label, band, tip } = result;
  const mascot = MASCOTS[band];
  const color = BAND_COLORS[band] || "#888";

  return (
    <div className="result-card">
      {mascot && <img src={mascot} alt={`${band} productivity mascot`} className="result-mascot" />}
      <span className="result-band" style={{ backgroundColor: color }}>{band}</span>
      <h2 className="result-label">{label}</h2>
      <p className="result-tip">{tip}</p>
    </div>
  );
}
