import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "../components/hero";
import PromptPlanner from "../components/PromptPlanner";
import Questionnaire from "../components/Questionnaire";
import Navbar from "../components/Navbar";
import TimelineCard from "../components/TimelineCard";
import FeedbackModal from "../components/FeedbackModal";

export default function Planner() {
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [inputs, setInputs] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const feedbackTimer = useRef(null);

  const storedUser = useMemo(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  }, []);

  const handleTripReady = (itinerary, meta) => {
    setTrip(itinerary);
    setInputs(meta);
    sessionStorage.setItem("lastTrip", JSON.stringify(itinerary));
    sessionStorage.setItem("lastInputs", JSON.stringify(meta || {}));
    if (feedbackTimer.current) {
      clearTimeout(feedbackTimer.current);
    }
    feedbackTimer.current = setTimeout(() => {
      setShowFeedback(true);
    }, 120000);
  };

  const openFullView = () => {
    if (trip) {
      navigate("/itinerary", { state: { trip, meta: inputs } });
    }
  };

  const saveFeedback = (feedback) => {
    const existing = JSON.parse(localStorage.getItem("feedback") || "[]");
    existing.push({
      ...feedback,
      destination: trip?.destination || "Unknown",
      createdAt: new Date().toISOString()
    });
    localStorage.setItem("feedback", JSON.stringify(existing));
    setShowFeedback(false);
  };

  return (
    <div className="page">
      <Navbar userName={storedUser?.user?.name} />
      <div className="page-content">
        <Hero />

        <div className="planner-grid">
          <PromptPlanner
            onTripReady={handleTripReady}
            userId={storedUser?.user?._id}
          />
          <Questionnaire
            onTripReady={handleTripReady}
            userId={storedUser?.user?._id}
          />
        </div>

        {trip && (
          <section className="preview-section">
            <div className="preview-header">
              <div>
                <h3>{trip.destination}</h3>
                <p>
                  {trip.duration} days · {trip.travel_style} · {trip.budget_level}
                </p>
                {inputs && (
                  <span className="muted">
                    Based on {inputs.destination || "prompt"} inputs
                  </span>
                )}
              </div>
              <button className="primary-btn" onClick={openFullView}>
                Open full itinerary
              </button>
            </div>

            <div className="preview-grid">
              {trip.itinerary.slice(0, 2).map((day) => (
                <TimelineCard key={day.day} day={day} />
              ))}
            </div>
          </section>
        )}
      </div>
      {showFeedback && (
        <FeedbackModal
          trip={trip}
          onClose={() => setShowFeedback(false)}
          onSubmit={saveFeedback}
        />
      )}
    </div>
  );
}
