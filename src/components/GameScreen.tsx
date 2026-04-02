// Updated GameScreenProps interface to include pauseTimer and resumeTimer props.
interface GameScreenProps {
    // ... other props
    pauseTimer: () => void;
    resumeTimer: () => void;
}

// Assuming HelpButtons component is receiving these props
<HelpButtons pauseTimer={props.pauseTimer} resumeTimer={props.resumeTimer} />