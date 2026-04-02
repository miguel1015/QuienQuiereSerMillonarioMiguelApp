import React from 'react';

interface GameScreenProps {
    pauseTimer: () => void;
    resumeTimer: () => void;
    // ... other props
}

const GameScreen: React.FC<GameScreenProps> = ({ pauseTimer, resumeTimer }) => {
    // Your component logic

    return (
        <HelpButtons pauseTimer={pauseTimer} resumeTimer={resumeTimer} />
    );
};

export default GameScreen;