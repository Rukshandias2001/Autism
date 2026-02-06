import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../auth/AuthContext";
import "../../../styles/virtualNurseyStyles/AlphabetLearn.css";
import LearnLayout from "./LearnLayout";
import "./layoutStyles.css";
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import alphabet from "../../../assets/alphabet1.png"


const MAX_VIDEOS = 5;

function getId(v) {
  return v?._id || v?.id || "";
}
function isYouTubeOrVimeo(url = "") {
  return /youtube\.com|youtu\.be|vimeo\.com/i.test(url);
}
function normalizeYouTubePoster(poster) {
  return poster || undefined;
}

// Normalize YouTube links so ReactPlayer always understands
function normalizeYouTubeUrl(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/watch?v=${u.pathname.slice(1)}`;
    }
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/watch?v=${v}`;
    }
  } catch {
    return url;
  }
  return url;
}

export default function AlphabetLearn({ topic: topicProp }) {
  const { user } = useAuth();
  const isMentor = user?.role?.toLowerCase() === "mentor";

  const { topic: topicURL } = useParams();
  const topic = (topicProp || topicURL || "alphabets").toLowerCase();

  

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
    <LearnLayout title="Alphabet" image={alphabet} imageAlt="Alphabet Chart">
      {toast && (
        <div className="al-toast" role="status" onAnimationEnd={() => setToast("")}>
          {toast}
        </div>
      )}

      <div className="al-player-card">
        {loading ? (
          <div className="al-empty">Loading…</div>
        ) : current ? (
          <>
            <div className="al-player" style={{ aspectRatio: "16/9" }}>
              <ReactPlayer url={current.url} controls width="100%" height="100%" />
            </div>

            <div className="al-player-meta">
              <h2 className="al-title">{current.title || "Untitled"}</h2>
            </div>
          </>
        ) : (
          <div className="al-empty">No video selected</div>
        )}
      </div>

      <div className="al-rail">
        {visible.map((v) => {
          const vid = getId(v);
          return (
            <div key={vid || v.title || Math.random()} className={`al-thumb ${currentId === vid ? "selected" : ""}`}>
              <button className="al-thumb-btn" onClick={() => vid && setCurrentId(vid)} aria-label={`Play ${v.title || "video"}`}>
                {v.thumbnail ? (
                  <img src={v.thumbnail} alt={v.title || "thumbnail"} onError={(e) => (e.currentTarget.style.display = "none")} />
                ) : (
                  <div className="al-thumb-fallback">{v.title?.[0]?.toUpperCase() || "?"}</div>
                )}
                <span className="al-thumb-title">{v.title || "Untitled"}</span>
              </button>

              {isMentor && vid && (
                <button className="al-thumb-delete" onClick={() => onDelete(vid)} aria-label={`Delete ${v.title || "video"}`} title="Delete">
                  ✕
                </button>
              )}
            </div>
          );
        })}

        <button className="al-thumb al-add" onClick={openAdd} aria-label="Add new video">
          <div className="al-add-plus">＋</div>
          <span className="al-thumb-title">Add video</span>
        </button>
      </div>

      {showForm && (
        <div className="al-modal" role="dialog" aria-modal="true">
          <div className="al-modal-card">
            <h3>
              Add a video ({videos.length}/{MAX_VIDEOS})
            </h3>
            <form className="al-form" onSubmit={onAdd}>
              <div className="al-form-row">
                <label>Title</label>
                <input value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} required />
              </div>
              <div className="al-form-row">
                <label>YouTube/Vimeo Link</label>
                <input value={form.url} onChange={(e) => setForm((s) => ({ ...s, url: e.target.value }))} placeholder="https://youtube.com/watch?v=..." required />
              </div>

              <div className="al-form-row">
                <label>Thumbnail</label>
                <input value={form.thumbnail} onChange={(e) => setForm((s) => ({ ...s, thumbnail: e.target.value }))} placeholder="Image URL (optional)" />
                <input type="file" accept="image/*" onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  const data = new FormData();
                  data.append("thumb", file);
                  try {
                    const res = await axios.post(
                      "http://localhost:5050/api/learn/upload/thumbnail",
                      data,
                      { headers: { "Content-Type": "multipart/form-data" } }
                    );
                    setForm((s) => ({ ...s, thumbnail: res.data.url }));
                  } catch (err) {
                    setToast("Thumbnail upload failed");
                  }
                }} />
              </div>

              <div className="al-form-actions">
                <button type="button" className="al-btn ghost" onClick={closeAdd}>Cancel</button>
                <button type="submit" className="al-btn">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </LearnLayout>
  );
}