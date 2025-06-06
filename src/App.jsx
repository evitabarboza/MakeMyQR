import React from 'react';
import QRGenerator from './components/QRGenerator';

function App() {
  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Custom QR Code Generator</h1>
      <QRGenerator />
    </div>
  );
}

export default App;
