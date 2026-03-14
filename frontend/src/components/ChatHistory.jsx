import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchChatHistory } from "../api";

export default function ChatHistory({ userId }) {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      if (!userId) {
        setItems([]);
        return;
      }

      const data = await fetchChatHistory(userId);
      setItems(data);
    }

    load();
  }, [userId]);

  return (
    <section className="section-card">
      <h4>History</h4>
      {items.length === 0 ? (
        <p className="muted">No saved itineraries yet.</p>
      ) : (
        <div className="history-stack">
          {items.map((item) => (
            <button
              key={item._id}
              type="button"
              className="history-card clickable-card"
              onClick={() => {
                const itinerary = item.response;
                if (!itinerary) return;
                sessionStorage.setItem("lastTrip", JSON.stringify(itinerary));
                sessionStorage.setItem("lastInputs", JSON.stringify(item.query || {}));
                navigate("/itinerary", { state: { trip: itinerary, meta: item.query } });
              }}
            >
              <div className="history-meta">
                <span>{new Date(item.date).toLocaleString()}</span>
              </div>
              <div className="history-body">
                <div className="history-title">
                  {item.response?.destination || "Trip"}
                </div>
                <div className="history-subtitle">
                  {item.response?.duration || "-"} days ·{" "}
                  {item.response?.travel_style || "Unknown style"}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
