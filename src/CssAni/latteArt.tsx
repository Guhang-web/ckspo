import { useState } from "react";
import "./latteArt.css";

export default function LatteArt() {
    const [tick, setTick] = useState(0);

    return (
        <button
            type="button"
            className="latteArt"
            onClick={() => setTick((t) => t + 1)}
            aria-label="Latte art heart. Click to redraw."
        >
            <svg
                key={tick}
                className="latteArtSvg"
                viewBox="0 0 300 300"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-hidden="true"
            >
                <defs>
                    {/* 커피 크레마 느낌 */}
                    <radialGradient id="crema" cx="45%" cy="35%" r="70%">
                        <stop offset="0" stopColor="#d6a06a" />
                        <stop offset="0.55" stopColor="#b8773f" />
                        <stop offset="1" stopColor="#7a4b25" />
                    </radialGradient>

                    {/* 컵 림 (기존 그라데이션 유지) */}
                    <linearGradient id="rim" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
                        <stop offset="1" stopColor="#ffffff" stopOpacity="0.35" />
                    </linearGradient>

                    {/* 하트 채움(라떼아트 흰 우유) */}
                    <radialGradient id="milk" cx="45%" cy="40%" r="70%">
                        <stop offset="0" stopColor="#ffffff" stopOpacity="0.98" />
                        <stop offset="0.7" stopColor="#fff7f0" stopOpacity="0.95" />
                        <stop offset="1" stopColor="#ffe9d6" stopOpacity="0.9" />
                    </radialGradient>

                    {/* 손잡이 바디 살짝 유광 느낌 */}
                    <linearGradient id="handleFill" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0" stopColor="#ffffff" stopOpacity="0.25" />
                        <stop offset="1" stopColor="#ffffff" stopOpacity="0.05" />
                    </linearGradient>
                </defs>

                {/* =========================
            1) 손잡이
           ========================= */}
                <path
                    d="
                    M252 122
                    L276 122
                    C280 122 280 140 276 140
                    L252 140
                    Z "
                    fill="#6d6d6d"
                    stroke="#6d6d6d"
                    strokeOpacity="0.9"
                    strokeWidth="2"
                    strokeLinejoin="round"
                />
                {/* =========================
             컵/커피 (원형)
           ========================= */}
                {/* 커피 크레마 */}
                <circle cx="150" cy="130" r="100" fill="url(#crema)" />

                {/* 림(기존) */}
                <circle
                    cx="150"
                    cy="150"
                    r="126"
                    fill="none"
                    stroke="url(#rim)"
                    strokeWidth="6"
                />
                {/* 테두리 */}
                <circle
                    cx="150"
                    cy="130"
                    r="101"
                    fill="none"
                    stroke="#6d6d6d"
                    strokeOpacity="0.9"
                    strokeWidth="2"
                />

                {/* =========================
            3) 하트 라인(그려지는 선)
           ========================= */}
                <path
                    className="heartLine"
                    pathLength={1000}
                    d="
            M150 112
            C138 96, 112 96, 104 116
            C95 140, 116 158, 150 180
            C184 158, 205 140, 196 116
            C188 96, 162 96, 150 112
            Z
          "
                    fill="none"
                />

                {/* 하트 채움 */}
                <path
                    className="heartFill"
                    d="
            M150 112
            C138 96, 112 96, 104 116
            C95 140, 116 158, 150 180
            C184 158, 205 140, 196 116
            C188 96, 162 96, 150 112
            Z
          "
                    fill="url(#milk)"
                />
            </svg>
        </button>
    );
}
