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
    let latestY = window.scrollY || 0;

    const computeStep = () => {
      // vscroll(가상) / scroll(네이티브) 모두에서 "현재 스크롤 Y" 기준으로 계산
      const viewportH = window.innerHeight;

      // 요소의 문서 상 절대 top (scrollY 변화에도 안정적)
      const start = el.getBoundingClientRect().top + latestY;
      const end = start + el.offsetHeight - viewportH;
      const range = Math.max(1, end - start);

      const progress = clamp((latestY - start) / range, 0, 1);

      // 0~3 (4단계)로 스냅
      const nextStep = Math.min(3, Math.floor(progress * 8));

      setStep((prev) => (prev === nextStep ? prev : nextStep));
    };

    const scheduleCompute = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(computeStep);
    };

    // ✅ 가상 스크롤용
    const onVScroll = (e: Event) => {
      const ce = e as CustomEvent<VScrollDetail>;
      latestY = ce.detail?.y ?? 0;
      scheduleCompute();
    };

    // ✅ 모바일/네이티브 스크롤용 fallback
    const onScroll = () => {
      latestY = window.scrollY || window.pageYOffset || 0;
      scheduleCompute();
    };

    const onResize = () => scheduleCompute();

    // 초기 동기화
    latestY = window.scrollY || 0;
    scheduleCompute();

    window.addEventListener("vscroll", onVScroll as EventListener);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("vscroll", onVScroll as EventListener);
      window.removeEventListener("scroll", onScroll as EventListener);
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
            <source
              src="https://refad-image.s3.ap-northeast-2.amazonaws.com/jobkorea/keyvisual.mp4"
              type="video/mp4"
            />
            Sorry, your browser doesn’t support embedded videos.
          </video>
        </div>
      </div>
    </header>
  );
}

export default Header;
