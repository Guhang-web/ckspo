import "./kirby.css"

export default function KirbySVG() {
    return (
        <svg
            viewBox="0 0 200 200"
            width={300}
            height={300}
            className="kirby1"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g className="kirby2">

                <g className="kirbyFoot">
                    <g className="kirbyFootLeft">
                        <ellipse cx="-70" cy="145" rx="25" ry="18" fill="#E6004C" />
                    </g>
                    <g className="kirbyFootRight">
                        <ellipse cx="180" cy="75" rx="25" ry="18" fill="#E6004C" />
                    </g>
                </g>

                <g className="kirbyBody">
                    <circle cx="100" cy="100" r="60" fill="#FF8FCF" />
                    <ellipse cx="80" cy="90" rx="10" ry="6" fill="#FF6FAE" />
                    <ellipse cx="145" cy="90" rx="10" ry="6" fill="#FF6FAE" />
                </g>
                <g className="kirbyArm">
                    <ellipse cx="42" cy="110" rx="18" ry="15" fill="#FF8FCF" />
                    <ellipse cx="155" cy="72" rx="18" ry="15" fill="#FF8FCF" />
                </g>

                <g className="kirbyEye">
                    <ellipse cx="100" cy="75" rx="9" ry="15" fill="#0b2286ff" />
                    <ellipse cx="102" cy="70" rx="5" ry="7" fill="#fff" />
                    <ellipse cx="125" cy="75" rx="9" ry="15" fill="#0b2286ff" />
                    <ellipse cx="127" cy="70" rx="5" ry="7" fill="#fff" />
                </g>
                <g className="kirbyMouth">
                    <ellipse cx="112" cy="95" rx="3" ry="5" fill="#A8004F" />
                </g>
            </g>
            <g className="kirbyStars">
                <polygon
                    className="star star1"
                    points="10,2 12,8 18,8 13,12 15,18 10,14 5,18 7,12 2,8 8,8"
                    fill="#FFD93D"
                />
                <polygon
                    className="star star2"
                    points="10,2 12,8 18,8 13,12 15,18 10,14 5,18 7,12 2,8 8,8"
                    fill="#FFD93D"
                />
                <polygon
                    className="star star3"
                    points="10,2 12,8 18,8 13,12 15,18 10,14 5,18 7,12 2,8 8,8"
                    fill="#FFD93D"
                />
            </g>
        </svg>
    );
}
