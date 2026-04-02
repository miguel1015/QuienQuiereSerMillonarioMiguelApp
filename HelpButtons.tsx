import React from 'react';

interface HelpButtonsProps {
  onPauseTimer: () => void;
  onResumeTimer: () => void;
  // other props...
}

const HelpButtons: React.FC<HelpButtonsProps> = ({ onPauseTimer, onResumeTimer }) => {
  const handleCallFriend = () => {
    onPauseTimer();
    console.log('Llamando a un amigo...'); // This is where you'll show the loading message.
    // Simulate loading...
    setTimeout(() => {
      // Handle the friend call response...
      onResumeTimer();
    }, 2000);
  };

  const handleAskAudience = () => {
    onPauseTimer();
    console.log('Consultando el público...'); // This is where you'll show the loading message.
    // Simulate loading...
    setTimeout(() => {
      // Handle the audience response...
      onResumeTimer();
    }, 2000);
  };

  return (
    <div>
      <button onClick={handleCallFriend}>Llamar a un amigo</button>
      <button onClick={handleAskAudience}>Preguntar al público</button>
    </div>
  );
};

export default HelpButtons;