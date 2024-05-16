import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Canvas } from 'konva/lib/Canvas';
import CanvasComponent from './Components/Canvas';

function App() {
  return (
    <div className="App">
      <CanvasComponent></CanvasComponent>
    </div>
  );
}

export default App;
