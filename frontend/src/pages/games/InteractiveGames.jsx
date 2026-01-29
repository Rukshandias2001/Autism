import React, { useState, useEffect } from "react";
import "./InteractiveGames.css";
import redbus from "../../assets/redbus.png";
import bluebus from "../../assets/bluebus.png";
import yellowbus from "../../assets/yellowbus.png";
import socialChoice1 from "../../assets/socialChoice1.png";
import socialChoice2 from "../../assets/socialChoice2.png";
import socialChoice3 from "../../assets/socialChoice3.png";
import socialChoice4 from "../../assets/socialChoice4.png";
import socialChoice5 from "../../assets/socialChoice5.png";


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
    setFeedback(isCorrect ? "Great job! Correct order." : "try again!");
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

//GAME 2: TRANSPORTATION
const TransportGame = () => {
  const steps = [
    { 
      img: bluebus, 
      action: "ignore", 
      msg: "Look! A Blue 223 bus. Is it ours?" 
    },
    { 
      img: yellowbus, 
      action: "ignore", 
      msg: "Look! A Yellow 118 bus. Is it ours?" 
    },
    { 
      img: redbus, 
      action: "getIn", 
      msg: "Look! A Red 118 bus. Is it ours?" 
    }
  ];

  const [step, setStep] = useState(0);
  const [status, setStatus] = useState("Goal: Get on Red Bus #118");

  const handleChoice = (choice) => {
    if (choice === steps[step].action) {
      if (step === steps.length - 1) {
        setStatus("Well done! You're on the right bus!");
      } else {
        setStep(step + 1);
        setStatus("Waiting for the next bus...");
      }
    } else {
      setStatus("Oops! That's not the right bus. Try again!");
      setStep(0);
    }
  };

  return (
    <div className="game-box">
      <h3 className="game-status">{status}</h3>
      
      {step < steps.length && (
        <div className="bus-scene">
          <img 
            src={steps[step].img} 
            alt="Bus approaching" 
            className="bus-image"
          />
          
          <p className="instruction-text">{steps[step].msg}</p>
          
          <div className="button-group">
            <button className="action-btn ignore" onClick={() => handleChoice("ignore")}>Ignore</button>
            <button className="action-btn get-in" onClick={() => handleChoice("getIn")}>Get In</button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- GAME 3: SOCIAL SCRIPTING (UPDATED) ---
const SocialScripting = () => {
  // 1. Define all scenarios, images, and outcomes in an array
  const scenarios = [
    {
      id: 1,
      image: socialChoice1,
      situation: "A friend comes over wanting to play with your toy. what do you do?",
      options: [
        { label: '"No! Go away!"', type: "aggressive", result: "The friend feels sad and goes away." },
        { label: '"Okay... (give it up)"', type: "passive", result: "You feel a bit sad because you wanted to play too." },
        { label: '"Can I play with your toy?"', type: "prosocial", result: "You both have fun playing together!" }
      ]
    },
    {
      id: 2,
      image: socialChoice2,
      situation: "A group of kids is playing tag in the park. You want to join them. How doo you join?",
      options: [
        { label: "Run in and push someone", type: "aggressive", result: "The kids get upset and stop playing. 'Hey, that wasn't nice!'" },
        { label: "Stand silently and watch", type: "passive", result: "The kids don't see you and keep playing without you. You feel lonely." },
        { label: 'Ask, "Can I play too?"', type: "prosocial", result: "The kids smile and say, 'Sure! You're It!' Everyone has fun running." }
      ]
    },
    {
      id: 3,
      image: socialChoice3,
      situation: "You and your friend are racing. Your friend runs faster and wins. How do you respond?",
      options: [
        { label: 'Scream "You cheated!"', type: "aggressive", result: "Your friend feels hurt and doesn't want to race anymore." },
        { label: "Sit down and refuse to move", type: "passive", result: "The game is over, and you both feel bored and annoyed." },
        { label: 'Say "Good job! You are fast!"', type: "prosocial", result: "Your friend feels proud and says, 'Thanks! Let's race again!'" }
      ]
    },
    {
      id: 4,
      image: socialChoice4,
      situation: "You accidentally knock over a tower of blocks your classmate built. What do you do?",
      options: [
        { label: "Run away quickly", type: "passive", result: "Your classmate cries because they don't know who did it." },
        { label: 'Laugh and say "It fell!"', type: "aggressive", result: "Your classmate gets angry because they think you did it on purpose." },
        { label: 'Say "Oops, sorry! I will help fix it."', type: "prosocial", result: "Your classmate feels better because you are helping them rebuild." }
      ]
    },
    {
      id: 5,
      image: socialChoice5,
      situation: "Your friend is excitedly showing you a drawing they made of a dragon. How do you respond?",
      options: [
        { label: "Look away and talk about your toy", type: "passive", result: "Your friend puts the drawing away sadly because you didn't look." },
        { label: 'Say "That looks weird."', type: "aggressive", result: "Your friend feels embarrassed and hurt." },
        { label: 'Ask "Wow! Is that fire?"', type: "prosocial", result: "Your friend lights up and happily tells you a story about the dragon." }
      ]
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0); // Tracks which scenario we are on
  const [selectedResult, setSelectedResult] = useState(null); // Tracks if user has clicked an option
  const [isFinished, setIsFinished] = useState(false); // Tracks if all scenarios are done

  // Handle user selection
  const handleOptionClick = (result) => {
    setSelectedResult(result);
  };

  // Move to next scenario
  const handleNext = () => {
    if (currentIndex < scenarios.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedResult(null);
    } else {
      setIsFinished(true);
    }
  };

  // Reset Game
  const restartGame = () => {
    setCurrentIndex(0);
    setSelectedResult(null);
    setIsFinished(false);
  };

  
  // 1. If Game is Finished
  if (isFinished) {
    return (
      <div className="game-box">
        <h3>🎉 Amazing Job! 🎉</h3>
        <p>You have completed all the social scenarios.</p>
        <button className="confirm-btn" onClick={restartGame}>Play Again</button>
      </div>
    );
  }

  // 2. Get current scenario data
  const currentScenario = scenarios[currentIndex];

  return (
    <div className="game-box">
      {/* Image */}
      <img 
        src={currentScenario.image} 
        alt="Social Situation" 
        className="scenario-image" 
      />

      {/* Situation Description */}
      <div className="situation-box">
        <p className="situation-text">{currentScenario.situation}</p>
      </div>

      {/* Logic: Show Options OR Show Result */}
      {!selectedResult ? (
        <div className="choice-list">
          {currentScenario.options.map((option, index) => (
            <button 
              key={index} 
              className={`social-btn ${option.type}`} 
              onClick={() => handleOptionClick(option.result)}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : (
        <div className="outcome">
          <p className="outcome-text">{selectedResult}</p>
          <button className="next-btn" onClick={handleNext}>
            {currentIndex === scenarios.length - 1 ? "Finish Game" : "Next Scenario ➡"}
          </button>
        </div>
      )}
    </div>
  );
};
// --- GAME 4: SPATIAL SEQUENCE (MEMORY MATCH) ---
const SpatialSequence = () => {
  const colors = ["red", "blue", "green"];
  const [sequence, setSequence] = useState([]);
  const [isShowing, setIsShowing] = useState(false); // True when showing the pattern
  const [activeColor, setActiveColor] = useState(null); // The specific color currently flashing
  const [userIndex, setUserIndex] = useState(0); // Track which step the user is on
  const [gameStatus, setGameStatus] = useState("idle"); // idle, playing, won, lost
  const [msg, setMsg] = useState("Click Start to play Memory Match");

  // Start the game
  const startGame = () => {
    const startColor = colors[Math.floor(Math.random() * 3)];
    const newSeq = [startColor];
    setSequence(newSeq);
    setGameStatus("playing");
    playSequence(newSeq);
  };

  // Logic to flash the colors one by one
  const playSequence = async (seq) => {
    setIsShowing(true);
    setMsg("Watch the colors...");
    setUserIndex(0); // Reset user progress for this turn

    for (let i = 0; i < seq.length; i++) {
      // 1. Show color
      setActiveColor(seq[i]);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Show for 1 second

      // 2. Hide color (white/blank)
      setActiveColor(null);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Wait 0.5s before next
    }

    setIsShowing(false);
    setMsg("Now it's your turn! Tap the colors.");
  };

  // Handle User Click
  const handleColorClick = (color) => {
    // Prevent clicking if we are showing the sequence or game is over
    if (isShowing || gameStatus !== "playing") return;

    // Check if correct
    if (color === sequence[userIndex]) {
      // Correct click
      if (userIndex + 1 === sequence.length) {
        // Round Complete!
        if (sequence.length === 5) {
          setGameStatus("won");
          setMsg("🎉 YOU WON! You remembered all 5 colors!");
        } else {
          setMsg("Correct! Get ready for the next color...");
          setTimeout(() => {
            const nextColor = colors[Math.floor(Math.random() * 3)];
            const newSeq = [...sequence, nextColor];
            setSequence(newSeq);
            playSequence(newSeq);
          }, 1000);
        }
      } else {
        // Correct, but more colors left in the sequence
        setUserIndex(userIndex + 1);
      }
    } else {
      // Wrong click
      setGameStatus("lost");
      setMsg("Oops! That was the wrong color.");
    }
  };

  return (
    <div className="game-box">
      <h3 className="memory-msg">{msg}</h3>

      {/* The Display Box (Shows the color to memorize) */}
      <div 
        className={`display-box ${activeColor ? activeColor : ""}`}
      >
        {activeColor ? "" : "?"}
      </div>

      {/* The Input Buttons (Hidden or Disabled while watching) */}
      <div className={`simon-grid ${isShowing ? "disabled" : ""}`}>
        {colors.map((c) => (
          <div
            key={c}
            className={`color-btn ${c}`}
            onClick={() => handleColorClick(c)}
          />
        ))}
      </div>

      {/* Controls */}
      {gameStatus === "idle" && (
        <button className="confirm-btn" onClick={startGame}>Start Game</button>
      )}
      {(gameStatus === "won" || gameStatus === "lost") && (
        <button className="confirm-btn" onClick={startGame}>Try Again</button>
      )}
      
      {gameStatus === "playing" && (
        <p>Level: {sequence.length} / 5</p>
      )}
    </div>
  );
};