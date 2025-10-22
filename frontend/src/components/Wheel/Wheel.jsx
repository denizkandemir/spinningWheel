import React, { useState, useEffect, useRef } from 'react';
import './Wheel.scss';

export default function Wheel({ options, colors, isSpinning, onSpinStart, onSpinEnd, selectedOption, onModalClose }) {
  const canvasRef = useRef(null);
  const spinSpeedRef = useRef(0);
  const [rotation, setRotation] = useState(0);

  const drawWheel = (ctx, currentRotation) => {
    const canvas = canvasRef.current;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 220;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((currentRotation * Math.PI) / 180);

    if (options.length === 0) {
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, 2 * Math.PI);
      ctx.fillStyle = '#ff0000ff'; // Açık gri
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      ctx.save();
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffffff';
      ctx.font = 'bold 20px Arial';
      ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
      ctx.shadowBlur = 2;
      ctx.fillText('Seçenek Yok', 0, 0);
      ctx.restore();
    } else {
      const sliceAngle = (2 * Math.PI) / options.length;

      options.forEach((option, index) => {
        const startAngle = -Math.PI / 2 + index * sliceAngle;
        const endAngle = startAngle + sliceAngle;

        // Draw segment
        ctx.beginPath();
        ctx.arc(0, 0, radius, startAngle, endAngle);
        ctx.lineTo(0, 0);
        ctx.fillStyle = colors[index % colors.length];
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw text
        ctx.save();
        ctx.rotate(startAngle + sliceAngle / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px Arial';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 4;
        ctx.fillText(option.substring(0, 15), radius - 30, 8);
        ctx.restore();
      });
    }

    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      drawWheel(ctx, rotation);
    }
  }, [rotation, options, colors]);

  useEffect(() => {
    if (!isSpinning) return;

    const interval = setInterval(() => {
      setRotation((prev) => {
        const newRotation = (prev + spinSpeedRef.current) % 360;
        spinSpeedRef.current *= 0.98;

        if (spinSpeedRef.current < 0.5) {
          const sliceAngle = 360 / options.length;
          const selectedIndex = Math.floor(((360 - newRotation) % 360) / sliceAngle) % options.length;
          onSpinEnd(options[selectedIndex]);
          spinSpeedRef.current = 0;
        }

        return newRotation;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [isSpinning, options, onSpinEnd]);

  const handleSpin = () => {
    if (isSpinning || options.length === 0) return;
    spinSpeedRef.current = 30 + Math.random() * 20;
    onSpinStart();
  };

  return (
    <div className="wheel-section">
      <div className="wheel-wrapper">
        <canvas
          ref={canvasRef}
          width={600}
          height={600}
          className="canvas"
        />
        <div className="pointer" />
        <button
          onClick={handleSpin}
          disabled={isSpinning || options.length === 0}
          className={`spin-button ${isSpinning || options.length === 0 ? 'disabled' : ''}`}
        >
          ▶
        </button>
      </div>

      {selectedOption && (
        <div className="result-overlay">
          <div className="result-modal">
            <button 
              className="result-close-btn"
              onClick={onModalClose}
            >
              ×
            </button>
            <h3>🎉 Kazanan:</h3>
            <p><strong>{selectedOption}</strong></p>
          </div>
        </div>
      )}
    </div>
  );
}