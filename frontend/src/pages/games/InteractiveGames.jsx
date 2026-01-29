import React, { useState, useEffect } from "react";
import "./InteractiveGames.css";
import redbus from "../assets/redbus.png";
import bluebus from "../assets/bluebus.png";
import yellowbus from "../assets/yellowbus.png";

export default function InteractiveGames() {
  const [activeGame, setActiveGame] = useState("Routine");

  useEffect(() => {
    document.title = "Interactive Games";
  }, []);

  const renderGame = () => {
    switch (activeGame) {
      case "Routine": return <RoutineGame />;
      case "Transport": return <TransportGame />;
      case "Social": return <SocialScripting />;
      case "Spatial": return <SpatialSequence />;
      default: return <div className="placeholder">Select a game from the menu</div>;
    }
  };

  return (
    <div className="game-wrapper">
      <div className="leftContainer">
        <div className="menu">
          {["Routine", "Transport", "Social", "Spatial"].map((game) => (
            <button 
              key={game} 
              className={`menu-btn ${activeGame === game ? "active" : ""}`}
              onClick={() => setActiveGame(game)}
            >
              {game === "Routine" && "Daily Routine"}
              {game === "Transport" && "Bus Catching"}
              {game === "Social" && "Social Choices"}
              {game === "Spatial" && "Memory Match"}
            </button>
          ))}
        </div>
      </div>
      <div className="rightContainer">
        <div className="rightTopContainer">
          <h2>{activeGame} Simulation</h2>
        </div>
        <div className="rightBottomContainer">
          {renderGame()}
        </div>
      </div>
    </div>
  );
}

// --- GAME 1: ROUTINE SIMULATION ---
const RoutineGame = () => {
  const initial = ["Alarm Off", "Wash Face", "Get Dressed", "Eat Breakfast"];
  const [items, setItems] = useState(["Wash Face", "Alarm Off", "Eat Breakfast", "Get Dressed"]);
  const [feedback, setFeedback] = useState("");

  const moveItem = (idx, direction) => {
    const newItems = [...items];
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    [newItems[idx], newItems[targetIdx]] = [newItems[targetIdx], newItems[idx]];
    setItems(newItems);
  };

  const checkOrder = () => {
    const isCorrect = JSON.stringify(items) === JSON.stringify(initial);
    setFeedback(isCorrect ? "✅ Great job! Correct order." : "❌ Not quite, try again!");
  };

  return (
    <div className="game-box">
      <p>Drag buttons or use arrows to order your morning:</p>
      {items.map((item, i) => (
        <div key={item} className="routine-item">
          <span>{item}</span>
          <div>
            <button onClick={() => moveItem(i, -1)}>↑</button>
            <button onClick={() => moveItem(i, 1)}>↓</button>
          </div>
        </div>
      ))}
      <button className="confirm-btn" onClick={checkOrder}>Confirm Order</button>
      <p className="feedback">{feedback}</p>
    </div>
  );
};

// --- GAME 2: TRANSPORTATION ---
const TransportGame = () => {
  const steps = [
    { color: "blue", number: "223", action: "ignore", msg: "Look! A Blue 223 bus. Is it ours?" },
    { color: "yellow", number: "118", action: "ignore", msg: "Look! A Yellow 118 bus. Is it ours?" },
    { color: "red", number: "118", action: "getIn", msg: "Look! A Red 118 bus. Is it ours?" }
  ];
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState("Goal: Get on Red Bus #118");

  const handleChoice = (choice) => {
    if (choice === steps[step].action) {
      if (step === 2) {
        setStatus("🎉 Well done! You're on the right bus!");
      } else {
        setStep(step + 1);
      }
    } else {
      setStatus("Oops! That's not the right bus. Try again!");
      setStep(0);
    }
  };

  return (
    <div className="game-box">
      <p>{status}</p>
      {step <= 2 && (
        <div className="bus-scene">
          <div className="bus" style={{ backgroundColor: steps[step].color }}>
            <span>{steps[step].number}</span>
          </div>
          <p>{steps[step].msg}</p>
          <button onClick={() => handleChoice("ignore")}>Ignore</button>
          <button onClick={() => handleChoice("getIn")}>Get In</button>
        </div>
      )}
    </div>
  );
};

// --- GAME 3: SOCIAL SCRIPTING ---
const SocialScripting = () => {
  const [choice, setChoice] = useState(null);
  const scenarios = {
    aggressive: "The friend feels sad and goes away. 😢",
    passive: "You feel a bit sad because you wanted to play too. 😐",
    prosocial: "You both have fun playing together! 🌟"
  };

  return (
    <div className="game-box">
      <p>"Can I play with your toy?"</p>
      {!choice ? (
        <div className="choice-list">
          <button onClick={() => setChoice("aggressive")}>"No! Go away!"</button>
          <button onClick={() => setChoice("passive")}>"Okay... (give it up)"</button>
          <button onClick={() => setChoice("prosocial")}>"Sure, let's share!"</button>
        </div>
      ) : (
        <div className="outcome">
          <p>{scenarios[choice]}</p>
          <button onClick={() => setChoice(null)}>Try Again</button>
        </div>
      )}
    </div>
  );
};

// --- GAME 4: SPATIAL SEQUENCES ---
const SpatialSequence = () => {
  const colors = ["red", "blue", "green"];
  const [sequence, setSequence] = useState([]);
  const [userSeq, setUserSeq] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [msg, setMsg] = useState("Click Start to watch the sequence");

  const startLevel = () => {
    const newSeq = [...sequence, colors[Math.floor(Math.random() * 3)]];
    setSequence(newSeq);
    setUserSeq([]);
    setIsPlaying(true);
    setMsg("Watch carefully...");
    // Sequence playback logic would go here
  };

  const handleColorClick = (color) => {
    const nextUserSeq = [...userSeq, color];
    setUserSeq(nextUserSeq);
    if (color !== sequence[nextUserSeq.length - 1]) {
      setMsg("Wrong sequence! Game Reset.");
      setSequence([]);
      return;
    }
    if (nextUserSeq.length === sequence.length) {
      setMsg("Correct! Get ready for the next level.");
      setTimeout(startLevel, 1000);
    }
  };

  return (
    <div className="game-box">
      <p>{msg}</p>
      <div className="simon-grid">
        {colors.map(c => (
          <div key={c} className={`color-btn ${c}`} onClick={() => handleColorClick(c)} />
        ))}
      </div>
      {sequence.length === 0 && <button onClick={startLevel}>Start Game</button>}
    </div>
  );
};