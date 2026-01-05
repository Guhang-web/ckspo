import React from 'react'
import "./section1.css"
import EggSVG from './CssAni/Egg.SVG'
import RobotSVG from './CssAni/RobotSVG'
import MilkSVG from './CssAni/MilkSVG'
import Turtle from './CssAni/TurtleSVG'
import VoltorbBounce from './CssAni/VoltorbBounceSVG'
import BoltSmall from './CssAni/BoltSmall'
import KirbySVG from './CssAni/kirbySVG'
import FlyingBirds from './CssAni/birlSVG'
import AirpodsSVG from './CssAni/AirpodsSVG'
import BlackHoleSVG from './CssAni/BlackHoleSVG'

function Section1() {
    return (
        <>
            <section id='section1'>
                <div className='section1Top'>
                    <div className='section1Css1'>
                        <div className="bolt-pos">
                            <VoltorbBounce />
                        </div>
                    </div>
                    <div className='section1Css2'>
                        <BlackHoleSVG/>
                    </div>
                </div>
                <div className='section1Middle'>
                    <div className='section1Layout'>
                        <img className='mungLayout'
                            src="./section/mungYa.png" alt="뭉 웃는모습" />
                    </div>
                    <div className='introduce'>
                        <p className="introText">
                            지난 <span className="accent">7년 4개월</span> 동안 카페 점장으로 운영과 고객 경험을 쌓았고,<br />
                            퇴사 후 <span className="accent">1년</span> Frontend를 집중 학습했습니다.<br />
                            <span className="accent">2025.04 ~ 12.31</span> 회사 운영팀에서 QA로 일하며 실행력을 더하였습니다.<br />
                            사용자 관점으로 결과를 만드는<strong> Junior Frontend Developer</strong> <strong>최광서</strong>입니다.
                        </p>
                    </div>
                </div>
                <div className='section1Bottom'>
                    <ul className='listItem'>
                        <li className='s1List egg1'>EGG</li>
                        {/* <EggSVG /> */}
                        <li className='explanation'>The egg character gently bobs.</li>
                    </ul>
                    <ul className='listItem'>
                        <li className='s1List robot1'>ROBOT</li>
                        {/* <RobotSVG /> */}
                        <li className='explanation'>The boxy robot gently bobs.</li>
                    </ul>
                    <ul className='listItem'>
                        <li className='s1List milk1'>MILK</li>
                        {/* <MilkSVG/> */}
                        <li className='explanation'>The milk carton gently bobs.</li>
                    </ul>
                    <ul className='listItem'>
                        <li className='s1List turtle1'>TURTLE</li>
                        {/* <Turtle/> */}
                        <li className='explanation'>The shy turtle gently bobs.</li>
                    </ul>
                    <ul className='listItem'>
                        <li className='s1List kirby1'>KIRBY</li>
                        {/* <KirbySVG/> */}
                        <li className='explanation'>Kirby Flying Through the Sky</li>
                    </ul>
                    <ul className='listItem'>
                        <li className='s1List bird1'>BIRD</li>
                        {/* <FlyingBirds/> */}
                        <li className='explanation'>A bird flying freely in the open sky</li>
                    </ul>
                    <ul className='listItem'>
                        <li className='s1List airpods1'>AIRPODS</li>
                        {/* <AirpodsSVG/> */}
                        <li className='explanation'>Hear the richness. AirPods</li>
                    </ul>

                </div>

            </section>
        </>
    )
}

export default Section1