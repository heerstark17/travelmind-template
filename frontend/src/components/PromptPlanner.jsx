import { useState } from "react";
import API from "../api";

export default function PromptPlanner({ setTrip, setLoading }) {

  const [prompt, setPrompt] = useState("");

  const generate = async () => {

    try {

      setLoading(true);

      const res = await API.post("/prompt", {
        prompt: prompt
      });

      setTrip(res.data);   // important fix

    } catch (err) {

      console.error(err);
      alert("Prompt API failed");

    }

    setLoading(false);
  };

  return (
    <div className="planner-card">

      <h4>🧠 Plan with Prompt</h4>

      <textarea
        className="form-control mb-3"
        placeholder="Example: Plan a 3 day cultural trip to Udaipur"
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button
        className="btn btn-dark w-100"
        onClick={generate}
      >
        Generate Itinerary
      </button>

    </div>
  );
}