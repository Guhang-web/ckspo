// header.tsx
import React, { useEffect, useRef, useState } from "react";
import "./header.css";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

type VScrollDetail = { y: number };

function Header() {
  const headerRef = useRef<HTMLElement | null>(null);

  const [step, setStep] = useState(0);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    let rafId = 0;
    let latestY = 0;

    const computeStep = () => {
      const start = el.offsetTop;
      const end = start + el.offsetHeight - window.innerHeight;
      const range = Math.max(1, end - start);

      const progress = clamp((latestY - start) / range, 0, 1);

      const nextStep = Math.min(3, Math.floor(progress * 6));

      setStep((prev) => (prev === nextStep ? prev : nextStep));
    };

    const scheduleCompute = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(computeStep);
    };

    const onVScroll = (e: Event) => {
      const ce = e as CustomEvent<VScrollDetail>;
      latestY = ce.detail?.y ?? 0;
      scheduleCompute();
    };

    const onResize = () => scheduleCompute();

    // 초기 동기화
    scheduleCompute();

    window.addEventListener("vscroll", onVScroll as EventListener);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("vscroll", onVScroll as EventListener);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <header id="header" ref={headerRef}>
      <div id="headerMain">
        <h1 className="headerPo">ChoiKwangSeo</h1>


        <div id="headerTop">
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
          <p className="p-1">FRONT-END</p>
          <p className="p-2">DEVELOPER</p>

          
        </div>

        <div id="headerBottom">
          <video
            className="headerBottomVideo"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src="https://refad-image.s3.ap-northeast-2.amazonaws.com/jobkorea/keyvisual.mp4" type="video/mp4" />
            Sorry, your browser doesn’t support embedded videos.
          </video>
        </div>
      </div>
    </header>
  );
}

export default Header;
