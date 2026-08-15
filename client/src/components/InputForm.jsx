import { useState } from "react";
import sunMotif from "../assets/processed/sun-motif.png";
import moonMotif from "../assets/processed/moon-motif.png";

const TIME_OPTIONS = ["Morning", "Afternoon", "Evening", "Night"];

export default function InputForm({ onSubmit, loading }) {
  const [studyHours, setStudyHours] = useState("");
  const [sleepHours, setSleepHours] = useState("");
  const [breaks, setBreaks] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("Morning");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const sh = parseFloat(studyHours);
    const sl = parseFloat(sleepHours);
    const br = parseInt(breaks, 10);

    if (Number.isNaN(sh) || Number.isNaN(sl) || Number.isNaN(br)) {
      setError("Please fill in all fields with valid numbers.");
      return;
    }

    setError("");
    onSubmit({ studyHours: sh, sleepHours: sl, breaks: br, timeOfDay });
  }

  return (
    <form className="input-form" onSubmit={handleSubmit}>
      <img src={sunMotif} alt="" className="form-motif form-motif-sun" />
      <img src={moonMotif} alt="" className="form-motif form-motif-moon" />

      <label className="form-field">
        Study hours per day
        <input
          type="number" step="0.1" min="0" max="16"
          value={studyHours}
          onChange={(e) => setStudyHours(e.target.value)}
          required
        />
      </label>

      <label className="form-field">
        Sleep hours per night
        <input
          type="number" step="0.1" min="0" max="12"
          value={sleepHours}
          onChange={(e) => setSleepHours(e.target.value)}
          required
        />
      </label>

      <label className="form-field">
        Number of breaks while studying
        <input
          type="number" step="1" min="0" max="10"
          value={breaks}
          onChange={(e) => setBreaks(e.target.value)}
          required
        />
      </label>

      <label className="form-field">
        Primary time of study
        <select value={timeOfDay} onChange={(e) => setTimeOfDay(e.target.value)}>
          {TIME_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </label>

      {error && <p className="form-error">{error}</p>}

      <button type="submit" className="analyze-button" disabled={loading}>Analyze my pattern</button>
    </form>
  );
}
