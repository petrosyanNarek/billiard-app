import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import { OptionMenu } from './components/OptionMenu';
import { GameCanvas } from './components/GameCanvas';

export interface Ball {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    color: string;
}

const ballRadius = 10;

const App: React.FC = () => {
    const [balls, setBalls] = useState<Ball[]>([
        { x: 100, y: 150, vx: 0, vy: 0, radius: ballRadius, color: '#FF0000' },
        { x: 200, y: 150, vx: 0, vy: 0, radius: ballRadius, color: '#0000FF' },
        { x: 300, y: 150, vx: 0, vy: 0, radius: ballRadius, color: '#008000' },
    ]);
    const [showOptionMenu, setShowOptionMenu] = useState<boolean>(false);
    const [ballIndexForChange, setBallIndexForChange] = useState<number | null>(null);



    return (
        <div className="App">
            <GameCanvas
                balls={balls}
                setBalls={setBalls}
                setBallIndexForChange={setBallIndexForChange}
                setShowOptionMenu={setShowOptionMenu}
            />
            {showOptionMenu && (
                <OptionMenu
                    balls={balls}
                    selectedBallIndex={ballIndexForChange}
                    setBalls={setBalls}
                    setSelectedBallIndex={setBallIndexForChange}
                    setShowOptionMenu={setShowOptionMenu}
                />
            )}
        </div>
    );
};

export default App;


