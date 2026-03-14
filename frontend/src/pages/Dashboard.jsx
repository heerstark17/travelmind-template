import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import ChatHistory from "../components/ChatHistory";
import Wishlist from "../components/Wishlist";
import { fetchChatHistory, fetchWishlist, listShares } from "../api";

export default function Dashboard() {
  const storedUser = useMemo(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  }, []);

  const [stats, setStats] = useState({
    trips: 0,
    wishlist: 0,
    lastTrip: null,
    shares: 0
  });

  useEffect(() => {
    async function load() {
      if (!storedUser?.user?._id) {
        return;
      }

      const [history, wishlist, shares] = await Promise.all([
        fetchChatHistory(storedUser.user._id),
        fetchWishlist(storedUser.user._id),
        listShares(storedUser.user._id)
      ]);

      const lastTrip = history[0]?.response || null;

      setStats({
        trips: history.length,
        wishlist: wishlist.length,
        lastTrip,
        shares: shares.length
      });

    }

    load();
  }, [storedUser]);

  return (
    <div className="page">
      <Navbar userName={storedUser?.user?.name} />
      <div className="page-content">
        <section className="dashboard-hero">
          <div>
            <span className="hero-tag">Dashboard</span>
            <h2>Welcome back, {storedUser?.user?.name || "traveler"}.</h2>
            <p className="muted">
              Your planning hub for saved trips, wishlists, and hotel planning.
            </p>
          </div>
          <div className="stat-grid">
            <div className="stat-card">
              <span>Trips planned</span>
              <strong>{stats.trips}</strong>
            </div>
            <div className="stat-card">
              <span>Wishlist items</span>
              <strong>{stats.wishlist}</strong>
            </div>
            <div className="stat-card">
              <span>Last destination</span>
              <strong>{stats.lastTrip?.destination || "None yet"}</strong>
            </div>
            <div className="stat-card">
              <span>Shared itineraries</span>
              <strong>{stats.shares}</strong>
            </div>
          </div>
        </section>

        <div className="dashboard-grid">
          <div>
            <section className="section-card premium-card">
              <h4>Hotel concierge</h4>
              <p className="muted">
                Pick a tier and jump to trusted options mapped to your itinerary.
              </p>
              <div className="hotel-options">
                <div className="hotel-option">
                  <span>Essential</span>
                  <strong>Budget stays</strong>
                  <p>Compact, clean, and close to action.</p>
                </div>
                <div className="hotel-option">
                  <span>Signature</span>
                  <strong>Comfort-first</strong>
                  <p>Balanced pricing with premium details.</p>
                </div>
                <div className="hotel-option">
                  <span>Prestige</span>
                  <strong>Luxury escapes</strong>
                  <p>Iconic stays and destination hotels.</p>
                </div>
              </div>
            </section>
            <ChatHistory userId={storedUser?.user?._id} />
          </div>
          <div>
            <Wishlist userId={storedUser?.user?._id} />
          </div>
        </div>
      </div>
    </div>
  );
}
