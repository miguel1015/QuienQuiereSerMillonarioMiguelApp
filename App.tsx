// Import necessary modules
import React from 'react';
import GameScreen from './GameScreen';
import { useGameState } from './gameContext';

const App = () => {
    // Destructure pauseTimer and resumeTimer from useGameState
    const { pauseTimer, resumeTimer } = useGameState();

    return (
        <GameScreen pauseTimer={pauseTimer} resumeTimer={resumeTimer} />
    );
};

export default App;