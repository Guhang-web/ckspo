import React, { useEffect, useMemo, useRef, useState } from "react";
import "./section3.css";

type BoxKey = "lotteCultureworks" | "lego" | "amio" | "mung";

const BOXES: { key: BoxKey; label: string; boxClass: string; navClass: string }[] = [
  { key: "lotteCultureworks", label: "LotteCultureworks", boxClass: "lotteCultureworks", navClass: "lotteCultureworks_nav" },
  { key: "lego", label: "Lego", boxClass: "lego", navClass: "lego_nav" },
  { key: "amio", label: "Amio", boxClass: "amio", navClass: "amio_nav" },
  { key: "mung", label: "Mung", boxClass: "mung", navClass: "mung_nav" },
];

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

function Section3() {
  const [hoveredKey, setHoveredKey] = useState<BoxKey | null>(null);

  // DOM refs
  const boxRefs = useRef<Record<BoxKey, HTMLUListElement | null>>({
    lotteCultureworks: null,
    lego: null,
    amio: null,
    mung: null,
  });

  const barRefs = useRef<Record<BoxKey, HTMLLIElement | null>>({
    lotteCultureworks: null,
    lego: null,
    amio: null,
    mung: null,
  });

  //  즉시 반영용 ref (state 타이밍 문제 제거)
  const activeKeyRef = useRef<BoxKey | null>(null);

  //  App에서 쏘는 가상스크롤 값 캐싱
  const vscrollYRef = useRef(0);

  //  마지막 포인터(뷰포트 기준) Y
  const pointerYRef = useRef(0);

  //  활성 박스의 “절대 top” (가상스크롤 0 기준 top), height 캐싱
  const absTopRef = useRef(0);
  const boxHRef = useRef(0);

  //  활성 바 높이/패딩 캐싱
  const barHalfHRef = useRef(40); // 초기값, enter 시 실제 높이로 갱신
  const paddingRef = useRef(10);

  //  lerp 애니메이션 (현재/목표)
  const targetYRef = useRef(0);
  const currentYRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const stopAnim = () => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };

  const applyBarY = (key: BoxKey, y: number) => {
    const barEl = barRefs.current[key];
    if (!barEl) return;
    barEl.style.setProperty("--y", `${y}px`);
  };

  const calcTarget = () => {
    const key = activeKeyRef.current;
    if (!key) return;

    const boxH = boxHRef.current;
    if (boxH <= 0) return;

    const padding = paddingRef.current;
    const halfH = barHalfHRef.current;

    // vscroll 값으로 rect.top을 “레이아웃 읽기 없이” 계산
    const rectTop = absTopRef.current - vscrollYRef.current;

    const rawY = pointerYRef.current - rectTop; // 박스 내부 y
    const minTop = padding + halfH;
    const maxTop = boxH - padding - halfH;

    targetYRef.current = clamp(rawY, minTop, maxTop);
  };

  const startAnim = () => {
    if (rafRef.current != null) return;

    const tick = () => {
      const key = activeKeyRef.current;
      if (!key) {
        rafRef.current = null;
        return;
      }

      //  관성(부드러움) — 값 조절 포인트
      const cur = currentYRef.current;
      const target = targetYRef.current;
      const next = cur + (target - cur) * 0.22;

      currentYRef.current = Math.abs(next - target) < 0.1 ? target : next;
      applyBarY(key, currentYRef.current);

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  //  vscroll 이벤트 수신 (App.tsx에서 dispatch)
  useEffect(() => {
    const onVScroll = (e: Event) => {
      const ce = e as CustomEvent<{ y: number }>;
      const y = ce?.detail?.y ?? 0;
      vscrollYRef.current = y;

      if (!activeKeyRef.current) return;
      // 스크롤로 박스 위치가 변하니 목표값 재계산만(레이아웃 읽기 X)
      calcTarget();
    };

    window.addEventListener("vscroll", onVScroll as EventListener);
    return () => window.removeEventListener("vscroll", onVScroll as EventListener);
  }, []);

  //  리사이즈 시만 다시 측정(레이아웃 읽기 최소화)
  useEffect(() => {
    const onResize = () => {
      const key = activeKeyRef.current;
      if (!key) return;

      const boxEl = boxRefs.current[key];
      const barEl = barRefs.current[key];
      if (!boxEl || !barEl) return;

      const rect = boxEl.getBoundingClientRect();
      absTopRef.current = rect.top + vscrollYRef.current;
      boxHRef.current = rect.height;

      barHalfHRef.current = barEl.getBoundingClientRect().height / 2;

      calcTarget();
      // 리사이즈 직후 튐 방지: 현재도 목표로 맞춰서 시작
      currentYRef.current = targetYRef.current;
      applyBarY(key, currentYRef.current);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleEnter = (key: BoxKey) => (e: React.PointerEvent) => {
    activeKeyRef.current = key;
    setHoveredKey(key);

    pointerYRef.current = e.clientY;

    const boxEl = boxRefs.current[key];
    const barEl = barRefs.current[key];
    if (!boxEl || !barEl) return;

    //  진입 시 1회만 레이아웃 측정
    const rect = boxEl.getBoundingClientRect();
    absTopRef.current = rect.top + vscrollYRef.current; // 절대 top(가상스크롤 0 기준)
    boxHRef.current = rect.height;

    barHalfHRef.current = barEl.getBoundingClientRect().height / 2;

    // 목표 계산 + 즉시 위치 맞추고 애니메이션 시작
    calcTarget();
    currentYRef.current = targetYRef.current;
    applyBarY(key, currentYRef.current);

    startAnim();
  };

  const handleLeave = () => {
    activeKeyRef.current = null;
    setHoveredKey(null);
    stopAnim();
  };

  const handleMove = (key: BoxKey) => (e: React.PointerEvent) => {
    if (activeKeyRef.current !== key) return;
    pointerYRef.current = e.clientY;
    calcTarget();
  };

  const rendered = useMemo(() => {
    return BOXES.map((box) => {
      const isHovered = hoveredKey === box.key;

      return (
        <ul
          key={box.key}
          ref={(el) => {
            boxRefs.current[box.key] = el;
          }}
          className={`s3Box ${box.boxClass} ${isHovered ? "isHovered" : ""}`}
          onPointerEnter={handleEnter(box.key)}
          onPointerLeave={handleLeave}
          onPointerMove={handleMove(box.key)}
        >
          <li
            ref={(el) => {
              barRefs.current[box.key] = el;
            }}
            className={`poporbar ${box.navClass}`}
            // bar가 포인터 이벤트를 먹으면 enter/move가 미묘하게 끊기는 경우가 있어서 차단
            aria-hidden="true"
          >
            <p>{box.label}</p>
          </li>
        </ul>
      );
    });
  }, [hoveredKey]);

  return (
    <section id="section3">
      <div className="poporList">{rendered}</div>
    </section>
  );
}

export default Section3;
