// src/pages/authentication/MonsterAuth.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthAPI } from "../../api/http";
import "../../styles/authenticationStyles/monster-auth.css";
import { useAuth } from "../../auth/AuthContext";

// Put your witch image here:
// Example: src/assets/auth/witch.png
import witchImg from "../../assets/2.png";

export default function MonsterAuth() {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [vibe, setVibe] = useState("ok"); // "ok" | "error"
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [remember] = useState(true);
  const { loginAs } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "parent",
  });

  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState("");

  const nav = useNavigate();
  useLocation();

  // Yellow = login, Green = signup, Red = wrong login
  const theme =
    mode === "signup"
      ? "theme-green2"
      : vibe === "error"
      ? "theme-red2"
      : "theme-yellow2";

  function validateField(name, value, wholeForm, currentMode) {
    switch (name) {
      case "email":
        if (!value) return "Email is required.";
        if (!/\S+@\S+\.\S+/.test(value)) return "Enter a valid email address.";
        return "";
      case "password":
        if (!value) return "Password is required.";
        if (value.length < 6) return "Password must be at least 6 characters.";
        if (
          currentMode === "signup" &&
          wholeForm.confirmPassword &&
          value !== wholeForm.confirmPassword
        )
          return "Passwords do not match.";
        return "";
      case "confirmPassword":
        if (currentMode === "signup") {
          if (!value) return "Please confirm your password.";
          if (value !== wholeForm.password) return "Passwords do not match.";
        }
        return "";
      case "role":
        if (currentMode === "signup" && !["parent", "mentor"].includes(value))
          return "Please select a role.";
        return "";
      default:
        return "";
    }
  }

  function validateForm(currentMode, data) {
    const e = {};
    e.email = validateField("email", data.email, data, currentMode);
    e.password = validateField("password", data.password, data, currentMode);
    if (currentMode === "signup") {
      e.confirmPassword = validateField(
        "confirmPassword",
        data.confirmPassword,
        data,
        currentMode
      );
      e.role = validateField("role", data.role, data, currentMode);
    }
    Object.keys(e).forEach((k) => !e[k] && delete e[k]);
    return e;
  }

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;

    setForm((s) => ({ ...s, [name]: val }));

    setErrors((prev) => {
      const next = { ...prev };
      const { [name]: _ignored, ...rest } = next;
      const single = validateField(name, val, { ...form, [name]: val }, mode);
      return { ...rest, ...(single ? { [name]: single } : {}) };
    });

    if (vibe === "error") setVibe("ok");
    if (banner) setBanner("");
  }

  async function saveAndGo(user) {
    const store = remember ? localStorage : sessionStorage;
    store.setItem("user", JSON.stringify(user));

    try {
      localStorage.removeItem("childAuth");
      localStorage.removeItem("currentChild");
      window.dispatchEvent(new CustomEvent("authChange", { detail: user }));
    } catch {}

    if (user.role === "parent") return nav("/routines", { replace: true });
    return nav("/mentor/reports", { replace: true });
  }

  // auto redirect if already logged in
  useEffect(() => {
    const stored = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (!stored) return;

    try {
      const user = JSON.parse(stored);
      if (user?.role) saveAndGo(user);
    } catch {
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submitSignup(e) {
    e.preventDefault();
    setBanner("");
    const found = validateForm("signup", form);
    setErrors(found);
    if (Object.keys(found).length) return;

    try {
      setLoading(true);
      const user = await AuthAPI.signup({
        email: form.email,
        password: form.password,
        role: form.role,
      });

      loginAs(user);
      await saveAndGo(user);
    } catch (err) {
      const status = err?.response?.status;

      if (status === 409) {
        setMode("login");
        setVibe("ok");
        setErrors({});
        setBanner("That email is already registered. Please log in.");
        return;
      }

      const card = document.querySelector(".card20");
      card?.classList.add("shake");
      setTimeout(() => card?.classList.remove("shake"), 420);
      setBanner("Hmm… the spell failed. Try again!");
    } finally {
      setLoading(false);
    }
  }

  async function submitLogin(e) {
    e.preventDefault();
    setBanner("");
    const found = validateForm("login", form);
    setErrors(found);
    if (Object.keys(found).length) return;

    try {
      setLoading(true);
      const user = await AuthAPI.login({
        email: form.email,
        password: form.password,
      });

      loginAs(user);
      await saveAndGo(user);
    } catch {
      setVibe("error");
      const card = document.querySelector(".card20");
      card?.classList.add("shake");
      setTimeout(() => card?.classList.remove("shake"), 420);
      setBanner("Wrong! Try again.");
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = mode === "login" ? submitLogin : submitSignup;

  const canSubmit = useMemo(() => {
    return (
      !loading &&
      !Object.keys(validateForm(mode, form)).length &&
      form.email &&
      form.password &&
      (mode === "login" || (form.confirmPassword && form.role))
    );
  }, [loading, mode, form]);

  return (
    <div className={`auth-wrap2 witchy-rain ${theme}`}>
      {/* Rain overlays */}
      {/* <div className="rain-layer" />
      <div className="rain-layer r2" /> */}

      {/* Soft floating particles */}
      <div className="sparkles" />

      <div className="sky9">
        <div className="panel2 panel2-grid">
          {/* LEFT: Witch image */}
          <div className="scene-left">
            <header className="heading2 heading2-left">
              <h1>{mode === "signup" ? "Join the magic," : "Welcome back,"}</h1>
              <p>
                {mode === "signup"
                  ? "create your account and step into the rain."
                  : "log in and continue your little adventure."}
              </p>
            </header>

            <div className={`witch-pic-wrap ${vibe === "error" ? "witch-angry" : ""}`}>
              <img className="witch-pic" src={witchImg} alt="Witch" />
              {/* Angry glow ring (only when wrong login) */}
              <div className="witch-glow-ring" />
            </div>

            <div className="scene-caption">
              🌧️ Cozy vibes • ✨ Pastel magic • 😡 Wrong login = angry glow
            </div>
          </div>

          {/* RIGHT: Form */}
          <div className="scene-right">
            <form className="card20" onSubmit={onSubmit} autoComplete="on" noValidate>
              <div className="tabs20">
                <button
                  type="button"
                  className={mode === "login" ? "active" : ""}
                  onClick={() => {
                    setMode("login");
                    setVibe("ok");
                    setErrors({});
                    setBanner("");
                  }}
                >
                  Login
                </button>
                <button
                  type="button"
                  className={mode === "signup" ? "active" : ""}
                  onClick={() => {
                    setMode("signup");
                    setVibe("ok");
                    setErrors({});
                    setBanner("");
                  }}
                >
                  Sign up
                </button>
              </div>

              {banner && <div className="banner2">{banner}</div>}

              <label className="input2">
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={onChange}
                  aria-invalid={!!errors.email}
                />
              </label>
              {errors.email && <div className="field-error">{errors.email}</div>}

              <label className="input2 input2-password">
                <input
                  name="password"
                  type={showPw ? "text" : "password"}
                  placeholder="Password (min 6)"
                  value={form.password}
                  onChange={onChange}
                  aria-invalid={!!errors.password}
                />
                <button
                  className="pw-toggle"
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </label>
              {errors.password && <div className="field-error">{errors.password}</div>}

              {mode === "signup" && (
                <>
                  <label className="input2">
                    <input
                      name="confirmPassword"
                      type={showPw ? "text" : "password"}
                      placeholder="Confirm password"
                      value={form.confirmPassword}
                      onChange={onChange}
                      aria-invalid={!!errors.confirmPassword}
                    />
                  </label>
                  {errors.confirmPassword && (
                    <div className="field-error">{errors.confirmPassword}</div>
                  )}

                  <div className="role-row">
                    <label>
                      <input
                        type="radio"
                        name="role"
                        value="parent"
                        checked={form.role === "parent"}
                        onChange={onChange}
                      />{" "}
                      Parent
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="role"
                        value="mentor"
                        checked={form.role === "mentor"}
                        onChange={onChange}
                      />{" "}
                      Mentor
                    </label>
                  </div>
                  {errors.role && <div className="field-error">{errors.role}</div>}
                </>
              )}

              {vibe === "error" && mode === "login" && (
                <div className="error2">Oops! Email or password is incorrect.</div>
              )}

              <button className="go20" type="submit" disabled={!canSubmit}>
                {loading ? "..." : mode === "signup" ? "Create" : "Enter"}
              </button>

              <div className="tiny-hint">
                Yellow = login • Green = signup • Red = wrong login
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}