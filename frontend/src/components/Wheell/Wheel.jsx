import React, { useState, useRef, useEffect } from 'react';
import './Wheel.scss';


export default function WheelSpinner() {
  const [options, setOptions] = useState(['Timonun', 'Çarkına', 'Hoşgeldiniz']);
  const [input, setInput] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [selected, setSelected] = useState(null);
  const wheelRef = useRef(null);
  const pointerRef = useRef(null);

  const sliceAngle = options.length ? 360 / options.length : 360;

  const gradient = () => {
    if (!options.length) return '#ff0000ff';
    const colors = generateColors(options.length);
    let pos = 0;
    const parts = options.map((opt, i) => {
      const start = pos;
      const end = pos + sliceAngle;
      pos = end;
      return `${colors[i]} ${start}deg ${end}deg`;
    });
    return `conic-gradient(${parts.join(',')})`;
  };

  const generateColors = (n) => {
    const out = [];
    for (let i = 0; i < n; i++) {
      const hue = Math.round((i * 360) / n);
      out.push(`hsl(${hue} 75% 55%)`);
    }
    return out;
  };

  const handleSpin = () => {
    if (!options.length || isSpinning) return;
    setIsSpinning(true);
    setSelected(null);

    const targetIndex = Math.floor(Math.random() * options.length);

    const fullRotations = 6 + Math.floor(Math.random() * 4); 
    const targetAngle = (targetIndex * sliceAngle) + (sliceAngle / 2);
    const finalRotation = fullRotations * 360 + targetAngle;

    const duration = 5 + Math.random() * 2; 

    const wheel = wheelRef.current;
    if (wheel) {
      wheel.style.transition = `transform ${duration}s cubic-bezier(.1,.9,.2,1)`;
      wheel.style.transform = `rotate(-${finalRotation}deg)`;
    }

    setTimeout(() => {
      setIsSpinning(false);
      setSelected(options[targetIndex]);
      if (wheel) {
        wheel.style.transition = 'none';
        const remainder = finalRotation % 360;
        wheel.style.transform = `rotate(-${remainder}deg)`;
      }
    }, duration * 1000 + 100);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const val = input.trim();
    if (!val) return;
    setOptions(prev => [...prev, val]);
    setInput('');
  };

  const handleRemove = (i) => {
    setOptions(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleClear = () => {
    setOptions([]);
    setSelected(null);
  };

  useEffect(() => {
    const wheel = wheelRef.current;
    if (wheel) {
      wheel.style.transition = 'none';
      wheel.style.transform = 'rotate(0deg)';
    }
  }, [options.length]);

  return (
    <div className="ws-container">
      <div className="ws-left">
        <form onSubmit={handleAdd} className="ws-form">
          <input
            className="ws-input"
            placeholder="Seçenek ekle (Enter veya +)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isSpinning}
          />
          <div className="ws-buttons">
            <button className="ws-btn" onClick={handleAdd} disabled={isSpinning}>+</button>
            <button type="button" className="ws-btn danger" onClick={handleClear} disabled={isSpinning}>Temizle</button>
          </div>
        </form>

        <div className="ws-list">
          {options.length === 0 && <div className="ws-empty">Henüz seçenek yok — ekleyin!</div>}
          {options.map((opt, i) => (
            <div key={i} className="ws-item">
              <span className="ws-item-text">{opt}</span>
              <button className="ws-remove" onClick={() => handleRemove(i)} disabled={isSpinning}>✕</button>
            </div>
          ))}
        </div>

        <div className="ws-controls">
          <button className="ws-spin" onClick={handleSpin} disabled={isSpinning || options.length === 0}>Döndür</button>
          {selected && <div className="ws-selected">Seçilen: <strong>{selected}</strong></div>}
        </div>
      </div>

      <div className="ws-right">
        <div className="ws-wheel-wrap">
          <div className="ws-pointer" ref={pointerRef}>▼</div>
          <div
            className="ws-wheel"
            ref={wheelRef}
            style={{ background: gradient() }}
            aria-hidden={false}
          >
            {options.map((opt, i) => {
              const rotate = i * sliceAngle + (sliceAngle / 2);
              return (
                <div
                  key={i}
                  className="ws-label"
                  style={{ 
                    transform: `rotate(${rotate}deg) translate(-50%, -50%)`,
                  }}
                >
                  <span style={{ transform: `rotate(-${rotate}deg)` }}>{opt}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}


