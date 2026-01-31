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

  // sticky
  const middleRef = useRef<HTMLDivElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);

  // list
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
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

  // ✅ 터치 디바이스(hover 없음) 판별
  const isCoarse = useMemo(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia?.("(hover: none) and (pointer: coarse)")?.matches ?? false
    );
  }, []);

  // ✅ 데스크톱(hover 가능) 판별
  const isHoverable = useMemo(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia?.("(hover: hover) and (pointer: fine)")?.matches ?? false
    );
  }, []);

  /**
   * ✅ UI에서 “활성처럼 보이게” 할 기준
   * - 데스크톱: hoverIndex가 있으면 hover가 우선
   * - 모바일: activeIndex(스크롤로 자동 갱신)가 기준
   */
  const uiIndex = isHoverable ? hoverIndex ?? activeIndex : activeIndex;

  /**
   * ✅ 비주얼 표시 기준
   * - 데스크톱: hover로만 바뀌도록(hoverIndex가 없으면 activeIndex 유지)
   * - 모바일: 탭으로 선택한 hoverIndex가 있으면 그거, 없으면 activeIndex
   */
  const displayIndex = isHoverable ? uiIndex : hoverIndex ?? activeIndex;
  const DisplayVisual = tools[displayIndex]?.Visual ?? null;

  /**
   * (1) TOP parallax
   * ✅ vscroll(가상스크롤) + native scroll(모바일) 둘 다 지원
   */
  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const VOL_MAX = 450;
    const BH_MAX = 180;
    const RANGE_PX = 1100;

    let raf = 0;
    let latestY = 0;

    const getNativeScrollY = () =>
      window.scrollY ||
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      0;

    const update = () => {
      raf = 0;

      const sectionTop = sectionEl.offsetTop;
      const vh = window.innerHeight;

      const start = sectionTop - vh * 1.1;
      const end = start + RANGE_PX;

      const raw = (latestY - start) / (end - start);
      const t = clamp(raw, 0, 1);

      // smoothstep
      const eased = t * t * (3 - 2 * t);

      voltorbWrapRef.current?.style.setProperty(
        "--s1-voltorb-y",
        `${-eased * VOL_MAX}px`
      );
      blackholeWrapRef.current?.style.setProperty(
        "--s1-blackhole-y",
        `${-eased * BH_MAX}px`
      );
    };

    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    // (A) 가상 스크롤 이벤트
    const onVScroll = (e: Event) => {
      const ce = e as CustomEvent<VScrollDetail>;
      latestY = ce.detail?.y ?? 0;
      schedule();
    };

    // (B) 네이티브 스크롤 이벤트(모바일)
    const onNativeScroll = () => {
      latestY = getNativeScrollY();
      schedule();
    };

    const onResize = () => {
      latestY = getNativeScrollY();
      schedule();
    };

    window.addEventListener("vscroll", onVScroll as EventListener);
    window.addEventListener("scroll", onNativeScroll, { passive: true });
    window.addEventListener("resize", onResize);

    // 초기 1회 세팅
    latestY = getNativeScrollY();
    schedule();

    return () => {
      window.removeEventListener("vscroll", onVScroll as EventListener);
      window.removeEventListener("scroll", onNativeScroll as EventListener);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /**
   * (2) middle pin: middle 내부에서 pinRef가 화면 중앙에 고정되도록 top 계산
   * (이건 vscroll 기반이라, 네 App의 가상스크롤 구조에서 이미 잘 동작)
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
    window.addEventListener("resize", schedule);

    return () => {
      window.removeEventListener("vscroll", schedule as EventListener);
      window.removeEventListener("resize", schedule);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /**
   * (3) activeIndex: pin과 가장 가까운 리스트 아이템 활성화
   * ✅ 모바일(hover 불가)에서만 동작
   * ✅ 데스크톱(hover 가능)에서는 스크롤로 activeIndex를 바꾸지 않음
   */
  useEffect(() => {
    if (isHoverable) return; // 데스크톱에서는 비활성화

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
    window.addEventListener("resize", schedule);
    schedule();

    return () => {
      window.removeEventListener("vscroll", schedule as EventListener);
      window.removeEventListener("resize", schedule);
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
        <div
          className={`section1Layout ${DisplayVisual ? "is-visual" : ""}`}
          ref={pinRef}
        >
          <div
            className={`s1VisualStage ${DisplayVisual ? "is-on" : ""}`}
            aria-hidden="true"
          >
            {DisplayVisual ? <DisplayVisual /> : null}
          </div>
        </div>

        <div className="introduce">
          <p className="introText">
            지난 <span className="accent">7년 4개월</span> 동안 카페 점장으로
            운영과 고객 경험을 쌓았고,
            <br />
            퇴사 후 <span className="accent">1년</span> Frontend를 집중
            학습했습니다.
            <br />
            <span className="accent">2025.04 ~ 25.12.31</span> 회사 운영팀에서
            QA로 일하며 실행력을 더하였습니다.
            <br />
            사용자 관점으로 결과를 만드는{" "}
            <strong>Junior Frontend Developer</strong>{" "}
            <strong>최광서</strong>입니다.
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
                tabIndex={0}
                onPointerEnter={() => {
                  // ✅ 데스크톱: hover로만 반응
                  if (isHoverable) setHoverIndex(idx);
                }}
                onPointerLeave={() => {
                  if (isHoverable) setHoverIndex(null);
                }}
                onClick={() => {
                  // ✅ 모바일: 탭으로 선택(토글)
                  // (hover 없는 환경에서만)
                  if (!isHoverable && isCoarse) {
                    setHoverIndex((prev) => (prev === idx ? null : idx));
                    setActiveIndex(idx);
                  }
                }}
                onFocus={() => setHoverIndex(idx)}
                onBlur={() => setHoverIndex(null)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveIndex(idx);
                    setHoverIndex(idx);
                  }
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
