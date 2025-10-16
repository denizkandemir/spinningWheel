import React from 'react'
import { useState } from 'react'
import './App.css'
import Welcome from './components/Welcome/Welcome'
import MusicPlayer from './components/MusicPlayer/MusicPlayer'
import WheelSpinner from './components/Wheell/Wheel'

function App() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <>
      <div className="app-container">
        {isVisible && <Welcome isVisible={isVisible} setIsVisible={setIsVisible} />}
        {!isVisible && 
        <>
          <WheelSpinner />
          <MusicPlayer />
        </> 
        }

      </div>
    </>
  )
}

export default App
