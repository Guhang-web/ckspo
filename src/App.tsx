// App.tsx
import React, { useState } from "react";
import Loding from "./loding";
import Header from "./header";
import Nav from "./nav";
import Section1 from "./section1";
import EggSVG from "./CssAni/Egg.SVG";
import Section2 from "./section2";
import "./App.css";

export default function App() {
  const [ready, setReady] = useState(false);

  return (
    <>
      {!ready && (
        <Loding
          assets={[
            "/logo/lego-logo 1.png",
            "/section1Img/hero.jpg",
            "/section3Img/marvelImg.png",
            // ...초기 뷰에 필요한 핵심 리소스들
          ]}
          minDuration={900}
          onComplete={() => setReady(true)}
        />
      )}
      <Header/>
      <Nav/>
      <Section1/>
     <Section2/>
    </>
  );
}