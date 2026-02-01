
// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

// Shared
import NavBar from "./components/NavBar";
import HomeHero from "./pages/Home";

// Utils
import { initVoices } from "./Utils/voiceHelper";

// Speech Therapy
import CategoryPage from "./pages/speechTherapy/CategoryPage";
import SpeechHome from "./pages/speechTherapy/SpeechHome";
import ParentDashboard from "./pages/speechTherapy/ParentDashboard";
import TherapistDashboard from "./pages/speechTherapy/TherapistDashboard";
import TherapistDashboardSpeechStats from "./pages/speechTherapy/TherapistDashboardSpeechStats";

// Emotion Simulator
import ParallaxMagic from "./pages/emotionSimulator/ParallaxMagic";
import HappyLesson from "./pages/emotionSimulator/HappyLesson";
import EmotionActivity from "./pages/emotionSimulator/EmotionActivity";
import ExpressionPractice from "./pages/emotionSimulator/ExpressionPractice";
import Login from "./pages/authentication/Login";
import Signup from "./pages/authentication/SignUp";
import ContentManager from "./pages/emotionSimulator/ContentManager";
import ContentGrid from "./pages/emotionSimulator/ContentGrid";
import RequireAuth from "./auth/RequireAuth";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import MentorDashboard from "./pages/mentor/MentorDashboard";
import ReportsIndex from "./pages/mentor/ReportsIndex";
import ChildReport from "./pages/mentor/ChildReport";
import MentorChildProgress from "./pages/mentor/MentorChildProgress";
import ScenariosPage from "./pages/mentor/ScenariosPage";

// Blogs + Nursery
import AddBlogs from "./pages/blogs/AddBlogs";
import BlogsHome from "./pages/blogs/BlogHome";
import BlogList from "./pages/blogs/BlogsCard";
import BlogDetail from "./pages/blogs/BlogDetail";
import EditBlogs from "./pages/blogs/EditBlogs.jsx"
import VirtualNursery from "./pages/virtualNursery/NurseryHome";
import NurseryDashboard from "./pages/virtualNursery/NurseryDashboard";
import NurseryActivity from "./pages/virtualNursery/NurseryActivity";
import NurseryLearnActivity from "./pages/virtualNursery/LearnSwitch";
import ActivitySwitch from "./pages/virtualNursery/ActivitySwitch";
import AlphabetLearn from "./pages/virtualNursery/learn/AlphabetLearn"

//RoutineBuilder
import RoutineHome from "./pages/routineBuilder/RoutineHome";

//Interactive Games
import InteractiveGames from "./pages/games/InteractiveGames.jsx";
import AdminGames from './pages/games/AdminGames.jsx';

// Child Interface
import ChildAuth from "./pages/child/ChildAuth";
import ChildDashboard from "./pages/child/ChildDashboard";
import RoutineTimer from "./pages/child/RoutineTimer";

// Parent Child Management
import ChildRegistration from "./pages/parent/ChildRegistration";

// Navigation
import RoutineNavigation from "./pages/RoutineNavigation";

import Example from "./Example";
import NumbersLearn from "./pages/virtualNursery/learn/NumbersLearn.jsx";
import ShapesLearn from "./pages/virtualNursery/learn/ShapesLearn.jsx";
import ColoursLearn from "./pages/virtualNursery/learn/ColoursLearn.jsx";
import AnimalsLearn from "./pages/virtualNursery/learn/AnimalsLearn.jsx";
import FruitsLearn from "./pages/virtualNursery/learn/FruitsLearn.jsx";

// Simple stubs
function Routine() {
  return <div style={{ padding: 20 }}>📅 Routine Builder (stub)</div>;
}
function Games() {
  return <div style={{ padding: 20 }}>🎮 Interactive Games (stub)</div>;
}
function Profile() {
  return <div style={{ padding: 20 }}>👤 Profile (stub)</div>;

}

export default function App() {
  useEffect(() => {
    initVoices((voice) => {
      console.log("✅ Voices ready:", voice.name);
    });
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Inner component uses router hooks to decide whether to show NavBar */}
        <InnerRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
  
  function InnerRoutes() {
    const location = useLocation();
    const hideNav = location.pathname === "/login" || location.pathname === "/signup";
    const { user } = useAuth();
    // If user not logged in, restrict access to only login/signup pages
    const isAuthPage = hideNav;
    if (!user && !isAuthPage) return <Navigate to="/login" replace />;
    return (
      <>
        {!hideNav && <NavBar />}
        <Routes>
        {/* Public */}
        <Route path="/" element={<HomeHero />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />

        {/* Speech Therapy Tool */}
        <Route path="/speech-home" element={<SpeechHome />} />
        <Route path="/cards/:category" element={<CategoryPage />} />
        <Route path="/parent-dashboard" element={<ParentDashboard />} />
        <Route path="/therapist-dashboard" element={<TherapistDashboard />} />
        <Route path="/TherapistDashboardSpeechStats" element={<TherapistDashboardSpeechStats />} />

        {/* Emotion Simulator */}
        <Route path="/lesson" element={<ParallaxMagic />} />
        <Route path="/lesson/:emotion" element={<HappyLesson />} />
        <Route path="/lesson/:emotion/activity" element={<EmotionActivity />} />
        <Route path="/lesson/:emotion/content" element={<ContentGrid />} />
        <Route path="/contents" element={<ContentManager />} />

        <Route path="/mentor" element={<MentorDashboard />}>
          <Route index element={<Navigate to="reports" replace />} />
          <Route path="reports" element={<ReportsIndex />} />
          <Route path="reports/:childId" element={<ChildReport />} />
          <Route path="progress/:childId" element={<MentorChildProgress />} />
          <Route path="scenarios" element={<ScenariosPage />} />
          <Route path="content" element={<ContentManager />} />
        </Route>

        {/* Practice (guarded) */}
        <Route element={<RequireAuth roles={["parent", "mentor"]} />}>
          <Route path="/practice/:emotion" element={<ExpressionPractice />} />
        </Route>

        {/* Mentor-only area */}
        <Route element={<RequireAuth />}>
          {/* <Route element={<RequireAuth roles={["mentor"]} />}> */}
          <Route path="/mentor" element={<MentorDashboard />}>
            <Route index element={<Navigate to="reports" replace />} />
            <Route path="reports" element={<ReportsIndex />} />
            <Route path="reports/:childId" element={<ChildReport />} />
            <Route path="progress/:childId" element={<MentorChildProgress />} />
            <Route path="scenarios" element={<ScenariosPage />} />
            <Route path="content" element={<ContentManager />} />
          </Route>
        </Route>

        {/* Blogs */}
        <Route path="/blogs" element={<BlogsHome />} />
        <Route path="/blogs/list" element={<BlogList />} />
        <Route path="/blogs/new" element={<AddBlogs />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
        <Route path="/blogs/edit/:id" element={<EditBlogs />} />

        {/* Virtual Nursery */}
        <Route path="/virtualNursery" element={<VirtualNursery />} />
        <Route path="/nurseryDashboard" element={<NurseryDashboard />} />
        <Route path="/nursery/:category/select" element={<NurseryActivity />} />
        <Route
          path="/nursery/:category/learn"
          element={<NurseryLearnActivity />}
        />
        <Route
          path="/nursery/:category/activity-mode"
          element={<ActivitySwitch />}
        />
            
        <Route path="/alphabets" element={<AlphabetLearn  />} />
        <Route path="/numbers" element={<NumbersLearn  />} />
        <Route path="/shapes" element={<ShapesLearn  />} />
        <Route path="/colors" element={<ColoursLearn />} />
        <Route path="/animals" element={<AnimalsLearn  />} />
        <Route path="/fruits" element={<FruitsLearn  />} />

        {/* Routine Navigation */}
        <Route path="/accounts" element={<RoutineNavigation />} />

        {/* Routine Builder */}
        <Route path="/routine" element={<RoutineHome />} />
               <Route path="/games" element={<InteractiveGames />} />

        {/* Child Interface */}
        <Route path="/child/login" element={<ChildAuth />} />
        <Route path="/child/dashboard" element={<ChildDashboard />} />
        <Route path="/child/routine/:routineId" element={<RoutineTimer />} />

        {/* Parent Child Management */}
        <Route element={<RequireAuth roles={["parent"]} />}>
          <Route path="/parent/children" element={<ChildRegistration />} />
        </Route>

        {/* Example */}
        <Route path="/example" element={<Example />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </>
    );
  }
}
