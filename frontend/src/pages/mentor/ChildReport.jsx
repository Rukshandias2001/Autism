// src/pages/mentor/ChildReport.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ReportsAPI, ChildrenAPI } from "../../api/http";
import "../../styles/mentor/ChildReport.css";

export default function ChildReport() {
  const { childId } = useParams();
  const [child, setChild] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [reportData] = await Promise.all([
          ReportsAPI.getChildReport(childId),
        ]);
        setReport(reportData);
        // Child info might be included in report or fetched separately
        if (reportData.child) {
          setChild(reportData.child);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load report data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [childId]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEmotionEmoji = (emotion) => {
    const emojis = {
      happy: "😊",
      sad: "😢",
      angry: "😠",
      surprised: "😲",
      fearful: "😨",
      disgusted: "🤢",
      neutral: "😐",
    };
    return emojis[emotion?.toLowerCase()] || "🎭";
  };

  const getPassRateColor = (rate) => {
    if (rate >= 0.8) return "#10b981";
    if (rate >= 0.5) return "#f59e0b";
    return "#ef4444";
  };

  if (loading) {
    return (
      <div className="report-loading">
        <div className="spinner"></div>
        <p>Loading report...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="report-error">
        <div className="error-icon">⚠️</div>
        <h3>Error Loading Report</h3>
        <p>{error}</p>
        <Link to="/mentor/reports" className="back-link">← Back to Children</Link>
      </div>
    );
  }

  // Check if there's no data at all
  const hasNoData = !report || (
    (!report.overall || report.overall.attempts === 0) &&
    (!report.byEmotion || report.byEmotion.length === 0) &&
    (!report.recent || report.recent.length === 0)
  );

  if (hasNoData) {
    return (
      <div className="child-report">
        <div className="report-header">
          <Link to="/mentor/reports" className="back-link">← Back to Children</Link>
          <div className="header-content">
            <h1>Child Progress Report</h1>
            <p>Detailed statistics and performance metrics</p>
          </div>
        </div>
        
        <div className="no-data-container">
          <div className="no-data-icon">📭</div>
          <h2>No Data Available</h2>
          <p>This child hasn't completed any activities yet.</p>
          <p className="no-data-hint">Data will appear here once they start using the learning modules.</p>
          <Link to="/mentor/reports" className="back-button">← Return to Children List</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="child-report">
      {/* Header */}
      <div className="report-header">
        <Link to="/mentor/reports" className="back-link">← Back to Children</Link>
        <div className="header-content">
          <h1>Child Progress Report</h1>
          <p>Detailed statistics and performance metrics</p>
        </div>
      </div>

      {/* Stats Grid - Games Overview */}
      <div className="stats-grid">
        {/* Emotion Simulator Card */}
        <div className="stat-card emotion-card">
          <div className="card-icon">🎭</div>
          <h2>Emotion Simulator</h2>
          <p className="card-description">Facial expression recognition practice</p>
          
          {report?.overall ? (
            <div className="stat-content">
              <div className="stat-row">
                <div className="stat-item">
                  <span className="stat-value">{report.overall.attempts || 0}</span>
                  <span className="stat-label">Total Attempts</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value" style={{ color: getPassRateColor(report.overall.passRate) }}>
                    {Math.round((report.overall.passRate || 0) * 100)}%
                  </span>
                  <span className="stat-label">Pass Rate</span>
                </div>
              </div>
              <div className="stat-row">
                <div className="stat-item">
                  <span className="stat-value">{(report.overall.avgScore || 0).toFixed(1)}</span>
                  <span className="stat-label">Avg Score</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">⭐ {(report.overall.avgStars || 0).toFixed(1)}</span>
                  <span className="stat-label">Avg Stars</span>
                </div>
              </div>

              {/* Emotion Breakdown */}
              {report.byEmotion && report.byEmotion.length > 0 && (
                <div className="emotion-breakdown">
                  <h3>By Emotion</h3>
                  <div className="emotion-list">
                    {report.byEmotion.map((item) => (
                      <div key={item.emotion} className="emotion-item">
                        <div className="emotion-header">
                          <span className="emotion-emoji">{getEmotionEmoji(item.emotion)}</span>
                          <span className="emotion-name">{item.emotion}</span>
                        </div>
                        <div className="emotion-stats">
                          <span className="attempts">{item.attempts} attempts</span>
                          <span 
                            className="pass-rate"
                            style={{ color: getPassRateColor(item.passRate) }}
                          >
                            {Math.round((item.passRate || 0) * 100)}%
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{ 
                              width: `${(item.passRate || 0) * 100}%`,
                              backgroundColor: getPassRateColor(item.passRate)
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="no-data">
              <p>No practice attempts yet</p>
            </div>
          )}
        </div>

        {/* Speech Therapy Card - Placeholder */}
        <div className="stat-card speech-card">
          <div className="card-icon">🗣️</div>
          <h2>Speech Therapy</h2>
          <p className="card-description">Pronunciation and speech practice</p>
          <div className="coming-soon">
            <div className="coming-soon-icon">📊</div>
            <p>Statistics coming soon</p>
          </div>
        </div>

        {/* Virtual Nursery Card - Placeholder */}
        <div className="stat-card nursery-card">
          <div className="card-icon">🌼</div>
          <h2>Virtual Nursery</h2>
          <p className="card-description">Learning activities and lessons</p>
          <div className="coming-soon">
            <div className="coming-soon-icon">📊</div>
            <p>Statistics coming soon</p>
          </div>
        </div>

        {/* Routine Builder Card - Placeholder */}
        <div className="stat-card routine-card">
          <div className="card-icon">📅</div>
          <h2>Routine Builder</h2>
          <p className="card-description">Daily routine completion</p>
          <div className="coming-soon">
            <div className="coming-soon-icon">📊</div>
            <p>Statistics coming soon</p>
          </div>
        </div>

        {/* Interactive Games Card - Placeholder */}
        <div className="stat-card games-card">
          <div className="card-icon">🎮</div>
          <h2>Interactive Games</h2>
          <p className="card-description">Educational game progress</p>
          <div className="coming-soon">
            <div className="coming-soon-icon">📊</div>
            <p>Statistics coming soon</p>
          </div>
        </div>

        {/* Overall Progress Card - Placeholder */}
        <div className="stat-card overall-card">
          <div className="card-icon">📈</div>
          <h2>Overall Progress</h2>
          <p className="card-description">Combined learning metrics</p>
          <div className="coming-soon">
            <div className="coming-soon-icon">📊</div>
            <p>Statistics coming soon</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {report?.recent && report.recent.length > 0 && (
        <div className="recent-activity">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {report.recent.map((attempt, index) => (
              <div key={attempt._id || index} className="activity-item">
                <div className="activity-icon">
                  {getEmotionEmoji(attempt.emotionName)}
                </div>
                <div className="activity-details">
                  <div className="activity-title">
                    <span className="emotion">{attempt.emotionName}</span>
                    {attempt.scenario && (
                      <span className="scenario">— {attempt.scenario}</span>
                    )}
                  </div>
                  <div className="activity-meta">
                    <span className="score">Score: {attempt.score}</span>
                    <span className="stars">⭐ {attempt.stars}</span>
                    <span className={`status ${attempt.passed ? "passed" : "failed"}`}>
                      {attempt.passed ? "✅ Passed" : "❌ Failed"}
                    </span>
                  </div>
                </div>
                <div className="activity-time">
                  {formatDate(attempt.createdAt)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
