import { useState } from "react";
import InputForm from "../components/InputForm";
import ResultCard from "../components/ResultCard";
import { analyzePattern } from "../lib/api";
import emptyStateKid from "../assets/processed/empty-state-kid.png";
import resetButtonImg from "../assets/processed/reset-button.png";

export default function AnalyzePage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formKey, setFormKey] = useState(0);

  async function handleSubmit(values) {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await analyzePattern(values);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setResult(null);
    setError("");
    setLoading(false);
    setFormKey((prev) => prev + 1);
  }

  return (
    <div className="app">
      <div className="floating-bubbles" aria-hidden="true">
        <span className="bubble bubble-1"></span>
        <span className="bubble bubble-2"></span>
        <span className="bubble bubble-3"></span>
        <span className="bubble bubble-4"></span>
        <span className="bubble bubble-5"></span>
        <span className="bubble bubble-6"></span>
        <span className="bubble bubble-7"></span>
        <span className="bubble bubble-8"></span>
        <span className="bubble bubble-9"></span>
        <span className="bubble bubble-10"></span>
      </div>

      <button
        type="button"
        className="reset-image-button page-reset-btn"
        onClick={handleReset}
        title="Reset everything"
      >
        <img src={resetButtonImg} alt="Reset" className="reset-button-img" />
      </button>

      <h1 className="app-title">AI Study Pattern Analyzer</h1>
      <p className="app-subtitle">Tell us your habits, meet your study pattern.</p>

      <InputForm key={formKey} onSubmit={handleSubmit} loading={loading} />

      {loading && <p className="app-loading">Analyzing...</p>}
      {error && <p className="form-error">{error}</p>}
      {result && <ResultCard result={result} />}
      {!result && !error && !loading && (
        <div className="empty-state">
          <img src={emptyStateKid} alt="" className="empty-state-image" />
          <p className="empty-state-caption">Your study pattern will appear here.</p>
        </div>
      )}
    </div>
  );
}
