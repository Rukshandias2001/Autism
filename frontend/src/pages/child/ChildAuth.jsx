import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChildAuthAPI } from "../../api/http"; // Ensure this path matches your project structure
import "../../styles/child/child-auth.css";

export default function ChildAuth() {
  const [form, setForm] = useState({ username: "", pin: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Protect route: Ensure parent is logged in
  useEffect(() => {
    try {
      const parent = JSON.parse(localStorage.getItem("user") || "null");
      if (!parent) {
        navigate("/login", { replace: true });
        return;
      }
      if (parent.role === "mentor") {
        navigate("/", { replace: true });
        return;
      }
    } catch (e) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.pin.trim()) {
      setError("Please enter both username and PIN");
      return;
    }

    setLoading(true);
    try {
      const response = await ChildAuthAPI.login({
        username: form.username.trim(),
        pin: form.pin.trim(),
      });

      // Store auth data
      localStorage.setItem("childAuth", JSON.stringify({
        token: response.token,
        child: response.child,
        username: response.username,
        theme: response.theme,
      }));
      localStorage.setItem("currentChild", JSON.stringify({ _id: response.child.id }));
      
      navigate("/child/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  // PIN Pad Logic
  const handlePinInput = (digit) => {
    if (form.pin.length < 6) {
      setForm((prev) => ({ ...prev, pin: prev.pin + digit }));
      if (error) setError("");
    }
  };

  const handlePinBackspace = () => {
    setForm((prev) => ({ ...prev, pin: prev.pin.slice(0, -1) }));
  };

  return (
    <div className="child-auth-container">
      {/* Background Animated Stars */}
      <div className="floating-stars">
        <div className="star star-1">⭐</div>
        <div className="star star-2">🌟</div>
        <div className="star star-3">✨</div>
        <div className="star star-4">⭐</div>
        <div className="star star-5">🌟</div>
      </div>

      <div className="child-auth-card">
        <div className="child-auth-header">
          <div className="star-icon">⭐</div>
          <h1>Little Stars</h1>
          <p>Login to see your routines!</p>
        </div>

        <form onSubmit={handleSubmit} className="child-auth-form">
          {/* Username Input */}
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              className="child-input"
              placeholder="Enter your username"
              value={form.username}
              onChange={handleChange}
              disabled={loading}
              autoComplete="off"
            />
          </div>

          {/* PIN Display */}
          <div className="form-group">
            <label>PIN</label>
            <div className="pin-display">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={`pin-dot ${i < form.pin.length ? "filled" : ""}`}
                />
              ))}
            </div>
          </div>

          {/* Numeric Keypad */}
          <div className="pin-keypad">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                type="button"
                key={num}
                className="pin-key"
                onClick={() => handlePinInput(num)}
                disabled={loading || form.pin.length >= 6}
              >
                {num}
              </button>
            ))}
            <div className="pin-key-spacer"></div> {/* Empty slot for alignment */}
            <button
              type="button"
              className="pin-key"
              onClick={() => handlePinInput(0)}
              disabled={loading || form.pin.length >= 6}
            >
              0
            </button>
            <button
              type="button"
              className="pin-key backspace-key"
              onClick={handlePinBackspace}
              disabled={loading || form.pin.length === 0}
            >
              ⌫
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="child-login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Let's Go! 🚀"}
          </button>
        </form>

        <div className="child-auth-footer">
          <p>Ask your parent to help if you forgot your login!</p>
          <button onClick={() => navigate("/parent-login")} className="parent-login-link">
            Parent Login
          </button>
        </div>
      </div>
    </div>
  );
}
