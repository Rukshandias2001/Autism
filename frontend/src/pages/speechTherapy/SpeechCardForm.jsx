import { useEffect, useMemo, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

import { createSpeechCard, updateSpeechCard } from "../../api/speechCardsApi";
// import  from "../../pages/speechTherapy/MediaPreview";
import MediaPreview_1 from "./MediaPreview";
const CATEGORY_OPTIONS = [
  "food", "family", "actions", "emotions", "objects", "places",
  "people", "animals", "vehicles", "colours"
];

function isLottieAsset(url) {
  const u = (url || "").trim().toLowerCase();
  return u.endsWith(".json") || u.endsWith(".lottie");
}


function MediaPreview({ src, alt }) {
  if (!src) return null;

  if (isLottieAsset(src)) {
    return (
      <div className="sc-lottie">
        <DotLottieReact
          src={src}
          loop
          autoplay
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }
  return (
    <MediaPreview
    src={imagePreview}
    alt="preview"
    className="sc-media"
  />
  );
}

export default function SpeechCardForm({ editing, onSaved, onCancelEdit }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("family");
  const [difficulty, setDifficulty] = useState("easy");

  // image can be either: file upload OR URL (for lottie / hosted image)
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  // audio can be: file upload OR URL
  const [audioFile, setAudioFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");

  const [saving, setSaving] = useState(false);
  const isEdit = !!editing?._id;

  const [recording, setRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState("");

  useEffect(() => {
    if (!editing) return;
    setTitle(editing.title || "");
    setCategory(editing.category || "family");
    setDifficulty(editing.difficulty || "easy");
    setImageUrl(editing.image || "");
    setAudioUrl(editing.audio || "");
    setImageFile(null);
    setAudioFile(null);
    setAudioPreviewUrl(""); // reset preview when editing changes
  }, [editing]);

  const imagePreview = useMemo(() => {
    if (imageFile) return URL.createObjectURL(imageFile);
    return imageUrl || "";
  }, [imageFile, imageUrl]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim()) return alert("Title is required.");
    if (!category) return alert("Category is required.");

    const hasImage = !!imageFile || !!imageUrl.trim();
    const hasAudio = !!audioFile || !!audioUrl.trim();

    if (!hasImage) return alert("Please upload an image OR provide an image/Lottie URL.");
    if (!hasAudio) return alert("Please upload audio OR provide an audio URL.");

    const fd = new FormData();
    fd.append("title", title.trim());
    fd.append("category", category);
    fd.append("difficulty", difficulty);

    if (imageFile) fd.append("imageFile", imageFile);
    if (imageUrl.trim()) fd.append("image", imageUrl.trim());

    if (audioFile) fd.append("audioFile", audioFile);
    if (audioUrl.trim()) fd.append("audio", audioUrl.trim());

    setSaving(true);
    try {
      if (isEdit) await updateSpeechCard(editing._id, fd);
      else await createSpeechCard(fd);

      if (!isEdit) {
        setTitle("");
        setCategory("family");
        setDifficulty("easy");
        setImageFile(null);
        setImageUrl("");
        setAudioFile(null);
        setAudioUrl("");
        setAudioPreviewUrl("");
      }
      onSaved?.();
    } catch (err) {
      console.error(err);
      alert("Save failed. Check console + backend endpoint.");
    } finally {
      setSaving(false);
    }
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());

        const blob = new Blob(chunks, { type: "audio/webm" });
        const file = new File([blob], `${title || "speech"}.webm`, { type: "audio/webm" });

        setAudioFile(file);
        setAudioUrl("");
        setAudioPreviewUrl(URL.createObjectURL(blob));
      };

      mediaRecorder.start();
      setRecorder(mediaRecorder);
      setRecording(true);
    } catch (err) {
      console.error(err);
      alert("Microphone access denied or not available.");
    }
  }

  function stopRecording() {
    if (!recorder) return;
    recorder.stop();
    setRecording(false);
    setRecorder(null);
  }

  return (
    <form onSubmit={handleSubmit} className="sc-form">
      {/* Header */}
      <div className="sc-header">
        <div className="sc-header-left">
          <div className="sc-title-row">
            <h2 className="sc-title">{isEdit ? "Edit Speech Card" : "Create Speech Card"}</h2>
            <span className={`sc-badge ${isEdit ? "edit" : "new"}`}>
              {isEdit ? "EDIT MODE" : "NEW"}
            </span>
          </div>
          <p className="sc-sub">
            Add an image or animation + audio to help children learn with visual + sound cues.
          </p>
        </div>

        {isEdit && (
          <button type="button" className="sc-btn sc-btn-ghost" onClick={onCancelEdit}>
            ✕ Cancel edit
          </button>
        )}
      </div>

      <div className="sc-grid">
        {/* Left: Form */}
        <div className="sc-panel">
          <div className="sc-panel-title">
            <span>Card Details</span>
            <span className="sc-tip">✨ Clear and simple is best</span>
          </div>

          <div className="sc-field">
            <label>Title (Expected word)</label>
            <input
              className="sc-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Apple / Mother / Car"
            />
          </div>

          <div className="sc-row">
            <div className="sc-field">
              <label>Category</label>
              <select className="sc-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="sc-field">
              <label>Difficulty</label>
              <select className="sc-input" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option value="easy">easy</option>
                <option value="medium">medium</option>
                <option value="hard">hard</option>
              </select>
            </div>
          </div>

          {/* Image / Lottie */}
          <div className="sc-section">
            <div className="sc-section-head">
              <h3>Image / Animation</h3>
              <span className="sc-hint">Upload OR paste a URL</span>
            </div>

            <div className="sc-upload">
              <div className="sc-upload-left">
                <label className="sc-file">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  />
                  <span className="sc-file-btn">🖼️ Choose file</span>
                  <span className="sc-file-meta">{imageFile ? imageFile.name : "PNG / JPG / WEBP"}</span>
                </label>
              </div>

              <div className="sc-upload-right">
                <input
                  className="sc-input"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://.../image.png OR https://.../animation.json"
                />
                <div className="sc-muted">
                  For Lottie: paste the direct <b>.json</b> URL (not oEmbed).
                </div>
              </div>
            </div>
          </div>

          {/* Audio */}
          <div className="sc-section">
            <div className="sc-section-head">
              <h3>Audio</h3>
              <span className="sc-hint">Upload OR record OR paste a URL</span>
            </div>

            <div className="sc-upload">
              <div className="sc-upload-left">
                <label className="sc-file">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0] || null;
                      setAudioFile(f);
                      if (f) setAudioPreviewUrl(URL.createObjectURL(f));
                    }}
                  />
                  <span className="sc-file-btn">🔊 Choose audio</span>
                  <span className="sc-file-meta">{audioFile ? audioFile.name : "MP3 / WAV / M4A"}</span>
                </label>

                <div className="sc-rec">
                  {!recording ? (
                    <button type="button" className="sc-btn sc-btn-primary" onClick={startRecording}>
                      🎙️ Record
                    </button>
                  ) : (
                    <button type="button" className="sc-btn sc-btn-danger" onClick={stopRecording}>
                      ⏹ Stop
                    </button>
                  )}

                  <button
                    type="button"
                    className="sc-btn sc-btn-ghost"
                    onClick={() => {
                      setAudioFile(null);
                      setAudioPreviewUrl("");
                    }}
                  >
                    🧹 Clear
                  </button>
                </div>
              </div>

              <div className="sc-upload-right">
                {audioPreviewUrl ? (
                  <div className="sc-audio-card">
                    <div className="sc-audio-top">
                      <span className="sc-audio-chip">Preview</span>
                      <span className="sc-muted">{recording ? "Recording..." : "Ready"}</span>
                    </div>
                    <audio controls src={audioPreviewUrl} style={{ width: "100%" }} />
                  </div>
                ) : (
                  <div className="sc-muted">No audio selected yet.</div>
                )}

                <div className="sc-divider" />

                <input
                  className="sc-input"
                  value={audioUrl}
                  onChange={(e) => setAudioUrl(e.target.value)}
                  placeholder="https://.../audio.mp3"
                />
                <div className="sc-muted">If you paste a URL, it will be saved as the audio source.</div>
              </div>
            </div>
          </div>

          <button className="sc-save" disabled={saving}>
            {saving ? "Saving..." : isEdit ? "Update Card ✨" : "Create Card ✨"}
          </button>
        </div>

        {/* Right: Preview */}
        <div className="sc-preview-panel">
          <div className="sc-preview-head">
            <div>
              <h3 className="sc-preview-title">Live Preview</h3>
              <div className="sc-muted">Image or animation will show here.</div>
            </div>
            <div className="sc-pillrow">
              <span className="sc-pill">{category}</span>
              <span className="sc-pill ghost">{difficulty}</span>
              {isLottieAsset(imagePreview) ? <span className="sc-pill soft">lottie</span> : null}

            </div>
          </div>

          <div className="sc-preview-card">
            <div className="sc-preview-media">
              {imagePreview ? (
                <MediaPreview src={imagePreview} alt="preview" />
              ) : (
                <div className="sc-preview-empty">
                  <div className="sc-empty-icon">🖼️</div>
                  <div className="sc-empty-text">Add an image or Lottie JSON URL</div>
                </div>
              )}
            </div>

            <div className="sc-preview-body">
              <div className="sc-preview-word">{title?.trim() || "Your word here"}</div>

              <div className="sc-preview-meta">
                <span className="sc-mini-chip">{category}</span>
                <span className="sc-mini-chip soft">{difficulty}</span>
              </div>

              {audioPreviewUrl || audioUrl ? (
                <div className="sc-preview-audio">
                  <div className="sc-muted">Audio Preview</div>
                  <audio controls src={audioPreviewUrl || audioUrl} style={{ width: "100%" }} />
                </div>
              ) : (
                <div className="sc-muted">Add audio to preview sound.</div>
              )}
            </div>
          </div>

          <div className="sc-preview-note">
            <b>Tip:</b> Use short clear titles like “Apple”, “Mother”, “Car”.
          </div>
        </div>
      </div>
    </form>
  );
}
