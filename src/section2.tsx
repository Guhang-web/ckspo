// section2.tsx
import { useEffect, useRef } from "react";
import "./section2.css";

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

type ItemMeasure = { top: number; height: number; center: number };

function getDocTop(el: HTMLElement | null): number {
  // transform 영향 없는 “레이아웃 문서 좌표” 누적
  let y = 0;
  let cur: HTMLElement | null = el;
  while (cur) {
    y += cur.offsetTop || 0;
    cur = cur.offsetParent as HTMLElement | null;
  }
  return y;
}

function Section2() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const toolRef = useRef<HTMLDivElement | null>(null);
  const accentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const tool = toolRef.current;
    const accent = accentRef.current;
    if (!section || !tool || !accent) return;

    const items = Array.from(section.querySelectorAll<HTMLUListElement>(".listTool"));
    if (items.length === 0) return;

    const state = {
      active: false,
      index: 0,
      raf: 0 as number | 0,
      lastY: 0, // vscroll에서 받은 y
      dirty: true, // 레이아웃 재측정 필요 여부
      toolDocTop: 0,
      toolHeight: 0,
      measures: [] as ItemMeasure[],
      reduceMotion: false,
    };

    const mql = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    state.reduceMotion = !!mql?.matches;

    const setAccentVisible = (on: boolean) => {
      accent.style.opacity = on ? "1" : "0";
    };

    const updateClasses = (nextIndex: number) => {
      items.forEach((ul, idx) => {
        ul.classList.toggle("is-active", idx === nextIndex);
        ul.classList.toggle("is-prev", idx < nextIndex);
        ul.classList.toggle("is-next", idx > nextIndex);
      });
    };

    const measure = () => {
      //  offset 기반 측정만 (getBoundingClientRect 금지)
      state.toolDocTop = getDocTop(tool);
      state.toolHeight = tool.offsetHeight;

      state.measures = items.map((el) => {
        const top = el.offsetTop;
        const height = el.offsetHeight;
        return { top, height, center: top + height / 2 };
      });

      state.dirty = false;
    };

    const getCenterLocalY = () => {
      // viewport center(문서좌표) = y + innerHeight/2
      // tool 내부좌표 = (문서좌표 - toolDocTop)
      const centerDocY = state.lastY + window.innerHeight * 0.5;
      return centerDocY - state.toolDocTop;
    };

    const getCoverState = () => {
      // tool 영역 내부에서만 accent 활성 (hysteresis)
      const centerLocalY = getCenterLocalY();

      const ON_PAD = 18;
      const OFF_PAD = 10;

      const canTurnOn = centerLocalY >= ON_PAD && centerLocalY <= state.toolHeight - ON_PAD;
      const shouldTurnOff = centerLocalY < OFF_PAD || centerLocalY > state.toolHeight - OFF_PAD;

      return { canTurnOn, shouldTurnOff, centerLocalY };
    };

    const getNearestIndex = (centerLocalY: number) => {
      let bestIdx = 0;
      let bestDist = Number.POSITIVE_INFINITY;

      for (let i = 0; i < state.measures.length; i++) {
        const d = Math.abs(state.measures[i].center - centerLocalY);
        if (d < bestDist) {
          bestDist = d;
          bestIdx = i;
        }
      }
      return clamp(bestIdx, 0, items.length - 1);
    };

    const updateAccentToIndex = (idx: number) => {
      const m = state.measures[idx];
      if (!m) return;

      // accent는 tool 내부 레이아웃 좌표만 사용
      // 서브픽셀 떨림 최소화 (원하면 Math.round)
      const y = Math.round(m.top);

      accent.style.top = "0px";
      accent.style.height = `${m.height}px`;
      accent.style.transform = `translate3d(0, ${y}px, 0)`;
    };

    const activate = (centerLocalY: number) => {
      if (state.active) return;
      state.active = true;

      const nearest = getNearestIndex(centerLocalY);
      state.index = nearest;
      updateClasses(nearest);

      setAccentVisible(true);
      updateAccentToIndex(nearest);
    };

    const deactivate = () => {
      if (!state.active) return;
      state.active = false;

      setAccentVisible(false);

      // 잔상 방지
      accent.style.transform = "";
      accent.style.top = "0px";
    };

    const frame = () => {
      state.raf = 0;

      if (state.dirty) measure();

      const cover = getCoverState();

      if (!state.active) {
        if (!cover.canTurnOn) {
          setAccentVisible(false);
          return;
        }
        activate(cover.centerLocalY);
        return;
      } else {
        if (cover.shouldTurnOff) {
          deactivate();
          return;
        }
      }

      // 활성 상태: nearest 갱신 + accent를 active item으로 스냅
      const nearest = getNearestIndex(cover.centerLocalY);
      if (nearest !== state.index) {
        state.index = nearest;
        updateClasses(nearest);
      }

      updateAccentToIndex(state.index);
    };

    const requestFrame = () => {
      if (state.raf) return;
      state.raf = requestAnimationFrame(frame);
    };

    const onVScroll = (e: Event) => {
      const ce = e as CustomEvent<{ y?: number }>;
      const y = ce.detail?.y ?? 0;
      state.lastY = y;
      requestFrame();
    };

    const markDirtyAndUpdate = () => {
      state.dirty = true;
      requestFrame();
    };

    //  ResizeObserver: 레이아웃 변화 감지(폰트/줄바꿈/반응형 포함)
    const ro = new ResizeObserver(() => {
      markDirtyAndUpdate();
    });
    ro.observe(tool);
    items.forEach((el) => ro.observe(el));

    //  폰트 로딩 이후 한 번 더
    const fontsAny = (document as any).fonts;
    if (fontsAny?.ready?.then) {
      fontsAny.ready.then(() => {
        markDirtyAndUpdate();
      });
    }

    // prefers-reduced-motion 변경 대응(선택)
    const onMqlChange = () => {
      state.reduceMotion = !!mql?.matches;
      // motion 줄여도 위치는 동일, 필요하면 클래스/transition 제어만 css에서
      requestFrame();
    };
    mql?.addEventListener?.("change", onMqlChange);

    // 초기화
    accent.style.top = "0px";
    accent.style.transform = "";
    setAccentVisible(false);
    updateClasses(0);
    requestFrame();

    window.addEventListener("vscroll", onVScroll as EventListener, { passive: true });
    window.addEventListener("resize", markDirtyAndUpdate);

    return () => {
      window.removeEventListener("vscroll", onVScroll as EventListener);
      window.removeEventListener("resize", markDirtyAndUpdate);

      mql?.removeEventListener?.("change", onMqlChange);

      ro.disconnect();

      if (state.raf) cancelAnimationFrame(state.raf);

      setAccentVisible(false);
      accent.style.transform = "";
      accent.style.top = "0px";
    };
  }, []);

  return (
    <section id="section2" ref={sectionRef}>
      <div className="section2Layout">
        <img className="mungMoon" src="./section/mung_with_moon.png" alt="노트북" />
      </div>

      <div className="section2Middle">
        <p className="section2Middle_p">
          사용되는 흐름을 기준으로 화면을 설계하고,
          <br />
          AI를 활용해 방향을 탐색하되 최종 구조는 직접 결정합니다.
        </p>

        <div className="section2Tool" ref={toolRef}>
          <div className="tool__accent" ref={accentRef} />

          <ul className="listTool toola1">
            <li className="toolLogo listSvg toola2">
              <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="bi bi-filetype-html" viewBox="0 0 16 16">
                <path
                  fillRule="evenodd"
                  d="M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zm-9.736 7.35v3.999h-.791v-1.714H1.79v1.714H1V11.85h.791v1.626h1.682V11.85h.79Zm2.251.662v3.337h-.794v-3.337H4.588v-.662h3.064v.662zm2.176 3.337v-2.66h.038l.952 2.159h.516l.946-2.16h.038v2.661h.715V11.85h-.8l-1.14 2.596H9.93L8.79 11.85h-.805v3.999zm4.71-.674h1.696v.674H12.61V11.85h.79v3.325Z"
                />
              </svg>
            </li>
            <li className="tool">HTML / CSS</li>
            <li className="toolCompetency toola3">레이아웃 구성과 반응형 화면 구현</li>
          </ul>

          <ul className="listTool tools1">
            <li className="toolLogo listSvg">
              <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="bi bi-javascript" viewBox="0 0 16 16">
                <path
                  fillRule="evenodd"
                  d="M14 0a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zM9.053 7.596v3.127l-.007 1.752q0 .498-.186.752t-.556.263q-.342 0-.528-.234-.185-.234-.185-.684v-.175H6.37v.185q0 .665.253 1.113.255.45.703.674.44.225 1.016.225.88 0 1.406-.498.527-.498.527-1.485l.007-1.752V7.596zm3.808-.108q-.585 0-1.006.244a1.67 1.67 0 0 0-.634.674 2.1 2.1 0 0 0-.225.996q0 .753.293 1.182.303.42.967.732l.469.215q.438.186.625.43.185.244.185.635 0 .478-.166.703-.156.224-.527.224-.361.001-.547-.244-.186-.243-.205-.752h-1.162q.02.996.498 1.524.479.527 1.386.527.909 0 1.417-.518.507-.517.507-1.484 0-.81-.332-1.289t-1.045-.79l-.449-.196q-.39-.166-.556-.381-.166-.214-.166-.576 0-.4.165-.596.177-.195.508-.195.361 0 .508.234.156.234.176.703h1.123q-.03-.976-.498-1.484-.47-.518-1.309-.518"
                />
              </svg>
            </li>
            <li className="tool">JavaScript</li>
            <li className="toolCompetency">DOM 제어, 이벤트 처리, 데이터 요청</li>
          </ul>

          <ul className="listTool tools1">
            <li className="toolLogo listImg">
              <img className="jQueryLogo" src="./section/jQuery.png" alt="jQuery 로고" />
            </li>
            <li className="tool">jQuery (basic)</li>
            <li className="toolCompetency">기존 코드 이해 및 간단한 수정</li>
          </ul>

          <ul className="listTool tools1">
            <li className="toolLogo reactToolLogo">
              <svg width="80" height="80" viewBox="0 0 700 700" fill="none" xmlns="http://www.w3.org/2000/svg" className="bi bi-react">
                <g stroke="currentColor" strokeWidth="25">
                  <ellipse cx="420.9" cy="296.5" rx="20" ry="20" fill="currentColor" />
                  <ellipse rx="211" ry="91" cx="420.9" cy="296.5" />
                  <ellipse rx="211" ry="91" cx="420.9" cy="296.5" transform="rotate(60 420.9 296.5)" />
                  <ellipse rx="211" ry="91" cx="420.9" cy="296.5" transform="rotate(120 420.9 296.5)" />
                </g>
              </svg>
            </li>
            <li className="tool">React</li>
            <li className="toolCompetency">컴포넌트 분리와 상태 기반 UI 구성</li>
          </ul>

          <ul className="listTool tools1">
            <li className="toolLogo listSvg">
              <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="bi bi-github" viewBox="0 0 16 16">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
              </svg>
            </li>
            <li className="tool">Git / GitHub</li>
            <li className="toolCompetency">기본적인 협업 흐름과 버전 관리</li>
          </ul>

          <ul className="listTool tools1 tools2">
            <li className="toolLogo listSvg">
              <svg width="50" height="50" viewBox="0 0 200 350" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 150a0 50 0 1 0 0-100H50a50 50 0 0 0 0 100h50z" fill="#F24E1E" />
                <path d="M100 150a0 50 0 1 0 0-100h50a50 50 0 0 1 0 100h-50z" fill="#FF7262" />
                <path d="M100 150a0 50 0 1 1 0 100H50a50 50 0 0 1 0-100h50z" fill="#A259FF" />
                <circle cx="150" cy="200" r="50" fill="#1ABCFE" />
                <circle cx="50" cy="300" r="50" fill="#0ACF83" />
              </svg>
            </li>
            <li className="tool">Figma</li>
            <li className="toolCompetency">디자인 시안에서 이미지 및 리소스 추출</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default Section2;
