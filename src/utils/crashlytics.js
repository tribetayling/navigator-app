import crashlytics from '@react-native-firebase/crashlytics';

export const initializeCrashlytics = async () => {
    try {
        await crashlytics().setCrashlyticsCollectionEnabled(true);
        log('Crashlytics initialized');
    } catch (error) {
        console.warn('Failed to initialize Crashlytics:', error);
    }
};

export const log = (message) => {
    try {
        crashlytics().log(message);
    } catch (error) {
        console.warn('Crashlytics log failed:', error);
    }
};

export const recordError = (error, context) => {
    try {
        if (context) {
            crashlytics().log(context);
        }
        crashlytics().recordError(error);
    } catch (err) {
        console.warn('Crashlytics recordError failed:', err);
    }
};

export const setUserId = async (userId) => {
    try {
        await crashlytics().setUserId(userId);
    } catch (error) {
        console.warn('Crashlytics setUserId failed:', error);
    }
};

export const setAttribute = async (key, value) => {
    try {
        await crashlytics().setAttribute(key, String(value));
    } catch (error) {
        console.warn('Crashlytics setAttribute failed:', error);
    }
};

export const setAttributes = async (attributes) => {
    try {
        await crashlytics().setAttributes(attributes);
    } catch (error) {
        console.warn('Crashlytics setAttributes failed:', error);
    }
};

export const crash = () => {
    if (__DEV__) {
        crashlytics().crash();
    } else {
        console.warn('Crash test is only available in development mode');
    }
};

export default {
    initializeCrashlytics,
    log,
    recordError,
    setUserId,
    setAttribute,
    setAttributes,
    crash,
};
