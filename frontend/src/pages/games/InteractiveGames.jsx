import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/games/InteractiveGames.css";
import redbus from "../../assets/redbus.png";
import bluebus from "../../assets/bluebus.png";
import yellowbus from "../../assets/yellowbus.png";
// You can reuse existing bus images for the new steps or import new ones
// For this code, I will reuse blue/yellow for the extra steps to keep it simple
import socialChoice1 from "../../assets/socialChoice1.png";
import socialChoice2 from "../../assets/socialChoice2.png";
import socialChoice3 from "../../assets/socialChoice3.png";
import socialChoice4 from "../../assets/socialChoice4.png";
import socialChoice5 from "../../assets/socialChoice5.png";

// Define game order for enforcement
const GAME_ORDER = ["Routine", "Transport", "Social", "Spatial"];

export default function InteractiveGames() {
  const navigate = useNavigate();
  const [activeGame, setActiveGame] = useState("Routine");
  const [childData, setChildData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // State to store scores for all games
  const [scores, setScores] = useState({
    routine: 0,
    transport: 0,
    social: 0,
    spatial: 0
  });

  // Track which games have been completed (to prevent going back)
  const [completedGames, setCompletedGames] = useState({
    routine: false,
    transport: false,
    social: false,
    spatial: false
  });

  useEffect(() => {
    document.title = "Interactive Games";
    
    // Check if child is authenticated
    const childAuth = localStorage.getItem("childAuth");
    if (!childAuth) {
      // Not logged in as a child, redirect to login
      alert("Please log in as a child to play these games.");
      navigate("/child/login");
      return;
    }

    try {
      const authData = JSON.parse(childAuth);
      // Verify it's a child role (not mentor/parent)
      if (!authData.token || !authData.child) {
        alert("Please log in as a child to play these games.");
        navigate("/child/login");
        return;
      }
      setChildData(authData);
      setIsLoading(false);
    } catch (err) {
      console.error("Error parsing child auth data:", err);
      navigate("/child/login");
    }
  }, [navigate]);

  // Function to check if a game can be accessed
  const canAccessGame = (gameName) => {
    const gameIndex = GAME_ORDER.indexOf(gameName);
    if (gameIndex === 0) return true; // First game is always accessible
    
    // Check if all previous games are completed
    for (let i = 0; i < gameIndex; i++) {
      const prevGame = GAME_ORDER[i].toLowerCase();
      if (!completedGames[prevGame]) {
        return false;
      }
    }
    return true;
  };

  // Function to check if a game is already completed (can't go back)
  const isGameCompleted = (gameName) => {
    return completedGames[gameName.toLowerCase()];
  };

  // Handle game selection with order enforcement
  const handleGameSelect = (gameName) => {
    if (isGameCompleted(gameName)) {
      alert(`You've already completed ${gameName}. Keep moving forward! 🚀`);
      return;
    }
    if (!canAccessGame(gameName)) {
      alert("Please complete the previous games first!");
      return;
    }
    setActiveGame(gameName);
  };

  // Function to handle moving to the next game and saving the score
  const handleGameComplete = (gameName, score) => {
    // 1. Save Score
    const newScores = { ...scores, [gameName]: score };
    setScores(newScores);
    
    // 2. Mark game as completed
    const newCompleted = { ...completedGames, [gameName]: true };
    setCompletedGames(newCompleted);
    
    console.log(`Finished ${gameName}. Score: ${score}/5`);

    // 3. Navigate to Next Game
    if (gameName === "routine") {
      setActiveGame("Transport");
    } else if (gameName === "transport") {
      setActiveGame("Social");
    } else if (gameName === "social") {
      setActiveGame("Spatial");
    } else if (gameName === "spatial") {
      // 4. Final Submission
      submitToBackend(newScores);
    }
  };

  const submitToBackend = async (finalScores) => {
    console.log("Submitting to backend:", finalScores);
    const payload = {
      routine: finalScores.routine,
      transport: finalScores.transport,
      social: finalScores.social,
      spatial: finalScores.spatial
    };

    try {
      // Get the child's token from localStorage
      const childAuth = JSON.parse(localStorage.getItem("childAuth") || "{}");
      const token = childAuth.token;

      if (!token) {
        alert("Authentication error. Please log in again.");
        navigate("/child/login");
        return;
      }

      const response = await fetch('http://localhost:5050/api/scores/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Backend Response:", data);

      if (data.success) {
        alert("Scores successfully saved to the database! ✅");
      } else {
        alert("Failed to save scores. ❌ " + (data.message || ""));
      }
    } catch (error) {
      console.error("Error submitting scores:", error);
      alert("Error connecting to server. Is the backend running?");
    }
  };

  const renderGame = () => {
    switch (activeGame) {
      case "Routine": 
        return <RoutineGame onComplete={(score) => handleGameComplete("routine", score)} />;
      case "Transport": 
        return <TransportGame onComplete={(score) => handleGameComplete("transport", score)} />;
      case "Social": 
        return <SocialScripting onComplete={(score) => handleGameComplete("social", score)} />;
      case "Spatial": 
        return <SpatialSequence onComplete={(score) => handleGameComplete("spatial", score)} />;
      default: 
        return <div className="placeholder">Select a game from the menu</div>;
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="game-wrapper">
        <div className="loading-container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="game-wrapper">
      <div className="leftContainer">
        <div className="menu">
          {["Routine", "Transport", "Social", "Spatial"].map((game) => {
            const isCompleted = isGameCompleted(game);
            const canAccess = canAccessGame(game);
            const isActive = activeGame === game;
            
            return (
              <button 
                key={game} 
                className={`menu-btn ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""} ${!canAccess ? "locked" : ""}`}
                onClick={() => handleGameSelect(game)}
                disabled={isCompleted || !canAccess}
              >
                {game === "Routine" && "Daily Routine"}
                {game === "Transport" && "Bus Catching"}
                {game === "Social" && "Social Choices"}
                {game === "Spatial" && "Memory Match"}

                {/* Show status icons */}
                {isCompleted && <span className="status-icon"> ✅</span>}
                {!canAccess && !isCompleted && <span className="status-icon"> 🔒</span>}
                
                {/* Show score if available */}
                {scores[game.toLowerCase()] > 0 && <span className="score-badge"> ({scores[game.toLowerCase()]}/5)</span>}
              </button>
            );
          })}
        </div>
        {childData && (
          <div className="child-info">
            <p>Playing as: <strong>{childData.child?.name}</strong></p>
          </div>
        )}
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
const RoutineGame = ({ onComplete }) => {
  const initial = ["Alarm Off","Brush Teeth", "Wash Face", "Get Dressed", "Eat Breakfast"];
  const [items, setItems] = useState(["Brush Teeth","Wash Face", "Alarm Off", "Eat Breakfast", "Get Dressed"]);
  const [feedback, setFeedback] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false); // Prevent double submission

  const moveItem = (idx, direction) => {
    if (isSubmitted) return; // Prevent moves after submission
    const newItems = [...items];
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    [newItems[idx], newItems[targetIdx]] = [newItems[targetIdx], newItems[idx]];
    setItems(newItems);
  };

  const checkOrder = () => {
    if (isSubmitted) return; // Prevent double submission
    setIsSubmitted(true);
    
    // Calculate Score: 1 point for every item in the correct index
    let score = 0;
    items.forEach((item, index) => {
      if (item === initial[index]) {
        score++;
      }
    });

    const isPerfect = score === 5;
    setFeedback(isPerfect ? "Great job! Perfect order." : `You got ${score}/5 correct.`);

    // Complete the game and pass score
    setTimeout(() => {
      onComplete(score);
    }, 1500); // Small delay so they can see the feedback text
  };

  return (
    <div className="game-box">
      <p>Drag buttons or use arrows to order your morning:</p>
      {items.map((item, i) => (
        <div key={item} className="routine-item">
          <span>{item}</span>
          <div>
            <button onClick={() => moveItem(i, -1)} disabled={isSubmitted}>↑</button>
            <button onClick={() => moveItem(i, 1)} disabled={isSubmitted}>↓</button>
          </div>
        </div>
      ))}
      <button className="confirm-btn" onClick={checkOrder} disabled={isSubmitted}>
        {isSubmitted ? "Submitted..." : "Confirm Order"}
      </button>
      <p className="feedback">{feedback}</p>
    </div>
  );
};

// --- GAME 2: TRANSPORTATION (Modified for 5 Steps) ---
const TransportGame = ({ onComplete }) => {
  // Added 2 more steps to make it out of 5
  const steps = [
    { img: bluebus, action: "ignore", msg: "1. Look! A Blue 223 bus. Is it ours?" },
    { img: yellowbus, action: "ignore", msg: "2. Look! A Yellow 118 bus. Is it ours?" },
    { img: bluebus, action: "ignore", msg: "3. Look! A Green 550 bus. Is it ours?" }, // Reusing image for demo
    { img: yellowbus, action: "ignore", msg: "4. Look! A Purple 990 bus. Is it ours?" }, // Reusing image for demo
    { img: redbus, action: "getIn", msg: "5. Look! A Red 118 bus. Is it ours?" }
  ];

  const [step, setStep] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [status, setStatus] = useState("Goal: Get on Red Bus #118");
  const [isProcessing, setIsProcessing] = useState(false); // Prevent rapid clicks
  const [isReady, setIsReady] = useState(false); // Prevent clicks before game loads

  // Mark game as ready after initial render
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleChoice = (choice) => {
    // Prevent clicks if not ready or already processing
    if (!isReady || isProcessing) return;
    setIsProcessing(true);

    const isCorrect = choice === steps[step].action;

    // Update local score variable (React state update is async, so we use a temp var)
    let newScore = currentScore;
    if (isCorrect) {
      newScore = currentScore + 1;
      setCurrentScore(newScore);
    }

    if (step === steps.length - 1) {
      // Game Over
      setStatus(isCorrect ? "Well done! You got on the bus!" : "Oops, wrong bus!");
      setTimeout(() => {
        onComplete(newScore);
      }, 1000);
    } else {
      // Next Step
      setStep(step + 1);
      setStatus(isCorrect ? "Correct! Waiting..." : "Wrong choice! Waiting...");
      // Allow next click after a short delay
      setTimeout(() => setIsProcessing(false), 300);
    }
  };

  return (
    <div className="game-box">
      <h3 className="game-status">{status}</h3>
      <p>Current Score: {currentScore}</p>

      {!isReady ? (
        <div className="loading-game">
          <p>Loading bus game...</p>
        </div>
      ) : step < steps.length && (
        <div className="bus-scene">
          <img 
            src={steps[step].img} 
            alt="Bus approaching" 
            className="bus-image"
          />
          <p className="instruction-text">{steps[step].msg}</p>
          <div className="button-group">
            <button 
              className="action-btn ignore" 
              onClick={() => handleChoice("ignore")}
              disabled={isProcessing}
            >
              Ignore
            </button>
            <button 
              className="action-btn get-in" 
              onClick={() => handleChoice("getIn")}
              disabled={isProcessing}
            >
              Get In
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- GAME 3: SOCIAL SCRIPTING ---
const SocialScripting = ({ onComplete }) => {
  const scenarios = [
    {
      id: 1, image: socialChoice1,
      situation: "A friend comes over wanting to play with your toy. what do you do?",
      options: [
        { label: '"No! Go away!"', type: "aggressive" },
        { label: '"Okay... (give it up)"', type: "passive" },
        { label: '"Can I play with your toy?"', type: "prosocial" }
      ]
    },
    {
      id: 2, image: socialChoice2,
      situation: "A group of kids is playing tag in the park. You want to join them.",
      options: [
        { label: "Run in and push someone", type: "aggressive" },
        { label: "Stand silently and watch", type: "passive" },
        { label: 'Ask, "Can I play too?"', type: "prosocial" }
      ]
    },
    {
      id: 3, image: socialChoice3,
      situation: "You and your friend are racing. Your friend runs faster and wins.",
      options: [
        { label: 'Scream "You cheated!"', type: "aggressive" },
        { label: "Sit down and refuse to move", type: "passive" },
        { label: 'Say "Good job! You are fast!"', type: "prosocial" }
      ]
    },
    {
      id: 4, image: socialChoice4,
      situation: "You accidentally knock over a tower of blocks your classmate built.",
      options: [
        { label: "Run away quickly", type: "passive" },
        { label: 'Laugh and say "It fell!"', type: "aggressive" },
        { label: 'Say "Oops, sorry! I will help fix it."', type: "prosocial" }
      ]
    },
    {
      id: 5, image: socialChoice5,
      situation: "Your friend is excitedly showing you a drawing of a dragon.",
      options: [
        { label: "Look away", type: "passive" },
        { label: 'Say "That looks weird."', type: "aggressive" },
        { label: 'Ask "Wow! Is that fire?"', type: "prosocial" }
      ]
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedResult, setSelectedResult] = useState(null);
  const [score, setScore] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false); // Prevent rapid clicks

  const handleOptionClick = (type) => {
    if (isProcessing || selectedResult) return; // Prevent double clicks
    setIsProcessing(true);

    let point = 0;
    let resultMsg = "";

    if (type === "prosocial") {
      point = 1;
      resultMsg = "Great choice! (+1 Point) 🌟";
    } else if (type === "aggressive") {
      resultMsg = "That might hurt feelings. (0 Points) 😐";
    } else {
      resultMsg = "You might feel sad later. (0 Points) 😐";
    }

    setScore(score + point);
    setSelectedResult(resultMsg);
    setIsProcessing(false);
  };

  const handleNext = () => {
    if (isProcessing) return;
    setIsProcessing(true);

    if (currentIndex < scenarios.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedResult(null);
      setIsProcessing(false);
    } else {
      // Finished all 5
      onComplete(score); // Pass final score
    }
  };

  const currentScenario = scenarios[currentIndex];

  return (
    <div className="game-box">
      <img src={currentScenario.image} alt="Social Situation" className="scenario-image" />
      <div className="situation-box">
        <p className="situation-text">{currentScenario.situation}</p>
      </div>

      {!selectedResult ? (
        <div className="choice-list">
          {currentScenario.options.map((option, index) => (
            <button 
              key={index} 
              className={`social-btn ${option.type}`} 
              onClick={() => handleOptionClick(option.type)}
              disabled={isProcessing}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : (
        <div className="outcome">
          <p className="outcome-text">{selectedResult}</p>
          <button className="next-btn" onClick={handleNext} disabled={isProcessing}>
            {currentIndex === scenarios.length - 1 ? "Finish Game" : "Next Scenario ➡"}
          </button>
        </div>
      )}
      <p>Score: {score}</p>
    </div>
  );
};

// --- GAME 4: SPATIAL SEQUENCE (MEMORY MATCH) ---
const SpatialSequence = ({ onComplete }) => {
  const colors = ["red", "blue", "green"];
  const [sequence, setSequence] = useState([]);
  const [isShowing, setIsShowing] = useState(false);
  const [activeColor, setActiveColor] = useState(null);
  const [userIndex, setUserIndex] = useState(0);
  const [gameStatus, setGameStatus] = useState("idle");
  const [msg, setMsg] = useState("Click Start to play Memory Match");
  const [isProcessing, setIsProcessing] = useState(false); // Prevent rapid clicks

  // Track score based on levels passed (Level 1 passed = 1 point, etc)
  const [currentLevel, setCurrentLevel] = useState(0); 

  const startGame = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    const startColor = colors[Math.floor(Math.random() * 3)];
    const newSeq = [startColor];
    setSequence(newSeq);
    setGameStatus("playing");
    setCurrentLevel(0); // Reset score on new game
    playSequence(newSeq);
  };

  const playSequence = async (seq) => {
    setIsShowing(true);
    setIsProcessing(true);
    setMsg(`Level ${seq.length}/5 - Watch carefully...`);
    setUserIndex(0);

    for (let i = 0; i < seq.length; i++) {
      setActiveColor(seq[i]);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setActiveColor(null);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setIsShowing(false);
    setIsProcessing(false);
    setMsg("Your turn!");
  };

  const handleColorClick = (color) => {
    // Prevent clicks during showing sequence, not playing, or already processing
    if (isShowing || gameStatus !== "playing" || isProcessing) return;
    setIsProcessing(true);

    if (color === sequence[userIndex]) {
      // Correct click
      if (userIndex + 1 === sequence.length) {
        // Level Complete
        const newLevel = sequence.length; // If seq length was 1, we passed level 1
        setCurrentLevel(newLevel);

        if (newLevel === 5) {
          setGameStatus("won");
          setMsg("🎉 YOU WON! Perfect Score!");
          setTimeout(() => onComplete(5), 1500); // Pass 5 points
        } else {
          setMsg("Correct! Next level...");
          setTimeout(() => {
            const nextColor = colors[Math.floor(Math.random() * 3)];
            const newSeq = [...sequence, nextColor];
            setSequence(newSeq);
            playSequence(newSeq);
          }, 1000);
        }
      } else {
        setUserIndex(userIndex + 1);
        setIsProcessing(false); // Allow next click
      }
    } else {
      // Wrong click - Game Over immediately
      setGameStatus("lost");
      setMsg("Wrong color! Game Over.");
      // Pass the current level as the score (e.g. passed level 2 = 2 points)
      setTimeout(() => onComplete(currentLevel), 1500); 
    }
  };

  return (
    <div className="game-box">
      <h3 className="memory-msg">{msg}</h3>
      <div className={`display-box ${activeColor ? activeColor : ""}`}>
        {activeColor ? "" : "?"}
      </div>
      <div className={`simon-grid ${isShowing || isProcessing ? "disabled" : ""}`}>
        {colors.map((c) => (
          <div key={c} className={`color-btn ${c}`} onClick={() => handleColorClick(c)} />
        ))}
      </div>
      {gameStatus === "idle" && (
        <button className="confirm-btn" onClick={startGame} disabled={isProcessing}>
          Start Game
        </button>
      )}
      {/* If lost/won, the parent handles navigation, so we might not need a restart button, 
          but keeping it for UI stability if needed. */}
    </div>
  );
};