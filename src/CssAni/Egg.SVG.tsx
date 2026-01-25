import "./egg.css";

export default function EggSVG() {
  return (
    <div className="eggBox" aria-label="cute egg animation">
      <svg
        className="egg1"
        viewBox="0 0 200 200"
        role="img"
        aria-hidden="false"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* 바닥 그림자 */}
        <ellipse className="eggShadow" cx="100" cy="160" rx="42" ry="10" />

        {/* 달걀 그룹 (통째로 둥실/흔들림) */}
        <g className="eggGroup">
          {/* 달걀 외형 */}
          <path
            className="eggShell"
            d="
              M100,28
              C74,28 48,63 48,100
              C48,136 71,160 100,160
              C129,160 152,136 152,100
              C152,63 126,28 100,28
              Z"
          />

          {/* 하이라이트 */}
          <path
            className="eggShine"
            d="M83,46 C72,54 66,67 66,80 C66,86 70,90 76,90 C84,90 91,84 96,76
               C100,69 102,61 100,55 C98,50 92,43 83,46 Z"
          />

          {/* 볼터치 */}
          <ellipse className="eggBlush eggLeft" cx="78" cy="108" rx="10" ry="6" />
          <ellipse className="eggBlush eggRight" cx="122" cy="108" rx="10" ry="6" />

          {/* 눈/입 (깜빡임 애니메이션) */}
          <g className="eggFace">
            <ellipse className="eggEye eggLeft" cx="82" cy="96" rx="5" ry="5" />
            <ellipse className="eggEye eggRight" cx="118" cy="96" rx="5" ry="5" />
            <path
              className="eggMouth"
              d="M86,115 C92,121 108,121 114,115"
              fill="none"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
