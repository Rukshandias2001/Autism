import React, { useEffect, useState } from "react";
import SpeechCard from "./SpeechCard";
import { useParams } from "react-router-dom";
import "../../styles/speechTherapyStyles/CategoryPage.css";


function getMyUserId() {
  try {
    const u = JSON.parse(localStorage.getItem("user") || "null");
    const token = u?.token;
    if (!token) return null;
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const json = JSON.parse(atob(padded));
    return json?.sub || null;
  } catch {
    return null;
  }
}


const CategoryPage = () => {

  const { category } = useParams(); // /cards/animals -> "animals"
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);





  const myId = getMyUserId();

  const [childId, setChildId] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("currentChild") || "null");
      return stored?._id || null;
    } catch { return null; }
  });


  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("currentChild") || "null");
      
      if (!childId) {
        localStorage.removeItem("currentChild");
        setChildId(null);
      }
    } catch {
      localStorage.removeItem("currentChild");
      setChildId(null);
    }
  }, [myId]);

  useEffect(() => { // Fetch cards for the given category in the background
    const fetchCards = async () => {
      try {
        const res = await fetch(`https://express-api-440581871543.us-central1.run.app/api/cards/${category}`); // Fetch cards by category
        const json = await res.json();
        if (json.success) {
          setCards(json.data); // Set fetched cards to state
        }
      } catch (err) {
        console.error("Error fetching cards:", err);
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };
    fetchCards(); // Call the async function
  }, [category]); // Re-run effect if category changes and on mount

  if (loading) return <p className="speech-therapy-loading">Loading cards...</p>; // Show loading state
  // Guard: require a child profile first
  function handleLogout() {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("currentChild");
    } catch (e) {
      // ignore
    }
    // redirect to login page
    window.location.href = "/login";
  }
  
  if (!childId) {
    return <div style={{ padding: 24, textAlign: "center", minHeight: "calc(99.9dvh - var(--nav-height))" }}>
        <h2>This page is for children only</h2>
        <p>Please sign in using a child account to access this activity.</p>
        <div style={{ marginTop: 16 }}>
          <button className="wood-btn primary" onClick={handleLogout}>
            Logout and go to login
          </button>
        </div>
      </div>;
  }

  return (
    <div className="speech-therapy-category-page">
      <h1 className="speech-therapy-category-title">
        {category.charAt(0).toUpperCase() + category.slice(1)} Cards {/* Capitalize first letter */}
      </h1>

      {/* Grid of Speech Cards */}
      {/* Map over cards and render SpeechCard components */}
      <div className="speech-therapy-grid">
        {cards.map((card) => ( 
          <SpeechCard
            key={card._id}
            title={card.title}
            imageUrl={card.image}
            childId={childId}
            category={card.category}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
