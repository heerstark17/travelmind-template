export default function DayCard({ day }) {

  return (
    <div className="card mb-3 shadow-sm">

      <div className="card-body">

        <h5>
          Day {day.day} — {day.theme}
        </h5>

        <p>🌅 {day.activities.morning.place}</p>
        <p>☀️ {day.activities.afternoon.place}</p>
        <p>🌙 {day.activities.evening.place}</p>

        <p>
          💎 Hidden Gem: {day.hidden_gem.place}
        </p>

        <p>
          🏨 Hotel: {day.hotel_suggestion}
        </p>

        <p>
          💰 Budget: ₹{day.estimated_daily_budget_inr}
        </p>

      </div>

    </div>
  );
}