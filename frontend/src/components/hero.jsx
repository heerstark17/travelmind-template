export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <span className="hero-tag">Trips-era AI</span>
        <h1>Itineraries that feel researched, not random.</h1>
        <p>
          Build day-by-day travel plans with routing logic, hidden gems, and
          grounded INR budgets.
        </p>
      </div>
      <div className="hero-panel">
        <div className="hero-stat">
          <span>3 inputs</span>
          <strong>Prompt, style, budget</strong>
        </div>
        <div className="hero-stat">
          <span>Structured output</span>
          <strong>Morning, afternoon, evening</strong>
        </div>
        <div className="hero-stat">
          <span>Confidence</span>
          <strong>Distances and hidden gems</strong>
        </div>
      </div>
    </section>
  );
}
