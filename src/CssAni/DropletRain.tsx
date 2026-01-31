import { useMemo, type CSSProperties } from "react";
type Drop = {
    x: number;      // 0~100 (%)
    delay: number;  // seconds (음수면 시작부터 흘러가게)
    dur: number;    // seconds
    size: number;   // px
    op: number;     // 0~1
    sway: number;   // px
};

function mulberry32(seed: number) {
    return function () {
        let t = (seed += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

type DropletRainProps = {
    count?: number;
    seed?: number;
    className?: string;
};

export default function DropletRain({ count = 18, seed = 7, className = "" }: DropletRainProps) {
    const drops = useMemo<Drop[]>(() => {
        const rnd = mulberry32(seed);
        return Array.from({ length: count }).map(() => {
            const x = rnd() * 100;                
            const dur = 2.2 + rnd() * 2.2;         
            const delay = -(rnd() * dur);          
            const size = 6 + rnd() * 14;           
            const op = 0.35 + rnd() * 0.55;        
            const sway = (rnd() * 2 - 1) * (6 + rnd() * 10);
            return { x, dur, delay, size, op, sway };
        });
    }, [count, seed]);

    return (
        <div className={`s3Drops ${className}`} aria-hidden="true">
            {drops.map((d, idx) => {
                const style = {
                    ["--x" as any]: `${d.x}%`,
                    ["--dur" as any]: `${d.dur}s`,
                    ["--delay" as any]: `${d.delay}s`,
                    ["--op" as any]: d.op,
                    ["--size" as any]: `${d.size}px`,
                    ["--sway" as any]: `${d.sway}px`,
                } as CSSProperties;

                return (
                    <span key={idx} className="s3Drop" style={style}>
                        <span className="s3DropInner">
                            <svg
                                className="s3DropSvg"
                                width="100%"
                                height="100%"
                                viewBox="0 0 100 120"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <defs>
                                    <radialGradient id={`dropG${idx}`} cx="35%" cy="25%" r="70%">
                                        <stop offset="0%" stopColor="#BFE8FF" stopOpacity="0.95" />
                                        <stop offset="45%" stopColor="#2B78E4" stopOpacity="0.85" />
                                        <stop offset="100%" stopColor="#1F4183" stopOpacity="0.9" />
                                    </radialGradient>
                                </defs>

                                {/* 물방울 형태 */}
                                <path
                                    d="   M50 14
                                          C64 26, 76 44, 76 62
                                          C76 88, 64 106, 50 106
                                          C36 106, 24 88, 24 62
                                          C24 44, 36 26, 50 14 Z"
                                    fill={`url(#dropG${idx})`}
                                />
                            </svg>
                        </span>
                    </span>
                );
            })}
        </div>
    );
}
