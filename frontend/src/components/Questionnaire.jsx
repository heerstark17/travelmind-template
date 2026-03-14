import { useEffect, useState } from "react";
import { fetchQuestions, generateItinerary, saveChatHistory } from "../api";

export default function Questionnaire({ onTripReady, userId }) {
  const [questions, setQuestions] = useState({});
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchQuestions();
        setQuestions(data);

        const defaults = Object.entries(data).reduce((acc, [key, value]) => {
          acc[key] = value.type === "dropdown" ? value.options[0] : "";
          return acc;
        }, {});
        setForm(defaults);
      } catch (err) {
        setError("Unable to load the questionnaire.");
      }
    }

    load();
  }, []);

  const onChange = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const generate = async () => {
    setLoading(true);
    setError("");

    try {
      if (!form.destination || !form.duration) {
        setError("Destination and duration are required.");
        setLoading(false);
        return;
      }

      const itinerary = await generateItinerary(form);
      onTripReady(itinerary, form);

      if (userId) {
        await saveChatHistory({
          userId,
          query: { questionnaire: form },
          response: itinerary
        });
      }
    } catch (err) {
      setError("Itinerary API failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel-card">
      <div className="panel-header">
        <div>
          <h3>Guided questionnaire</h3>
          <p>Dial in budget, duration, and style with structure.</p>
        </div>
      </div>

      {Object.keys(questions).map((key) => {
        const q = questions[key];
        return (
          <label key={key} className="field">
            <span>{q.question}</span>
            {q.type === "dropdown" ? (
              <select value={form[key] || ""} onChange={onChange(key)}>
                {q.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : q.type === "date" ? (
              <input
                type="date"
                value={form[key] || ""}
                onChange={onChange(key)}
              />
            ) : (
              <input
                placeholder={q.question}
                value={form[key] || ""}
                onChange={onChange(key)}
              />
            )}
          </label>
        );
      })}

      {error && <div className="form-error">{error}</div>}

      <button className="primary-btn" onClick={generate} disabled={loading}>
        {loading ? "Building itinerary..." : "Generate itinerary"}
      </button>
    </div>
  );
}
