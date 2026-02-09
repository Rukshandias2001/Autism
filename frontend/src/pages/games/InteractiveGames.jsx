// InteractiveGames.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/games/InteractiveGames.css";

import redbus from "../../assets/redbus.png";
import bluebus from "../../assets/bluebus.png";
import yellowbus from "../../assets/yellowbus.png";

import socialChoice1 from "../../assets/socialChoice1.png";
import socialChoice2 from "../../assets/socialChoice2.png";
import socialChoice3 from "../../assets/socialChoice3.png";
import socialChoice4 from "../../assets/socialChoice4.png";
import socialChoice5 from "../../assets/socialChoice5.png";

const GAME_ORDER = ["Routine", "Transport", "Social", "Spatial"];

export default function InteractiveGames() {
  const navigate = useNavigate();

  const [activeGame, setActiveGame] = useState("Routine");
  const [childData, setChildData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [coins, setCoins] = useState(234); // UI-only like the samples (optional)

  const [scores, setScores] = useState({
    routine: 0,
    transport: 0,
    social: 0,
    spatial: 0,
  });

  const [completedGames, setCompletedGames] = useState({
    routine: false,
    transport: false,
    social: false,
    spatial: false,
  });

  useEffect(() => {
    document.title = "Interactive Games";

    const childAuth = localStorage.getItem("childAuth");
    if (!childAuth) {
      alert("Please log in as a child to play these games.");
      navigate("/child/login");
      return;
    }

    try {
      const authData = JSON.parse(childAuth);
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

  const canAccessGame = (gameName) => {
    const gameIndex = GAME_ORDER.indexOf(gameName);
    if (gameIndex === 0) return true;

    for (let i = 0; i < gameIndex; i++) {
      const prevGame = GAME_ORDER[i].toLowerCase();
      if (!completedGames[prevGame]) return false;
    }
    return true;
  };

  const isGameCompleted = (gameName) => completedGames[gameName.toLowerCase()];

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

  const handleGameComplete = (gameName, score) => {
    const newScores = { ...scores, [gameName]: score };
    setScores(newScores);

    const newCompleted = { ...completedGames, [gameName]: true };
    setCompletedGames(newCompleted);

    // Optional reward UI like kid games
    setCoins((c) => c + score * 3);

    if (gameName === "routine") setActiveGame("Transport");
    else if (gameName === "transport") setActiveGame("Social");
    else if (gameName === "social") setActiveGame("Spatial");
    else if (gameName === "spatial") submitToBackend(newScores);
  };

  const submitToBackend = async (finalScores) => {
    const payload = {
      routine: finalScores.routine,
      transport: finalScores.transport,
      social: finalScores.social,
      spatial: finalScores.spatial,
    };

    try {
      const childAuth = JSON.parse(localStorage.getItem("childAuth") || "{}");
      const token = childAuth.token;

      if (!token) {
        alert("Authentication error. Please log in again.");
        navigate("/child/login");
        return;
      }

      const response = await fetch(
        "https://express-api-440581871543.us-central1.run.app/api/scores/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
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

  const theme = useMemo(() => {
    // 4 different “screens” like your examples
    if (activeGame === "Routine") {
      return {
        name: "workshop",
        title: "Morning Workshop",
        subtitle: "Put the steps in the correct order!",
        icon: "🛠️",
      };
    }
    if (activeGame === "Transport") {
      return {
        name: "shop",
        title: "Bus Stop Shop",
        subtitle: "Find the correct bus!",
        icon: "🚌",
      };
    }
    if (activeGame === "Social") {
      return {
        name: "garden",
        title: "Friendship Garden",
        subtitle: "Choose the kindest option!",
        icon: "🌼",
      };
    }
    return {
      name: "space",
      title: "Space Memory",
      subtitle: "Watch the colors and repeat!",
      icon: "🪐",
    };
  }, [activeGame]);

  const renderGame = () => {
    switch (activeGame) {
      case "Routine":
        return (
          <RoutineGame
            onComplete={(score) => handleGameComplete("routine", score)}
          />
        );
      case "Transport":
        return (
          <TransportGame
            onComplete={(score) => handleGameComplete("transport", score)}
          />
        );
      case "Social":
        return (
          <SocialScripting
            onComplete={(score) => handleGameComplete("social", score)}
          />
        );
      case "Spatial":
        return (
          <SpatialSequence
            onComplete={(score) => handleGameComplete("spatial", score)}
          />
        );
      default:
        return <div className="igCard">Select a game from the menu</div>;
    }
  };

  if (isLoading) {
    return (
      <div className="igPage">
        <div className="igLoading">Loading...</div>
      </div>
    );
  }

  const progressPct =
    (Object.values(completedGames).filter(Boolean).length / 4) * 100;

  return (
    <div className="igPage">
      <div className={`igScene ${theme.name}`}>
        {/* Top bar like your sample screens */}
        <div className="igTopBar">
          <button className="igCircleBtn" onClick={() => navigate(-1)} aria-label="Back">
            ←
          </button>

          <div className="igTopTitle">
            <span className="igTopIcon">{theme.icon}</span>
            <div>
              <div className="igTopTitleMain">{theme.title}</div>
              <div className="igTopTitleSub">{theme.subtitle}</div>
            </div>
          </div>

          <div className="igTopRight">
            <div className="igCoinPill" title="Coins">
              🪙 <span>{coins}</span>
            </div>
            <button className="igCircleBtn danger" onClick={() => navigate("/child/home")} aria-label="Close">
              ✕
            </button>
          </div>
        </div>

        {/* Tabs like “different sections” in cute games */}
        <div className="igTabs">
          {["Routine", "Transport", "Social", "Spatial"].map((g) => {
            const locked = !canAccessGame(g);
            const done = isGameCompleted(g);
            const active = activeGame === g;
            const key = g.toLowerCase();
            const scoreVal = scores[key];

            return (
              <button
                key={g}
                className={`igTab ${active ? "active" : ""} ${done ? "done" : ""}`}
                onClick={() => handleGameSelect(g)}
                disabled={locked || done}
              >
                <span className="igTabLabel">
                  {g === "Routine" && "Routine"}
                  {g === "Transport" && "Transport"}
                  {g === "Social" && "Social"}
                  {g === "Spatial" && "Memory"}
                </span>

                {locked && !done && <span className="igTabBadge lock">🔒</span>}
                {done && <span className="igTabBadge done">✅</span>}
                {scoreVal > 0 && <span className="igTabBadge score">{scoreVal}/5</span>}
              </button>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="igProgressWrap">
          <div className="igProgressBar">
            <div className="igProgressFill" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="igProgressText">{Math.round(progressPct)}% complete</div>
        </div>

        {/* Stage area (this is where each game renders) */}
        <div className="igStage">{renderGame()}</div>
      </div>
    </div>
  );
}

/* ===================== GAME 1: ROUTINE ===================== */
const RoutineGame = ({ onComplete }) => {
  const initial = ["Alarm Off", "Brush Teeth", "Wash Face", "Get Dressed", "Eat Breakfast"];
  const [items, setItems] = useState(["Brush Teeth", "Wash Face", "Alarm Off", "Eat Breakfast", "Get Dressed"]);
  const [feedback, setFeedback] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const moveItem = (idx, direction) => {
    if (isSubmitted) return;
    const newItems = [...items];
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    [newItems[idx], newItems[targetIdx]] = [newItems[targetIdx], newItems[idx]];
    setItems(newItems);
  };

  const checkOrder = () => {
    if (isSubmitted) return;
    setIsSubmitted(true);

    let score = 0;
    items.forEach((item, index) => {
      if (item === initial[index]) score++;
    });

    setFeedback(score === 5 ? "Perfect! 🌟" : `Nice try! You got ${score}/5`);
    setTimeout(() => onComplete(score), 1300);
  };

  return (
    <div className="igCard">
      <div className="igCardHeader">
        <div className="igCardTitle">Arrange the routine</div>
        <div className="igCardHint">Use ↑ ↓ to move steps</div>
      </div>

      <div className="igList">
        {items.map((item, i) => (
          <div key={item} className="igRow">
            <div className="igRowLeft">
              <div className="igStep">{i + 1}</div>
              <div className="igRowText">
                <div className="igRowMain">{item}</div>
                <div className="igRowSub">{isSubmitted ? "Locked ✅" : "Move me ↕️"}</div>
              </div>
            </div>

            <div className="igRowBtns">
              <button onClick={() => moveItem(i, -1)} disabled={isSubmitted} aria-label="Move up">
                ↑
              </button>
              <button onClick={() => moveItem(i, 1)} disabled={isSubmitted} aria-label="Move down">
                ↓
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="igBigBtn" onClick={checkOrder} disabled={isSubmitted}>
        {isSubmitted ? "Submitted..." : "Confirm"}
      </button>

      {feedback && <div className="igFeedback">{feedback}</div>}
    </div>
  );
};

/* ===================== GAME 2: TRANSPORT ===================== */
const TransportGame = ({ onComplete }) => {
  const steps = [
    { img: bluebus, action: "ignore", msg: "1) Blue 223 bus. Is it yours?" },
    { img: yellowbus, action: "ignore", msg: "2) Yellow 118 bus. Is it yours?" },
    { img: bluebus, action: "ignore", msg: "3) Green 550 bus. Is it yours?" },
    { img: yellowbus, action: "ignore", msg: "4) Purple 990 bus. Is it yours?" },
    { img: redbus, action: "getIn", msg: "5) Red 118 bus. Is it yours?" },
  ];

  const [step, setStep] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [status, setStatus] = useState("Goal: Get on Red Bus #118");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChoice = (choice) => {
    if (isProcessing) return;
    setIsProcessing(true);

    const isCorrect = choice === steps[step].action;
    const newScore = isCorrect ? currentScore + 1 : currentScore;
    if (isCorrect) setCurrentScore(newScore);

    if (step === steps.length - 1) {
      setStatus(isCorrect ? "Great! You got on the right bus! ✅" : "Oops! Wrong choice 😅");
      setTimeout(() => onComplete(newScore), 1000);
      return;
    }

    setStatus(isCorrect ? "Correct! Next bus..." : "Not this one... Next bus...");
    setTimeout(() => {
      setStep((s) => s + 1);
      setIsProcessing(false);
    }, 350);
  };

  return (
    <div className="igCard">
      <div className="igCardHeader">
        <div className="igCardTitle">Bus Catching</div>
        <div className="igCardHint">{status}</div>
      </div>

      <div className="igMini">
        <span className="igPill">Step {step + 1}/5</span>
        <span className="igPill">Score {currentScore}/5</span>
      </div>

      <div className="igBusScene">
        <img src={steps[step].img} alt="Bus" className="igBusImg" />
        <div className="igQuestion">{steps[step].msg}</div>

        <div className="igBtnRow">
          <button className="igSmallBtn gray" onClick={() => handleChoice("ignore")} disabled={isProcessing}>
            Ignore
          </button>
          <button className="igSmallBtn green" onClick={() => handleChoice("getIn")} disabled={isProcessing}>
            Get In
          </button>
        </div>
      </div>
    </div>
  );
};

/* ===================== GAME 3: SOCIAL ===================== */
const SocialScripting = ({ onComplete }) => {
  const scenarios = [
    {
      id: 1,
      image: socialChoice1,
      situation: "A friend wants to play with your toy. What do you do?",
      options: [
        { label: '"No! Go away!"', type: "aggressive" },
        { label: '"Okay..." (give it)', type: "passive" },
        { label: '"Sure! Let’s share!"', type: "prosocial" },
      ],
    },
    {
      id: 2,
      image: socialChoice2,
      situation: "Kids are playing tag. You want to join.",
      options: [
        { label: "Push someone and run in", type: "aggressive" },
        { label: "Stand and watch quietly", type: "passive" },
        { label: 'Ask: "Can I play too?"', type: "prosocial" },
      ],
    },
    {
      id: 3,
      image: socialChoice3,
      situation: "Your friend wins a race.",
      options: [
        { label: 'Shout "You cheated!"', type: "aggressive" },
        { label: "Refuse to talk", type: "passive" },
        { label: 'Say "Good job!"', type: "prosocial" },
      ],
    },
    {
      id: 4,
      image: socialChoice4,
      situation: "You knock over a blocks tower.",
      options: [
        { label: "Run away", type: "passive" },
        { label: "Laugh about it", type: "aggressive" },
        { label: "Say sorry and help fix it", type: "prosocial" },
      ],
    },
    {
      id: 5,
      image: socialChoice5,
      situation: "A friend shows you a cool drawing.",
      options: [
        { label: "Look away", type: "passive" },
        { label: 'Say "That’s weird"', type: "aggressive" },
        { label: 'Say "Wow! Tell me more!"', type: "prosocial" },
      ],
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedResult, setSelectedResult] = useState(null);
  const [score, setScore] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleOptionClick = (type) => {
    if (isProcessing || selectedResult) return;
    setIsProcessing(true);

    let point = 0;
    let msg = "";

    if (type === "prosocial") {
      point = 1;
      msg = "Great choice! 🌟 (+1)";
    } else if (type === "aggressive") {
      msg = "That may hurt feelings 😐 (+0)";
    } else {
      msg = "You might feel sad later 😐 (+0)";
    }

    setScore((s) => s + point);
    setSelectedResult(msg);
    setIsProcessing(false);
  };

  const handleNext = () => {
    if (isProcessing) return;
    setIsProcessing(true);

    if (currentIndex < scenarios.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedResult(null);
      setIsProcessing(false);
    } else {
      onComplete(score);
    }
  };

  const current = scenarios[currentIndex];

  return (
    <div className="igCard">
      <div className="igCardHeader">
        <div className="igCardTitle">Social Choices</div>
        <div className="igCardHint">Pick the kindest answer</div>
      </div>

      <div className="igMini">
        <span className="igPill">Scenario {currentIndex + 1}/5</span>
        <span className="igPill">Score {score}/5</span>
      </div>

      <img src={current.image} alt="Scenario" className="igScenarioImg" />
      <div className="igQuestion">{current.situation}</div>

      {!selectedResult ? (
        <div className="igChoices">
          {current.options.map((o, idx) => (
            <button
              key={idx}
              className={`igChoice ${o.type}`}
              onClick={() => handleOptionClick(o.type)}
              disabled={isProcessing}
            >
              {o.label}
            </button>
          ))}
        </div>
      ) : (
        <div className="igResultBox">
          <div className="igResultText">{selectedResult}</div>
          <button className="igSmallBtn orange" onClick={handleNext} disabled={isProcessing}>
            {currentIndex === scenarios.length - 1 ? "Finish" : "Next ➜"}
          </button>
        </div>
      )}
    </div>
  );
};

/* ===================== GAME 4: SPATIAL (MEMORY) ===================== */
const SpatialSequence = ({ onComplete }) => {
  const colors = ["red", "blue", "green"];
  const [sequence, setSequence] = useState([]);
  const [isShowing, setIsShowing] = useState(false);
  const [activeColor, setActiveColor] = useState(null);
  const [userIndex, setUserIndex] = useState(0);
  const [gameStatus, setGameStatus] = useState("idle");
  const [msg, setMsg] = useState("Press Start to play");
  const [isProcessing, setIsProcessing] = useState(false);

  const [currentLevel, setCurrentLevel] = useState(0);

  const startGame = () => {
    if (isProcessing) return;
    const startColor = colors[Math.floor(Math.random() * 3)];
    const newSeq = [startColor];
    setSequence(newSeq);
    setGameStatus("playing");
    setCurrentLevel(0);
    playSequence(newSeq);
  };

  const playSequence = async (seq) => {
    setIsShowing(true);
    setIsProcessing(true);
    setMsg(`Level ${seq.length}/5 - Watch...`);
    setUserIndex(0);

    for (let i = 0; i < seq.length; i++) {
      setActiveColor(seq[i]);
      await new Promise((r) => setTimeout(r, 850));
      setActiveColor(null);
      await new Promise((r) => setTimeout(r, 320));
    }

    setIsShowing(false);
    setIsProcessing(false);
    setMsg("Your turn!");
  };

  const handleColorClick = (color) => {
    if (isShowing || gameStatus !== "playing" || isProcessing) return;
    setIsProcessing(true);

    if (color === sequence[userIndex]) {
      if (userIndex + 1 === sequence.length) {
        const newLevel = sequence.length;
        setCurrentLevel(newLevel);

        if (newLevel === 5) {
          setGameStatus("won");
          setMsg("🎉 YOU WON!");
          setTimeout(() => onComplete(5), 1400);
        } else {
          setMsg("Correct! Next level...");
          setTimeout(() => {
            const nextColor = colors[Math.floor(Math.random() * 3)];
            const newSeq = [...sequence, nextColor];
            setSequence(newSeq);
            playSequence(newSeq);
          }, 750);
        }
      } else {
        setUserIndex((i) => i + 1);
        setIsProcessing(false);
      }
    } else {
      setGameStatus("lost");
      setMsg("Wrong! Game Over.");
      setTimeout(() => onComplete(currentLevel), 1400);
    }
  };

  return (
    <div className="igCard">
      <div className="igCardHeader">
        <div className="igCardTitle">Memory Match</div>
        <div className="igCardHint">Watch and repeat the colors</div>
      </div>

      <div className="igMini">
        <span className="igPill">Level {Math.max(1, sequence.length)}/5</span>
        <span className="igPill">Score {currentLevel}/5</span>
      </div>

      <div className="igMemoryMsg">{msg}</div>

      <div className={`igDisplay ${activeColor ? activeColor : ""}`}>
        {activeColor ? "" : "?"}
      </div>

      <div className={`igColorRow ${isShowing || isProcessing ? "disabled" : ""}`}>
        {colors.map((c) => (
          <button
            key={c}
            className={`igColorBtn ${c}`}
            onClick={() => handleColorClick(c)}
            aria-label={c}
          />
        ))}
      </div>

      {gameStatus === "idle" && (
        <button className="igBigBtn" onClick={startGame} disabled={isProcessing}>
          Start
        </button>
      )}
    </div>
  );
};
