import { useNavigate } from "react-router-dom";

export default function Navbar({ userName }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    document.cookie = "tripsera_user=; path=/; max-age=0";
    navigate("/");
  };

  return (
    <nav className="travel-nav">
      <div className="nav-shell">
        <button className="brand" onClick={() => navigate("/planner")} type="button">
          <span className="brand-logo">TE</span>
          Trips-era
        </button>
        <div className="nav-actions">
          {userName && <span className="user-pill">Hello, {userName}</span>}
          <button className="ghost-btn" onClick={() => navigate("/planner")} type="button">
            Planner
          </button>
          <button className="ghost-btn" onClick={() => navigate("/dashboard")} type="button">
            Dashboard
          </button>
          <button className="ghost-btn" onClick={logout} type="button">
            Log out
          </button>
        </div>
      </div>
    </nav>
  );
}
