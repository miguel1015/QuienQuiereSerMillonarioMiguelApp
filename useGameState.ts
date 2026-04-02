// In useGameState.ts

// Action Types
const PAUSE_TIMER = 'PAUSE_TIMER';
const RESUME_TIMER = 'RESUME_TIMER';

// Action Creators
export const pauseTimer = () => ({ type: PAUSE_TIMER });
export const resumeTimer = () => ({ type: RESUME_TIMER });

// ... existing code for handling actions

const initialState = {
    // ... other state properties
};

const gameReducer = (state = initialState, action) => {
    switch (action.type) {
        case PAUSE_TIMER:
            // Handle pause timer logic
            return { ...state, isTimerPaused: true };
        case RESUME_TIMER:
            // Handle resume timer logic
            return { ...state, isTimerPaused: false };
        // ... other action cases

        default:
            return state;
    }
};

export default gameReducer;