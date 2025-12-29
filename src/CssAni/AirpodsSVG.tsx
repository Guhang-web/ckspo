import "../CssAni/airpods.css"

export default function AirpodsSVG() {
  return (
    <svg
      viewBox="0 0 600 300"
      width={400}
      height={300}
      className="airpods"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 배경 */}
      <rect width="100%" height="100%" fill="#0f0c0cff" />

      <defs>
        {/* 본체 그라디언트 */}
        <linearGradient id="airpodsBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF" />
          <stop offset="100%" stopColor="#929191ff" />
        </linearGradient>

        {/* 실리콘 팁 */}
        <radialGradient id="airpodsTip" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF" />
          <stop offset="100%" stopColor="#353333ff" />
        </radialGradient>
      </defs>

      {/* LEFT EARBUD */}
      <g transform="translate(200,150)">
        <g className="earbud left">
          <rect x="-4" y="22" width="16" height="50" rx="8" fill="url(#airpodsBody)" />
          <ellipse cx="8" cy="4" rx="35" ry="25" fill="url(#airpodsBody)" />
          <rect x="-4" y="-12" width="16" height="8" rx="4" fill="#222" />
          <ellipse cx="35" cy="8" rx="22" ry="18" fill="url(#airpodsTip)" />
          <ellipse cx="42" cy="10" rx="10" ry="8" fill="#0a0a0aff" opacity={0.5} />
        </g>
        <g className="notes left-notes">
          <g className="note note-l-1">
            <circle cx="46" cy="6" r="2.2" />
            <rect x="46" y="-2" width="2" height="8" rx="1" />
          </g>
          <g className="note note-l-2">
            <circle cx="46" cy="6" r="2.2" />
            <rect x="46" y="-3" width="2" height="8" rx="1" />
            <circle cx="52" cy="6" r="2.2" />
            <rect x="52" y="-3" width="2" height="8" rx="1" />
            <rect x="47" y="-3" width="6" height="1" rx="1" />
            <rect x="47" y="-1" width="6" height="1" rx="1" />
          </g>
        </g>
      </g>

      {/* RIGHT EARBUD (좌우 반전) */}
      <g transform="translate(400,150) scale(-1,1)">
        <g className="earbud right">
          <rect x="-4" y="22" width="16" height="50" rx="8" fill="url(#airpodsBody)" />
          <ellipse cx="8" cy="4" rx="35" ry="25" fill="url(#airpodsBody)" />
          <rect x="-4" y="-12" width="16" height="8" rx="4" fill="#222" />
          <ellipse cx="35" cy="8" rx="22" ry="18" fill="url(#airpodsTip)" />
          <ellipse cx="42" cy="10" rx="10" ry="8" fill="#0a0a0aff" opacity={0.5} />
        </g>
        <g className="notes right-notes">
          <g className="note note-r-1">
            <circle cx="46" cy="6" r="2.2" />
            <rect x="44" y="-3" width="2" height="8" rx="1" />
            <circle cx="52" cy="6" r="2.2" />
            <rect x="50" y="-3" width="2" height="8" rx="1" />
            <rect x="45" y="-3" width="6" height="1" rx="1" />
            <rect x="45" y="-1" width="6" height="1" rx="1" />
          </g>
          <g className="note note-r-2">
            <circle cx="46" cy="6" r="2.2" />
            <rect x="44" y="-2" width="2" height="8" rx="1" />
          </g>
        </g>
      </g>
    </svg>
  );
}
