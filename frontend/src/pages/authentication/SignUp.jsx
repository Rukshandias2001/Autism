import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Lottie from "lottie-react";
import { AuthAPI } from "../../api/http";
import { useAuth } from "../../auth/AuthContext";
import tigerAnimation from "../../assets/animations/tiger.json";
import "../../styles/authenticationStyles/auth.css";

export default function SignUp() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        role: "parent"
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { loginAs } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(""); // Clear error on typing
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");

        // Validation
        if (!formData.email || !formData.password || !formData.confirmPassword) {
            setError("Please fill in all the magic boxes!");
            return;
        }
        if (formData.password.length < 6) {
            setError("Your secret password needs to be longer (at least 6 characters).");
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError("The passwords don't match! Try again.");
            return;
        }

        try {
            setLoading(true);
            const user = await AuthAPI.signup({
                email: formData.email,
                password: formData.password,
                role: formData.role
            });

            // Login immediately
            loginAs(user);
            localStorage.setItem("user", JSON.stringify(user));

            try {
                localStorage.removeItem("childAuth");
                localStorage.removeItem("currentChild");
                window.dispatchEvent(new CustomEvent("authChange", { detail: user }));
            } catch { }

            if (user.role === "parent") {
                navigate("/routines");
            } else {
                navigate("/mentor/reports");
            }
        } catch (err) {
            console.error(err);
            if (err?.response?.status === 409) {
                setError("This email is already on an adventure! Try logging in.");
            } else {
                setError("Something went wrong with the magic. Please try again!");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="sparkles" />

            <div className="auth-card">
                {/* Left Side - Tiger Animation */}
                <div className="auth-visual">
                    <div className="lottie-wrap">
                        <Lottie animationData={tigerAnimation} loop={true} />
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="auth-form-side">
                    <h1 className="auth-title">Join the Fun!</h1>
                    <p className="auth-subtitle">Create your magical account</p>

                    {error && <div className="global-error">{error}</div>}

                    <form onSubmit={handleSignup}>
                        <div className="form-group">
                            <input
                                name="email"
                                type="email"
                                className="input-field"
                                placeholder="Magic Email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <input
                                name="password"
                                type="password"
                                className="input-field"
                                placeholder="Secret Password (min 6 chars)"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <input
                                name="confirmPassword"
                                type="password"
                                className="input-field"
                                placeholder="Confirm Secret Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="role-group">
                            <input
                                type="radio"
                                id="role-parent"
                                name="role"
                                value="parent"
                                className="role-radio"
                                checked={formData.role === "parent"}
                                onChange={handleChange}
                            />
                            <label htmlFor="role-parent" className="role-label">Parent</label>

                            <input
                                type="radio"
                                id="role-mentor"
                                name="role"
                                value="mentor"
                                className="role-radio"
                                checked={formData.role === "mentor"}
                                onChange={handleChange}
                            />
                            <label htmlFor="role-mentor" className="role-label">Mentor</label>
                        </div>

                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? "Creating Magic..." : "Start Adventure!"}
                        </button>
                    </form>

                    <div className="auth-link">
                        Already have an account? <Link to="/login">Log In Here</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}