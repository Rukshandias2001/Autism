import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Lottie from "lottie-react";
import { AuthAPI } from "../../api/http";
import { useAuth } from "../../auth/AuthContext";
import dragonAnimation from "../../assets/animations/dragon.json";
import "../../styles/authenticationStyles/auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginAs } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields to start the adventure!");
      return;
    }

    try {
      setLoading(true);
      const user = await AuthAPI.login({ email, password });

      // Save user session
      loginAs(user);
      localStorage.setItem("user", JSON.stringify(user));

      // Clear child session
      try {
        localStorage.removeItem("childAuth");
        localStorage.removeItem("currentChild");
        window.dispatchEvent(new CustomEvent("authChange", { detail: user }));
      } catch { }

      // Navigation
      if (user.role === "parent") {
        navigate("/routines");
      } else {
        navigate("/mentor/reports");
      }
    } catch (err) {
      console.error(err);
      setError("Oops! That magic spell didn't work (Wrong email or password).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="sparkles" />

      <div className="auth-card">
        {/* Left Side - Dragon Animation */}
        <div className="auth-visual">
          <div className="lottie-wrap">
            <Lottie animationData={dragonAnimation} loop={true} />
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="auth-form-side">
          <h1 className="auth-title">Welcome Back!</h1>
          <p className="auth-subtitle">Ready to continue your journey?</p>

          {error && <div className="global-error">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <input
                type="email"
                className={`input-field ${error ? "input-error" : ""}`}
                placeholder="Magic Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                className={`input-field ${error ? "input-error" : ""}`}
                placeholder="Secret Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Casting Spells..." : "Let's Go!"}
            </button>
          </form>

          <div className="auth-link">
            New here? <Link to="/signup">Join the Adventure</Link>
          </div>
        </div>
      </div>
    </div>
  );
}