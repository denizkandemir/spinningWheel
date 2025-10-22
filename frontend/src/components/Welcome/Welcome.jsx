import gsap from "gsap";
import React, { useRef, useState } from "react";
import "./Welcome.scss";
import MusicPlayer from "../MusicPlayer/MusicPlayer";
import Wheel from "../Wheel/Wheel";

export default function Welcome({ isVisible, setIsVisible }) {
  const contentRef = useRef();
  const containerRef = useRef();

  const [options, setOptions] = useState([
    'Timonun', 'Çarkına', 'Hoş', 'Geldiniz', 'Oyun', 'Başlasın', 'Şansınızı', 'Deneyin',
  ]);

  const colors = [
    '#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#6C5CE7',
    '#00B894', '#A29BFE', '#FD79A8', '#FDCB6E', '#FF7675',
  ];

  const [inputValue, setInputValue] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showGuitarRain, setShowGuitarRain] = useState(true);

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

  const createGuitarEmojis = () => {
    const guitars = [];
    for (let i = 0; i < 15; i++) {
      guitars.push(
        <div 
          key={i} 
          className="guitar-emoji" 
          style={{
            left: Math.random() * 100 + '%',
            animationDelay: Math.random() * 2 + 's',
            animationDuration: (2 + Math.random() * 2) + 's'
          }}
        >
          🎸
        </div>
      );
    }
    return guitars;
  };

  return (
    <>
      <div ref={containerRef} className="welcome-background"></div>
      {showGuitarRain && isVisible && (
        <div className="welcome-guitar-rain-container">
          {createGuitarEmojis()}
        </div>
      )}
      {
        isVisible && (
          <div className="welcome-player-container">
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

            <MusicPlayer containerClass="music-player-welcome"  />
          </div>
        )
      }
    </>
  );
}
