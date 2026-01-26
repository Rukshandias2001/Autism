import React, {useEffect} from "react";
import "./InteractiveGames.css";

export default function InteractiveGames() {

    useEffect(() => {
        document.title = "Interactive Games - KidzConnect";
    }, []);
  return (
    <div className="container">
      <div className="leftContainer">
        <div className="menu">
            <button className="menu-btn">Alphabet</button>
            <button className="menu-btn">Colours</button>
            <button className="menu-btn">Shapes</button>
            <button className="menu-btn">Numbers</button>    
            <button className="menu-btn">Body Parts</button>    
        </div>
      </div>
      <div className="rightContainer">
        <div className="rightTopContainer">

        </div>
        <div className="rightBottomContainer">

        </div>
      </div>
    </div>
  );
}