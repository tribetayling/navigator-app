# Project Update & Documentation

This document details the changes made to the `navigator-app` repository to replicate the setup, upgrade dependencies, and ensure successful execution on Android.

## 1. Changes & Rationale

### Configuration & Environment
*   **Created `.env`**: Added environment variables for API keys (`FLEETBASE_KEY`, `GOOGLE_MAPS_API_KEY`, etc.) to secure sensitive data and allow easy configuration.
*   **Created `android/local.properties`**: Explicitly defined `sdk.dir` to point to the Android SDK, resolving build environment issues.
*   **Updated `.gitignore`**: Added `.env` and `google-services.json` to prevent committing sensitive credentials.
*   **Updated `config/default.js`**: Added `fleetbaseKey` to the default configuration to ensure the app can authenticate with the Fleetbase backend.

### Android Native Configuration
*   **Upgraded `build.gradle`**:
    *   Updated `namespace` and `applicationId` to `com.navigator.app` to match the desired package identity.
    *   Added `com.google.gms.google-services` plugin for Firebase integration.
    *   Added `androidx.core:core-splashscreen` for modern Android splash screen support.
    *   Fixed a build error by removing an explicit `Project` type declaration.
*   **Updated `AndroidManifest.xml`**:
    *   Set `package="com.navigator.app"`.
    *   Added essential permissions: `ACCESS_FINE_LOCATION`, `CAMERA`, `POST_NOTIFICATIONS`, etc.
    *   Added `<queries>` block to allow the app to open external map applications (Google Maps, Waze, etc.).
    *   Added `meta-data` for API keys (Google Maps, Facebook, TransistorSoft).
*   **Refactored `MainActivity` & `MainApplication`**:
    *   Moved Kotlin files from `io/fleetbase/navigator` to `com/navigator/app` to match the new package structure.
    *   Updated package declarations to `com.navigator.app`.
*   **Updated `settings.gradle`**:
    *   Removed legacy autolinking scripts incompatible with React Native 0.77.
    *   Manually linked `react-native-background-geolocation` to resolve a missing project error.
*   **Fixed `strings.xml`**: Added missing API key string resources and resolved duplicate resource errors.

### React Native & Dependencies
*   **Upgraded to React Native 0.77.0**: Updated `package.json` to use the latest stable version for better performance and features.
*   **Updated Dependencies**: Upgraded various libraries (e.g., `react-native-maps`, `react-native-reanimated`) to versions compatible with RN 0.77.
*   **Patched `react-native-i18n`**: Applied a patch to change `compile` to `implementation` in `build.gradle`, fixing a build failure due to obsolete Gradle configurations.
*   **Fixed `tsconfig.json`**: Updated to extend `@react-native/typescript-config` to resolve TypeScript errors.
*   **Created `react-native.config.js`**: Added to ensure the CLI correctly detects the Android project.

### Codebase Improvements
*   **Refactored `AuthContext.tsx`**:
    *   Updated to use `@fleetbase/sdk` directly for robust authentication.
    *   Fixed TypeScript errors and improved state management for driver sessions.
    *   Implemented organization switching logic.
*   **Updated `src/utils/index.js`**:
    *   Added utility functions (`resizePhoto`, `navigatorConfig`) required by the app.
    *   Fixed syntax errors (removed TypeScript type annotations from a JavaScript file).

---

## 2. App Flow & Architecture

### Authentication Flow
1.  **Initialization**: On app launch, `AuthContext` checks `AsyncStorage` for an existing driver session (`_driver_token`).
2.  **Login Screen**: If no session exists, the user is presented with the Login screen.
3.  **Phone Verification**:
    *   User enters their phone number.
    *   App requests a verification code via `fleetbase.drivers.login(phone)`.
    *   User enters the SMS code.
4.  **Session Creation**:
    *   Upon verification, a `Driver` instance is created and stored.
    *   The app retrieves the driver's organizations.
    *   If the driver belongs to multiple organizations, they may be prompted to switch/select.

### Main Navigation
Once authenticated, the app loads the `DriverNavigator`. The specific tabs are configurable via `config/default.js` but typically include:
*   **Dashboard**: Overview of current status and active orders.
*   **Tasks**: List of assigned orders/tasks.
*   **Reports**: Driver performance or earning reports.
*   **Chat**: Communication channel with dispatch/customers.
*   **Account**: Profile settings and vehicle information.

### Background Services
*   **Geolocation**: The app uses `react-native-background-geolocation` to track the driver's location even when the app is in the background. This is critical for dispatching and tracking.
*   **Notifications**: `react-native-notifications` handles incoming push notifications for new orders or updates.

---

## 3. Setup & Running

### Prerequisites
*   Node.js (v18+)
*   Yarn
*   Android Studio & SDK
*   Java JDK 17+

### Installation
1.  **Install Dependencies**:
    ```bash
    yarn install
    ```

2.  **Configure Environment**:
    *   Ensure `.env` is populated with your API keys.
    *   Ensure `android/app/google-services.json` is present.

3.  **Run on Android**:
    ```bash
    # Start Metro Bundler (reset cache recommended)
    yarn start --reset-cache

    # Build and Launch App
    yarn android
    ```

### Troubleshooting
*   **Build Failures**: Run `cd android && ./gradlew clean` to clear stale build artifacts.
*   **Metro Issues**: Stop all Metro processes and run `yarn start --reset-cache`.
