import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import TimelineCard from "../components/TimelineCard";
import Wishlist from "../components/Wishlist";
import ChatHistory from "../components/ChatHistory";
import { addCollaborator, createShare, fetchCatalogCity, voteShare } from "../api";

export default function Itinerary() {
  const location = useLocation();
  const navigate = useNavigate();

  const storedUser = useMemo(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  }, []);

  const storedTrip = useMemo(() => {
    const raw = sessionStorage.getItem("lastTrip");
    return raw ? JSON.parse(raw) : null;
  }, []);

  const storedInputs = useMemo(() => {
    const raw = sessionStorage.getItem("lastInputs");
    return raw ? JSON.parse(raw) : null;
  }, []);

  const trip = location.state?.trip || storedTrip;
  const meta = location.state?.meta || storedInputs;
  const [origin, setOrigin] = useState("");
  const [geoOrigin, setGeoOrigin] = useState(null);
  const [geoError, setGeoError] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [catalogCity, setCatalogCity] = useState("");
  const [share, setShare] = useState(null);
  const [collabEmail, setCollabEmail] = useState("");
  const [shareError, setShareError] = useState("");

  const durationLabel = useMemo(() => {
    const raw = String(trip?.duration || "").trim();
    if (!raw) return "";
    if (/day/i.test(raw)) return raw;
    return `${raw} days`;
  }, [trip?.duration]);

  const places = useMemo(() => {
    if (!trip?.itinerary) {
      return [];
    }

    const collected = [];
    trip.itinerary.forEach((day) => {
      if (day?.activities?.morning?.place) collected.push(day.activities.morning.place);
      if (day?.activities?.afternoon?.place) collected.push(day.activities.afternoon.place);
      if (day?.activities?.evening?.place) collected.push(day.activities.evening.place);
      if (day?.hidden_gem?.place) collected.push(day.hidden_gem.place);
      if (day?.hotel_suggestion) collected.push(day.hotel_suggestion);
    });

    return Array.from(new Set(collected));
  }, [trip]);

  const mapQuery = useMemo(() => {
    if (!trip?.destination) {
      return "";
    }

    const highlights = places.slice(0, 6).join(" ");
    return encodeURIComponent(`${trip.destination} ${highlights}`);
  }, [trip, places]);

  const mapUrl = mapQuery
    ? `https://www.google.com/maps/search/?api=1&query=${mapQuery}`
    : null;

  const hotelUrl = trip?.destination
    ? `https://www.google.com/maps/search/hotels+in+${encodeURIComponent(trip.destination)}`
    : null;
  const bookingUrl = trip?.destination
    ? `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(trip.destination)}`
    : null;

  const bookingDateParams = useMemo(() => {
    if (!meta?.checkin_date || !meta?.checkout_date) {
      return "";
    }

    const [ciYear, ciMonth, ciDay] = meta.checkin_date.split("-");
    const [coYear, coMonth, coDay] = meta.checkout_date.split("-");

    if (!ciYear || !ciMonth || !ciDay || !coYear || !coMonth || !coDay) {
      return "";
    }

    return [
      `checkin_year=${ciYear}`,
      `checkin_month=${ciMonth}`,
      `checkin_monthday=${ciDay}`,
      `checkout_year=${coYear}`,
      `checkout_month=${coMonth}`,
      `checkout_monthday=${coDay}`
    ].join("&");
  }, [meta]);

  const bookingUrlWithDates = bookingDateParams
    ? `${bookingUrl}&${bookingDateParams}`
    : bookingUrl;

  const hotelSuggestions = useMemo(() => {
    if (!trip?.itinerary) {
      return [];
    }
    const hotels = trip.itinerary
      .map((day) => day.hotel_suggestion)
      .filter(Boolean);
    return Array.from(new Set(hotels)).slice(0, 4);
  }, [trip]);

  const parseInr = (value) => {
    if (!value) return 0;
    const numeric = String(value).replace(/[^0-9.]/g, "");
    return Number.parseFloat(numeric || "0");
  };

  const parseKm = (value) => {
    if (!value) return 0;
    const numeric = String(value).replace(/[^0-9.]/g, "");
    return Number.parseFloat(numeric || "0");
  };

  const dailyTotals = useMemo(() => {
    if (!trip?.itinerary) return [];
    return trip.itinerary.map((day) => parseInr(day.estimated_daily_budget_inr));
  }, [trip]);

  const maxBudget = useMemo(() => {
    if (dailyTotals.length === 0) return 1;
    return Math.max(...dailyTotals, 1);
  }, [dailyTotals]);

  const totalKm = useMemo(() => {
    if (!trip?.itinerary) return 0;
    return trip.itinerary.reduce((sum, day) => {
      const dayKm = (day.distances || []).reduce((acc, d) => acc + parseKm(d.distance_km), 0);
      return sum + dayKm;
    }, 0);
  }, [trip]);

  const calculatedTotal = dailyTotals.reduce((sum, value) => sum + value, 0);

  const preferredHotel = meta?.preferred_hotel?.trim();
  const preferredMissing =
    preferredHotel &&
    !hotelSuggestions.some((hotel) =>
      hotel.toLowerCase().includes(preferredHotel.toLowerCase())
    );

  useEffect(() => {
    async function loadCatalog() {
      if (!trip?.destination) return;
      try {
        const response = await fetchCatalogCity(trip.destination);
        setRestaurants(response.data?.restaurants || []);
        setCatalogCity(response.city || trip.destination);
      } catch (err) {
        setRestaurants([]);
        setCatalogCity(trip.destination);
      }
    }

    loadCatalog();
  }, [trip?.destination]);

  const voteScore = useMemo(() => {
    if (!share?.votes?.length) return 0;
    return share.votes.reduce((sum, vote) => sum + (vote.value || 0), 0);
  }, [share]);

  const shareItinerary = async () => {
    if (!storedUser?.user?._id) {
      setShareError("Log in to share itineraries.");
      return;
    }

    try {
      setShareError("");
      const created = await createShare({
        ownerId: storedUser.user._id,
        title: `${trip.destination} itinerary`,
        itinerary: trip,
        meta
      });
      setShare(created);
    } catch (err) {
      setShareError("Unable to create a share link.");
    }
  };

  const addEmail = async () => {
    if (!share?._id || !collabEmail.trim()) return;
    try {
      const updated = await addCollaborator(share._id, collabEmail.trim());
      setShare(updated);
      setCollabEmail("");
    } catch (err) {
      setShareError("Could not add collaborator.");
    }
  };

  const vote = async (value) => {
    if (!share?._id) return;
    try {
      const updated = await voteShare(share._id, storedUser?.user?._id, value);
      setShare(updated);
    } catch (err) {
      setShareError("Vote failed.");
    }
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation not supported in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoOrigin({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setGeoError("");
      },
      () => {
        setGeoError("Unable to access location.");
      }
    );
  };

  const originParam = geoOrigin ? `${geoOrigin.lat},${geoOrigin.lng}` : origin.trim();
  const hasOrigin = Boolean(originParam);

  const directionsUrl = (mode) => {
    if (!trip?.destination || !hasOrigin) {
      return null;
    }
    return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      originParam
    )}&destination=${encodeURIComponent(trip.destination)}&travelmode=${mode}`;
  };

  const flightUrl = trip?.destination
    ? `https://www.google.com/travel/flights?q=Flights%20to%20${encodeURIComponent(trip.destination)}`
    : null;

  if (!trip) {
    return (
      <div className="empty-state">
        <h2>No itinerary yet.</h2>
        <p>Head back to the planner and generate a trip first.</p>
        <button className="primary-btn" onClick={() => navigate("/planner")}>
          Back to planner
        </button>
      </div>
    );
  }

  const cards = [
    ...trip.itinerary.map((day) => <TimelineCard key={`day-${day.day}`} day={day} />),
    <section className="section-card premium-card" key="hotel">
      <h4>Hotel booking options</h4>
      {preferredMissing && (
        <div className="form-error">
          Preferred hotel not found in the itinerary. Showing best alternatives from the web.
        </div>
      )}
      {hotelSuggestions.length > 0 && (
        <div className="hotel-list">
          {hotelSuggestions.map((hotel) => (
            <div key={hotel} className="hotel-row">
              <div>
                <strong>{hotel}</strong>
                <span>{trip.destination}</span>
              </div>
              <a
                className="ghost-btn"
                href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(
                  `${hotel} ${trip.destination}`
                )}${bookingDateParams ? `&${bookingDateParams}` : ""}`}
                target="_blank"
                rel="noreferrer"
              >
                View on Booking.com
              </a>
            </div>
          ))}
        </div>
      )}
      {hotelSuggestions.length === 0 && (
        <div className="hotel-list">
          <div className="hotel-row">
            <div>
              <strong>Top stays in {trip.destination}</strong>
              <span>Curated from Booking.com</span>
            </div>
            <a className="ghost-btn" href={bookingUrlWithDates} target="_blank" rel="noreferrer">
              Browse options
            </a>
          </div>
          {preferredHotel && (
            <div className="hotel-row">
              <div>
                <strong>{preferredHotel}</strong>
                <span>{trip.destination}</span>
              </div>
              <a
                className="ghost-btn"
                href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(
                  `${preferredHotel} ${trip.destination}`
                )}${bookingDateParams ? `&${bookingDateParams}` : ""}`}
                target="_blank"
                rel="noreferrer"
              >
                Check availability
              </a>
            </div>
          )}
        </div>
      )}
      <div className="hotel-options">
        <div className="hotel-option">
          <span>Essential</span>
          <strong>Budget stays</strong>
          <p>Smart hotels close to transit.</p>
        </div>
        <div className="hotel-option">
          <span>Signature</span>
          <strong>Comfort-first</strong>
          <p>Premium rooms with curated amenities.</p>
        </div>
        <div className="hotel-option">
          <span>Prestige</span>
          <strong>Luxury escapes</strong>
          <p>Iconic properties and suites.</p>
        </div>
      </div>
      {hotelUrl && (
        <a className="primary-btn full-width" href={hotelUrl} target="_blank" rel="noreferrer">
          View hotels in maps
        </a>
      )}
      {bookingUrlWithDates && (
        <a className="ghost-btn full-width" href={bookingUrlWithDates} target="_blank" rel="noreferrer">
          Continue on Booking.com
        </a>
      )}
    </section>,
    <section className="section-card premium-card map-card" key="map">
      <h4>Map highlights</h4>
      <p className="muted">A fast visual of today’s route anchors and hidden gems.</p>
      <div className="map-shell">
        <div className="map-glow" />
        <div className="map-list">
          {places.slice(0, 6).map((place) => (
            <div key={place} className="map-pill">
              {place}
            </div>
          ))}
        </div>
      </div>
      {mapUrl && (
        <a className="ghost-btn full-width" href={mapUrl} target="_blank" rel="noreferrer">
          Open route in maps
        </a>
      )}
    </section>,
    <section className="section-card premium-card" key="restaurants">
      <h4>Restaurant recommendations</h4>
      {restaurants.length === 0 ? (
        <p className="muted">No restaurant dataset found for this city.</p>
      ) : (
        <div className="restaurant-list">
          {restaurants.slice(0, 6).map((restaurant) => (
            <div key={restaurant} className="restaurant-row">
              <div>
                <strong>{restaurant}</strong>
                <span>{catalogCity}</span>
              </div>
              <a
                className="ghost-btn"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${restaurant} ${catalogCity}`
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                Map route
              </a>
            </div>
          ))}
        </div>
      )}
    </section>,
    <section className="section-card premium-card" key="timeline-viz">
      <h4>Timeline visualization</h4>
      <div className="timeline-viz">
        {trip.itinerary.map((day, index) => (
          <div className="timeline-viz-row" key={`timeline-${day.day}`}>
            <span>Day {index + 1}</span>
            <div className="timeline-bar">
              <div className="timeline-fill" />
            </div>
            <strong>{day.theme || `Day ${index + 1}`}</strong>
          </div>
        ))}
      </div>
    </section>,
    <section className="section-card premium-card" key="budget-viz">
      <h4>Budget visualization</h4>
      <div className="budget-viz">
        {dailyTotals.map((value, index) => (
          <div className="budget-viz-row" key={`budget-${index}`}>
            <span>Day {index + 1}</span>
            <div className="budget-bar">
              <div
                className="budget-fill"
                style={{ width: `${Math.min(100, (value / maxBudget) * 100)}%` }}
              />
            </div>
            <strong>INR {value}</strong>
          </div>
        ))}
      </div>
    </section>,
    <section className="section-card premium-card" key="collaboration">
      <h4>Collaboration</h4>
      <p className="muted">Share this itinerary, invite collaborators, and vote on it.</p>
      {!share && (
        <button className="primary-btn full-width" onClick={shareItinerary}>
          Create share link
        </button>
      )}
      {share && (
        <div className="share-panel">
          <div className="share-row">
            <span>Share ID</span>
            <strong>{share._id}</strong>
          </div>
          <div className="share-row">
            <span>Votes</span>
            <strong>{voteScore}</strong>
          </div>
          <div className="share-actions">
            <button className="ghost-btn" onClick={() => vote(1)} type="button">
              Upvote
            </button>
            <button className="ghost-btn" onClick={() => vote(-1)} type="button">
              Downvote
            </button>
          </div>
          <div className="share-invite">
            <input
              placeholder="Add collaborator email"
              value={collabEmail}
              onChange={(e) => setCollabEmail(e.target.value)}
            />
            <button className="ghost-btn" onClick={addEmail} type="button">
              Invite
            </button>
          </div>
          {share.collaborators?.length > 0 && (
            <div className="share-list">
              {share.collaborators.map((email) => (
                <span key={email} className="badge">
                  {email}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
      {shareError && <div className="form-error">{shareError}</div>}
    </section>,
    <section className="section-card premium-card" key="travel">
      <h4>Travel options and pricing</h4>
      <p className="muted">
        Add your starting point to open live fares and routes. Prices are shown on partner sites.
      </p>
      <div className="origin-row">
        <input
          placeholder="Starting city or address"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
        />
        <button className="ghost-btn" onClick={useMyLocation} type="button">
          Use my location
        </button>
      </div>
      {geoError && <div className="form-error">{geoError}</div>}
      <div className="travel-grid">
        <div className="travel-card">
          <span>Flight</span>
          <strong>Best fares</strong>
          {flightUrl && (
            <a className="ghost-btn full-width" href={flightUrl} target="_blank" rel="noreferrer">
              Check flights
            </a>
          )}
        </div>
        <div className="travel-card">
          <span>Train / Bus</span>
          <strong>Transit routes</strong>
          {directionsUrl("transit") && (
            <a
              className="ghost-btn full-width"
              href={directionsUrl("transit")}
              target="_blank"
              rel="noreferrer"
            >
              Open transit routes
            </a>
          )}
        </div>
        <div className="travel-card">
          <span>Drive</span>
          <strong>Road trip</strong>
          {directionsUrl("driving") && (
            <a
              className="ghost-btn full-width"
              href={directionsUrl("driving")}
              target="_blank"
              rel="noreferrer"
            >
              Open driving route
            </a>
          )}
        </div>
      </div>
      <div className="muted">Estimated on-ground distance in itinerary: {totalKm.toFixed(0)} km.</div>
    </section>,
    ...(Array.isArray(trip.nearby_cities) && trip.nearby_cities.length > 0
      ? [
          <section className="section-card premium-card" key="nearby">
            <h4>Nearby city add-ons (within 20 km)</h4>
            <p className="muted">
              {Number(trip.duration) > 3
                ? "If you finish early, these nearby spots fit the remaining days."
                : "Quick extensions if you want a short add-on."}
            </p>
            <div className="nearby-list">
              {trip.nearby_cities.map((city) => (
                <div key={city.name} className="nearby-row">
                  <div>
                    <strong>{city.name}</strong>
                    <span>{city.distance_km} km away</span>
                  </div>
                  <a
                    className="ghost-btn"
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(city.name)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Map
                  </a>
                </div>
              ))}
            </div>
          </section>
        ]
      : []),
    <section className="section-card premium-card" key="budget">
      <h4>Budget breakdown</h4>
      <div className="budget-list">
        {dailyTotals.map((value, index) => (
          <div className="budget-row" key={`day-${index}`}>
            <span>Day {index + 1}</span>
            <strong>INR {value || "-"}</strong>
          </div>
        ))}
      </div>
      <div className="budget-total">
        <span>Calculated total</span>
        <strong>INR {calculatedTotal || "-"}</strong>
      </div>
      <div className="budget-total muted">Model estimate: INR {trip.estimated_total_trip_budget_inr}</div>
    </section>,
    <Wishlist key="wishlist" userId={storedUser?.user?._id} city={trip.destination} />,
    <ChatHistory key="history" userId={storedUser?.user?._id} />
  ];

  const leftCards = cards.filter((_, index) => index % 2 === 0);
  const rightCards = cards.filter((_, index) => index % 2 === 1);

  return (
    <div className="page">
      <Navbar userName={storedUser?.user?.name} />
      <div className="page-content">
        <section className="itinerary-hero">
          <div>
            <span className="hero-tag">Itinerary</span>
            <h2>{trip.destination}</h2>
            <p>
              {durationLabel} · {trip.travel_style} · {trip.budget_level}
            </p>
            {meta && (
              <div className="tag-row">
                {meta.collaboration && (
                  <span className="badge">Collaboration: {meta.collaboration}</span>
                )}
                {meta.travel_companion && (
                  <span className="badge">Companion: {meta.travel_companion}</span>
                )}
                {meta.checkin_date && meta.checkout_date && (
                  <span className="badge">
                    Dates: {meta.checkin_date} to {meta.checkout_date}
                  </span>
                )}
                {meta.destination_options?.length > 1 && (
                  <span className="badge">Options: {meta.destination_options.join(" · ")}</span>
                )}
              </div>
            )}
          </div>
          <div className="budget-card">
            <span>Total estimate</span>
            <strong>INR {trip.estimated_total_trip_budget_inr}</strong>
          </div>
        </section>

        <div className="itinerary-grid">
          <div className="itinerary-column">{leftCards}</div>
          <div className="side-column">{rightCards}</div>
        </div>
      </div>
    </div>
  );
}
