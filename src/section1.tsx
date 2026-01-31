// section1.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import "./section1.css";

import Americano from "./CssAni/americano";
import LatteArt from "./CssAni/latteArt";
import RobotSVG from "./CssAni/RobotSVG";
import MilkSVG from "./CssAni/MilkSVG";
import AirpodsSVG from "./CssAni/AirpodsSVG";
import BlackHoleSVG from "./CssAni/BlackHoleSVG";
import goden from "../public/section/goden.png";
import goden2 from "../public/section/goden2.png";

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

type VisualComp = React.ComponentType | null;

type ToolItem = {
  key: string;
  label: string;
  desc: string;
  Visual: VisualComp;
};

//  데스크톱 hover 가능 여부를 반응형으로 정확히 판별
function calcHoverable() {
  if (typeof window === "undefined") return false;

  const canHover =
    window.matchMedia?.("(hover: hover) and (pointer: fine)")?.matches ?? false;

  const hasTouch = (navigator.maxTouchPoints ?? 0) > 0;

  // devtools에서 폭만 줄여도 모바일 로직 타게끔 강제
  const isMobileWidth =
    window.matchMedia?.("(max-width: 768px)")?.matches ?? false;

  return canHover && !hasTouch && !isMobileWidth;
}

export default function Section1() {
  const sectionRef = useRef<HTMLElement | null>(null);

  // TOP parallax
  const voltorbWrapRef = useRef<HTMLDivElement | null>(null);
  const blackholeWrapRef = useRef<HTMLDivElement | null>(null);

  // sticky
  const middleRef = useRef<HTMLDivElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);

  // list
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // 모바일: 스크롤 기준으로만 갱신됨
  const [activeIndex, setActiveIndex] = useState(0);
  // 데스크톱: hover로만 사용됨
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const tools: readonly ToolItem[] = useMemo(
    () =>
      [
        {
          key: "americano",
          label: "Cafe Employee",
          desc: "2017.01 - 2018.4(Operations)",
          Visual: Americano as VisualComp,
        },
        {
          key: "milk",
          label: "Cafe Deputy Manager",
          desc: "2018.05 - 2020.01(Management)",
          Visual: MilkSVG as VisualComp,
        },
        {
          key: "latteArt",
          label: "Cafe Manager",
          desc: "2020.02 - 2024.05(Store Management)",
          Visual: LatteArt as VisualComp,
        },
        {
          key: "blackhole",
          label: "QA",
          desc: "2025-04 - 2025.12(Quality Assurance)",
          Visual: BlackHoleSVG as VisualComp,
        },
        {
          key: "airpods",
          label: "Design Study",
          desc: "2024.10 - 2024.12(Design Tools)",
          Visual: AirpodsSVG as VisualComp,
        },
        {
          key: "robot",
          label: "Front-end Study",
          desc: "2024.10 - 2026.01(Fundamentals)",
          Visual: RobotSVG as VisualComp,
        },
      ] as const,
    []
  );

  //  반응형으로 계속 갱신되는 isHoverable
  const [isHoverable, setIsHoverable] = useState(false);

  useEffect(() => {
    const sync = () => setIsHoverable(calcHoverable());
    sync();

    const mql = window.matchMedia("(hover: hover) and (pointer: fine)");
    const add = (mql as any).addEventListener ? "addEventListener" : "addListener";
    const remove = (mql as any).removeEventListener ? "removeEventListener" : "removeListener";

    (mql as any)[add]("change", sync);
    window.addEventListener("resize", sync);

    return () => {
      (mql as any)[remove]("change", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  /**
   *  “보이는 활성”과 “비주얼 표시”를 완전히 분리
   * - 데스크톱: hoverIndex가 있으면 그게 보이고(hover 느낌), 없으면 activeIndex
   * - 모바일: 무조건 activeIndex (스투키 느낌만)
   */
  const uiIndex = isHoverable ? hoverIndex ?? activeIndex : activeIndex;
  const displayIndex = isHoverable ? uiIndex : activeIndex;
  const DisplayVisual = tools[displayIndex]?.Visual ?? null;

  /**
   * (1) TOP parallax
   *  vscroll + native scroll 모두
   *  getBoundingClientRect 기반(가상스크롤/모바일 모두 안정적)
   */
  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const VOL_MAX = 450;
    const BH_MAX = 180;
    const RANGE_PX = 700;

    let raf = 0;

    const update = () => {
      raf = 0;

      const vh = window.innerHeight;
      const rect = sectionEl.getBoundingClientRect();

      const start = vh * 1.1;
      const end = start - RANGE_PX;

      const raw = (start - rect.top) / (start - end);
      const t = clamp(raw, 0, 1);

      const eased = t * t * (3 - 2 * t);

      voltorbWrapRef.current?.style.setProperty("--s1-voltorb-y", `${-eased * VOL_MAX}px`);
      blackholeWrapRef.current?.style.setProperty("--s1-blackhole-y", `${-eased * BH_MAX}px`);
    };

    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    const onVScroll = () => schedule();
    const onScroll = () => schedule();
    const onResize = () => schedule();

    window.addEventListener("vscroll", onVScroll as EventListener);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    schedule();

    return () => {
      window.removeEventListener("vscroll", onVScroll as EventListener);
      window.removeEventListener("scroll", onScroll as EventListener);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /**
   * (2) middle pin
   */
  useEffect(() => {
    const middle = middleRef.current;
    const pin = pinRef.current;
    if (!middle || !pin) return;

    pin.style.position = "absolute";
    pin.style.willChange = "top";

    let raf = 0;

    const apply = () => {
      const mRect = middle.getBoundingClientRect();
      const pinH = pin.getBoundingClientRect().height;
      const fixedTop = window.innerHeight * 0.5 - pinH * 0.5;

      const maxTop = Math.max(0, mRect.height - pinH);
      const nextTop = clamp(fixedTop - mRect.top, 0, maxTop);

      pin.style.top = `${nextTop}px`;
    };

    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        apply();
      });
    };

    const ro = new ResizeObserver(() => schedule());
    ro.observe(middle);
    ro.observe(pin);

    apply();

    window.addEventListener("vscroll", schedule as EventListener);
    window.addEventListener("scroll", schedule, { passive: true }); 
    window.addEventListener("resize", schedule);

    return () => {
      window.removeEventListener("vscroll", schedule as EventListener);
      window.removeEventListener("scroll", schedule as EventListener);
      window.removeEventListener("resize", schedule as EventListener);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /**
   * (3) activeIndex (스투키)
   *  모바일에서만 동작
   *  데스크톱은 hover만 쓰게끔 스크롤 activeIndex 갱신 off
   */
  useEffect(() => {
    if (isHoverable) return;

    const pin = pinRef.current;
    const bottom = bottomRef.current;
    const section = sectionRef.current;
    if (!pin || !bottom || !section) return;

    const items = Array.from(bottom.querySelectorAll<HTMLElement>(".s1-item"));
    if (items.length === 0) return;

    let raf = 0;

    const getCenterY = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      return r.top + r.height / 2;
    };

    const update = () => {
      raf = 0;

      const rect = section.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;

      const pinCenter = getCenterY(pin);

      let bestIdx = 0;
      let bestDist = Number.POSITIVE_INFINITY;

      for (let i = 0; i < items.length; i++) {
        const d = Math.abs(getCenterY(items[i]) - pinCenter);
        if (d < bestDist) {
          bestDist = d;
          bestIdx = i;
        }
      }

      bestIdx = clamp(bestIdx, 0, items.length - 1);
      setActiveIndex((prev) => (prev === bestIdx ? prev : bestIdx));
    };

    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    window.addEventListener("vscroll", schedule as EventListener);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    schedule();

    return () => {
      window.removeEventListener("vscroll", schedule as EventListener);
      window.removeEventListener("scroll", schedule as EventListener);
      window.removeEventListener("resize", schedule as EventListener);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isHoverable]);

  return (
    <section id="section1" ref={sectionRef}>
      <div className="section1Top">
        <div className="section1Css1" ref={voltorbWrapRef}>
          <div className="bolt-pos">
            <img className="goden" src={goden} alt="goden" draggable={false} />
          </div>
        </div>

        <div className="section1Css2" ref={blackholeWrapRef}>
          <img className="goden" src={goden2} alt="goden2" draggable={false} />
        </div>
      </div>

      <div className="section1Middle" ref={middleRef}>
        <div className={`section1Layout ${DisplayVisual ? "is-visual" : ""}`} ref={pinRef}>
          <div className={`s1VisualStage ${DisplayVisual ? "is-on" : ""}`} aria-hidden="true">
            {DisplayVisual ? <DisplayVisual /> : null}
          </div>
        </div>

        <div className="introduce">
          <p className="introText">
            지난 <span className="accent">7년 4개월</span> 동안 카페 점장으로 운영과 고객 경험을 쌓았고,
            <br />
            퇴사 후 <span className="accent">1년</span> Frontend를 집중 학습했습니다.
            <br />
            <span className="accent">2025.04 ~ 25.12.31</span> 회사 운영팀에서 QA로 일하며 실행력을 더하였습니다.
            <br />
            사용자 관점으로 결과를 만드는 <strong>Junior Frontend Developer</strong> <strong>최광서</strong>입니다.
          </p>
        </div>
      </div>

      <div className="section1Bottom" ref={bottomRef}>
        <ul className="s1ListWrap">
          {tools.map((t, idx) => {
            const isActive = idx === uiIndex;
            const isPrev = idx < uiIndex;
            const isNext = idx > uiIndex;

            return (
              <li
                key={t.key}
                className={[
                  "listItem",
                  "s1-item",
                  isActive ? "is-active" : "",
                  isPrev ? "is-prev" : "",
                  isNext ? "is-next" : "",
                ]
                  .join(" ")
                  .trim()}
                //  데스크톱 hover만 허용
                onPointerEnter={() => {
                  if (isHoverable) setHoverIndex(idx);
                }}
                onPointerLeave={() => {
                  if (isHoverable) setHoverIndex(null);
                }}
                aria-label={`${t.label}: ${t.desc}`}
              >
                <div className={`s1List ${t.key}`}>{t.label}</div>
                <div className="explanation">{t.desc}</div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
