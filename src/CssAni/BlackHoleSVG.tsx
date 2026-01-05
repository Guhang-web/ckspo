export default function BlackHoleSVG() {
  return (
    <svg
      viewBox="0 0 200 200"
      width={460}
      height={460}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="coreFade" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000000ff" />
          <stop offset="70%" stopColor="#202020ff" />
          <stop offset="100%" stopColor="#292828ff" />
        </radialGradient>
      </defs>

      {/* === 회오리 링 1 === */}
      <path
        d="M100 30 A70 70 0 1 1 99.9 30"
        fill="none"
        stroke="#333"
        strokeWidth="3"
        strokeDasharray="6 10"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 100 100"
          to="360 100 100"
          dur="18s"
          repeatCount="indefinite"
        />
      </path>

      {/* === 회오리 링 2 === */}
      <path
        d="M100 40 A60 60 0 1 1 99.9 40"
        fill="none"
        stroke="#444"
        strokeWidth="2"
        strokeDasharray="4 12"
        opacity="0.8"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="360 100 100"
          to="0 100 100"
          dur="12s"
          repeatCount="indefinite"
        />
      </path>

      {/* === 회오리 링 3 === */}
      <path
        d="M100 50 A50 50 0 1 1 99.9 50"
        fill="none"
        stroke="#555"
        strokeWidth="2"
        strokeDasharray="2 14"
        opacity="0.6"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 100 100"
          to="360 100 100"
          dur="9s"
          begin="0.6s"
          repeatCount="indefinite"
        />
      </path>

      {/* === 흡수 링 1 (밖 → 안) === */}
      <circle
        cx="100"
        cy="100"
        r="80"
        fill="none"
        stroke="#666"
        strokeWidth="2"
        opacity="0.6"
      >
        <animate
          attributeName="r"
          from="80"
          to="44"
          dur="3.2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          from="0.6"
          to="0"
          dur="3.2s"
          repeatCount="indefinite"
        />
      </circle>

      {/* === 흡수 링 2 (시간차) === */}
      <circle
        cx="100"
        cy="100"
        r="80"
        fill="none"
        stroke="#777"
        strokeWidth="1.5"
        opacity="0.4"
      >
        <animate
          attributeName="r"
          from="80"
          to="44"
          dur="3.2s"
          begin="1.6s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          from="0.4"
          to="0"
          dur="3.2s"
          begin="1.6s"
          repeatCount="indefinite"
        />
      </circle>

      {/* === 블랙홀 코어 === */}
      <circle cx="100" cy="100" r="36" fill="url(#coreFade)" opacity={0.9}/>

      {/* === 중심 미세 수축 === */}
      <circle cx="100" cy="100" r="36" fill="#131212ff">
        <animate
          attributeName="r"
          from="42"
          to="20"
          dur="5s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}
