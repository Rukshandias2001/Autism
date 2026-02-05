import React, { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { API_BASE } from "../../api/http";
import "../../styles/authenticationStyles/profile.css";

export default function Profile() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const parentAuth = JSON.parse(localStorage.getItem("user") || "null");
      const childAuth = JSON.parse(localStorage.getItem("childAuth") || "null");
      const token = parentAuth?.token ?? childAuth?.token;
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/api/users/change-password`, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const text = await res.text();
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (parseErr) {
        data = { message: text };
      }

      if (!res.ok) {
        const serverMsg = data?.message || `Request failed with status ${res.status}`;
        throw new Error(serverMsg);
      }

      setMessage(data?.message || "Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      if (err.name === "TypeError") {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError(err.message || "An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-content profile-page">
      <div className="hero-card profile-card">
        <div className="profile-header">
          <div className="profile-title">
            <h2>Profile</h2>
            <div className="profile-subtitle">Manage your account settings</div>
          </div>
          <div className="profile-meta">
            <div className="chip ghost">{user?.email || "User"}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <label className="profile-field">
            <div className="profile-field-label">Current Password</div>
            <input
              className="profile-input"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </label>

          <label className="profile-field">
            <div className="profile-field-label">New Password</div>
            <input
              className="profile-input"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
            />
          </label>

          <label className="profile-field">
            <div className="profile-field-label">Confirm New Password</div>
            <input
              className="profile-input"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>

          <div className="profile-actions">
            <button type="submit" className="chip profile-btn-primary">
              {loading ? "Saving..." : "Change Password"}
            </button>
            <button
              type="button"
              className="chip ghost"
              onClick={() => {
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setError(null);
                setMessage(null);
              }}
            >
              Reset
            </button>
            {error && <div className="profile-error">{error}</div>}
            {message && <div className="profile-success">{message}</div>}
          </div>
        </form>
      </div>
    </div>
  );
}
