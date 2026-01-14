// Nav.tsx
import React, { useEffect, useRef, useState } from "react";
import "./nav.css";

type NavProps = {
  hidden?: boolean;
};

function MenuIcon({
  len = 200,
  align = "right",
  strokeWidth = 1,
  pad = 0,
  gap = 4.5,
  ...rest
}: React.SVGProps<SVGSVGElement> & {
  len?: number;
  align?: "left" | "center" | "right";
  strokeWidth?: number;
  pad?: number;
  gap?: number;
}) {
  const height = 18;
  const vbW = Math.max(len + pad * 2, 10);
  const center = vbW / 2;

  let x1 = pad,
    x2 = vbW - pad;
  if (align === "left") {
    x1 = pad;
    x2 = x1 + len;
  } else if (align === "center") {
    x1 = center - len / 2;
    x2 = center + len / 2;
  } else {
    x2 = vbW - pad;
    x1 = x2 - len;
  }

  const y1 = 2.5,
    y2 = y1 + gap,
    y3 = y2 + gap;

  return (
    <svg
      width={vbW}
      height={height}
      viewBox={`0 0 ${vbW} ${height}`}
      fill="none"
      aria-hidden="true"
      {...rest}
    >
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y1}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <line
        x1={x1}
        y1={y2}
        x2={x2}
        y2={y2}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <line
        x1={x1}
        y1={y3}
        x2={x2}
        y2={y3}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

type BgKey = "thought" | "about" | "lab" | "work" | "join" | "contact";

const BG_MAP: Record<BgKey, string> = {
  thought: "/nav/nav3.webp",
  about: "/nav/me.webp",
  lab: "/nav/nav1.webp",
  work: "/nav/nav2.webp",
  join: "/nav/nav4.webp",
  contact: "/nav/nav5.webp",
};

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export default function Nav({ hidden = false }: NavProps) {
  const [selected, setSelected] = useState<BgKey>("thought");
  const [hovered, setHovered] = useState<BgKey | null>(null);
  const [open, setOpen] = useState(false);

  const loadedRef = useRef<Set<string>>(new Set());

  const [active, setActive] = useState<0 | 1>(0);
  const activeRef = useRef<0 | 1>(0);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    Object.values(BG_MAP).forEach((src) => {
      const img = new Image();
      const markLoaded = () => loadedRef.current.add(src);

      img.onload = markLoaded;
      img.onerror = () => loadedRef.current.add(src);
      img.src = src;

      if (img.complete) markLoaded();
    });
  }, []);

  const effectiveKey = hovered ?? selected;

  const [layerA, setLayerA] = useState<string>(BG_MAP[effectiveKey]);
  const [layerB, setLayerB] = useState<string>(BG_MAP[effectiveKey]);

  useEffect(() => {
    const nextUrl = BG_MAP[effectiveKey];

    let cancelled = false;
    let applied = false;

    const crossfade = () => {
      if (cancelled || applied) return;
      applied = true;

      const nextActive: 0 | 1 = activeRef.current === 0 ? 1 : 0;

      if (nextActive === 0) setLayerA(nextUrl);
      else setLayerB(nextUrl);

      requestAnimationFrame(() => {
        if (cancelled) return;
        setActive(nextActive);
      });
    };

    if (loadedRef.current.has(nextUrl)) {
      crossfade();
      return () => {
        cancelled = true;
      };
    }

    const img = new Image();
    img.onload = () => {
      loadedRef.current.add(nextUrl);
      crossfade();
    };
    img.onerror = () => {
      loadedRef.current.add(nextUrl);
      crossfade();
    };
    img.src = nextUrl;

    if (img.complete) {
      loadedRef.current.add(nextUrl);
      crossfade();
    }

    return () => {
      cancelled = true;
    };
  }, [effectiveKey]);

  const menuRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => setOpen((v) => !v);
  const closeMenu = () => setOpen(false);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };

    const onClickOutside = (e: MouseEvent) => {
      const t = e.target as Node;
      if (menuRef.current?.contains(t)) return;
      if (btnRef.current?.contains(t)) return;
      closeMenu();
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClickOutside);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [open]);

  /**
   * ✅ 핵심: 가상 스크롤 이동 함수
   * App.tsx의 contentRef(vs__content)의 "레이아웃 좌표계"에서 targetY를 계산해야 함.
   *
   * - offsetTop은 offsetParent에 따라 깨질 수 있어서, offsetParent 체인을 타고 올라가며 합산한다.
   * - 기준은 ".vs__content" (App의 contentRef)로 고정.
   */
  const getTopInContent = (targetEl: HTMLElement) => {
    const contentEl = document.querySelector(".vs__content") as HTMLElement | null;
    if (!contentEl) return 0;

    let y = 0;
    let node: HTMLElement | null = targetEl;

    // targetEl이 contentEl 내부일 때까지 offsetTop 누적
    while (node && node !== contentEl) {
      y += node.offsetTop;
      node = node.offsetParent as HTMLElement | null;
    }

    return y;
  };

  const vscrollToId = (id: string) => {
    const el = document.getElementById(id) as HTMLElement | null;
    const contentEl = document.querySelector(".vs__content") as HTMLElement | null;
    if (!el || !contentEl) return;

    const y = getTopInContent(el);

    // ✅ App.tsx에서 쓰는 동일 패턴: vscroll 이벤트를 계속 받고 있을 컴포넌트들을 위해
    // transform 이동은 App에서 tick이 적용하므로, 여기서는 "wheel처럼 targetYRef를 만질 수가 없음".
    // 대신 가장 안전한 방식: 커스텀 이벤트로 App에게 "이동 요청"을 보낸다.
    window.dispatchEvent(new CustomEvent("vscroll:to", { detail: { y } }));

    // URL hash는 업데이트(브라우저 기본 스크롤은 막음)
    history.replaceState(null, "", `#${id}`);
  };

  /**
   * ✅ 섹션 링크(About/Lab/Work/Contact)는 가상 스크롤 이동으로만 처리
   */
  const onJump = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    closeMenu();
    vscrollToId(id);
  };

  const onJumpKey = (id: string) => (e: React.KeyboardEvent<HTMLAnchorElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      closeMenu();
      vscrollToId(id);
    }
  };

  /**
   * 기존 overlay 메뉴(Thought/About/Lab/Work/Join/Contact)는 네 UI 로직 유지
   * 여기서는 "selected"만 바꾸고 닫는다 (원하면 이것도 섹션 점프로 바꿀 수 있음)
   */
  const onLink = (key: BgKey) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setSelected(key);
    closeMenu();
  };

  const onLinkKey = (key: BgKey) => (e: React.KeyboardEvent<HTMLAnchorElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSelected(key);
      closeMenu();
    }
  };

  const onEnter = (k: BgKey) => () => setHovered(k);
  const onLeave = () => setHovered(null);
  const onFocus = (k: BgKey) => () => setHovered(k);
  const onBlur = () => setHovered(null);

  return (
    <nav id="nav" className={`nav ${hidden ? "isHidden" : ""}`} aria-label="주요">
      <ul className={`navBox${open ? " is-overlay" : ""}`} role="list" aria-live="polite">
        {open ? (
          <li className="navClose">
            <button type="button" className="closeBtn" aria-label="메뉴 닫기" onClick={closeMenu}>
              <span aria-hidden>×</span>
            </button>
          </li>
        ) : (
          <>
            <li className="navAbout">
              <a href="#section1" onClick={onJump("section1")} onKeyDown={onJumpKey("section1")}>
                About
              </a>
            </li>
            <li className="navLab">
              <a href="#section2" onClick={onJump("section2")} onKeyDown={onJumpKey("section2")}>
                Lab
              </a>
            </li>
            <li className="navWork">
              <a href="#section3" onClick={onJump("section3")} onKeyDown={onJumpKey("section3")}>
                Work
              </a>
            </li>
            <li className="navContact">
              <a href="#footer" onClick={onJump("footer")} onKeyDown={onJumpKey("footer")}>
                Contact
              </a>
            </li>
            <li className="navMenu">
              <button
                ref={btnRef}
                type="button"
                className="menuBtn"
                aria-label="메뉴 열기"
                aria-controls="globalMenu"
                aria-expanded={open}
                onClick={toggleMenu}
              >
                <MenuIcon len={70} align="right" pad={1} />
              </button>
            </li>
          </>
        )}
      </ul>

      <div
        id="globalMenu"
        ref={menuRef}
        className={`menu${open ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
      >
        <div className="meunMain">
          <ul className="menuTop">
            <li>
              <a href="#" onClick={(e) => e.preventDefault()}>
                LINKEDIN
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => e.preventDefault()}>
                NEWSLETTER
              </a>
            </li>
          </ul>

          <ul className="menuMeddle">
            <li>
              <a
                href="#thought"
                onClick={onLink("thought")}
                onKeyDown={onLinkKey("thought")}
                onMouseEnter={onEnter("thought")}
                onMouseLeave={onLeave}
                onFocus={onFocus("thought")}
                onBlur={onBlur}
              >
                Thought
              </a>
            </li>
            <li>
              <a
                href="#about"
                onClick={onLink("about")}
                onKeyDown={onLinkKey("about")}
                onMouseEnter={onEnter("about")}
                onMouseLeave={onLeave}
                onFocus={onFocus("about")}
                onBlur={onBlur}
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#lab"
                onClick={onLink("lab")}
                onKeyDown={onLinkKey("lab")}
                onMouseEnter={onEnter("lab")}
                onMouseLeave={onLeave}
                onFocus={onFocus("lab")}
                onBlur={onBlur}
              >
                Lab
              </a>
            </li>
            <li>
              <a
                href="#work"
                onClick={onLink("work")}
                onKeyDown={onLinkKey("work")}
                onMouseEnter={onEnter("work")}
                onMouseLeave={onLeave}
                onFocus={onFocus("work")}
                onBlur={onBlur}
              >
                Work
              </a>
            </li>
            <li>
              <a
                href="#join"
                onClick={onLink("join")}
                onKeyDown={onLinkKey("join")}
                onMouseEnter={onEnter("join")}
                onMouseLeave={onLeave}
                onFocus={onFocus("join")}
                onBlur={onBlur}
              >
                Join
              </a>
            </li>
            <li>
              <a
                href="#contact"
                onClick={onLink("contact")}
                onKeyDown={onLinkKey("contact")}
                onMouseEnter={onEnter("contact")}
                onMouseLeave={onLeave}
                onFocus={onFocus("contact")}
                onBlur={onBlur}
              >
                Contact
              </a>
            </li>
          </ul>
        </div>

        <div className="menuBottom" aria-hidden="true">
          <span className="mb-backdrop" />
          <span
            className={`mb-layer ${active === 0 ? "is-on" : ""}`}
            style={{ ["--bg" as any]: `url("${layerA}")` }}
          />
          <span
            className={`mb-layer ${active === 1 ? "is-on" : ""}`}
            style={{ ["--bg" as any]: `url("${layerB}")` }}
          />
        </div>
      </div>
    </nav>
  );
}
