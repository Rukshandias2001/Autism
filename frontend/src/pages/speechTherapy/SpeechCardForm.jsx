import { useEffect, useMemo, useState } from "react";
import { fetchSpeechCards, deleteSpeechCard } from "../../api/speechCardsApi";



const CATEGORY_OPTIONS = [
  "food", "family", "actions", "emotions", "objects", "places",
  "people", "animals", "vehicles", "colours"
];

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

  useEffect(() => {
    if (!editing) return;
    setTitle(editing.title || "");
    setCategory(editing.category || "family");
    setDifficulty(editing.difficulty || "easy");
    setImageUrl(editing.image || "");
    setAudioUrl(editing.audio || "");
    setImageFile(null);
    setAudioFile(null);
  }, [editing]);

  const imagePreview = useMemo(() => {
    if (imageFile) return URL.createObjectURL(imageFile);
    return imageUrl || "";
  }, [imageFile, imageUrl]);

  async function handleSubmit(e) {
    e.preventDefault();

    // minimal validation
    if (!title.trim()) return alert("Title is required.");
    if (!category) return alert("Category is required.");

    // your schema requires image + audio strings.
    // So: send either file or URL, but at least something must exist.
    const hasImage = !!imageFile || !!imageUrl.trim();
    const hasAudio = !!audioFile || !!audioUrl.trim();

    if (!hasImage) return alert("Please upload an image OR provide an image/Lottie URL.");
    if (!hasAudio) return alert("Please upload audio OR provide an audio URL.");

    const fd = new FormData();
    fd.append("title", title.trim());
    fd.append("category", category);
    fd.append("difficulty", difficulty);

    // backend can decide: if file exists -> upload -> set URL string
    // else use provided url string
    if (imageFile) fd.append("imageFile", imageFile);
    if (imageUrl.trim()) fd.append("image", imageUrl.trim());

    if (audioFile) fd.append("audioFile", audioFile);
    if (audioUrl.trim()) fd.append("audio", audioUrl.trim());

    setSaving(true);
    try {
      if (isEdit) await updateSpeechCard(editing._id, fd);
      else await createSpeechCard(fd);

      // reset if new card
      if (!isEdit) {
        setTitle("");
        setCategory("family");
        setDifficulty("easy");
        setImageFile(null);
        setImageUrl("");
        setAudioFile(null);
        setAudioUrl("");
      }
      onSaved?.();
    } catch (err) {
      console.error(err);
      alert("Save failed. Check console + backend endpoint.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="st-panel-title">
        <span>{isEdit ? "Edit Card" : "Add New Card"}</span>
        {isEdit && (
          <button type="button" className="st-mini" onClick={onCancelEdit}>
            Cancel edit
          </button>
        )}
      </div>

      <div className="st-field">
        <label>Title (expected word)</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Car / Mother / Apple" />
      </div>

      <div className="st-row">
        <div className="st-field">
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="st-field">
          <label>Difficulty</label>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="easy">easy</option>
            <option value="medium">medium</option>
            <option value="hard">hard</option>
          </select>
        </div>
      </div>

      <div className="st-row">
        <div className="st-field">
          <label>Image Upload (png/jpg)</label>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
          <div className="st-muted">OR use URL (for hosted image or lottie JSON)</div>
          <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://.../image.png OR .../lottie.json" />
        </div>

        <div className="st-field">
          <label>Audio Upload (mp3/wav)</label>
          <input type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files?.[0] || null)} />
          <div className="st-muted">OR use URL</div>
          <input value={audioUrl} onChange={(e) => setAudioUrl(e.target.value)} placeholder="https://.../audio.mp3" />
        </div>
      </div>

      {imagePreview ? (
        <div className="st-preview">
          <div className="st-muted">Preview</div>
          {/* if URL is lottie.json, you should render with lottie-react instead of img */}
          <img src={imagePreview} alt="preview" onError={(e) => { e.currentTarget.style.display = "none"; }} />
          <div className="st-muted">If this is a Lottie JSON URL, use lottie-react to render it (shown below).</div>
        </div>
      ) : null}

      <button className="st-primary" disabled={saving}>
        {saving ? "Saving..." : isEdit ? "Update Card" : "Create Card"}
      </button>
    </form>
  );
}
