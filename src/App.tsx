import React from 'react';
import './App.css';
import Card from './Card/Card';

function App() {
  return (
    <div className="App">
            <div className="Side-panel">
                <div className="User"></div>
                <Card className="User-card"></Card>
                <Card className="User-card"></Card>
                <Card className="User-card"></Card>
            </div>

            <header className="Chart-list">
                <Card className="Chart-card"></Card>
                <Card className="Chart-card"></Card>
                <Card className="Chart-card"></Card>
                <Card className="Chart-card"></Card>
      </header>
    </div>
  );
}

export default App;
