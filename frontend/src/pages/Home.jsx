import { useEffect, useRef } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";
import FeatureSelect from "./BugTower";
import bg from "../assets/bg-home2.png";
import forest from "../assets/play.png";
import "../styles/home-hero.css";
import monster from "../assets/monster1.png";
import monster1 from "../assets/monster2.png";
import bgEmotion from "../assets/e1.png";
import bgSpeech from "../assets/talk.png";
import bgRoutine from "../assets/r3.png";
import bgGames from "../assets/pl1.png";
import b4 from "../assets/butterfly4.png";
import b3 from "../assets/butterfly5.png";
import bgNursery from "../assets/nursury9.png";
import Lottie from "lottie-react";
const slides = [
  {
    id: 1,
    name: "Emotion Simulator",
    price: "Free",
    image: bgEmotion,
    link: "/emotion",
  },
  {
    id: 2,
    name: "Speech Therapy",
    price: "Free",
    image: bgSpeech,
    link: "/speech-home",
  },
  {
    id: 3,
    name: "Routine Builder",
    price: "Free",
    image: bgRoutine,
    link: "/routine",
  },
  { id: 4, name: "Games", price: "Free", image: bgGames, link: "/games" },
  {
    id: 5,
    name: "Nursery",
    price: "Free",
    image: bgNursery,
    link: "/virtualNursery",
  },
];

export default function HomeHero() {
  const rootRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#features") {
      document
        .getElementById("features")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const goFeatures = () =>
    document
      .getElementById("features")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (

      <div className="ls-hero-main" style={{ backgroundImage: `url(${bg})` }}>
        <div className="ls-hero-content">
          <h1 className="ls-hero-title">
            Welcome to <span>LittleStars</span>
          </h1>
          <p className="ls-hero-sub">
            Discover a magical world of learning and play!
          </p>
          <div className="ls-hero-actions">
            {user && user.role === "mentor" ? (
              <button className="ls-cta" onClick={() => navigate('/mentor')}>
                Mentor Dashboard
              </button>
            ) : (
              <button
                className="ls-cta"
                onClick={() => navigate('/accounts')}
              >
                Accounts
              </button>
            )}
          </div>
      
        </div>
      </div>
   
  );
}
