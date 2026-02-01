import { useMemo, useState } from "react";
import MediaPreview from "../../pages/speechTherapy/MediaPreview";
function normalize(s) {
  return (s || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .trim();
}

export default function SpeechPractice({ cards, categories }) {
  const [category, setCategory] = useState(categories?.[0] || "family");
  const [idx, setIdx] = useState(0);
  const [lastHeard, setLastHeard] = useState("");
  const [result, setResult] = useState(null); // true/false/null
  const [listening, setListening] = useState(false);

  const filtered = useMemo(() => cards.filter(c => c.category === category), [cards, category]);
  const current = filtered[idx] || null;

  function next() {
    setResult(null);
    setLastHeard("");
    setIdx(i => (filtered.length ? (i + 1) % filtered.length : 0));
  }

  function prev() {
    setResult(null);
    setLastHeard("");
    setIdx(i => (filtered.length ? (i - 1 + filtered.length) % filtered.length : 0));
  }

  function playAudio() {
    if (!current?.audio) return;
    const a = new Audio(current.audio);
    a.play().catch(() => {});
  }

  function startListening() {
    if (!current) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser. Try Chrome.");
      return;
    }

    const rec = new SpeechRecognition();
    rec.lang = "en-US"; // change to "si-LK" if you later support Sinhala speech
    rec.interimResults = false;
    rec.maxAlternatives = 3;

    setListening(true);
    setResult(null);
    setLastHeard("");

    rec.onresult = (e) => {
      const text = e.results?.[0]?.[0]?.transcript || "";
      setLastHeard(text);

      const expected = normalize(current.title);
      const heard = normalize(text);

      // Simple rule: must match title exactly.
      // Later: allow synonyms by commands array or synonym map.
      setResult(heard === expected);
    };

    rec.onerror = (e) => {
      console.error(e);
      alert("Mic error. Check permissions.");
    };

    rec.onend = () => setListening(false);

    rec.start();
  }

  if (!cards.length) return <div className="st-muted">Add some cards first, then preview practice here.</div>;

  return (
    <div className="sp-wrap">
      <div className="sp-head">
        <div>
          <h3 className="sp-title">Practice Preview</h3>
          <p className="sp-sub">Listen, speak, and get instant feedback.</p>
        </div>
  
        <div className="sp-meta">
          <div className="sp-chip">
            {filtered.length ? `${idx + 1} / ${filtered.length}` : "0 / 0"}
          </div>
        </div>
      </div>
  
      <div className="sp-controls">
        <div className="sp-field">
          <label>Category</label>
          <select
            className="sp-input"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setIdx(0);
              setResult(null);
              setLastHeard("");
            }}
          >
            {(categories?.length ? categories : ["family"]).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
  
        <div className="sp-field">
          <label>Status</label>
          <div className="sp-status">
            {listening ? (
              <span className="sp-live">🎤 Listening…</span>
            ) : (
              <span className="sp-muted">Ready</span>
            )}
          </div>
        </div>
      </div>
  
      {!current ? (
        <div className="sp-empty">
          <div className="sp-empty-icon">📚</div>
          <div className="sp-empty-title">No cards in this category</div>
          <div className="sp-empty-sub">Add a few cards first, then practice here.</div>
        </div>
      ) : (
        <div className="sp-stage">
          <div className="sp-card">
          <div className="sp-card-media">
  <MediaPreview
    src={current.image}
    alt={current.title}
    className="sp-media"
  />
</div>

  
            <div className="sp-card-body">
              <div className="sp-expected">Expected word</div>
              <div className="sp-word">{current.title}</div>
  
              <div className="sp-actions">
                <button type="button" className="sp-btn ghost" onClick={prev}>
                  ◀ Prev
                </button>
                <button type="button" className="sp-btn ghost" onClick={next}>
                  Next ▶
                </button>
                <button type="button" className="sp-btn" onClick={playAudio}>
                  🔊 Play Audio
                </button>
                <button
                  type="button"
                  className="sp-btn primary"
                  onClick={startListening}
                  disabled={listening}
                >
                  {listening ? "Listening..." : "🎤 Speak"}
                </button>
              </div>
  
              <div className="sp-feedback">
                {lastHeard ? (
                  <div className="sp-heard">
                    <span className="sp-heard-label">You said:</span>
                    <span className="sp-heard-text">{lastHeard}</span>
                  </div>
                ) : (
                  <div className="sp-muted">Press “Speak” and say the word clearly.</div>
                )}
  
                {result === true ? (
                  <div className="sp-result ok">✅ Correct! Nice job 🎉</div>
                ) : null}
  
                {result === false ? (
                  <div className="sp-result bad">
                    ❌ Try again (say exactly: <b>{current.title}</b>)
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
}
