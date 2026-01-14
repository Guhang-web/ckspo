import React from "react";
import "./turtle.css";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

const TurtleSVG: React.FC<Props> = ({ className = "", style }) => {
  return (
    <div className={`walk-box ${className}`} style={style} aria-label="turtle1 turtleWalk turtleArea">
      <div className="ground" />
      <div className="turtle1" aria-hidden="true">
        <div className="shell" />
        <div className="turtleHead" />
        <div className="turtleEye" />
        <div className="turtleTail" />

        <div className="turtleLeg turtleFront turtleLeft" />
        <div className="turtleLeg turtleFront turtleRight" />
        <div className="turtleLeg turtleBack turtleLeft" />
        <div className="turtleLeg turtleBack turtleRight" />
      </div>
        <div className="fish">
          <div className="fishBubble"></div>
          <div className="fishEye">
            <div className="fishEyeIn"></div>
          </div>
          <div className="fishMouth fishMouthUp"></div>
          <div className="fishMouth fishMouthDown"></div>
          <div className="fishFin"></div>
            <div className="fishTail"></div>
        </div>
    </div>
  );
};

export default TurtleSVG;
