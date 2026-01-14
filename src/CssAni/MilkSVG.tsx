import React from "react";
import "./milk.css";

export default function MilkSVG() {
  return (
    <div className="milkBox" aria-label="cute milk carton animation">
      <svg
        className="milkSVG"
        viewBox="0 0 200 300"
        preserveAspectRatio="xMidYMid meet"
        role="img"
      >
        <defs>
          {/* 우윳물 클리핑(몸통 안에서만 보이도록) */}
          <clipPath id="milk-clip">
            <rect x="56" y="82" width="88" height="70" rx="8" />
          </clipPath>
          {/* 라벨 둥근 사각 */}
          <clipPath id="label-clip">
            <rect x="60" y="118" width="80" height="26" rx="6" />
          </clipPath>
        </defs>

        {/* 전체 그룹(둥실둥실) */}
        <g className="milkGroup">
          {/* 뚜껑/상단(접힌 종이 부분) */}
          <path
            className="cartonTop"
            d="M60 60 L100 38 L140 60 L140 80 L60 80 Z"
          />
          {/* 본체 */}
          <rect className="cartonBody" x="56" y="80" width="88" height="86" rx="10" />

          {/* 빨대(살짝 흔들) */}
          <g className="strawGroup">
            <rect className="straw" x="120" y="38" width="8" height="28" rx="3" />
            <rect className="strawStripe" x="120" y="43" width="8" height="4" rx="2" />
            <rect className="strawStripe" x="120" y="51" width="8" height="4" rx="2" />
            <rect className="strawStripe" x="120" y="59" width="8" height="4" rx="2" />
          </g>

          {/* 우윳물(클립 내부 파도) */}
          <g clipPath="url(#milk-clip)" className="milkInside">
            <rect x="58" y="82" width="84" height="70" rx="8" className="milkFill" />
          </g>

          {/* 라벨 */}
          <g clipPath="url(#label-clip)">
            <rect x="60" y="120" width="80" height="24" rx="6" className="labelBg" />
            <text x="100" y="136" textAnchor="middle" className="labelText">Milk</text>
          </g>

          {/* 팔/다리 */}
          <g className="limb">
            <path d="M56 110 Q 40 112 42 124" className="milkArm" />
            <path d="M144 110 Q 160 112 158 124" className="milkArm" />
            <rect x="80" y="166" width="10" height="10" rx="3" className="milkLeg" />
            <rect x="110" y="166" width="10" height="10" rx="3" className="milkLeg" />
          </g>

          {/* 얼굴 */}
          <g className="milkFace">
            <circle cx="88" cy="103" r="3.5" className="milkEye" />
            <circle cx="112" cy="103" r="3.5" className="milkEye" />
            <path d="M94 112 Q100 116 106 112" className="milkMouth" />
          </g>
        </g>
      </svg>
    </div>
  );
}
