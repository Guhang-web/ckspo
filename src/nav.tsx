// Nav.tsx
import React, { useMemo, useRef, useState, useEffect } from "react";
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
    const [selected, setSelected] = useState<BgKey>("thought");
    const [hovered, setHovered] = useState<BgKey | null>(null);
    const [open, setOpen] = useState(false);

    const effectiveKey = hovered ?? selected;
    const bgStyle = useMemo(
        () => ({ ["--menu-bg" as any]: `url("${BG_MAP[effectiveKey]}")` }) as React.CSSProperties,
        [effectiveKey]
    );

    const menuRef = useRef<HTMLDivElement>(null);
    const btnRef = useRef<HTMLButtonElement>(null);

    const toggleMenu = () => setOpen(v => !v);
    const closeMenu = () => setOpen(false);

    // ESC/바깥클릭으로 닫기
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

    // 링크 핸들러들
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
        <nav id="nav" aria-label="주요">
            {/* ▼ 하단 바: 메뉴 닫힘/열림에 따라 내용만 바꿔 렌더 */}
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

            {/* ▼ 메뉴 오버레이 */}
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

                <div className="menuBottom" style={bgStyle} aria-hidden="true" />
            </div>
        </nav>
    );
}