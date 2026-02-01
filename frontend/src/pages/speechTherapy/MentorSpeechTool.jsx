import { useEffect, useMemo, useState } from "react";
import SpeechCard from "./SpeechCard";
import SpeechCardList from "./SpeechCardList";
import SpeechPractice from "./SpeechPractice";
import { fetchSpeechCards, deleteSpeechCard } from "../../api/speechCardsApi";


import "../../styles/virtualNurseyStyles/Speech.css";
import SpeechCardForm from "./SpeechCardForm";




export default function MentorSpeechTool() {
  const [cards, setCards] = useState([]);
  const [activeTab, setActiveTab] = useState("manage"); // manage | practice
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchSpeechCards();
      setCards(Array.isArray(data) ? data : data?.items || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function onDelete(id) {
    const ok = confirm("Delete this speech card?");
    if (!ok) return;
    await deleteSpeechCard(id);
    await load();
  }

  const categories = useMemo(() => {
    const set = new Set(cards.map(c => c.category));
    return Array.from(set).sort();
  }, [cards]);

  return (
    <div className="st-wrap">
      <div className="st-header">
        <div>
          <h2 className="st-title">Speech Therapy Tool</h2>
          <p className="st-sub">Mentors add cards by category (family, vehicles, food…) and students practice speaking.</p>
        </div>

        <div className="st-tabs">
          <button
            className={`st-tab ${activeTab === "manage" ? "is-active" : ""}`}
            onClick={() => setActiveTab("manage")}
          >
            Manage Cards
          </button>
          <button
            className={`st-tab ${activeTab === "practice" ? "is-active" : ""}`}
            onClick={() => setActiveTab("practice")}
          >
            Practice Preview
          </button>
        </div>
      </div>

      {activeTab === "manage" && (
        <div className="st-grid">
          <div className="st-panel">
            <SpeechCardForm
              editing={editing}
              onSaved={async () => {
                setEditing(null);
                await load();
              }}
              onCancelEdit={() => setEditing(null)}
            />
          </div>

          <div className="st-panel">
            <div className="st-panel-title">
              <span>Saved Cards</span>
              <button className="st-mini" onClick={load}>Refresh</button>
            </div>

            {loading ? (
              <div className="st-muted">Loading…</div>
            ) : (
              <SpeechCardList
                cards={cards}
                onEdit={(card) => setEditing(card)}
                onDelete={(id) => onDelete(id)}
              />
            )}
          </div>
        </div>
      )}

      {activeTab === "practice" && (
        <div className="st-panel">
          <SpeechPractice cards={cards} categories={categories} />
        </div>
      )}
    </div>
  );
}
