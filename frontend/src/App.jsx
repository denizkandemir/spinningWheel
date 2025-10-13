import React from 'react'
import { useState } from 'react'
import './App.css'
import Welcome from './components/Welcome/Welcome'
import MusicPlayer from './components/MusicPlayer/MusicPlayer'

function App() {

  return (
    <>
      <div className="app-container">
        <Welcome />
        <MusicPlayer />
      </div>
    </>
  )
}

export default App
