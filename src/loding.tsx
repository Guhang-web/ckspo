// loding.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import "./loding.css";

type Props = {
  assets?: string[];
  minDuration?: number;
  onComplete?: () => void;
  className?: string;
};

export default function Loding({
  assets = [],
  minDuration = 900,
  onComplete,
  className = "",
}: Props) {
  const [displayPct, setDisplayPct] = useState(0);
  const actualPctRef = useRef(0);

  // ✅ 타입 오류 해결: 초기값 null로 명시
  const rafRef = useRef<number | null>(null);
  const doneCheckRafRef = useRef<number | null>(null);

  const doneRef = useRef(false);
  const [isHiding, setIsHiding] = useState(false);

  const totalTasks = useMemo(() => {
    const fontTask = 1;
    return Math.max(1, fontTask + assets.length);
  }, [assets.length]);

  useEffect(() => {
    let finished = 0;
    const startedAt = performance.now();
    const controllers: AbortController[] = [];

    const tick = () => {
      const target = actualPctRef.current;
      setDisplayPct((prev) => {
        const next = prev + (target - prev) * 0.12;
        return next > 99.5 && target === 100 ? 100 : next;
      });
      if (displayPct < 100 || !isHiding) {
        rafRef.current = window.requestAnimationFrame(tick);
      }
    };
    rafRef.current = window.requestAnimationFrame(tick);

    const bump = () => {
      finished += 1;
      actualPctRef.current = Math.min(100, Math.round((finished / totalTasks) * 100));
    };

    // 1) 폰트 준비
    if ((document as any).fonts?.ready instanceof Promise) {
      (document as any).fonts.ready.finally(bump).catch(() => {});
    } else {
      bump();
    }

    // 2) 에셋 프리로드
    assets.forEach((url) => {
      const ctrl = new AbortController();
      controllers.push(ctrl);
      fetch(url, { method: "GET", cache: "force-cache", signal: ctrl.signal })
        .catch(() => null)
        .finally(() => {
          if (/\.(png|jpe?g|webp|gif|svg|avif)$/i.test(url)) {
            const img = new Image();
            img.onload = img.onerror = () => bump();
            img.src = url;
          } else {
            bump();
          }
        });
    });

    const checkDone = () => {
      const elapsed = performance.now() - startedAt;
      const ready = actualPctRef.current >= 100 && elapsed >= minDuration;
      if (ready && !doneRef.current) {
        doneRef.current = true;
        setIsHiding(true);
        // CSS 트랜지션 후 콜백
        window.setTimeout(() => onComplete?.(), 420);
      } else {
        doneCheckRafRef.current = window.requestAnimationFrame(checkDone);
      }
    };
    doneCheckRafRef.current = window.requestAnimationFrame(checkDone);

    return () => {
      controllers.forEach((c) => c.abort());
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      if (doneCheckRafRef.current != null) cancelAnimationFrame(doneCheckRafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assets, minDuration, totalTasks]);

  return (
    <div
      aria-busy={!isHiding}
      className={`loding-root ${isHiding ? "is-hiding" : ""} ${className}`}
      role="status"
    >
      <div className="loding-inner">
        <span className="loding-percent" aria-live="polite" aria-atomic="true">
          {Math.floor(displayPct)}%
        </span>
      </div>
    </div>
  );
}
