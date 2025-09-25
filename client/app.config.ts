import { type ConfigContext, type ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: "review",
    slug: "review",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "review",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
        supportsTablet: true,
        bundleIdentifier: "com.review.app",
        googleServicesFile: "GoogleService-Info.plist",
    },
    android: {
        adaptiveIcon: {
            foregroundImage: "./assets/images/adaptive-icon.png",
            backgroundColor: "#ffffff",
        },
        edgeToEdgeEnabled: true,
        package: "com.review.app",
        googleServicesFile: "google-services.json",
    },
    web: {
        bundler: "metro",
        output: "static",
        favicon: "./assets/images/favicon.png",
    },
    plugins: [
        "expo-router",
        [
            "expo-splash-screen",
            {
                image: "./assets/images/splash-icon.png",
                imageWidth: 200,
                resizeMode: "contain",
                backgroundColor: "#ffffff",
            },
        ],
        [
            "expo-image-picker",
            {
                photosPermission:
                    "The app accesses your photos to let you share them with your friends.",
            },
        ],
        [
            "expo-audio",
            {
                microphonePermission: "Allow $(PRODUCT_NAME) to access your microphone.",
            },
        ],
        "@react-native-google-signin/google-signin",
        "@react-native-firebase/app",
        "@react-native-firebase/auth",
        "expo-font",
        "expo-web-browser",
    ],
    experiments: {
        typedRoutes: true,
        reactCompiler: true,
    },
});
