import "../CssAni/bird.css"

export default function FlyingBirds() {
  return (
    <svg viewBox="0 0 300 200"
    width={300}
    height={200}
    className="birds">
        
      {/* ☁️ 구름 레이어 (새 아래) */}
      <g className="clouds">
        <g className="cloud cloud1">
          <ellipse cx="40" cy="140" rx="18" ry="10" />
          <ellipse cx="55" cy="135" rx="22" ry="12" />
          <ellipse cx="75" cy="140" rx="16" ry="9" />
        </g>

        <g className="cloud cloud2">
          <ellipse cx="120" cy="160" rx="20" ry="11" />
          <ellipse cx="140" cy="155" rx="26" ry="14" />
          <ellipse cx="165" cy="160" rx="18" ry="10" />
        </g>
      </g>
      <g className="flock">
        <path className="bird bird_A" d="M10 20 Q20 5 30 20 Q40 5 50 20" />
        <path className="bird bird_B" d="M60 40 Q70 25 80 40 Q90 25 100 40" />
        <path className="bird bird_C" d="M120 30 Q130 15 140 30 Q150 15 160 30" />
      </g>
    </svg>
  );
}
