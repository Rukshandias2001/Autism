import React from "react";
import "../../../styles/virtualNurseyStyles/layoutStyles.css";

export default function LearnLayout({ title, image, imageAlt, children }) {
  return (
    <div className="al-page">
      <button
        className="nurseryD-learn-bp-back"
        onClick={() => window.history.back()}
        type="button"
      >
        back
      </button>

      <aside className="al-chart">
        <div className="al-chart-title">{title}</div>
        <div className="al-image-container">
          {image ? (
            <img src={image} alt={imageAlt || title} className="al-image" />
          ) : null}
        </div>
      </aside>

      <main className="al-main">{children}</main>
    </div>
  );
}
