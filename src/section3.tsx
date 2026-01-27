import React, { useEffect, useMemo, useRef, useState } from "react";
import "./section3.css";

type BoxKey = "lotteCultureworks" | "lego" | "amio" | "mung";

const BOXES: {
  key: BoxKey;
  label: string;
  boxClass: string;
  navClass: string;
  href: string;
}[] = [
  {
    key: "lotteCultureworks",
    label: "LotteCultureworks",
    boxClass: "lotteCultureworks",
    navClass: "lotteCultureworks_nav",
    href: "https://guhang-web.github.io/Lotte_important/",
  },
  {
    key: "lego",
    label: "Lego",
    boxClass: "lego",
    navClass: "lego_nav",
    href: "https://example.com", // 바꿔줘
  },
  {
    key: "amio",
    label: "Amio",
    boxClass: "amio",
    navClass: "amio_nav",
    href: "https://guhang-web.github.io/Amio/",
  },
  {
    key: "mung",
    label: "Mung",
    boxClass: "mung",
    navClass: "mung_nav",
    href: "https://example.com", // 바꿔줘
  },
];

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

function Section3() {
  const [hoveredKey, setHoveredKey] = useState<BoxKey | null>(null);

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

  const activeKeyRef = useRef<BoxKey | null>(null);
  const vscrollYRef = useRef(0);
  const pointerYRef = useRef(0);
  const absTopRef = useRef(0);
  const boxHRef = useRef(0);
  const barHalfHRef = useRef(40);
  const paddingRef = useRef(10);

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

    const rectTop = absTopRef.current - vscrollYRef.current;
    const rawY = pointerYRef.current - rectTop;

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
      const cur = currentYRef.current;
      const target = targetYRef.current;
      const next = cur + (target - cur) * 0.22;

      currentYRef.current = Math.abs(next - target) < 0.1 ? target : next;
      applyBarY(key, currentYRef.current);

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    const onVScroll = (e: Event) => {
      const ce = e as CustomEvent<{ y: number }>;
      vscrollYRef.current = ce?.detail?.y ?? 0;
      if (!activeKeyRef.current) return;
      calcTarget();
    };

    window.addEventListener("vscroll", onVScroll as EventListener);
    return () => window.removeEventListener("vscroll", onVScroll as EventListener);
  }, []);

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

    const rect = boxEl.getBoundingClientRect();
    absTopRef.current = rect.top + vscrollYRef.current;
    boxHRef.current = rect.height;
    barHalfHRef.current = barEl.getBoundingClientRect().height / 2;

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

  const openProject = (href: string) => {
    window.open(href, "_blank", "noopener,noreferrer");
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
          onClick={() => openProject(box.href)}
          role="link"
          tabIndex={0}
          aria-label={`${box.label} 프로젝트 열기`}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openProject(box.href);
            }
          }}
        >
          <li
            ref={(el) => {
              barRefs.current[box.key] = el;
            }}
            className={`poporbar ${box.navClass}`}
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
