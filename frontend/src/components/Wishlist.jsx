import { useEffect, useState } from "react";
import { addWishlist, fetchWishlist } from "../api";

export default function Wishlist({ userId, city }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ place: "", city: city || "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    if (!userId) {
      return;
    }

    const data = await fetchWishlist(userId);
    setItems(data);
  };

  useEffect(() => {
    setForm((prev) => ({ ...prev, city: city || prev.city }));
  }, [city]);

  useEffect(() => {
    load();
  }, [userId]);

  const handleChange = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const submit = async () => {
    if (!userId) {
      setError("Log in to save wishlist items.");
      return;
    }

    if (!form.place.trim() || !form.city.trim()) {
      setError("Add both a place and a city.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await addWishlist({ userId, place: form.place, city: form.city });
      setForm((prev) => ({ ...prev, place: "" }));
      await load();
    } catch (err) {
      setError("Could not save the wishlist item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-card">
      <h4>Wishlist</h4>
      <div className="mini-form">
        <input
          placeholder="Place"
          value={form.place}
          onChange={handleChange("place")}
        />
        <input
          placeholder="City"
          value={form.city}
          onChange={handleChange("city")}
        />
        <button className="ghost-btn" onClick={submit} disabled={loading}>
          {loading ? "Saving..." : "Add"}
        </button>
      </div>
      {error && <div className="form-error">{error}</div>}

      {items.length === 0 ? (
        <p className="muted">No wishlist items yet.</p>
      ) : (
        <div className="list-stack">
          {items.map((item) => (
            <div key={item._id} className="list-row">
              <div>{item.place}</div>
              <span>{item.city}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
