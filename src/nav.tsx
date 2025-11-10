// Nav.tsx
import React, { useEffect, useRef, useState } from "react";
import "./nav.css";

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

    let x1 = pad, x2 = vbW - pad;
    if (align === "left") { x1 = pad; x2 = x1 + len; }
    else if (align === "center") { x1 = center - len / 2; x2 = center + len / 2; }
    else { x2 = vbW - pad; x1 = x2 - len; }

    const y1 = 2.5, y2 = y1 + gap, y3 = y2 + gap;

    return (
        <svg width={vbW} height={height} viewBox={`0 0 ${vbW} ${height}`} fill="none" aria-hidden="true" {...rest}>
            <line x1={x1} y1={y1} x2={x2} y2={y1} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            <line x1={x1} y1={y2} x2={x2} y2={y2} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            <line x1={x1} y1={y3} x2={x2} y2={y3} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>
    );
}

type BgKey = "thought" | "about" | "lab" | "work" | "join" | "contact";

const BG_MAP: Record<BgKey, string> = {
    thought: "/nav/nav3.jpg",
    about: "/nav/me.jpg",
    lab: "/nav/nav1.jpg",
    work: "/nav/nav2.jpg",
    join: "/nav/nav4.jpg",
    contact: "/nav/nav5.jpg",
};

export default function Nav() {
    // 선택 고정 상태 + 호버(디바운스) 상태 + 메뉴 열림
    const [selected, setSelected] = useState<BgKey>("thought");
    const [hovered, setHovered] = useState<BgKey | null>(null);
    const [open, setOpen] = useState(false);

    // ▼ 호버 디바운스(빠른 연속 호버 보정)
    const hoverTimer = useRef<number | null>(null);
    const setHoveredDebounced = (k: BgKey | null) => {
        if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
        hoverTimer.current = window.setTimeout(() => setHovered(k), 80); // 60~120ms 권장
    };

    // 실제 표시 키(호버 우선)
    const effectiveKey = hovered ?? selected;

    // ▼ 크로스페이드 레이어(더블 버퍼)
    const [active, setActive] = useState<0 | 1>(0);
    const [layerA, setLayerA] = useState<string>(BG_MAP[effectiveKey]);
    const [layerB, setLayerB] = useState<string>(BG_MAP[effectiveKey]);

    useEffect(() => {
        const nextUrl = BG_MAP[effectiveKey];
        let cancelled = false;
        const img = new Image();
        img.onload = () => {
            if (cancelled) return;
            if (active === 0) setLayerB(nextUrl);
            else setLayerA(nextUrl);
            requestAnimationFrame(() => setActive(prev => (prev === 0 ? 1 : 0)));
        };
        img.src = nextUrl;
        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [effectiveKey]);

    // 메뉴 열고 닫기
    const menuRef = useRef<HTMLDivElement>(null);
    const btnRef = useRef<HTMLButtonElement>(null);

    const toggleMenu = () => setOpen(v => !v);
    const closeMenu = () => setOpen(false);

    // ESC / 바깥 클릭으로 닫기
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeMenu(); };
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

    // 링크/호버 핸들러
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
    const onEnter = (k: BgKey) => () => setHoveredDebounced(k);
    const onLeave = () => setHoveredDebounced(null);
    const onFocus = (k: BgKey) => () => setHoveredDebounced(k);
    const onBlur = () => setHoveredDebounced(null);

    return (
        <nav id="nav" aria-label="주요">
            {/* 하단 바: 메뉴 열림 시 X 캡슐 */}
            <ul className={`navBox${open ? " is-overlay" : ""}`} role="list" aria-live="polite">
                {open ? (
                    <li className="navClose">
                        <button
                            type="button"
                            className="closeBtn"
                            aria-label="메뉴 닫기"
                            onClick={closeMenu}
                        >
                            <span aria-hidden>×</span>
                        </button>
                    </li>
                ) : (
                    <>
                        <li className="navAbout"><a href="#about">About</a></li>
                        <li className="navLab"><a href="#lab">Lab</a></li>
                        <li className="navWork"><a href="#work">Work</a></li>
                        <li className="navContact"><a href="#contact">Contact</a></li>
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

            {/* 메뉴 오버레이 */}
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
                        <li><a href="#">LINKEDIN</a></li>
                        <li><a href="#">NEWSLETTER</a></li>
                    </ul>

                    <ul className="menuMeddle">
                        <li><a href="#thought" onClick={onLink("thought")} onKeyDown={onLinkKey("thought")} onMouseEnter={onEnter("thought")} onMouseLeave={onLeave} onFocus={onFocus("thought")} onBlur={onBlur}>Thought</a></li>
                        <li><a href="#about" onClick={onLink("about")} onKeyDown={onLinkKey("about")} onMouseEnter={onEnter("about")} onMouseLeave={onLeave} onFocus={onFocus("about")} onBlur={onBlur}>About</a></li>
                        <li><a href="#lab" onClick={onLink("lab")} onKeyDown={onLinkKey("lab")} onMouseEnter={onEnter("lab")} onMouseLeave={onLeave} onFocus={onFocus("lab")} onBlur={onBlur}>Lab</a></li>
                        <li><a href="#work" onClick={onLink("work")} onKeyDown={onLinkKey("work")} onMouseEnter={onEnter("work")} onMouseLeave={onLeave} onFocus={onFocus("work")} onBlur={onBlur}>Work</a></li>
                        <li><a href="#join" onClick={onLink("join")} onKeyDown={onLinkKey("join")} onMouseEnter={onEnter("join")} onMouseLeave={onLeave} onFocus={onFocus("join")} onBlur={onBlur}>Join</a></li>
                        <li><a href="#contact" onClick={onLink("contact")} onKeyDown={onLinkKey("contact")} onMouseEnter={onEnter("contact")} onMouseLeave={onLeave} onFocus={onFocus("contact")} onBlur={onBlur}>Contact</a></li>
                    </ul>
                </div>

                {/* 하단 배경: 백드롭 + 2중 레이어 크로스페이드 */}
                <div className="menuBottom" aria-hidden="true">
                    {/* 백드롭: 항상 깔림 (css에서 불투명 배경색 지정) */}
                    <span className="mb-backdrop" />
                    {/* 더블 버퍼 레이어 */}
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
