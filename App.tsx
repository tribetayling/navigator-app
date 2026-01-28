import { Toasts } from '@backpackapp-io/react-native-toast';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { PortalHost, PortalProvider } from '@gorhom/portal';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TamaguiProvider, Theme } from 'tamagui';
import { AuthProvider } from './src/contexts/AuthContext';
import { ChatProvider } from './src/contexts/ChatContext';
import { ConfigProvider } from './src/contexts/ConfigContext';
import { LanguageProvider } from './src/contexts/LanguageContext';
import { LocationProvider } from './src/contexts/LocationContext';
import { NotificationProvider } from './src/contexts/NotificationContext';
import { OrderManagerProvider } from './src/contexts/OrderManagerContext';
import { SocketClusterProvider } from './src/contexts/SocketClusterContext';
import { TempStoreProvider } from './src/contexts/TempStoreContext';
import { ThemeProvider, useThemeContext } from './src/contexts/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';
import { initializeClarity } from './src/utils/clarity';
import { initializeCrashlytics } from './src/utils/crashlytics';
import config from './tamagui.config';

function AppContent(): React.JSX.Element {
    const { appTheme } = useThemeContext();

    useEffect(() => {
        initializeCrashlytics();
        initializeClarity();
    }, []);

    return (
        <TamaguiProvider config={config} theme={appTheme}>
            <Theme name={appTheme}>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <SafeAreaProvider>
                        <BottomSheetModalProvider>
                            <ConfigProvider>
                                <NotificationProvider>
                                    <LanguageProvider>
                                        <AuthProvider>
                                            <SocketClusterProvider>
                                                <LocationProvider>
                                                    <TempStoreProvider>
                                                        <ChatProvider>
                                                            <OrderManagerProvider>
                                                                <AppNavigator />
                                                                <Toasts extraInsets={{ bottom: 80 }} />
                                                                <PortalHost name='MainPortal' />
                                                                <PortalHost name='BottomSheetPanelPortal' />
                                                                <PortalHost name='LocationPickerPortal' />
                                                            </OrderManagerProvider>
                                                        </ChatProvider>
                                                    </TempStoreProvider>
                                                </LocationProvider>
                                            </SocketClusterProvider>
                                        </AuthProvider>
                                    </LanguageProvider>
                                </NotificationProvider>
                            </ConfigProvider>
                        </BottomSheetModalProvider>
                    </SafeAreaProvider>
                </GestureHandlerRootView>
            </Theme>
        </TamaguiProvider>
    );
}

function App(): React.JSX.Element {
    return (
        <PortalProvider>
            <ThemeProvider>
                <AppContent />
            </ThemeProvider>
        </PortalProvider>
    );
}

export default App;
