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
  const [multiTrips, setMultiTrips] = useState([]);
  const [multiMeta, setMultiMeta] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const feedbackTimer = useRef(null);

  const storedUser = useMemo(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  }, []);

  const handleTripReady = (itinerary, meta) => {
    setTrip(itinerary);
    setInputs(meta);
    setMultiTrips([]);
    setMultiMeta(null);
    sessionStorage.setItem("lastTrip", JSON.stringify(itinerary));
    sessionStorage.setItem("lastInputs", JSON.stringify(meta || {}));
    if (feedbackTimer.current) {
      clearTimeout(feedbackTimer.current);
    }
    feedbackTimer.current = setTimeout(() => {
      setShowFeedback(true);
    }, 120000);
  };

  const handleMultiTrips = (itineraries, meta) => {
    setMultiTrips(itineraries);
    setMultiMeta(meta);
    setTrip(null);
    setInputs(null);
  };

  const openFullView = () => {
    if (trip) {
      navigate("/itinerary", { state: { trip, meta: inputs } });
    }
  };

  const openFullViewFor = (itinerary) => {
    navigate("/itinerary", { state: { trip: itinerary, meta: multiMeta } });
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
            onMultiTrips={handleMultiTrips}
            userId={storedUser?.user?._id}
          />
          <Questionnaire
            onTripReady={handleTripReady}
            userId={storedUser?.user?._id}
          />
        </div>

        {multiTrips.length > 0 && (
          <section className="preview-section">
            <div className="preview-header">
              <div>
                <h3>Suggested city itineraries</h3>
                <p>Pick one to open the full itinerary.</p>
                {multiMeta?.destination_options?.length > 0 && (
                  <div className="tag-row">
                    {multiMeta.destination_options.map((city) => (
                      <span className="badge" key={city}>
                        {city}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="preview-grid">
              {multiTrips.map((item) => {
                const day = item.itinerary?.[0];
                return (
                  <div className="section-card" key={item.destination}>
                    <div className="timeline-header">
                      <h4>{item.destination}</h4>
                      <button
                        className="ghost-btn"
                        onClick={() => openFullViewFor(item)}
                      >
                        Open itinerary
                      </button>
                    </div>
                    {day && (
                      <>
                        <div className="activity-block">
                          <div className="activity-label">Day 1</div>
                          <div className="activity-place">{day.theme}</div>
                        </div>
                        <div className="activity-block">
                          <div className="activity-label">Morning</div>
                          <div className="activity-place">{day.activities.morning.place}</div>
                          <div className="activity-note">{day.activities.morning.description}</div>
                        </div>
                        <div className="activity-block">
                          <div className="activity-label">Afternoon</div>
                          <div className="activity-place">{day.activities.afternoon.place}</div>
                          <div className="activity-note">{day.activities.afternoon.description}</div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

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
                {inputs?.destination_options?.length > 1 && (
                  <div className="tag-row">
                    {inputs.destination_options.map((city) => (
                      <span className="badge" key={city}>
                        {city}
                      </span>
                    ))}
                  </div>
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
