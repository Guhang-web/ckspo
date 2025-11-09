import React, { useEffect, useRef, useState } from "react";
import "./header.css";

function Header() {
    const headerRef = useRef<HTMLElement | null>(null);

    // p-3 ~ p-6 중 어떤 항목이 보일지 index로 관리 (0: p-3 TRUST, 1: p-4 USERS, 2: p-5 ACCESSIBILITY, 3: p-6 PERFORMANCE)
    const [step, setStep] = useState(0);
    const isLockedRef = useRef(false); // 휠 과도 입력 방지용 쿨다운

    useEffect(() => {
        const el = headerRef.current;
        if (!el) return;

        const onWheel = (e: WheelEvent) => {
            if (isLockedRef.current) {
                e.preventDefault();
                return;
            }

            const rect = el.getBoundingClientRect();
            const inside =
                e.clientX >= rect.left &&
                e.clientX <= rect.right &&
                e.clientY >= rect.top &&
                e.clientY <= rect.bottom;

            if (!inside) return;

            e.preventDefault();

            const dir = e.deltaY > 0 ? 1 : -1;
            setStep(prev => Math.max(0, Math.min(3, prev + dir)));

            isLockedRef.current = true;
            setTimeout(() => (isLockedRef.current = false), 1000);
        };

        // passive:false 여야 preventDefault가 유효
        el.addEventListener("wheel", onWheel, { passive: false });
        return () => el.removeEventListener("wheel", onWheel as any);
    }, []);
    return (
        <>
            <header id='header' ref={headerRef}>
                <div id='headerMain'>
                    <h1 className='headerPo'>BUILD, HONESTLY</h1>
                    <div id='headerTop'>
                        <p className='p-1'>INTEGRITY</p>
                        <p className='p-2'>CONSISTENCY</p>
                        <div
                            className="slot"
                            aria-live="polite"
                            style={{ ["--step" as any]: step } as React.CSSProperties}
                        >
                            <div className="slotInner">
                                <p className="p-3">TRUST</p>
                                <p className="p-4">USERS</p>
                                <p className="p-5">ACCESSIBILITY</p>
                                <p className="p-6">PERFORMANCE</p>
                            </div>
                        </div>
                    </div>
                    <div id='headerBottom'>
                        <video
                            className="headerBottomVideo"
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="metadata">
                            <source src="/mung.mp4" type="video/mp4" />
                            Sorry, your browser doesn’t support embedded videos.
                        </video>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header