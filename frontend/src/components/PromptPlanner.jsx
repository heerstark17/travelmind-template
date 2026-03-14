import { useState } from "react";
import { generateFromPrompt, saveChatHistory } from "../api";

export default function PromptPlanner({ onTripReady, onMultiTrips, userId }) {
  const [prompt, setPrompt] = useState("");
  const [collaboration, setCollaboration] = useState("Solo planning");
  const [companion, setCompanion] = useState("Solo");
  const [preferredHotel, setPreferredHotel] = useState("");
  const [checkinDate, setCheckinDate] = useState("");
  const [checkoutDate, setCheckoutDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [semanticOptions, setSemanticOptions] = useState([]);
  const [semanticBriefs, setSemanticBriefs] = useState([]);

  const runPrompt = async (basePrompt) => {
    if (!basePrompt.trim()) {
      setError("Add a quick prompt to get started.");
      return;
    }

    setError("");
    setSemanticOptions([]);
    setSemanticBriefs([]);
    setLoading(true);

    try {
      const enrichedPrompt = `${basePrompt}\nTravel collaboration: ${collaboration}\nTravel companion: ${companion}`;
      const data = await generateFromPrompt(enrichedPrompt);
      if (Array.isArray(data.itineraries) && data.itineraries.length > 0) {
        onMultiTrips?.(data.itineraries, {
          destination_options: data.semantic_suggestions || [],
          prompt
        });
        return;
      }

      if (!data.itinerary && data.semantic_suggestions) {
        setSemanticOptions(data.semantic_suggestions || []);
        setSemanticBriefs(data.brief_itineraries || []);
        setError(data.note || "");
        return;
      }

      onTripReady(data.itinerary, {
        ...data.extracted_parameters,
        collaboration,
        travel_companion: companion,
        preferred_hotel: preferredHotel,
        checkin_date: checkinDate,
        checkout_date: checkoutDate
      });

      if (userId) {
        await saveChatHistory({
          userId,
          query: { prompt, extracted: data.extracted_parameters },
          response: data.itinerary
        });
      }
    } catch (err) {
      const suggestions = err?.response?.data?.semantic_suggestions || [];
      if (suggestions.length > 0) {
        setSemanticOptions(suggestions);
        setSemanticBriefs(err?.response?.data?.brief_itineraries || []);
        setError("We couldn't match a city. Pick one of these suggestions:");
      } else {
        setError("Prompt planner failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const generate = async () => {
    await runPrompt(prompt);
  };

  return (
    <div className="panel-card">
      <div className="panel-header">
        <div>
          <h3>Freeform prompt</h3>
          <p>Let the model infer your budget, style, and duration.</p>
        </div>
      </div>

      <textarea
        className="planner-textarea"
        placeholder="Example: 3 day cultural trip to Udaipur with a medium budget"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={5}
      />

      <div className="field">
        <span>Travel collaboration</span>
        <select value={collaboration} onChange={(e) => setCollaboration(e.target.value)}>
          <option>Solo planning</option>
          <option>Planning with friends</option>
          <option>Family group</option>
          <option>Team trip</option>
        </select>
      </div>

      <div className="field">
        <span>Travel companion</span>
        <select value={companion} onChange={(e) => setCompanion(e.target.value)}>
          <option>Solo</option>
          <option>Partner</option>
          <option>Friends</option>
          <option>Family</option>
          <option>Colleagues</option>
        </select>
      </div>

      <div className="field">
        <span>Preferred hotel (optional)</span>
        <input
          placeholder="Example: Taj Lake Palace"
          value={preferredHotel}
          onChange={(e) => setPreferredHotel(e.target.value)}
        />
      </div>

      <div className="field">
        <span>Check-in date</span>
        <input type="date" value={checkinDate} onChange={(e) => setCheckinDate(e.target.value)} />
      </div>

      <div className="field">
        <span>Check-out date</span>
        <input type="date" value={checkoutDate} onChange={(e) => setCheckoutDate(e.target.value)} />
      </div>

      {error && <div className="form-error">{error}</div>}
      {semanticOptions.length > 0 && (
        <div className="semantic-grid">
          {semanticOptions.map((city, index) => (
            <div key={city} className="semantic-card">
              <strong>{city}</strong>
              <span>{semanticBriefs[index] || "Suggested itinerary preview"}</span>
            </div>
          ))}
        </div>
      )}

      <button className="primary-btn" onClick={generate} disabled={loading}>
        {loading ? "Building itinerary..." : "Generate itinerary"}
      </button>
    </div>
  );
}
