import gsap from "gsap";
import React, { useRef, useState } from "react";
import "./Welcome.scss";
import MusicPlayer from "../MusicPlayer/MusicPlayer";
import Wheel from "../Wheel/Wheel";

export default function Welcome({ isVisible, setIsVisible }) {
  const contentRef = useRef();
  const containerRef = useRef();

  const [options, setOptions] = useState([
    'Timonun', 'Çarkona', 'Hoş', 'Geldiniz', 'Oyun', 'Başlasın', 'Şansınızı', 'Deneyin',
  ]);

  const colors = [
    '#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#6C5CE7',
    '#00B894', '#A29BFE', '#FD79A8', '#FDCB6E', '#FF7675',
  ];

  const [inputValue, setInputValue] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleClick = () => {
    gsap.to(contentRef.current, {
      scale: 0,
      rotation: 2880,
      duration: 0.8,
      ease: "power4.in",
      opacity: 0,
      onComplete: () => {
        contentRef.current.style.display = "none";
      },
    });

    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 1,
      ease: "power2.out",
      onComplete: () => {
        containerRef.current.style.display = "none";
        setIsVisible(false);
      },
    });
  };

  const handleSpinStart = () => {
    setIsSpinning(true);
    setSelectedOption(null);
  };

  const handleSpinEnd = (selected) => {
    setSelectedOption(selected);
    setIsSpinning(false);
  };

  return (
    <>
      <div ref={containerRef} className="welcome-background"></div>
      {
        isVisible && (
          <div className="welcome-player-container">
            {/* <div className={"welcome-container"}>
              <div ref={contentRef} className="welcome-content-container">
                <h1 className="welcome-title">Timonun Çarkına Hoş Geldiniz!</h1>
                <button className="welcome-button" onClick={handleClick}>
                  Başlayın
                </button>
              </div>
            </div> */}
            <div onClick={handleClick} ref={contentRef} className="wheel-container">
              <Wheel
                options={options}
                colors={colors}
                isSpinning={isSpinning}
                onSpinStart={handleSpinStart}
                onSpinEnd={handleSpinEnd}
                selectedOption={selectedOption}
                handleClick={handleClick}
              />
            </div>

            <MusicPlayer />
          </div>
        )
      }
    </>
  );
}
