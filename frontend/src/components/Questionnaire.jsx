import { useState } from "react";
import API from "../api";

export default function Questionnaire({ setTrip, setLoading }) {

  const [form, setForm] = useState({
    destination: "",
    duration: "",
    budget: "Medium",
    travel_style: "Cultural"
  });

  const generate = async () => {

    try {

      setLoading(true);

      const res = await API.post("/itinerary", form);

      setTrip({ itinerary: res.data }); // normalize structure

    } catch (err) {

      console.error(err);
      alert("Itinerary API failed");

    }

    setLoading(false);
  };

  return (
    <div className="planner-card">

      <h4>📋 Plan with Questionnaire</h4>

      <input
        className="form-control mb-2"
        placeholder="Destination"
        onChange={(e) => setForm({ ...form, destination: e.target.value })}
      />

      <input
        className="form-control mb-2"
        placeholder="Duration (days)"
        onChange={(e) => setForm({ ...form, duration: e.target.value })}
      />

      <select
        className="form-control mb-2"
        onChange={(e) => setForm({ ...form, budget: e.target.value })}
      >
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>

      <select
        className="form-control mb-3"
        onChange={(e) => setForm({ ...form, travel_style: e.target.value })}
      >
        <option>Cultural</option>
        <option>Adventure</option>
        <option>Relaxation</option>
      </select>

      <button
        className="btn btn-success w-100"
        onClick={generate}
      >
        Generate Itinerary
      </button>

    </div>
  );
}