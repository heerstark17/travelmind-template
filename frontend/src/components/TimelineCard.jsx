export default function TimelineCard({ day }) {
  if (!day) {
    return null;
  }

  return (
    <div className="timeline-card">
      <div className="timeline-header">
        <h4>
          Day {day.day}: {day.theme}
        </h4>
        <span className="badge budget">Day budget: INR {day.estimated_daily_budget_inr}</span>
      </div>

      <div className="activity-block">
        <div className="activity-label">Morning</div>
        <div className="activity-place">{day.activities.morning.place}</div>
        <div className="activity-note">{day.activities.morning.description}</div>
        <div className="activity-cost">INR {day.activities.morning.estimated_budget_inr}</div>
      </div>

      <div className="activity-block">
        <div className="activity-label">Afternoon</div>
        <div className="activity-place">{day.activities.afternoon.place}</div>
        <div className="activity-note">{day.activities.afternoon.description}</div>
        <div className="activity-cost">INR {day.activities.afternoon.estimated_budget_inr}</div>
      </div>

      <div className="activity-block">
        <div className="activity-label">Evening</div>
        <div className="activity-place">{day.activities.evening.place}</div>
        <div className="activity-note">{day.activities.evening.description}</div>
        <div className="activity-cost">INR {day.activities.evening.estimated_budget_inr}</div>
      </div>

      <div className="tag-row">
        <span className="badge gem">Hidden gem: {day.hidden_gem.place}</span>
        <span className="badge hotel">Hotel: {day.hotel_suggestion}</span>
      </div>

      {day.distances?.length > 0 && (
        <div className="distance-list">
          <h5>Routing</h5>
          {day.distances.map((distance, index) => (
            <div className="distance-item" key={`${distance.from}-${index}`}>
              <div>
                {distance.from} to {distance.to}
              </div>
              <div>
                {distance.distance_km} km, {distance.travel_time}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
