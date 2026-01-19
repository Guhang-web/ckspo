// section1.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import "./section1.css";

import EggSVG from "./CssAni/Egg.SVG";
import RobotSVG from "./CssAni/RobotSVG";
import MilkSVG from "./CssAni/MilkSVG";
import TurtleSVG from "./CssAni/TurtleSVG";
import VoltorbBounce from "./CssAni/VoltorbBounce";
import KirbySVG from "./CssAni/kirbySVG";
import FlyingBirds from "./CssAni/birlSVG";
import AirpodsSVG from "./CssAni/AirpodsSVG";
import BlackHoleSVG from "./CssAni/BlackHoleSVG";

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

type VisualComp = React.ComponentType | null;

type ToolItem = {
  key: string;
  label: string;
  desc: string;
  Visual: VisualComp;
};

type VScrollDetail = { y: number };

export default function Section1() {
  const sectionRef = useRef<HTMLElement | null>(null);

  // TOP parallax
  const voltorbWrapRef = useRef<HTMLDivElement | null>(null);
  const blackholeWrapRef = useRef<HTMLDivElement | null>(null);

  // ✅ sticky
  const middleRef = useRef<HTMLDivElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);

  // list
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const tools: readonly ToolItem[] = useMemo(
    () =>
      [
        { key: "egg", label: "EGG", desc: "The egg character gently bobs.", Visual: EggSVG as VisualComp },
        { key: "robot", label: "ROBOT", desc: "The boxy robot gently bobs.", Visual: RobotSVG as VisualComp },
        { key: "milk", label: "MILK", desc: "The milk carton gently bobs.", Visual: MilkSVG as VisualComp },
        { key: "turtle", label: "TURTLE", desc: "The shy turtle gently bobs.", Visual: TurtleSVG as VisualComp },
        { key: "kirby", label: "KIRBY", desc: "Kirby Flying Through the Sky", Visual: KirbySVG as VisualComp },
        { key: "bird", label: "BIRD", desc: "A bird flying freely in the open sky", Visual: FlyingBirds as VisualComp },
        { key: "airpods", label: "AIRPODS", desc: "Hear the richness. AirPods", Visual: AirpodsSVG as VisualComp },
      ] as const,
    []
  );

  const displayIndex = hoverIndex ?? activeIndex;
  const DisplayVisual =
    hoverIndex !== null ? tools[displayIndex]?.Visual ?? null : null;

  /**
   * (1) TOP parallax (vscroll 기반)
   */
  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const VOL_MAX = 450;
    const BH_MAX = 180;
    const RANGE_PX = 1100;

    let raf = 0;
    let latestY = 0;

    const update = () => {
      raf = 0;

      const sectionTop = sectionEl.offsetTop;
      const vh = window.innerHeight;

      const start = sectionTop - vh * 1.1;
      const end = start + RANGE_PX;

      const raw = (latestY - start) / (end - start);
      const t = clamp(raw, 0, 1);

      const eased = t * t * (3 - 2 * t);

      voltorbWrapRef.current?.style.setProperty("--s1-voltorb-y", `${-eased * VOL_MAX}px`);
      blackholeWrapRef.current?.style.setProperty("--s1-blackhole-y", `${-eased * BH_MAX}px`);
    };

    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    const onVScroll = (e: Event) => {
      const ce = e as CustomEvent<VScrollDetail>;
      latestY = ce.detail?.y ?? 0;
      schedule();
    };

    window.addEventListener("vscroll", onVScroll as EventListener);
    window.addEventListener("resize", schedule);
    schedule();

    return () => {
      window.removeEventListener("vscroll", onVScroll as EventListener);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const middle = middleRef.current;
    const pin = pinRef.current;
    if (!middle || !pin) return;

    // pin은 middle 기준 absolute
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

    const onVScroll = () => schedule();
    const onResize = () => schedule();

    // 크기 바뀌면 재계산
    const ro = new ResizeObserver(() => schedule());
    ro.observe(middle);
    ro.observe(pin);

    // 초기 1회
    apply();

    window.addEventListener("vscroll", onVScroll as EventListener);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("vscroll", onVScroll as EventListener);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /**
    activeIndex: pin과 가장 가까운 리스트 아이템 활성화
   */
  useEffect(() => {
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

      items.forEach((el, idx) => {
        el.classList.toggle("is-active", idx === bestIdx);
        el.classList.toggle("is-prev", idx < bestIdx);
        el.classList.toggle("is-next", idx > bestIdx);
      });

      setActiveIndex(bestIdx);
    };

    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    window.addEventListener("vscroll", schedule as EventListener);
    window.addEventListener("resize", schedule);
    schedule();

    return () => {
      window.removeEventListener("vscroll", schedule as EventListener);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="section1" ref={sectionRef}>
      <div className="section1Top">
        <div className="section1Css1" ref={voltorbWrapRef}>
          <div className="bolt-pos">
            <VoltorbBounce/>
          </div>
        </div>

        <div className="section1Css2" ref={blackholeWrapRef}>
          <BlackHoleSVG />
        </div>
      </div>

      <div className="section1Middle" ref={middleRef}>
        <div className={`section1Layout ${DisplayVisual ? "is-visual" : ""}`} ref={pinRef}>
          <img className="mungLayout" src="./section/mungYa.png" alt="뭉 웃는모습" />
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
            사용자 관점으로 결과를 만드는<strong> Junior Frontend Developer</strong>{" "}
            <strong>최광서</strong>입니다.
          </p>
        </div>
      </div>

      <div className="section1Bottom" ref={bottomRef}>
        <ul className="s1ListWrap">
          {tools.map((t, idx) => (
            <li
              key={t.key}
              className="listItem s1-item"
              tabIndex={0}
              onMouseEnter={() => setHoverIndex(idx)}
              onMouseLeave={() => setHoverIndex(null)}
              onFocus={() => setHoverIndex(idx)}
              onBlur={() => setHoverIndex(null)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActiveIndex(idx);
                }
              }}
              aria-label={`${t.label}: ${t.desc}`}
            >
              <div className={`s1List ${t.key}`}>{t.label}</div>
              <div className="explanation">{t.desc}</div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
