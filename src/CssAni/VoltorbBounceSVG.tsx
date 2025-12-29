import React from "react";
import "./voltorb.css"; // 아래 CSS 추가한 파일(또는 같은 파일)에 포함
import BoltSmall from "./BoltSmall";

export default function VoltorbBounce() {
    return (
        <div className="voltorb-wrap" aria-label="찌리리공 bouncing">
            <div className="bolt-pos1">
                <BoltSmall size={40} className="zap zap-anim" />
            </div>
            <div className="bolt-pos2">
                <BoltSmall size={40} className="zap zap-anim" />
            </div>
            <div className="bolt-pos3">
                <BoltSmall size={40} className="zap zap-anim" />
            </div>
            <div className="voltorb">
                <i className="pupil pupil--l" />
                <i className="pupil pupil--r" />
            </div>
            <div className="voltorb-shadow" aria-hidden />
        </div>
    );
}
