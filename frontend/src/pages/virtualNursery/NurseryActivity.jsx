import { Link , useParams } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import "../../styles/virtualNurseyStyles/NurseryActivity.css";

import learnBG from "../../assets/nbg5.png";
import activityBG from "../../assets/nbg4.png";

export default function NurseryActivity() {
  const { category } = useParams(); 
  const handleBack = () => window.history.back();
  const { user } = useAuth();
  const childAuthRaw = typeof window !== "undefined" ? localStorage.getItem("childAuth") : null;
  const hasChildAuth = !!childAuthRaw;
  const isChild = (user && user.role === "child") || hasChildAuth;

  return (
    <main className="nursery-activity-page">
      <button
        className="nursery-back-button"
        onClick={handleBack}
        aria-label="Go back"
      >
         Back
      </button>

      <section className="activity-card">
        <header className="activity-header">
          <h1>Choose your option</h1>
          <p className="activity-sub">Pick how you want to continue</p>
        </header>

        <div className="tiles">
          {/* LEARN */}
          <Link
            to={`/nursery/${category}/learn`} 
            className="tile"
            style={{ "--tile-bg": `url(${learnBG})` }}
            aria-label="Go to Learn"
          >
            <span className="tile-icon" aria-hidden>
              📖
            </span>
            <span className="tile-title">Learn</span>
            <span className="tile-desc">Lessons & practice</span>
          </Link>

          {/* ACTIVITY */}
          {isChild ? (
            <Link
              to={`/nursery/${category}/activity-mode`}
              className="tile"
              style={{ "--tile-bg": `url(${activityBG})` }}
              aria-label="Go to Activity"
            >
              <span className="tile-icon" aria-hidden>
                🎮
              </span>
              <span className="tile-title">Activity</span>
              <span className="tile-desc">Play & explore</span>
            </Link>
          ) : (
            <div
              className="tile disabled"
              title="Only children can access activities"
              aria-hidden
              style={{ "--tile-bg": `url(${activityBG})` }}
            >
              <span className="tile-icon" aria-hidden>
                🎮
              </span>
              <span className="tile-title">Activity</span>
              <span className="tile-desc">Play & explore</span>
            </div>
          )}
        </div>
      </section>

      {/* cute floating bubbles */}
      <div className="float-bubble b1" />
      <div className="float-bubble b2" />
      <div className="float-bubble b3" />
    </main>
  );
}
