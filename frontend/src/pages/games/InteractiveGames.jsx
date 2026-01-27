import React, { useState, useEffect } from "react";
import "./InteractiveGames.css";

// --- GAME COMPONENTS ---

// 1.1 Routine Simulation
const RoutineSimulation = () => {
  const [step, setStep] = useState(0);
  const steps = [
    { task: "Turn off the alarm", img: "https://placehold.co/150/f39c12/white?text=Alarm+Clock" },
    { task: "Brush your teeth", img: "https://placehold.co/150/3498db/white?text=Toothbrush" },
    { task: "Put on your shirt", img: "https://placehold.co/150/2ecc71/white?text=Shirt" }
  ];
  return (
    <div className="game-box">
      <h3>Morning Routine</h3>
      <img src={steps[step].img} alt="task" />
      <p>Can you {steps[step].task}?</p>
      <button onClick={() => setStep((step + 1) % steps.length)}>Done! Next Step</button>
    </div>
  );
};

// 1.2.1 Canteen Scenario
const CanteenGame = () => {
  const [balance, setBalance] = useState(10);
  const buy = (price) => balance >= price ? setBalance(balance - price) : alert("Not enough money!");
  return (
    <div className="game-box">
      <h3>Canteen: Budgeting</h3>
      <p>Your Balance: ${balance}</p>
      <div className="items">
        <button onClick={() => buy(2)}>🍎 Apple ($2)</button>
        <button onClick={() => buy(5)}>🥪 Sandwich ($5)</button>
      </div>
    </div>
  );
};

// 2.1 Emotion Recognition
const EmotionGame = () => {
  const [target] = useState("Happy");
  const options = ["Happy", "Sad", "Angry"];
  const check = (opt) => opt === target ? alert("Correct!") : alert("Try again!");
  return (
    <div className="game-box">
      <h3>Emotion Detective</h3>
      <img src="https://placehold.co/150/f1c40f/333?text=:D" alt="emotion" />
      <p>How is this person feeling?</p>
      {options.map(opt => <button key={opt} onClick={() => check(opt)}>{opt}</button>)}
    </div>
  );
};

// 3.1 Train Game (Sorting)
const TrainGame = () => {
  const [wagons, setWagons] = useState([]);
  const addWagon = (color) => setWagons([...wagons, color]);
  return (
    <div className="game-box">
      <h3>The Color Train</h3>
      <div className="train-track">
        <div className="engine">🚂</div>
        {wagons.map((c, i) => <div key={i} className="wagon" style={{background: c}}></div>)}
      </div>
      <p>Add a wagon to the train:</p>
      <button onClick={() => addWagon("red")}>🔴 Red</button>
      <button onClick={() => addWagon("blue")}>🔵 Blue</button>
      <button onClick={() => setWagons([])}>Reset</button>
    </div>
  );
};

// --- MAIN COMPONENT ---

export default function InteractiveGames() {
  const [activeGame, setActiveGame] = useState("intro");

  useEffect(() => {
    document.title = "Interactive Games - KidzConnect";
  }, []);

  const renderGame = () => {
    switch (activeGame) {
      case "1.1": return <RoutineSimulation />;
      case "1.2.1": return <CanteenGame />;
      case "2.1": return <EmotionGame />;
      case "3.1": return <TrainGame />;
      default: return <div className="intro">Select a game from the menu to start playing!</div>;
    }
  };

  return (
    <div className="container">
      <div className="leftContainer">
        <div className="menu">
          <h4 className="category-title">1. Daily Living</h4>
          <button className="menu-btn" onClick={() => setActiveGame("1.1")}>1.1 Routine Simulation</button>
          <button className="menu-btn" onClick={() => setActiveGame("1.2.1")}>1.2.1 Canteen</button>
          
          <h4 className="category-title">2. Social/Emotional</h4>
          <button className="menu-btn" onClick={() => setActiveGame("2.1")}>2.1 Emotion Recognition</button>
          <button className="menu-btn">2.2 Eye Gaze</button>
          
          <h4 className="category-title">3. Cognitive</h4>
          <button className="menu-btn" onClick={() => setActiveGame("3.1")}>3.1 Train Game</button>
          <button className="menu-btn">3.2 Spatial Sequences</button>
        </div>
      </div>
      <div className="rightContainer">
        <div className="rightTopContainer">
          <h2>Game Zone</h2>
        </div>
        <div className="rightBottomContainer">
          {renderGame()}
        </div>
      </div>
    </div>
  );
}