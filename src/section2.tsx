import React from 'react'
import "./section2.css"
function Section2() {
    return (
        <>
            <section id='section2'>
                <div className='section2Layout'>
                    <img className='mungMoon' src="./section/mung_with_moon.png" alt="뭉이 달에 앉은 모습" />
                </div>
                <div className='section2Middle'>
                    <p className='section2Middle_p'>사용되는 흐름을 기준으로 화면을 설계하고,<br />
                        AI를 활용해 방향을 탐색하되 최종 구조는 직접 결정합니다.</p>
                    <ul className='listTool'>
                        <li className='toolLogo'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="bi bi-filetype-html" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zm-9.736 7.35v3.999h-.791v-1.714H1.79v1.714H1V11.85h.791v1.626h1.682V11.85h.79Zm2.251.662v3.337h-.794v-3.337H4.588v-.662h3.064v.662zm2.176 3.337v-2.66h.038l.952 2.159h.516l.946-2.16h.038v2.661h.715V11.85h-.8l-1.14 2.596H9.93L8.79 11.85h-.805v3.999zm4.71-.674h1.696v.674H12.61V11.85h.79v3.325Z" />
                            </svg>
                        </li>
                        <li className='tool'>HTML / CSS</li>
                        <li className='toolCompetency'>레이아웃 구성과 반응형 화면 구현</li>
                    </ul>
                    <ul className='listTool'>
                        <li className='toolLogo'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="bi bi-javascript" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M14 0a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zM9.053 7.596v3.127l-.007 1.752q0 .498-.186.752t-.556.263q-.342 0-.528-.234-.185-.234-.185-.684v-.175H6.37v.185q0 .665.253 1.113.255.45.703.674.44.225 1.016.225.88 0 1.406-.498.527-.498.527-1.485l.007-1.752V7.596zm3.808-.108q-.585 0-1.006.244a1.67 1.67 0 0 0-.634.674 2.1 2.1 0 0 0-.225.996q0 .753.293 1.182.303.42.967.732l.469.215q.438.186.625.43.185.244.185.635 0 .478-.166.703-.156.224-.527.224-.361.001-.547-.244-.186-.243-.205-.752h-1.162q.02.996.498 1.524.479.527 1.386.527.909 0 1.417-.518.507-.517.507-1.484 0-.81-.332-1.289t-1.045-.79l-.449-.196q-.39-.166-.556-.381-.166-.214-.166-.576 0-.4.165-.596.177-.195.508-.195.361 0 .508.234.156.234.176.703h1.123q-.03-.976-.498-1.484-.47-.518-1.309-.518" />
                            </svg></li>
                        <li className='tool'>JavaScript</li>
                        <li className='toolCompetency'>DOM 제어, 이벤트 처리, 데이터 요청</li>
                    </ul>
                    <ul className='listTool'>
                        <li className='toolLogo'>
                            <img className='jQueryLogo' src="./section/jQuery.png" alt="jQuery 로고" />
                        </li>
                        <li className='tool'>jQuery (basic)</li>
                        <li className='toolCompetency'>기존 코드 이해 및 간단한 수정</li>
                    </ul>
                    <ul className='listTool'>
                        <li className='toolLogo'>
                            <svg width="80" height="80" viewBox="0 0 700 700" fill="none" xmlns="http://www.w3.org/2000/svg" className="bi bi-react">
                                <g stroke="currentColor" strokeWidth="25">
                                    <ellipse cx="420.9" cy="296.5" rx="20" ry="20" fill="currentColor" />
                                    <ellipse rx="211" ry="91" cx="420.9" cy="296.5" />
                                    <ellipse rx="211" ry="91" cx="420.9" cy="296.5" transform="rotate(60 420.9 296.5)" />
                                    <ellipse rx="211" ry="91" cx="420.9" cy="296.5" transform="rotate(120 420.9 296.5)" />
                                </g>
                            </svg>
                        </li>
                        <li className='tool'>React</li>
                        <li className='toolCompetency'>컴포넌트 분리와 상태 기반 UI 구성</li>
                    </ul>
                    <ul className='listTool'>
                        <li className='toolLogo'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="bi bi-github" viewBox="0 0 16 16">
                                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
                            </svg>
                        </li>
                        <li className='tool'>Git / GitHub</li>
                        <li className='toolCompetency'>기본적인 협업 흐름과 버전 관리</li>
                    </ul>
                    <ul className='listTool'>
                        <li className='toolLogo'> <svg width="50" height="50" viewBox="0 0 200 350" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 150a0 50 0 1 0 0-100H50a50 50 0 0 0 0 100h50z" fill="#F24E1E" />
                            <path d="M100 150a0 50 0 1 0 0-100h50a50 50 0 0 1 0 100h-50z" fill="#FF7262" />
                            <path d="M100 150a0 50 0 1 1 0 100H50a50 50 0 0 1 0-100h50z" fill="#A259FF" />
                            <circle cx="150" cy="200" r="50" fill="#1ABCFE" />
                            <circle cx="50" cy="300" r="50" fill="#0ACF83" />
                        </svg></li>
                        <li className='tool'>Figma</li>
                        <li className='toolCompetency'>디자인 시안에서 이미지 및 리소스 추출</li>
                    </ul>

                </div>


            </section>
        </>
    )
}

export default Section2