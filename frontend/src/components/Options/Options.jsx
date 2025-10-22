import React, { useState, useEffect } from 'react';
import './Options.scss';
import Wheel from '../Wheel/Wheel';

export default function SpinnerWheel() {
  const [options, setOptions] = useState([
    'Timonun','Çarkına','Hoş','Geldiniz','Oyun','Başlasın','Şansınızı','Deneyin',
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showGuitarRain, setShowGuitarRain] = useState(false);

  const colors = [
    '#FF1744', '#D500F9', '#651FFF',
    '#2979F3', '#00B0FF', '#00E5FF', '#00E676',
    '#76FF03', '#FFEA00', '#FFC400', '#FF9100',
    '#FF3D00', '#FF6E40', '#FF5252', '#FF4081'
  ];

  const addOption = () => {
    if (inputValue.trim()) {
      setOptions([...options, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const clearAllOptions = () => {
    setOptions([]);
    setSelectedOption(null);
  };

  const handleSpinStart = () => {
    setIsSpinning(true);
    setSelectedOption(null);
  };

  const handleSpinEnd = (selected) => {
    setSelectedOption(selected);
    setIsSpinning(false);
    if (selected) {
      setShowGuitarRain(true);
    }
  };

  const handleModalClose = () => {
    setSelectedOption(null);
    setShowGuitarRain(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addOption();
    }
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
      {showGuitarRain && (
        <div className="guitar-rain-container">
          {createGuitarEmojis()}
        </div>
      )}
      
      <div className="wheel-title-container">
        <h2 className="wheel-title"> TİMONUN KUTSAL KARAR MERKEZİ 🎸🎸🎸🎸🎸</h2>
      </div>
      <div className="container">
        <Wheel
          options={options}
          colors={colors}
          isSpinning={isSpinning}
          onSpinStart={handleSpinStart}
          onSpinEnd={handleSpinEnd}
          selectedOption={selectedOption}
          onModalClose={handleModalClose}
        />

        <div className="control-section">
          <h3 className="heading">Seçenek Ekle/Sil</h3>
          <div className="input-group">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Yeni seçenek yazın..."
              className="input"
            />
            <button
              onClick={addOption}
              className={`add-btn`}
            >
              Ekle
            </button>
          </div>

          <div className="options-list">
            <div className="options-header">
              <h4 style={{ margin: 0, color: '#2c3e50' }}>
                Seçenekler ({options.length})
              </h4>
              {options.length > 0 && (
                <button
                  onClick={clearAllOptions}
                  className="clear-all-btn"
                  disabled={isSpinning}
                >
                  🗑️ Tümünü Sil
                </button>
              )}
            </div>
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
        </div>
      </div>
    </>
  );
}