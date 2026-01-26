import React, { useState, useEffect} from "react";


export default function InteractiveGames() {

    useEffect(() => {
        document.title = "Interactive Games - KidzConnect";
    }, []);
  return (
    <div style={{ padding: 20 }}>
      <h1>🎮 Interactive Games</h1>
      <p>Welcome to the Interactive Games page! Here you can find a variety of fun and educational games designed to engage and entertain.</p>
      {/* Add more content and components related to interactive games here */}
    </div>
  );
}