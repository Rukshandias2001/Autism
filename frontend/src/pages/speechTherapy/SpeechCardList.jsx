import MediaPreview from "../../pages/speechTherapy/MediaPreview";


export default function SpeechCardList({ cards, onEdit, onDelete }) {
    const grouped = cards.reduce((acc, c) => {
      (acc[c.category] ||= []).push(c);
      return acc;
    }, {});
  
    const categories = Object.keys(grouped).sort();
  
    if (!cards.length) return <div className="st-muted">No speech cards yet.</div>;
  
    return (
      <div className="sl-wrap">
        {categories.map((cat) => (
          <div key={cat} className="sl-group">
            <div className="sl-group-head">
              <div className="sl-group-title">{cat}</div>
              <div className="sl-group-count">{grouped[cat].length} cards</div>
            </div>
    
            <div className="sl-grid">
              {grouped[cat].map((card) => (
                <div key={card._id} className="sl-card">
                 <div className="sl-thumb">
  <MediaPreview
    src={card.image}
    alt={card.title}
    className="sl-media"
  />
</div>

    
                  <div className="sl-body">
                    <div className="sl-title">{card.title}</div>
                    <div className="sl-pills">
                      <span className="sl-pill">{card.difficulty || "easy"}</span>
                      <span className="sl-pill ghost">audio</span>
                    </div>
                  </div>
    
                  <div className="sl-actions">
                    <button className="sl-btn" onClick={() => onEdit(card)}>Edit</button>
                    <button className="sl-btn danger" onClick={() => onDelete(card._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
    
  }
  