import React, { useState, useEffect, useRef } from 'react';
import './Wheel.scss';

export default function Wheel({ options, colors, isSpinning, onSpinStart, onSpinEnd, selectedOption }) {
  const canvasRef = useRef(null);
  const spinSpeedRef = useRef(0);
  const [rotation, setRotation] = useState(0);

  const drawWheel = (ctx, currentRotation) => {
    const canvas = canvasRef.current;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 200;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((currentRotation * Math.PI) / 180);

    const sliceAngle = (2 * Math.PI) / options.length;

    options.forEach((option, index) => {
      // -90 derece ile başlat ki pointer top'ta olsun (0°)
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
          // Tepedeki pointer (yukarı) 0° da, çark dönerken hangi segment top'a geliyor
          const sliceAngle = 360 / options.length;
          // Pointer top'ta olduğu için negatif rotation'u tersine çevir
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
    if (isSpinning) return;
    spinSpeedRef.current = 30 + Math.random() * 20;
    onSpinStart();
  };

  return (
    <div className="wheel-section">
      <div className="wheel-wrapper">
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="canvas"
        />
        <div className="pointer" />
        <button
          onClick={handleSpin}
          disabled={isSpinning}
          className={`spin-button ${isSpinning ? 'disabled' : ''}`}
        >
          ▶
        </button>
      </div>

      {selectedOption && (
        <div className="result">
          <h3>🎉 Kazanan:</h3>
          <p><strong>{selectedOption}</strong></p>
        </div>
      )}
    </div>
  );
}