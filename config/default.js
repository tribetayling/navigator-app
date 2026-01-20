import { toArray } from '../src/utils';
import { config, mergeConfigs } from '../src/utils/config';

// Use a function to create config lazily, avoiding calls during module load
export const getDefaultConfig = () => ({
    theme: config('APP_THEME', 'blue'),
    driverNavigator: {
        tabs: toArray(config('DRIVER_NAVIGATOR_TABS', 'DriverDashboardTab,DriverTaskTab,DriverReportTab,DriverChatTab,DriverAccountTab')),
        defaultTab: toArray(config('DRIVER_NAVIGATOR_DEFAULT_TAB', 'DriverDashboardTab')),
    },
    defaultLocale: config('DEFAULT_LOCALE', 'en'),
    availableLocales: toArray(config('AVAILABLE_LOCALES', 'en,ar')),
    colors: {
        loginBackground: config('LOGIN_BG_COLOR', '#111827'),
    },
});

export function createNavigatorConfig(userConfig = {}) {
    return mergeConfigs(getDefaultConfig(), userConfig);
}
