// src/pages/mentor/MentorDashboard.jsx
import { useNavigate, NavLink, Outlet, useLocation } from "react-router-dom";
import "../../styles/mentor/mentor-dashboard.css";

const FEATURES = [
  { id:"emotion",  title:"Emotion Simulator", emoji:"😊", chip:"Feelings & Faces",  bg:"var(--grad-emotion)" },
  { id:"speech",   title:"Speech Therapy Tool", emoji:"🗣️", chip:"Pronounce & Practice", bg:"var(--grad-speech)" },
  { id:"nursery",  title:"Virtual Nursery", emoji:"🌼", chip:"Playful Lessons", bg:"var(--grad-nursery)" },
  { id:"routine",  title:"Routine Builder", emoji:"📅", chip:"Daily Habits", bg:"var(--grad-routine)", comingSoon: true },
  { id:"games",    title:"Interactive Games", emoji:"🎮", chip:"Learn by Playing", bg:"var(--grad-games)", comingSoon: true },
];

function FeatureCard({ item, onOpen, children }) {
  return (
    <div className={`md-feature ${item.comingSoon ? 'md-feature--locked' : ''}`} style={{ background:item.bg }} role={item.comingSoon ? 'group' : undefined} aria-disabled={item.comingSoon ? true : undefined}>
      <div className="md-feature-top">
        <span className="md-feature-emoji" aria-hidden>{item.emoji}</span>
        <span className="md-feature-chip">{item.comingSoon ? "🔒 Coming soon" : item.chip}</span>
      </div>
      <div className="md-feature-title">{item.title}</div>

      {children ? (
        <div className="md-quick-actions">{children}</div>
      ) : (
        <div className="md-feature-footer">
          {item.comingSoon ? (
            <button className="md-linkbtn md-linkbtn--disabled" disabled aria-disabled>
              🔒 Coming soon
            </button>
          ) : (
            <button className="md-linkbtn" onClick={onOpen}>
              Open
              <svg className="md-feature-arrow" viewBox="0 0 24 24" width="20" height="20" aria-hidden>
                <path d="M8 5l8 7-8 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>
      )}

      <div className="md-sparkles" aria-hidden><span>★</span><span>✦</span><span>✶</span></div>
    </div>
  );
}

export default function MentorDashboard() {
  const nav = useNavigate();
  const location = useLocation();

  // Show dashboard only on the exact /mentor path.
  const isMentorRoot = /^\/mentor\/?$/.test(location.pathname);

  return (
    <div className="md-wrap">
      {/* <header className="md-topbar">
        <div className="md-brand">Mentor</div>
      </header> */}

      <main className="md-main md-main--fullscreen">
        {isMentorRoot ? (
          <>
            {/* Hero */}
            <section className="md-hero md-hero--filled">
              <div className="md-hero-copy">
                <h1 className="md-hero-title">Choose a module</h1>
                <p className="md-hero-sub">Everything else stays on the same routes you already have.</p>
                <div className="md-hero-badges">
                  <span className="md-badge">Kid-friendly</span>
                  <span className="md-badge">Low overstimulation</span>
                  <span className="md-badge">Mentor tools inside</span>
                </div>
              </div>
              <div className="md-hero-art" aria-hidden>
                <svg viewBox="0 0 120 60" className="md-cloud">
                  <path d="M20 40c0-8 7-14 15-14 3-8 11-14 20-14 11 0 20 8 21 18 8 0 14 6 14 12 0 6-5 11-11 11H26c-9 0-16-6-16-13z" />
                </svg>
                <div className="md-mascot" title="hello!">🧸</div>
              </div>
              <div className="md-blob md-blob-a" />
              <div className="md-blob md-blob-b" />
            </section>

            {/* Feature tiles */}
            <section className="md-section">
              <div className="md-feature-grid">
                {/* Emotion → mentor routes */}
                <FeatureCard item={FEATURES[0]}>
                  <div className="md-quick-col">
                    <NavLink to="/mentor/scenarios" className="md-linkbtn">Open Scenarios ▸</NavLink>
                    <button onClick={() => nav("/mentor/reports")} className="md-linkbtn">Open Reports ▸</button>
                    <button onClick={() => nav("/mentor/content")} className="md-linkbtn">Open Content ▸</button>
                  </div>
                </FeatureCard>

                {/* Speech */}
                <FeatureCard item={FEATURES[1]} onOpen={() => nav("/mentor/speech")} />

                {/* Nursery → Alphabet Learn (top-level /alphabets) */}
                <FeatureCard item={FEATURES[2]}>
                  <div className="md-quick-col">
                    {/* <button onClick={() => nav("/alphabets")} className="md-linkbtn">Alphabet Learn ▸</button> */}
                    
                  <button onClick={() => nav("/nursery/alphabets/learn")} className="md-linkbtn">Nursery ▸ Alphabet</button>
                  <button onClick={()=>nav("/nursery/numbers/learn")} className="md-linkbtn">Nursery ▸ Numbers</button>
                  <button onClick={()=>nav("/nursery/shapes/learn")} className="md-linkbtn">Nursery ▸ Shapes</button>
                  <button onClick={()=>nav("/nursery/colors/learn")} className="md-linkbtn">Nursery ▸ Colors</button>
                  <button onClick={()=>nav("/nursery/animals/learn")} className="md-linkbtn">Nursery ▸ Animals</button>
                  <button onClick={()=>nav("/nursery/fruits/learn")} className="md-linkbtn">Nursery ▸ Fruits</button>
                  <button onClick={()=>nav("/nursery/vegetables/learn")} className="md-linkbtn">Nursery ▸ Vegetables</button>
                  
                  </div>
                </FeatureCard>

                {/* Routine */}
                <FeatureCard item={FEATURES[3]} />

                {/* Games */}
                <FeatureCard item={FEATURES[4]} />
              </div>
            </section>

            {/* Helpful strip */}
            <section className="md-help-strip">
              <div className="md-help-card">
                <div className="md-help-title">Quick tips</div>
                <ul className="md-help-list">
                  <li>Keep sessions 5–8 minutes for better focus.</li>
                  <li>Use gentle voice and celebrate small wins 🎉</li>
                  <li>Repeat activities rather than extending time.</li>
                </ul>
              </div>
              <div className="md-help-card">
                <div className="md-help-title">Shortcuts</div>
                <div className="md-shortcuts">
                  <button onClick={() => nav("/mentor/reports")}>Emotion ▸ Reports</button>
                  <button onClick={() => nav("/alphabets")}>Nursery ▸ Alphabet</button>
                  <button onClick={() => nav("/mentor/progress/123")}>Demo ▸ Progress</button>
                </div>
              </div>
              <div className="md-help-card md-help-safe">
                <div className="md-help-title">Calm & safe</div>
                <p className="md-help-note">
                  No flashing colors or loud surprise sounds by default. You can adjust intensity inside modules.
                </p>
              </div>
            </section>
          </>
        ) : (
          /* Child page mode: looks like a separate page */
          <section className="md-subpage-wrap">
            <button className="md-back" onClick={() => nav("/mentor")}>← Back to Mentor Home</button>
            <div className="md-subpage">
              <Outlet />
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
