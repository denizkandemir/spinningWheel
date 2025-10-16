import gsap from "gsap";
import React, { useRef, useState } from "react";
import "./Welcome.scss";
import MusicPlayer from "../MusicPlayer/MusicPlayer";

export default function Welcome({ isVisible, setIsVisible }) {
  const contentRef = useRef();
  const containerRef = useRef();

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

  return (
    <>
      <div ref={containerRef} className="welcome-background"></div>
      {
        isVisible && (
          <div className="welcome-player-container">
            <div className={"welcome-container"}>
              <div ref={contentRef} className="welcome-content-container">
                <h1 className="welcome-title">Timonun Çarkına Hoş Geldiniz!</h1>
                <button className="welcome-button" onClick={handleClick}>
                  Başlayın
                </button>
              </div>
            </div>
            <MusicPlayer />
          </div>
        )
      }
    </>
  );
}
