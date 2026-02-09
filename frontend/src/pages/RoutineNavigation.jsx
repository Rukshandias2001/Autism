import { useNavigate } from "react-router-dom";
import "../styles/routine-navigation.css";

export default function RoutineNavigation() {
  const navigate = useNavigate();

  return (
    <div className="routine-navigation-container">
      <div className="routine-navigation-content">
        <header className="routine-navigation-header">
          <div className="logo">
            <span className="logo-icon">⭐</span>
            <h1>Little Stars</h1>
          </div>
          <p className="tagline">Building Better Routines for Happy Families</p>
        </header>

          <div className="navigation-cards">
          <div className="navigation-card parent-card">
            <div className="card-icon">👨‍👩‍👧‍👦</div>
            <h2>For Parents</h2>
            <p>Create routines, manage children, and track their progress</p>
            <div className="card-features">
              <span>✓ Create custom routines</span>
              <span>✓ Register children</span>
              <span>✓ Assign activities</span>
              <span>✓ Monitor progress</span>
            </div>
            <div className="card-actions">
              <button
                className="primary-btn coming-soon"
                disabled
                title="Coming Soon"
                onClick={(e) => e.preventDefault()}
              >
                <span className="lock-icon">🔒</span> Routine Builder
              </button>
              <button 
                className="secondary-btn"
                onClick={() => navigate("/parent/children")}
              >
                Manage Children
              </button>
            </div>
          </div>

          <div className="navigation-card child-card">
            <div className="card-icon">🧒</div>
            <h2>For Children</h2>
            <p>Follow your daily routines with fun timers and step-by-step guidance</p>
            <div className="card-features">
              <span>🎯 Step-by-step guidance</span>
              <span>⏰ Fun timers</span>
              <span>🌟 Earn stars</span>
              <span>🎉 Celebrate achievements</span>
            </div>
            <div className="card-actions">
              <button 
                className="child-btn"
                onClick={() => navigate("/child/login")}
              >
                Child Login 🚀
              </button>
            </div>
          </div>
        </div>

        <div className="routine-navigation-footer">
          <div className="feature-highlights">
            <div className="feature">
              <span className="feature-icon">🎨</span>
              <div>
                <h3>Kid-Friendly Design</h3>
                <p>Colorful, engaging interface designed for children</p>
              </div>
            </div>
            <div className="feature">
              <span className="feature-icon">⏱️</span>
              <div>
                <h3>Timer-Based Activities</h3>
                <p>Each activity has its own timer to keep kids on track</p>
              </div>
            </div>
            <div className="feature">
              <span className="feature-icon">🏆</span>
              <div>
                <h3>Progress Tracking</h3>
                <p>Parents can monitor completion and celebrate success</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="floating-stars">
        <div className="floating-star star-1">⭐</div>
        <div className="floating-star star-2">🌟</div>
        <div className="floating-star star-3">✨</div>
        <div className="floating-star star-4">⭐</div>
        <div className="floating-star star-5">🌟</div>
        <div className="floating-star star-6">✨</div>
      </div>
    </div>
  );
}
