import {
    initialize,
    setCustomSessionId,
    setCustomTag,
    setCustomUserId,
    setOnSessionStartedCallback,
} from 'react-native-clarity';

// Clarity Project ID - Replace with your actual project ID
const CLARITY_PROJECT_ID = 'v80zmv3wvr';

/**
 * Initialize Microsoft Clarity
 * Call this on app startup
 */
export const initializeClarity = () => {
    try {
        initialize(CLARITY_PROJECT_ID);
        
        // Set callback to confirm session started
        setOnSessionStartedCallback((sessionId) => {
            console.log('Clarity session started with ID:', sessionId);
        });
        
        console.log('Clarity initialized successfully');
    } catch (error) {
        console.warn('Failed to initialize Clarity:', error);
    }
};

/**
 * Set custom user ID for Clarity session
 * @param {string} userId - The user identifier
 */
export const setClarityUserId = (userId) => {
    try {
        if (userId) {
            setCustomUserId(userId);
        }
    } catch (error) {
        console.warn('Clarity setCustomUserId failed:', error);
    }
};

/**
 * Set custom session ID for Clarity
 * @param {string} sessionId - The session identifier
 */
export const setClaritySessionId = (sessionId) => {
    try {
        if (sessionId) {
            setCustomSessionId(sessionId);
        }
    } catch (error) {
        console.warn('Clarity setCustomSessionId failed:', error);
    }
};

/**
 * Set custom tag for the Clarity session
 * @param {string} key - The tag key
 * @param {string} value - The tag value
 */
export const setClarityTag = (key, value) => {
    try {
        if (key && value) {
            setCustomTag(key, value);
        }
    } catch (error) {
        console.warn('Clarity setCustomTag failed:', error);
    }
};

export default {
    initializeClarity,
    setClarityUserId,
    setClaritySessionId,
    setClarityTag,
};
