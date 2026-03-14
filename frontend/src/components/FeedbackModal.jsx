import { useMemo, useState } from "react";

export default function FeedbackModal({ trip, onClose, onSubmit }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const stars = useMemo(() => [1, 2, 3, 4, 5], []);

  const submit = () => {
    onSubmit({ rating, comment });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h3>Rate your itinerary</h3>
          <button className="link-btn" onClick={onClose} type="button">
            Skip
          </button>
        </div>
        <p className="muted">
          Your feedback keeps our planning quality premium.
        </p>
        <div className="star-row">
          {stars.map((star) => (
            <button
              key={star}
              type="button"
              className={rating >= star ? "star-btn active" : "star-btn"}
              onClick={() => setRating(star)}
            >
              *
            </button>
          ))}
          <span className="star-label">{rating}/5</span>
        </div>
        <textarea
          className="planner-textarea"
          rows={4}
          placeholder="Share what you loved or what felt off."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className="modal-actions">
          <button className="ghost-btn" onClick={onClose} type="button">
            Later
          </button>
          <button className="primary-btn" onClick={submit} type="button">
            Submit feedback
          </button>
        </div>
        {trip && (
          <div className="modal-footer muted">
            For: {trip.destination} · {trip.duration} days
          </div>
        )}
      </div>
    </div>
  );
}
