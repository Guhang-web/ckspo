import "./americano.css"

export default function Americano() {
    return (
        <div
            className="americano"
            aria-label="Iced Americano illustration"
            role="img"
        >
            <svg
                className="americanoSvg"
                viewBox="0 0 200 300"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                preserveAspectRatio="xMidYMid meet"
            >
                <defs>
                    <linearGradient id="glassStroke" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
                        <stop offset="0.25" stopColor="#ffffff" stopOpacity="0.15" />
                        <stop offset="0.55" stopColor="#ffffff" stopOpacity="0.35" />
                        <stop offset="1" stopColor="#ffffff" stopOpacity="0.15" />
                    </linearGradient>

                    <linearGradient id="glassFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#ffffff" stopOpacity="0.18" />
                        <stop offset="1" stopColor="#ffffff" stopOpacity="0.05" />
                    </linearGradient>

                    <linearGradient id="coffee" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#7a2a24" stopOpacity="0.95" />
                        <stop offset="0.45" stopColor="#4b1512" stopOpacity="0.97" />
                        <stop offset="1" stopColor="#1a0a08" stopOpacity="0.98" />
                    </linearGradient>

                    <radialGradient id="topLight" cx="50%" cy="15%" r="70%">
                        <stop offset="0" stopColor="#ffffff" stopOpacity="0.35" />
                        <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
                    </radialGradient>

                    <radialGradient id="shadow" cx="50%" cy="50%" r="50%">
                        <stop offset="0" stopColor="#000000" stopOpacity="0.25" />
                        <stop offset="1" stopColor="#000000" stopOpacity="0" />
                    </radialGradient>

                    <clipPath id="clipInner">
                        <path
                            d="M55 28
               C56 18, 64 12, 76 12
               H124
               C136 12, 144 18, 145 28
               L153 232
               C154 250, 144 262, 127 266
               H73
               C56 262, 46 250, 47 232
               L55 28 Z"
                        />
                    </clipPath>

                    <filter id="iceBlur" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="0.5" />
                    </filter>
                </defs>

                {/* ground shadow */}
                <ellipse cx="100" cy="284" rx="52" ry="12" fill="url(#shadow)" />

                {/* coffee (clipped) */}
                <g clipPath="url(#clipInner)">
                    <rect x="40" y="52" width="120" height="230" fill="url(#coffee)" />
                    <ellipse cx="100" cy="58" rx="80" ry="26" fill="url(#topLight)" />
                </g>

                {/* ice cubes */}
                <g clipPath="url(#clipInner)" filter="url(#iceBlur)">
                    <g opacity="0.75">
                        <path
                        className="ice ice1"
                            d="M64 62 l22 -10 a8 8 0 0 1 10 4 l8 18 a8 8 0 0 1 -4 10 l-22 10 a8 8 0 0 1 -10 -4 l-8 -18 a8 8 0 0 1 4 -10 z"
                            fill="#ffffff"
                            fillOpacity="0.25"
                            stroke="#ffffff"
                            strokeOpacity="0.35"
                        />
                        <path
                        className="ice ice2"
                            d="M104 56 l26 0 a8 8 0 0 1 8 8 l0 20 a8 8 0 0 1 -8 8 l-26 0 a8 8 0 0 1 -8 -8 l0 -20 a8 8 0 0 1 8 -8 z"
                            fill="#ffffff"
                            fillOpacity="0.18"
                            stroke="#ffffff"
                            strokeOpacity="0.28"
                        />
                        <path
                        className="ice ice3"
                            d="M78 86 l24 8 a8 8 0 0 1 5 10 l-7 20 a8 8 0 0 1 -10 5 l-24 -8 a8 8 0 0 1 -5 -10 l7 -20 a8 8 0 0 1 10 -5 z"
                            fill="#ffffff"
                            fillOpacity="0.18"
                            stroke="#ffffff"
                            strokeOpacity="0.28"
                        />
                    </g>
                </g>

                {/* glass body */}
                <path
                    d="M55 28
             C56 18, 64 12, 76 12
             H124
             C136 12, 144 18, 145 28
             L153 232
             C154 250, 144 262, 127 266
             H73
             C56 262, 46 250, 47 232
             L55 28 Z"
                    fill="url(#glassFill)"
                    stroke="url(#glassStroke)"
                    strokeWidth="2"
                />

                {/* rim */}
                <ellipse
                    cx="100"
                    cy="22"
                    rx="52"
                    ry="14"
                    fill="#ffffff"
                    fillOpacity="0.07"
                    stroke="#ffffff"
                    strokeOpacity="0.25"
                />

                {/* highlight strip */}
                <path
                    d="M72 22
             C66 32, 64 60, 66 94
             C68 140, 66 188, 63 230
             C62 246, 70 258, 82 263"
                    fill="none"
                    stroke="#ffffff"
                    strokeOpacity="0.22"
                    strokeWidth="5"
                    strokeLinecap="round"
                />
            </svg>
        </div>
    );
}
