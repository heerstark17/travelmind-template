import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, signup } from "../api";

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const storedUser = useMemo(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  }, []);

  const handleChange = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const submit = async () => {
    setError("");
    setLoading(true);

    try {
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email || "");
      if (!emailValid) {
        setError("Enter a valid email address.");
        setLoading(false);
        return;
      }

      if (mode === "signup") {
        await signup({
          name: form.name,
          email: form.email,
          password: form.password
        });
      }

      const auth = await login({
        email: form.email,
        password: form.password
      });

      localStorage.setItem("user", JSON.stringify(auth));
      navigate("/planner");
    } catch (err) {
      setError(err?.response?.data?.error || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const quickContinue = () => {
    navigate("/planner");
  };

  const logout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };


  return (
    <div className="login-page">
      <div className="login-card">
        <div className="brand-lockup">
          <span className="brand-tag">TravelMind</span>
          <h1>Plan like a local, travel like a curator.</h1>
          <p>
            AI-assisted itineraries with real distances, hidden gems, and
            grounded budgets.
          </p>
        </div>

        <div className="mode-switch">
          <button
            className={mode === "login" ? "pill active" : "pill"}
            onClick={() => setMode("login")}
            type="button"
          >
            Log in
          </button>
          <button
            className={mode === "signup" ? "pill active" : "pill"}
            onClick={() => setMode("signup")}
            type="button"
          >
            Sign up
          </button>
        </div>

        {mode === "signup" && (
          <input
            placeholder="Name"
            value={form.name}
            onChange={handleChange("name")}
          />
        )}

        <input
          placeholder="Email"
          value={form.email}
          onChange={handleChange("email")}
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange("password")}
        />

        {error && <div className="form-error">{error}</div>}

        <button
          onClick={submit}
          className="primary-btn"
          disabled={loading}
        >
          {loading ? "Working..." : mode === "signup" ? "Create account" : "Log in"}
        </button>

        {storedUser && (
          <div className="quick-actions">
            <button className="ghost-btn" onClick={quickContinue} type="button">
              Continue as {storedUser.user?.name || "traveler"}
            </button>
            <button className="link-btn" onClick={logout} type="button">
              Log out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
