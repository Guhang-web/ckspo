// App.tsx
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

import Loding from "./loding";
import Header from "./header";
import Nav from "./nav";
import Section1 from "./section1";
import Section2 from "./section2";
import Section3 from "./section3";
import Footer from "./footer";

import "./App.css";

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export default function App() {
  const [ready, setReady] = useState(false);
  const [hideNav, setHideNav] = useState(false);

  // 가상 스크롤: 실제로 transform 될 컨텐츠 래퍼
  const contentRef = useRef<HTMLDivElement | null>(null);

  // 가상 스크롤 상태값들
  const targetYRef = useRef(0);
  const currentYRef = useRef(0);
  const maxYRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  // content 높이 기반으로 max 스크롤 계산
  const recalcMax = () => {
    const el = contentRef.current;
    if (!el) return;
    const contentH = el.scrollHeight; // 레이아웃상의 전체 높이
    const vh = window.innerHeight;
    const maxY = Math.max(0, contentH - vh);
    maxYRef.current = maxY;

    // 현재/목표가 max를 넘지 않게 보정
    targetYRef.current = clamp(targetYRef.current, 0, maxY);
    currentYRef.current = clamp(currentYRef.current, 0, maxY);
  };

  //  가상 스크롤 rAF 루프
  const startRaf = () => {
    const el = contentRef.current;
    if (!el) return;
    const tick = () => {
      const target = targetYRef.current;
      const cur = currentYRef.current;

      // 부드러움(Up&Up 느낌): lerp 비율이 핵심
      const next = cur + (target - cur) * 0.12;

      //  소수점 떨림 방지 + 이번 프레임 y 고정
      const y = Math.abs(next - target) < 0.1 ? target : next;
      currentYRef.current = y;

      //  실제 화면 이동
      el.style.transform = `translate3d(0, ${-y}px, 0)`;

      //  브로드캐스트도 같은 y 사용
      window.dispatchEvent(new CustomEvent("vscroll", { detail: { y } }));

      rafRef.current = requestAnimationFrame(tick);
    };


    rafRef.current = requestAnimationFrame(tick);
  };

  const stopRaf = () => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };

  // ready 이후에만 가상 스크롤 가동
  useEffect(() => {
    if (!ready) return;

    recalcMax();
    startRaf();

    const onResize = () => recalcMax();

    const onWheel = (e: WheelEvent) => {
      // 네이티브 스크롤 막고 우리가 움직임을 만들기
      e.preventDefault();

      const dy = e.deltaY;
      if (Math.abs(dy) < 1) return;

      const nextTarget = targetYRef.current + dy * 1.0;
      targetYRef.current = clamp(nextTarget, 0, maxYRef.current);
    };
    const onVscrollTo = (e: Event) => {
      const ce = e as CustomEvent<{ y: number }>;
      const y = ce.detail?.y ?? 0;
      targetYRef.current = clamp(y, 0, maxYRef.current);
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("wheel", onWheel, { passive: false });

    window.addEventListener("vscroll:to", onVscrollTo as EventListener);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("wheel", onWheel as any);

      window.removeEventListener("vscroll:to", onVscrollTo as EventListener);

      stopRaf();
    };
  }, [ready]);

  useEffect(() => {
    if (!ready) return;

    const footerEl = document.getElementById("footer");
    if (!footerEl) return;

    const io = new IntersectionObserver(
      ([entry]) => setHideNav(entry.isIntersecting),
      { threshold: 0.01, rootMargin: "0px" }
    );

    io.observe(footerEl);
    return () => io.disconnect();
  }, [ready]);

  return (
    <>
      {!ready && (
        <Loding
          assets={[
            "/logo/lego-logo 1.png",
            "/section1Img/hero.jpg",
            "/section3Img/marvelImg.png",
          ]}
          minDuration={900}
          onComplete={() => setReady(true)}
        />
      )}

      <Nav hidden={hideNav} />

      <div className="vs">
        <div className="vs__content" ref={contentRef}>
          <Header />
          <Section1 />
          <Section2 />
          <Section3 />
          <Footer />
        </div>
      </div>
    </>
  );
}
