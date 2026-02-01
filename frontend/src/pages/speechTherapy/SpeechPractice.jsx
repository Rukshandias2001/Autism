import { useMemo, useState } from "react";

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
    <div>
      <div className="st-panel-title">
        <span>Practice Preview</span>
      </div>

      <div className="st-row">
        <div className="st-field">
          <label>Category</label>
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setIdx(0); setResult(null); setLastHeard(""); }}
          >
            {(categories?.length ? categories : ["family"]).map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="st-field">
          <label>Card</label>
          <div className="st-muted">{filtered.length ? `${idx + 1} / ${filtered.length}` : "0 / 0"}</div>
        </div>
      </div>

      {!current ? (
        <div className="st-muted">No cards inside this category yet.</div>
      ) : (
        <div className="st-practice">
          <div className="st-practice-card">
            <img src={current.image} alt={current.title} />
          </div>

          <div className="st-practice-controls">
            <div className="st-muted">Expected word:</div>
            <div className="st-big">{current.title}</div>

            <div className="st-btnrow">
              <button className="st-mini" onClick={prev}>◀ Prev</button>
              <button className="st-mini" onClick={next}>Next ▶</button>
              <button className="st-mini" onClick={playAudio}>🔊 Play Audio</button>
              <button className="st-primary" onClick={startListening} disabled={listening}>
                {listening ? "Listening..." : "🎤 Speak"}
              </button>
            </div>

            <div className="st-feedback">
              {lastHeard ? <div><b>You said:</b> {lastHeard}</div> : null}
              {result === true ? <div className="ok">✅ Correct!</div> : null}
              {result === false ? <div className="bad">❌ Try again (say exactly: {current.title})</div> : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
