// App.tsx
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import Loding from "./loding";
import Header from "./header";
import Nav from "./nav";
import Section1 from "./section1";
import Section2 from "./section2";
import Section3 from "./section3";
import Footer from "./footer";

import "./App.css";

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

type VScrollDetail = { y: number };
type VScrollToDetail = { y?: number; id?: string };
type VScrollLockDetail = { locked: boolean };

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

  // 입력 잠금(Section3 등에서 필요하면 쓸 수 있게)
  const lockedRef = useRef(false);

  // 모바일 터치 스크롤 상태
  const touchActiveRef = useRef(false);
  const lastTouchYRef = useRef(0);

  // 네이티브 scroll이 섞이는 걸 방지하기 위한 scroll 보정(앵커 점프/주소창 등)
  const fixingScrollRef = useRef(false);

  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  /** ✅ 모바일 주소창/뷰포트 변화까지 반영한 viewport 높이 */
  const getViewportH = () => {
    const vv = window.visualViewport;
    return Math.round(vv?.height ?? window.innerHeight);
  };

  /** ✅ (id -> y) : .vs__content 기준 offsetTop 누적 */
  const getYWithinContent = (id: string) => {
    const targetEl = document.getElementById(id) as HTMLElement | null;
    const contentEl = contentRef.current;
    if (!targetEl || !contentEl) return null;

    let y = 0;
    let node: HTMLElement | null = targetEl;

    // contentEl을 만날 때까지 offsetParent 체인 합산
    while (node && node !== contentEl) {
      y += node.offsetTop;
      node = node.offsetParent as HTMLElement | null;
    }
    return y;
  };

  /** ✅ content 높이 기반으로 max 스크롤 계산 (visualViewport 반영) */
  const recalcMax = () => {
    const el = contentRef.current;
    if (!el) return;

    // scrollHeight는 내부 콘텐츠 전체 높이를 안정적으로 줌
    const contentH = el.scrollHeight;
    const vh = getViewportH();

    const maxY = Math.max(0, contentH - vh);
    maxYRef.current = maxY;

    // 현재/목표가 max를 넘지 않게 보정
    targetYRef.current = clamp(targetYRef.current, 0, maxY);
    currentYRef.current = clamp(currentYRef.current, 0, maxY);
  };

  /** ✅ 가상 스크롤 rAF 루프 */
  const startRaf = () => {
    const el = contentRef.current;
    if (!el) return;

    const tick = () => {
      const target = targetYRef.current;
      const cur = currentYRef.current;

      // 부드러움(Up&Up 느낌): lerp 비율
      const next = cur + (target - cur) * 0.12;

      // 소수점 떨림 방지 + 이번 프레임 y 고정
      const y = Math.abs(next - target) < 0.1 ? target : next;
      currentYRef.current = y;

      // 실제 화면 이동
      el.style.transform = `translate3d(0, ${-y}px, 0)`;

      // 브로드캐스트도 같은 y 사용
      window.dispatchEvent(new CustomEvent<VScrollDetail>("vscroll", { detail: { y } }));

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  const stopRaf = () => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };

  /** ✅ ready 이후에만 가상 스크롤 가동 */
  useEffect(() => {
    if (!ready) return;

    // ✅ 네이티브 스크롤(앵커 점프 포함) 완전 차단: 가상스크롤만 사용
    const html = document.documentElement;
    const body = document.body;

    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevHtmlOverscroll = (html.style as any).overscrollBehavior;
    const prevBodyOverscroll = (body.style as any).overscrollBehavior;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    (html.style as any).overscrollBehavior = "none";
    (body.style as any).overscrollBehavior = "none";

    // 혹시 남아있는 scroll이 있다면 즉시 0으로
    window.scrollTo(0, 0);

    recalcMax();
    startRaf();

    /** ✅ content 높이 변화를 자동 반영 (이미지 로드/폰트 로드 등) */
    const ro = new ResizeObserver(() => recalcMax());
    if (contentRef.current) ro.observe(contentRef.current);

    const onResize = () => recalcMax();

    const onVisualViewportResize = () => recalcMax();

    /** ✅ 네이티브 scroll이 섞이면(앵커 점프 등) 0으로 되돌려 충돌 방지 */
    const onNativeScroll = () => {
      if (fixingScrollRef.current) return;
      if (window.scrollY === 0) return;

      fixingScrollRef.current = true;
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        fixingScrollRef.current = false;
      });
    };

    /** ✅ wheel 입력 (데스크톱/트랙패드) */
    const onWheel = (e: WheelEvent) => {
      if (lockedRef.current) return;

      // 네이티브 스크롤 막고 우리가 움직임을 만들기
      e.preventDefault();

      const dy = e.deltaY;
      if (Math.abs(dy) < 1) return;

      const nextTarget = targetYRef.current + dy * 1.0;
      targetYRef.current = clamp(nextTarget, 0, maxYRef.current);
    };

    /** ✅ touch 입력 (모바일) : 손가락 드래그로 가상스크롤 */
    const onTouchStart = (e: TouchEvent) => {
      if (lockedRef.current) return;
      if (e.touches.length !== 1) return;

      touchActiveRef.current = true;
      lastTouchYRef.current = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (lockedRef.current) return;
      if (!touchActiveRef.current) return;
      if (e.touches.length !== 1) return;

      // ✅ 네이티브 스크롤 차단(가상스크롤만)
      e.preventDefault();

      const y = e.touches[0].clientY;
      const dy = lastTouchYRef.current - y; // 손가락이 위로 가면 dy+, 페이지는 아래로 내려가야 하므로 +로 누적
      lastTouchYRef.current = y;

      if (Math.abs(dy) < 0.5) return;

      const nextTarget = targetYRef.current + dy * 1.2; // 모바일은 살짝 가중치
      targetYRef.current = clamp(nextTarget, 0, maxYRef.current);
    };

    const onTouchEnd = () => {
      touchActiveRef.current = false;
    };

    /** ✅ vscroll:to : { y } 또는 { id } 지원 */
    const onVscrollTo = (e: Event) => {
      const ce = e as CustomEvent<VScrollToDetail>;
      const detail = ce.detail ?? {};

      let y: number | null = null;

      if (typeof detail.y === "number") {
        y = detail.y;
      } else if (typeof detail.id === "string" && detail.id.trim()) {
        y = getYWithinContent(detail.id.trim());
      }

      if (y == null) return;

      // 이동 전에 maxY 최신화(특히 모바일)
      recalcMax();

      targetYRef.current = clamp(y, 0, maxYRef.current);

      // 필요하면 즉시 스냅(원하면 주석 해제)
      // currentYRef.current = targetYRef.current;
    };

    /** ✅ vscroll:lock / vscroll:unlock 지원 */
    const onVscrollLock = (e: Event) => {
      const ce = e as CustomEvent<VScrollLockDetail>;
      lockedRef.current = !!ce.detail?.locked;
      // 잠겼을 때 손가락/휠 잔여 입력 정리
      if (lockedRef.current) touchActiveRef.current = false;
    };

    const onVscrollUnlock = () => {
      lockedRef.current = false;
      touchActiveRef.current = false;
    };

    /** ✅ 해시가 바뀌었을 때도(앵커 클릭 등) 가상스크롤로 핸들 */
    const onHashChange = () => {
      const hash = (location.hash || "").replace("#", "").trim();
      if (!hash) return;

      // 네이티브 점프는 이미 overflow hidden + scroll 0으로 막혔고,
      // 이제 가상스크롤로 이동만 처리
      window.dispatchEvent(new CustomEvent<VScrollToDetail>("vscroll:to", { detail: { id: hash } }));
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    window.visualViewport?.addEventListener("resize", onVisualViewportResize);

    window.addEventListener("scroll", onNativeScroll, { passive: true });

    window.addEventListener("wheel", onWheel, { passive: false });

    // 모바일 touch는 반드시 passive:false 여야 preventDefault 가능
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });

    window.addEventListener("vscroll:to", onVscrollTo as EventListener);
    window.addEventListener("vscroll:lock", onVscrollLock as EventListener);
    window.addEventListener("vscroll:unlock", onVscrollUnlock as EventListener);

    window.addEventListener("hashchange", onHashChange);

    // ✅ 초기 해시가 있으면(새로고침/직접접속) 그 위치로
    if (location.hash) onHashChange();

    return () => {
      ro.disconnect();

      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      window.visualViewport?.removeEventListener("resize", onVisualViewportResize);

      window.removeEventListener("scroll", onNativeScroll);

      window.removeEventListener("wheel", onWheel as any);

      window.removeEventListener("touchstart", onTouchStart as any);
      window.removeEventListener("touchmove", onTouchMove as any);
      window.removeEventListener("touchend", onTouchEnd as any);
      window.removeEventListener("touchcancel", onTouchEnd as any);

      window.removeEventListener("vscroll:to", onVscrollTo as EventListener);
      window.removeEventListener("vscroll:lock", onVscrollLock as EventListener);
      window.removeEventListener("vscroll:unlock", onVscrollUnlock as EventListener);

      window.removeEventListener("hashchange", onHashChange);

      stopRaf();

      // ✅ 원복
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      (html.style as any).overscrollBehavior = prevHtmlOverscroll;
      (body.style as any).overscrollBehavior = prevBodyOverscroll;
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

      {ready && <Nav hidden={hideNav} />}

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
