// Footer.tsx
import React, { useEffect, useRef, useState } from "react";
import "./footer.css";

type HoverSwapTextProps =
  | {
    as: "a";
    className?: string;
    href: string;
    target?: string;
    rel?: string;
    children: string;
  }
  | {
    as?: "p";
    className?: string;
    children: string;
  };

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

function vscrollToId(id: string) {
  const targetEl = document.getElementById(id) as HTMLElement | null;
  const contentEl = document.querySelector(".vs__content") as HTMLElement | null;
  if (!targetEl || !contentEl) return;

  // contentEl 기준으로 layout top 계산 (offsetParent 체인 합산)
  let y = 0;
  let node: HTMLElement | null = targetEl;
  while (node && node !== contentEl) {
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }

  // max는 App이 가지고 있으니 여기서는 음수 방지만
  y = clamp(y, 0, Number.MAX_SAFE_INTEGER);

  window.dispatchEvent(new CustomEvent("vscroll:to", { detail: { y } }));
  history.replaceState(null, "", `#${id}`);
}

function HoverSwapText(props: HoverSwapTextProps) {
  const { children, className } = props;

  const inner = (
    <span className="hs__inner" aria-hidden="true">
      <span className="hs__text">{children}</span>
      <span className="hs__text hs__text--clone">{children}</span>
    </span>
  );

  const sr = <span className="sr-only">{children}</span>;

  if (props.as === "a") {
    const { href, target, rel } = props;

    const isHash = href.startsWith("#") && href.length > 1;
    const hashId = isHash ? href.slice(1) : "";

    const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!isHash) return; // 외부 링크는 기본 동작 유지
      e.preventDefault();
      vscrollToId(hashId);
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
      if (!isHash) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        vscrollToId(hashId);
      }
    };

    return (
      <a
        className={`hs ${className ?? ""}`}
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        onKeyDown={onKeyDown}
      >
        {sr}
        {inner}
      </a>
    );
  }

  return (
    <p className={`hs ${className ?? ""}`}>
      {sr}
      {inner}
    </p>
  );
}

function Footer() {
  const footerRef = useRef<HTMLElement | null>(null);

  // footer 아래 박스 애니메이션 트리거(한 번만)
  const [inView, setInView] = useState(false);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isActive = entry.isIntersecting;

        // ✅ footer 컨텐츠 inView 애니메이션은 한 번만
        if (isActive && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          setInView(true);
        }
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -5% 0px",
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <footer id="footer" ref={footerRef}>
      <div className="footer_box">
        <div className="footer_boxUp">
          <h4>최광서</h4>
          <p>
            인터랙션과 스토리텔링으로,
            <br />
            기억에 남는 화면 경험을 만듭니다.
          </p>

          {/* ✅ 외부 링크(PDF)는 그대로 동작 */}
          <a
            className="resume download_resume"
            href="/resume/최광서_이력서.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="resume__inner" aria-hidden="true">
              <span className="resume__text">Download Resume</span>
              <span className="resume__text resume__text--clone">Download Resume</span>
            </span>
            <span className="sr-only">Download Resume</span>
          </a>
        </div>

        <div className={`footer_boxDown ${inView ? "is-inview" : ""}`}>
          <div className="footer_nav downLeft">
            <h6>Phone</h6>
            <ul>
              <li>
                <HoverSwapText as="p">010-4763-0262</HoverSwapText>
              </li>
            </ul>
          </div>

          <div className="footer_nav downCenter">
            <h6>Email</h6>
            <ul>
              <li>
                <HoverSwapText as="p">dacjj123@naver.com</HoverSwapText>
              </li>
            </ul>
          </div>

          <div className="footer_nav downRight">
            <h6>GitHub</h6>
            <ul>
              <li>
                <HoverSwapText as="p" className="github_url">https://github.com/Guhang-web</HoverSwapText>
                <HoverSwapText as="a" className="github_link"
                  href="https://github.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >Link</HoverSwapText>

              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
