import React from "react";
import "./voltorb.css"; 
import BoltSmall from "./BoltSmall";

export default function VoltorbBounce() {
    return (
        <div className="voltorb-wrap" aria-label="찌리리공 bouncing">
            <div className="bolt-pos1">
                <BoltSmall size={20} className="zap zap-anim" />
            </div>
            <div className="bolt-pos2">
                <BoltSmall size={20} className="zap zap-anim" />
            </div>
            <div className="bolt-pos3">
                <BoltSmall size={20} className="zap zap-anim" />
            </div>
            <div className="voltorb">
                <i className="pupil pupil--l" />
                <i className="pupil pupil--r" />
            </div>
            <div className="voltorb-shadow" aria-hidden />
        </div>
    );
}
