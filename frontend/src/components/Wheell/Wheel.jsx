import React, { useState, useEffect, useRef } from 'react';
import './Wheel.scss';

export default function SpinnerWheel() {
  const canvasRef = useRef(null);
  const [options, setOptions] = useState([
    'Timonun','Çarkona','Hoş','Geldiniz','Oyun','Başlasın','Şansınızı','Deneyin',
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const spinSpeedRef = useRef(0);

  const colors = [
    '#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#6C5CE7', 
    '#00B894', '#A29BFE', '#FD79A8', '#FDCB6E', '#FF7675',
  ];

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
      // Draw segment
      ctx.beginPath();
      ctx.arc(0, 0, radius, index * sliceAngle, (index + 1) * sliceAngle);
      ctx.lineTo(0, 0);
      ctx.fillStyle = colors[index % colors.length];
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.rotate(index * sliceAngle + sliceAngle / 2);
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
    const ctx = canvas.getContext('2d');
    drawWheel(ctx, rotation);
  }, [rotation, options]);

  useEffect(() => {
    if (!isSpinning) return;

    const interval = setInterval(() => {
      setRotation((prev) => (prev + spinSpeedRef.current) % 360);
      spinSpeedRef.current *= 0.98;

      if (spinSpeedRef.current < 0.5) {
        setIsSpinning(false);
        // Pointer yukarıda (12 saat pozisyonu) olduğu için doğru hesaplama
        const normalizedRotation = (360 - (rotation % 360)) % 360;
        const sliceAngle = 360 / options.length;
        const selectedIndex = Math.floor(normalizedRotation / sliceAngle) % options.length;
        setSelectedOption(options[selectedIndex]);
        spinSpeedRef.current = 0;
      }
    }, 30);

    return () => clearInterval(interval);
  }, [isSpinning, rotation, options]);

  const addOption = () => {
    if (inputValue.trim() && options.length < 20) {
      setOptions([...options, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    spinSpeedRef.current = 30 + Math.random() * 20;
    setSelectedOption(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addOption();
    }
  };

  return (
    <div className="container">
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
            onClick={spin}
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

      <div className="control-section">
        <h3 className="heading">Seçenek Ekle/Sil</h3>
        <div className="input-group">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Yeni seçenek yazın..."
            maxLength="20"
            className="input"
          />
          <button
            onClick={addOption}
            disabled={options.length >= 20}
            className={`add-btn ${options.length >= 20 ? 'disabled' : ''}`}
          >
            Ekle
          </button>
        </div>

        <div className="options-list">
          <h4 style={{ marginBottom: '10px', color: '#2c3e50' }}>
            Seçenekler ({options.length})
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {options.map((option, index) => (
              <li key={index} className="option-item">
                <span
                  className="color-dot"
                  style={{
                    backgroundColor: colors[index % colors.length],
                  }}
                />
                <span style={{ flex: 1 }}>{option}</span>
                <button
                  onClick={() => removeOption(index)}
                  disabled={options.length <= 2}
                  className={`remove-btn ${options.length <= 2 ? 'disabled' : ''}`}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>

        <p className="note">
          {options.length >= 20
            ? '⚠️ Maksimum seçenek sayısına ulaştınız'
            : `${20 - options.length} seçenek daha ekleyebilirsiniz`}
        </p>
      </div>
    </div>
  );
}
