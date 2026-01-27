import React, { createContext, useContext, useEffect, useRef } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { Notifications } from 'react-native-notifications';
import useStorage from '../hooks/use-storage';

const LOG_PREFIX = '[NotificationContext]';

const requestAndroidNotificationPermission = async () => {
    console.log(`${LOG_PREFIX} Requesting Android notification permission...`);
    console.log(`${LOG_PREFIX} Platform: ${Platform.OS}, Version: ${Platform.Version}`);
    
    if (Platform.OS === 'android' && Platform.Version >= 33) {
        const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
        console.log(`${LOG_PREFIX} Permission request result: ${result}`);
        console.log(`${LOG_PREFIX} Permission granted: ${result === PermissionsAndroid.RESULTS.GRANTED}`);
        return result === PermissionsAndroid.RESULTS.GRANTED;
    }

    console.log(`${LOG_PREFIX} No permission request needed (Android < 33 or iOS)`);
    return true;
};

const setupNotificationChannel = () => {
    if (Platform.OS === 'android') {
        console.log(`${LOG_PREFIX} Setting up Android notification channel...`);
        const channelConfig = {
            channelId: 'default-channel-id',
            name: 'Default Channel',
            importance: 5,
            description: 'Default notification channel',
            enableLights: true,
            enableVibration: true,
            showBadge: true,
            vibrationPattern: [200, 1000, 500, 1000, 500],
        };
        console.log(`${LOG_PREFIX} Channel config:`, JSON.stringify(channelConfig, null, 2));
        Notifications.setNotificationChannel(channelConfig);
        console.log(`${LOG_PREFIX} Notification channel setup complete`);
    } else {
        console.log(`${LOG_PREFIX} Skipping notification channel setup (not Android)`);
    }
};

const extractNotificationContent = (notification) => {
    const payload = notification?.payload || {};
    
    const title = notification?.title || payload['gcm.notification.title'] || payload.title || 'Notification';
    const body = notification?.body || payload['gcm.notification.body'] || payload.body || '';
    
    return { title, body };
};

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useStorage('_push_notifications', []);
    const [lastNotification, setLastNotification] = useStorage('_last_push_notification');
    const [deviceToken, setDeviceToken] = useStorage('_device_token');
    const notificationListeners = useRef([]);

    const addNotificationListener = (callback) => {
        notificationListeners.current.push(callback);
    };

    const removeNotificationListener = (callback) => {
        notificationListeners.current = notificationListeners.current.filter((listener) => listener !== callback);
    };

    useEffect(() => {
        console.log(`${LOG_PREFIX} Initializing notification system...`);
        
        const registerRemoteNotifications = async () => {
            const permissionGranted = await requestAndroidNotificationPermission();
            console.log(`${LOG_PREFIX} Permission granted: ${permissionGranted}`);
            
            setupNotificationChannel();
            
            console.log(`${LOG_PREFIX} Calling Notifications.registerRemoteNotifications()...`);
            Notifications.registerRemoteNotifications();
        };

        registerRemoteNotifications();

        const notificationDisplayedListener = Notifications.events().registerNotificationReceivedForeground((notification, completion) => {
            console.log(`${LOG_PREFIX} ========== FOREGROUND NOTIFICATION RECEIVED ==========`);
            console.log(`${LOG_PREFIX} Full notification object:`, JSON.stringify(notification, null, 2));
            console.log(`${LOG_PREFIX} Notification payload:`, JSON.stringify(notification?.payload, null, 2));
            
            const { title, body } = extractNotificationContent(notification);
            console.log(`${LOG_PREFIX} Extracted title:`, title);
            console.log(`${LOG_PREFIX} Extracted body:`, body);
            
            setLastNotification(notification);
            setNotifications((prev) => [...prev, notification]);

            notificationListeners.current.forEach((listener) => listener(notification, 'received'));

            if (Platform.OS === 'android' && title) {
                console.log(`${LOG_PREFIX} Posting local notification for foreground display...`);
                const localNotification = {
                    title: title,
                    body: body,
                    sound: 'default',
                    android_channel_id: 'default-channel-id',
                    id: notification?.payload?.id,
                    type: notification?.payload?.type,
                };
                console.log(`${LOG_PREFIX} Local notification:`, JSON.stringify(localNotification, null, 2));
                Notifications.postLocalNotification(localNotification);
                console.log(`${LOG_PREFIX} Local notification posted`);
            }

            const completionConfig = { alert: true, sound: true, badge: false };
            console.log(`${LOG_PREFIX} Calling completion with:`, JSON.stringify(completionConfig));
            completion(completionConfig);
            console.log(`${LOG_PREFIX} ========== END FOREGROUND NOTIFICATION ==========`);
        });

        const notificationOpenedListener = Notifications.events().registerNotificationOpened((notification, completion, action) => {
            console.log(`${LOG_PREFIX} ========== NOTIFICATION OPENED ==========`);
            console.log(`${LOG_PREFIX} Notification:`, JSON.stringify(notification, null, 2));
            console.log(`${LOG_PREFIX} Action:`, action);
            setLastNotification(notification);

            notificationListeners.current.forEach((listener) => listener(notification, 'opened'));

            completion();
            console.log(`${LOG_PREFIX} ========== END NOTIFICATION OPENED ==========`);
        });

        const registeredListener = Notifications.events().registerRemoteNotificationsRegistered((event) => {
            console.log(`${LOG_PREFIX} ========== REMOTE NOTIFICATIONS REGISTERED ==========`);
            console.log(`${LOG_PREFIX} Device Token: ${event.deviceToken}`);
            setDeviceToken(event.deviceToken);
        });

        const registrationFailedListener = Notifications.events().registerRemoteNotificationsRegistrationFailed((error) => {
            console.error(`${LOG_PREFIX} ========== REGISTRATION FAILED ==========`);
            console.error(`${LOG_PREFIX} Error:`, error);
        });

        return () => {
            console.log(`${LOG_PREFIX} Cleaning up notification listeners...`);
            notificationDisplayedListener.remove();
            notificationOpenedListener.remove();
            registeredListener.remove();
            registrationFailedListener.remove();
        };
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, lastNotification, deviceToken, addNotificationListener, removeNotificationListener }}>{children}</NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
