import React, { useState } from 'react';
import './Options.scss';
import Wheel from '../Wheel/Wheel';

export default function SpinnerWheel() {
  const [options, setOptions] = useState([
    'Timonun','Çarkona','Hoş','Geldiniz','Oyun','Başlasın','Şansınızı','Deneyin',
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const colors = [
      '#FF1744',  '#D500F9', '#651FFF',
    '#2979F3', '#00B0FF', '#00E5FF', '#00E676',
    '#76FF03', '#FFEA00', '#FFC400', '#FF9100',
    '#FF3D00', '#FF6E40', '#FF5252', '#FF4081'
  ];

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

  const handleSpinStart = () => {
    setIsSpinning(true);
    setSelectedOption(null);
  };

  const handleSpinEnd = (selected) => {
    setSelectedOption(selected);
    setIsSpinning(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addOption();
    }
  };

  return (
    <div className="container">
      <Wheel 
        options={options}
        colors={colors}
        isSpinning={isSpinning}
        onSpinStart={handleSpinStart}
        onSpinEnd={handleSpinEnd}
        selectedOption={selectedOption}
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