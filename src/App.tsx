import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Canvas } from 'konva/lib/Canvas';
import CanvasComponent from './Pages/Canvas';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="App">
      <CanvasComponent></CanvasComponent>
      <Toaster />
    </div>
  );
}

export default App;
