import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../auth/AuthContext";
import LearnLayout from "./LearnLayout";
import "../../../styles/virtualNurseyStyles/LearnPage.css";
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player";

const MAX_VIDEOS = 5;

function getId(v) {
  return v?._id || v?.id || "";
}
function isYouTubeOrVimeo(url = "") {
  return /youtube\.com|youtu\.be|vimeo\.com/i.test(url);
}

function normalizeYouTubeUrl(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be"))
      return `https://www.youtube.com/watch?v=${u.pathname.slice(1)}`;
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/watch?v=${v}`;
    }
  } catch {
    return url;
  }
  return url;
}

export default function LearnPage({
  title = "Learn",
  image,
  imageAlt,
  topic: topicProp,
  defaultTopic = "animals",
}) {
  const { user } = useAuth();
  const isMentor = user?.role?.toLowerCase() === "mentor";
  const { topic: topicURL } = useParams();
  const topic = (topicProp || topicURL || defaultTopic).toLowerCase();

  const [videos, setVideos] = useState([]);
  const [currentId, setCurrentId] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", url: "", thumbnail: "" });

  const visible = videos.slice(0, MAX_VIDEOS);
  const canAddMore = videos.length < MAX_VIDEOS;

  useEffect(() => {
    let alive = true;
    setLoading(true);
    axios
      .get(`http://localhost:5050/api/learn/${topic}/videos`)
      .then((res) => {
        if (!alive) return;
        const arr = Array.isArray(res.data) ? res.data : [];
        const trimmed = arr.slice(0, MAX_VIDEOS);
        setVideos(trimmed);
        setCurrentId(getId(trimmed[0]));
      })
      .catch(() => {
        if (!alive) return;
        setVideos([]);
        setCurrentId("");
        setToast("Couldn’t load from server.");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [topic]);

  useEffect(() => {
    if (!videos.length) {
      if (currentId) setCurrentId("");
      return;
    }
    if (!videos.some((v) => getId(v) === currentId)){
     setCurrentId(getId(videos[0]));
    }
  }, [videos, currentId]);

  function openAdd() {
    if (!canAddMore) {
      setToast(`You can add up to ${MAX_VIDEOS} videos only.`);
      return;
    }
    setShowForm(true);
  }

  function closeAdd() {
    setShowForm(false);
    setForm({ title: "", url: "", thumbnail: "" });
  }

  async function onAdd(e) {
    e?.preventDefault?.();

    if (!canAddMore) {
      setToast(`You can add up to ${MAX_VIDEOS} videos only.`);
      return;
    }

    if (!form.title || !form.url) {
      setToast("Title and URL are required.");
      return;
    }

    const normalizedUrl = normalizeYouTubeUrl(form.url);

    if (!isYouTubeOrVimeo(normalizedUrl)) {
      setToast("Please enter a valid YouTube or Vimeo link.");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:5050/api/learn/${topic}/videos`,
        {
          title: form.title,
          url: normalizedUrl,
          thumbnail: form.thumbnail || undefined,
          uploadedBy: user?._id || undefined,
        }
      );

      const saved = res.data;
      setVideos((prev) => {
        const next = [...prev, saved].slice(0, MAX_VIDEOS);
        if (!prev.length) setCurrentId(getId(saved));
        return next;
      });
      setToast("Video added successfully!");
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        (err?.message?.includes("Network Error")
          ? "Network error while adding."
          : "Couldn’t add video.");
      setToast(msg);
    } finally {
      closeAdd();
    }
  }

  const current = videos.find((v) => getId(v) === currentId) || videos[0] || null;

  async function onDelete(id) {
    if (!isMentor || !id) return;
    try {
      await axios.delete(
        `http://localhost:5050/api/learn/${topic}/videos/${id}`
      );
      setVideos((prev) => {
        const next = prev.filter((v) => getId(v) !== id);
        if (currentId === id) {
          setCurrentId(getId(next[0]) || "");
        }
        return next;
      });
      setToast("Video removed 🗑️");
    } catch {
      setToast("Failed to delete on server.");
    }
  }

  return (
    <LearnLayout
      title={title}
      image={image}
      imageAlt={imageAlt || `${title} Chart`}
    >
      {toast && (
        <div
          className="new-al-toast"
          role="status"
          onAnimationEnd={() => setToast("")}
        >
          <span className="new-al-toast-icon">ℹ️</span>
          <span>{toast}</span>
        </div>
      )}

      <div className="new-al-content">
        <section className="new-al-player-section">
        {loading ? (
          <div className="new-al-loading">
              <div className="new-al-spinner"></div>
              <p>Loading videos...</p>
            </div>
        ) : current ? (
          <>
            <div className="new-al-player-wrapper">
                <div className="new-al-player">
              <ReactPlayer
                url={current.url}
                controls
                width="100%"
                height="100%"
                config={{
                      youtube: {
                        playerVars: { modestbranding: 1 }
                      }
                    }}
              />
            </div>
            </div>
            <div className="new-al-player-info">
                <h2 className="new-al-video-title">{current.title || "Untitled Video"}</h2>
                <div className="new-al-video-meta">
                  <span className="new-al-badge">Now Playing</span>
                </div>
              </div>
          </>
        ) : (
          <div className="new-al-empty-state">
              <div className="new-al-empty-icon">🎥</div>
              <h3>No videos available</h3>
              <p>Start by adding your first video!</p>
            </div>
        )}
        </section>
        <section className="new-al-playlist-section">
        <div className="new-al-section-header">
            <h3 className="new-al-section-title">Video Playlist</h3>
            <span className="new-al-video-count">{videos.length} / {MAX_VIDEOS} videos</span>
          </div>

      <div className="new-al-thumbnails-grid">
        {visible.map((v, index) => {
          const vid = getId(v);
           const isActive = currentId === vid;
          return (
            <div
              key={vid || v.title || Math.random()}
              className={`new-al-thumbnail-card ${isActive ? "active" : ""}`}
            >
              <button
                className="new-al-thumbnail-btn"
                onClick={() => vid && setCurrentId(vid)}
                aria-label={`Play ${v.title || "video"}`}
              >
                <div className="new-al-thumbnail-image">
                {v.thumbnail ? (
                 <img
                          src={v.thumbnail}
                          alt={v.title || "thumbnail"}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.nextElementSibling.style.display = "flex";
                          }}
                        />
                ) : null}
                  <div className="new-al-thumbnail-fallback" style={{ display: v.thumbnail ? "none" : "flex" }}>
                        <span>{v.title?.[0]?.toUpperCase() || "?"}</span>
                         </div>
                      {isActive && (
                        <div className="new-al-playing-indicator">
                          <span className="new-al-playing-icon">▶</span>
                      </div>
                )}
                </div>
                <div className="new-al-thumbnail-content">
                      <p className="new-al-thumbnail-title">{v.title || "Untitled"}</p>
                      <span className="new-al-thumbnail-number">Video {index + 1}</span>
                    </div>
              </button>

              {isMentor && vid && (
                <button
                  className="new-al-delete-btn"
                      onClick={() => onDelete(vid)}
                      aria-label={`Delete ${v.title || "video"}`}
                      title="Delete video"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
                      </svg>
                </button>
              )}
            </div>
          );
        })}

        {videos.length < MAX_VIDEOS && (
          <button
              className="new-al-thumbnail-card new-al-add-card"
              onClick={openAdd}
              aria-label="Add new video"
              disabled={!canAddMore}
            >
              <div className="new-al-add-content">
                <div className="new-al-add-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                </div>
                <p className="new-al-add-text">Add Video</p>
                <span className="new-al-add-hint">{canAddMore ? "Click to upload" : "Limit reached"}</span>
              </div>
            </button>
        )}
        </div>
        </section>
      </div>

      {showForm && (
        <div className="new-al-modal-overlay" onClick={closeAdd}>
          <div className="new-al-modal" onClick={(e) => e.stopPropagation()}>
            <div className="new-al-modal-header">
              <h3>
              Add a video ({videos.length}/{MAX_VIDEOS})
            </h3>
              <button
                className="new-al-modal-close"
                onClick={closeAdd}
                aria-label="Close modal"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            
            <form className="new-al-form" onSubmit={onAdd}>
              <div className="new-al-form-group">
                <label htmlFor="video-title">Video Title *</label>
                <input
                  id="video-title"
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
                  placeholder="Enter a descriptive title"
                  required
                />
              </div>
             <div className="new-al-form-group">
                 <label htmlFor="video-url">YouTube / Vimeo URL *</label>
                <input
                  id="video-url"
                  type="url"
                  value={form.url}
                  onChange={(e) => setForm((s) => ({ ...s, url: e.target.value }))}
                  placeholder="https://youtube.com/watch?v=..."
                  required
                />
                <span className="new-al-form-hint">Paste the full video URL from YouTube or Vimeo</span>
              </div>

              <div className="new-al-form-group">
                <label htmlFor="video-thumbnail">Custom Thumbnail (Optional)</label>
                <input
                  id="video-thumbnail"
                  type="url"
                  value={form.thumbnail}
                  onChange={(e) => setForm((s) => ({ ...s, thumbnail: e.target.value }))}
                  placeholder="https://example.com/thumbnail.jpg"
                />
                <span className="new-al-form-hint">Or upload an image</span>
                <div className="new-al-file-upload">
                <input
                  type="file"
                  id="thumbnail-file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    setToast("Uploading thumbnail...");
                    const data = new FormData();
                    data.append("thumb", file);

                    try {
                      const res = await axios.post(
                        "http://localhost:5050/api/learn/upload/thumbnail",
                        data,
                        { headers: { "Content-Type": "multipart/form-data" } }
                      );
                      setForm((s) => ({ ...s, thumbnail: res.data.url }));
                      setToast("Thumbnail uploaded! ✅");
                    } catch (err) {
                      setToast("Thumbnail upload failed");
                    }
                  }}
                />
                <label htmlFor="thumbnail-file" className="new-al-file-label">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                    </svg>
                    Choose File
                  </label>
                </div>
              </div>

              <div className="new-al-form-actions">
                <button
                  type="button"
                  className="new-al-btn new-al-btn-secondary"
                  onClick={closeAdd}
                >
                  Cancel
                </button>
                <button type="submit" className="new-al-btn new-al-btn-primary">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Add Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </LearnLayout>
  );
}
