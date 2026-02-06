
// src/components/NavBar.jsx
import { useCallback, useEffect, useRef, useState } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/navbar.css";

// If you already have useAuth() context, use that.
// Fallback: read token/email/role from localStorage.
let externalUseAuth;
try {
  externalUseAuth = require("../pages/authentication/MonsterAuth").useAuth;
} catch (_) {}

function useAuthSafe() {
  if (externalUseAuth) return externalUseAuth();

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });
  const navigate = useNavigate();

  useEffect(() => {
    const sync = () => {
      try {
        setUser(JSON.parse(localStorage.getItem("user") || "null"));
      } catch {
        setUser(null);
      }
    };
    const onAuth = (e) => setUser(e.detail);

    window.addEventListener("storage", sync);
    window.addEventListener("authChange", onAuth);
    const id = setInterval(sync, 500);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("authChange", onAuth);
      clearInterval(id);
    };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    setUser(null);
    window.dispatchEvent(new CustomEvent("authChange", { detail: null }));
    navigate("/login", { replace: true });
  }, [navigate]);

  return { user, logout, setUser };
}

/* ────────────────────────────────────────────── */

export default function NavBar() {
  const { user, logout, setUser } = useAuthSafe();
  const navigate = useNavigate();
  const loc = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const dropdownRef = useRef(null);
  const profileRef = useRef(null);

  // Close everything on route change
  useEffect(() => {
    setMobileOpen(false);
    setToolsOpen(false);
    setProfileOpen(false);
  }, [loc.pathname]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setToolsOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setToolsOpen(false);
        setProfileOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Child auth info
  let childAuth = null;
  try {
    childAuth = JSON.parse(localStorage.getItem("childAuth") || "null");
  } catch {
    childAuth = null;
  }
  const initial =
    childAuth?.child?.name?.[0]?.toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    "🙂";

  const closeMobile = () => setMobileOpen(false);

  const handleLogout = () => {
    if (childAuth) {
      try { localStorage.removeItem("childAuth"); } catch {}
      try { localStorage.removeItem("user"); } catch {}
      window.dispatchEvent(new CustomEvent("authChange", { detail: null }));
      setUser?.(null);
      navigate("/login", { replace: true });
      return;
    }
    logout();
  };

  return (
    <>
      {/* Backdrop overlay for mobile drawer */}
      <div
        className={`ls-overlay ${mobileOpen ? "visible" : ""}`}
        onClick={closeMobile}
        aria-hidden="true"
      />

      <header className="ls-nav">
        <div className="ls-nav-inner">
          {/* ── Left: burger + brand ── */}
          <div className="ls-left">
            <button
              className={`ls-burger ${mobileOpen ? "open" : ""}`}
              aria-label="Toggle navigation"
              onClick={() => setMobileOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
            <Link className="ls-brand" to="/" onClick={closeMobile}>
              LittleStars
            </Link>
          </div>

          {/* ── Centre: nav links ── */}
          <nav
            className={`ls-links ${mobileOpen ? "open" : ""}`}
            aria-label="Main navigation"
          >
            <NavLink className="ls-link" to="/" onClick={closeMobile}>
              Home
            </NavLink>
            <NavLink className="ls-link" to="/blogs" onClick={closeMobile}>
              Blogs
            </NavLink>

            {/* Therapy Tools dropdown */}
            <div
              className={`ls-dropdown ${toolsOpen ? "open" : ""}`}
              ref={dropdownRef}
            >
              <button
                className="ls-dropbtn"
                aria-haspopup="true"
                aria-expanded={toolsOpen}
                onClick={() => setToolsOpen((v) => !v)}
              >
                Therapy Tools
                <svg viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M5 7l5 6 5-6" />
                </svg>
              </button>

              <div className="ls-menu" role="menu">
                <Link className="ls-item" role="menuitem" to="/lesson" onClick={closeMobile}>
                  Emotion Simulator
                </Link>
                <Link className="ls-item" role="menuitem" to="/speech-home" onClick={closeMobile}>
                  Speech Therapy Tool
                </Link>
                <Link className="ls-item" role="menuitem" to="/routine" onClick={closeMobile}>
                  Routine Builder
                </Link>
                <Link className="ls-item" role="menuitem" to="/games" onClick={closeMobile}>
                  Interactive Games
                </Link>
                <Link className="ls-item" role="menuitem" to="/virtualNursery" onClick={closeMobile}>
                  Virtual Nursery
                </Link>
              </div>
            </div>
          </nav>

          {/* ── Right: auth area ── */}
          <div className="ls-auth">
            {!user ? (
              <div className="ls-auth-cta">
                <Link className="ls-login" to="/login">
                  Login
                </Link>
                <Link className="ls-signup" to="/signup">
                  Sign up
                </Link>
              </div>
            ) : (
              <div
                className={`ls-profile ${profileOpen ? "open" : ""}`}
                ref={profileRef}
              >
                <button
                  className="ls-avatar"
                  aria-haspopup="true"
                  aria-expanded={profileOpen}
                  onClick={() => setProfileOpen((v) => !v)}
                  title={childAuth?.child?.name || user?.email}
                >
                  {initial}
                </button>

                <div className="ls-profile-menu" role="menu">
                  <div className="ls-profile-info">
                    <div className="ls-email">
                      {childAuth?.child?.name || user?.email}
                    </div>
                    <div className="ls-role">
                      {childAuth ? "child" : user?.role}
                    </div>
                  </div>
                  <Link className="ls-item" role="menuitem" to="/profile">
                    Profile
                  </Link>
                  <button
                    className="ls-item danger"
                    role="menuitem"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
