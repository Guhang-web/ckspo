import React from "react";
import "./robot.css";

export default function RobotSVG() {
  return (
    <div className="robotBox" aria-label="rusty robot animation">
      <svg
        className="robot1"
        viewBox="0 0 200 200"
        preserveAspectRatio="xMidYMid meet"
        role="img"
      >
        {/* 바닥 그림자 */}
        <ellipse className="robotShadow" cx="100" cy="172" rx="44" ry="10" />

        {/* 로봇 전체 그룹(둥실 + 살짝 흔들림) */}
        <g className="robotGroup">
          {/* 안테나 */}
          <g className="antenna">
            <line x1="100" y1="40" x2="100" y2="26" />
            <circle className="antennaLamp" cx="100" cy="22" r="5" />
          </g>

          {/* 머리 */}
          <rect className="robotHead" x="70" y="40" width="60" height="40" rx="6" />
          {/* 귀(볼트) */}
          <rect className="robotEar" x="60" y="53" width="10" height="14" rx="3" />
          <rect className="robotEar" x="130" y="53" width="10" height="14" rx="3" />

          {/* 눈(깜빡임) */}
          <circle className="robotEye robotEyeLeft" cx="85" cy="60" r="6" />
          <circle className="robotEye robotEyeRight" cx="115" cy="60" r="6" />

          {/* 입 */}
          <rect className="robotMouth" x="87" y="73" width="26" height="6" rx="3" />

          {/* 몸통 */}
          <rect className="robotBody" x="60" y="80" width="80" height="70" rx="8" />
          {/* 몸통 패널 */}
          <rect className="panel" x="72" y="94" width="56" height="30" rx="4" />
          <circle className="bolt" cx="78" cy="100" r="2.5" />
          <circle className="bolt" cx="122" cy="100" r="2.5" />
          <rect className="meterBg" x="78" y="110" width="44" height="8" rx="4" />
          <rect className="meterFill" x="78" y="110" width="24" height="8" rx="4" />

          {/* 팔(살랑) */}
          <rect className="robotArm robotLeftArm" x="45" y="92" width="14" height="44" rx="6" />
          <rect className="robotArm robotRightArm" x="140" y="92" width="14" height="44" rx="6" />

          {/* 다리 */}
          <rect className="robotLeg" x="80" y="152" width="10" height="18" rx="6" />
          <rect className="robotLeg" x="110" y="152" width="10" height="18" rx="6" />
        </g>
      </svg>
    </div>
  );
}
