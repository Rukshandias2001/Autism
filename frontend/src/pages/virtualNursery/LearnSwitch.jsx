import { lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import "../../styles/virtualNurseyStyles/LearnSwitch.css";

// Use the single reusable LearnPage for common topics
const LearnPage = lazy(() => import("../virtualNursery/learn/LearnPage"));

// images for LearnPage variants
import numbersImg from "../../assets/numbers1.png";
import shapesImg from "../../assets/shapes1.png";
import coloursImg from "../../assets/colours1.png";
import animalsImg from "../../assets/animals1.png";
import fruitsImg from "../../assets/fruits1.png";

function Loading() {
  return (
    <div className="learn-loading">
      <div className="spinner"></div>
      <h1>Loading...</h1>
    </div>
  );
}

function NotFound() {
  return (
    <div className="notfound-container">
      <div className="notfound-text">
        <h1>😔 Sorry, page not found</h1>
        <p>Looks like you wandered off the path…</p>
      </div>
    </div>
  );
}

export default function LearnSwitch() {
  const { category } = useParams();

  const pageConfig = {
    numbers: { title: "Numbers", image: numbersImg, defaultTopic: "numbers" },
    shapes: { title: "Shapes", image: shapesImg, defaultTopic: "shapes" },
    colors: { title: "Colours", image: coloursImg, defaultTopic: "colours" },
    animals: { title: "Animals", image: animalsImg, defaultTopic: "animals" },
    fruits: { title: "Fruits", image: fruitsImg, defaultTopic: "fruits" },
  };

  const isReusablePage = !!pageConfig[category];

  return (
    <Suspense fallback={<Loading />}>
      {isReusablePage ? (
        <LearnPage
          title={pageConfig[category].title}
          image={pageConfig[category].image}
          defaultTopic={pageConfig[category].defaultTopic}
        />
      ) : (
        <NotFound />
      )}
    </Suspense>
  );
}