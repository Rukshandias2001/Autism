export default function SpeechCardList({ cards, onEdit, onDelete }) {
    const grouped = cards.reduce((acc, c) => {
      (acc[c.category] ||= []).push(c);
      return acc;
    }, {});
  
    const categories = Object.keys(grouped).sort();
  
    if (!cards.length) return <div className="st-muted">No speech cards yet.</div>;
  
    return (
      <div className="st-list">
        {categories.map(cat => (
          <div key={cat} className="st-group">
            <div className="st-group-title">{cat}</div>
  
            <div className="st-cards">
              {grouped[cat].map(card => (
                <div key={card._id} className="st-card">
                  <div className="st-card-thumb">
                    {/* If using Lottie JSON URLs, render via lottie-react */}
                    <img src={card.image} alt={card.title} />
                  </div>
  
                  <div className="st-card-body">
                    <div className="st-card-title">{card.title}</div>
                    <div className="st-pillrow">
                      <span className="st-pill">{card.difficulty || "easy"}</span>
                      <span className="st-pill ghost">audio</span>
                    </div>
                  </div>
  
                  <div className="st-card-actions">
                    <button className="st-mini" onClick={() => onEdit(card)}>Edit</button>
                    <button className="st-mini danger" onClick={() => onDelete(card._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
  
          </div>
        ))}
      </div>
    );
  }
  