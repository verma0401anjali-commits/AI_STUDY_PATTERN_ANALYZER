import { Link } from "react-router-dom";
import heroKid from "../assets/processed/hero-studying-kid.png";
import moonMotif from "../assets/processed/moon-motif.png";
import mascotHigh from "../assets/processed/mascot-high.png";
import mascotMedium from "../assets/processed/mascot-medium.png";
import mascotLow from "../assets/processed/mascot-low.png";
import alarmMotif from "../assets/processed/alarm-motif.png";
import coffeeMotif from "../assets/processed/coffee-motif.png";
import bookCharMotif from "../assets/processed/bookchar-motif.png";
import pencilBooksMotif from "../assets/processed/pencilbooks-motif.png";
import lampBuddyMotif from "../assets/processed/lampbuddy-motif.png";
import crayonMotif from "../assets/processed/crayon-motif.png";
import sunWavesMotif from "../assets/processed/sun-waves-motif.png";
import moonStarsMotif from "../assets/processed/moon-stars-motif.png";

const STEPS = [
  {
    title: "Share your habits",
    text: "Tell us your study hours, sleep, breaks, and when you like to study.",
  },
  {
    title: "We find your pattern",
    text: "A model trained on real student data matches you to a study pattern.",
  },
  {
    title: "Get a personal tip",
    text: "See your productivity band and one clear tip to study smarter.",
  },
];

export default function LandingPage() {
  return (
    <div className="landing">
      <div className="landing-floaters" aria-hidden="true">
        <img src={moonMotif} className="floater floater-1" alt="" />
        <img src={sunWavesMotif} className="floater floater-2" alt="" />
        <img src={mascotMedium} className="floater floater-3" alt="" />
        <img src={coffeeMotif} className="floater floater-4" alt="" />
        <img src={mascotHigh} className="floater floater-5" alt="" />
        <img src={crayonMotif} className="floater floater-6" alt="" />
        <img src={lampBuddyMotif} className="floater floater-7" alt="" />
        <img src={alarmMotif} className="floater floater-8" alt="" />
        <img src={mascotLow} className="floater floater-9" alt="" />
        <img src={pencilBooksMotif} className="floater floater-10" alt="" />
        <img src={bookCharMotif} className="floater floater-11" alt="" />
        <img src={moonStarsMotif} className="floater floater-12" alt="" />
      </div>

      <section className="landing-hero">
        <div className="landing-hero-content">
          <h1 className="landing-title">AI Study Analyzer</h1>
          <p className="landing-tagline">
            Discover which study habits actually work for you.
          </p>
          <Link to="/analyze" className="analyze-button landing-cta">
            Try Now
          </Link>
        </div>

        <img src={heroKid} className="landing-hero-image" alt="A student studying at a desk" />
      </section>

      <section className="landing-how">
        <h2 className="landing-how-title">How it works</h2>
        <div className="landing-steps">
          {STEPS.map((step, i) => (
            <div className="landing-step" key={step.title}>
              <span className="landing-step-number">{i + 1}</span>
              <h3 className="landing-step-title">{step.title}</h3>
              <p className="landing-step-text">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-footer-cta">
        <h2 className="landing-footer-title">Ready to find your pattern?</h2>
      </section>
    </div>
  );
}
