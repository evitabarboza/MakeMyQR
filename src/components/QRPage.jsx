import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import QRGenerator from './QRGenerator'; // Assuming your component is saved as QRGenerator.js in the same folder

const App = () => {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">MakeMyQR</a>
        </div>
      </nav>

      <header className="bg-light py-5 text-center">
        <div className="container">
          <h1 className="display-5 fw-bold">Create Stylish QR Codes</h1>
          <p className="lead">Customize your QR with colors, logos, and shapes — then download it!</p>
        </div>
      </header>

      <main className="container py-4">
        <QRGenerator />
      </main>

      <footer className="bg-dark text-white text-center py-3 mt-4">
        <div className="container">
          <small>&copy; 2025 MakeMyQR. All rights reserved.</small>
        </div>
      </footer>
    </div>
  );
};

export default App;
