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

function Section1() {
    return (
        <>
            <section id='section1'>
                <div className='section1Top'>
                    <div className='section1Css1'>
                        <div className="bolt-pos">
                            <VoltorbBounce/>
                        </div>
                    </div>
                    <div className='section1Css2'>

                    </div>
                </div>
                <div className='section1Middle'>
                    <div className='section1Layout'>
                        <img className='mungLayout'
                            src="./section/mungYa.png" alt="뭉 웃는모습" />
                    </div>
                    <div className='introduce'>
                        <p className="introText">
                            지난 <span className="accent">7년 4개월</span> 동안 카페 점장으로<br />운영과 고객 경험을 쌓았고,<br />
                            퇴사 후 <span className="accent">1년</span> Frontend를 집중 학습했습니다.<br />
                            <span className="accent">2025.04~</span> 현재는 회사 운영팀에서<br /> 사무보조로 일하며 실행력을 더하고 있습니다.<br />
                            현장 감각과 사용자 관점으로 결과를 만드는<br /><strong>Junior Frontend Developer</strong> <strong>최광서</strong>입니다.
                        </p>
                    </div>
                </div>
                <div className='section1Bottom'>
                    <div className='listItem'>
                        <div className='s1List egg1'>EGG</div>
                        {/* <EggSVG /> */}
                        <div className='explanation'>The egg character gently bobs.</div>
                    </div>
                    <div className='listItem'>
                        <div className='s1List robot1'>ROBOT</div>
                        {/* <RobotSVG /> */}
                        <div className='explanation'>The boxy robot gently bobs.</div>
                    </div>
                    <div className='listItem'>
                        <div className='s1List milk1'>MILK</div>
                        {/* <MilkSVG/> */}
                        <div className='explanation'>The milk carton gently bobs.</div>
                    </div>
                    <div className='listItem'>
                        <div className='s1List turtle1'>TURTLE</div>
                        {/* <Turtle/> */}
                        <div className='explanation'>The shy turtle gently bobs.</div>
                    </div>
                    <div className='listItem'>
                        <div className='s1List kirby1'>KIRBY</div>
                        {/* <KirbySVG/> */}
                        <div className='explanation'>Kirby Flying Through the Sky</div>
                    </div>
                    <div className='listItem'>
                        <div className='s1List bird1'>BIRD</div>
                        {/* <FlyingBirds/> */}
                        <div className='explanation'>A bird flying freely in the open sky</div>
                    </div>
                    <div className='listItem'>
                        <div className='s1List airpods1'>AIRPODS</div>
                        <AirpodsSVG/>
                        <div className='explanation'>AirPods delivering rich, high-quality sound</div>
                    </div>
                    <div className='listItem'>
                        <div className='s1List egg'>EGG</div>
                        <div className='eggCss'></div>
                        <div className='explanation'></div>
                    </div>

                </div>

            </section>
        </>
    )
}

export default Section1