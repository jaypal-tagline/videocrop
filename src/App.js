import React from 'react'
import './App.css'
import SingleTrimVideo from './SingleTrimVideo'
import VideoCropper from './VideoComponent'
import SingleTrim30SecondVideo from './30SecondTrimVideo'
import OneMinuteTrim from './OneMinuteTrimVideo'

function App() {
  return (
    <>
      <h2>30 Second Trim</h2>
      <SingleTrim30SecondVideo />

      <h2>1 Minute Trim</h2>
      <OneMinuteTrim />
      
      <h2>Custom Trim</h2>
      <SingleTrimVideo />

      <h2>Multiple crop from starting to ending by given time frame</h2>  
      <VideoCropper />
    </>
  )
}

export default App
