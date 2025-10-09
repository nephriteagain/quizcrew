import { ReactNode } from "react";
import { Platform, StyleSheet } from "react-native";
import { configureFonts, MD3LightTheme, PaperProvider, useTheme } from "react-native-paper";

const fontConfig = {
    displayLarge: {
        fontFamily: Platform.select({
            web: "Sansation-Regular",
            ios: "Sansation-Regular",
            android: "Sansation-Regular",
            default: "Sansation-Regular",
        }),
        fontWeight: "400",
        letterSpacing: 0,
        lineHeight: 64,
        fontSize: 57,
    },
    displayMedium: {
        fontFamily: Platform.select({
            web: "Sansation-Regular",
            ios: "Sansation-Regular",
            android: "Sansation-Regular",
            default: "Sansation-Regular",
        }),
        fontWeight: "400",
        letterSpacing: 0,
        lineHeight: 52,
        fontSize: 45,
    },
    displaySmall: {
        fontFamily: Platform.select({
            web: "Sansation-Regular",
            ios: "Sansation-Regular",
            android: "Sansation-Regular",
            default: "Sansation-Regular",
        }),
        fontWeight: "400",
        letterSpacing: 0,
        lineHeight: 44,
        fontSize: 36,
    },
    headlineLarge: {
        fontFamily: Platform.select({
            web: "Sansation-Bold",
            ios: "Sansation-Bold",
            android: "Sansation-Bold",
            default: "Sansation-Bold",
        }),
        fontWeight: "700",
        letterSpacing: 0,
        lineHeight: 40,
        fontSize: 32,
    },
    headlineMedium: {
        fontFamily: Platform.select({
            web: "Sansation-Bold",
            ios: "Sansation-Bold",
            android: "Sansation-Bold",
            default: "Sansation-Bold",
        }),
        fontWeight: "700",
        letterSpacing: 0,
        lineHeight: 36,
        fontSize: 28,
    },
    headlineSmall: {
        fontFamily: Platform.select({
            web: "Sansation-Bold",
            ios: "Sansation-Bold",
            android: "Sansation-Bold",
            default: "Sansation-Bold",
        }),
        fontWeight: "700",
        letterSpacing: 0,
        lineHeight: 32,
        fontSize: 24,
    },
    titleLarge: {
        fontFamily: Platform.select({
            web: "Sansation-Bold",
            ios: "Sansation-Bold",
            android: "Sansation-Bold",
            default: "Sansation-Bold",
        }),
        fontWeight: "700",
        letterSpacing: 0,
        lineHeight: 28,
        fontSize: 22,
    },
    titleMedium: {
        fontFamily: Platform.select({
            web: "Sansation-Regular",
            ios: "Sansation-Regular",
            android: "Sansation-Regular",
            default: "Sansation-Regular",
        }),
        fontWeight: "500",
        letterSpacing: 0.15,
        lineHeight: 24,
        fontSize: 16,
    },
    titleSmall: {
        fontFamily: Platform.select({
            web: "Sansation-Regular",
            ios: "Sansation-Regular",
            android: "Sansation-Regular",
            default: "Sansation-Regular",
        }),
        fontWeight: "500",
        letterSpacing: 0.1,
        lineHeight: 20,
        fontSize: 14,
    },
    bodyLarge: {
        fontFamily: Platform.select({
            web: "Sansation-Regular",
            ios: "Sansation-Regular",
            android: "Sansation-Regular",
            default: "Sansation-Regular",
        }),
        fontWeight: "400",
        letterSpacing: 0.5,
        lineHeight: 24,
        fontSize: 16,
    },
    bodyMedium: {
        fontFamily: Platform.select({
            web: "Sansation-Regular",
            ios: "Sansation-Regular",
            android: "Sansation-Regular",
            default: "Sansation-Regular",
        }),
        fontWeight: "400",
        letterSpacing: 0.25,
        lineHeight: 20,
        fontSize: 14,
    },
    bodySmall: {
        fontFamily: Platform.select({
            web: "Sansation-Regular",
            ios: "Sansation-Regular",
            android: "Sansation-Regular",
            default: "Sansation-Regular",
        }),
        fontWeight: "400",
        letterSpacing: 0.4,
        lineHeight: 16,
        fontSize: 12,
    },
    labelLarge: {
        fontFamily: Platform.select({
            web: "Sansation-Regular",
            ios: "Sansation-Regular",
            android: "Sansation-Regular",
            default: "Sansation-Regular",
        }),
        fontWeight: "500",
        letterSpacing: 0.1,
        lineHeight: 20,
        fontSize: 14,
    },
    labelMedium: {
        fontFamily: Platform.select({
            web: "Sansation-Regular",
            ios: "Sansation-Regular",
            android: "Sansation-Regular",
            default: "Sansation-Regular",
        }),
        fontWeight: "500",
        letterSpacing: 0.5,
        lineHeight: 16,
        fontSize: 12,
    },
    labelSmall: {
        fontFamily: Platform.select({
            web: "Sansation-Regular",
            ios: "Sansation-Regular",
            android: "Sansation-Regular",
            default: "Sansation-Regular",
        }),
        fontWeight: "500",
        letterSpacing: 0.5,
        lineHeight: 16,
        fontSize: 11,
    },
    default: {
        fontFamily: Platform.select({
            web: "Sansation-Regular",
            ios: "Sansation-Regular",
            android: "Sansation-Regular",
            default: "Sansation-Regular",
        }),
        fontWeight: "400",
        letterSpacing: 0.25,
        lineHeight: 20,
        fontSize: 14,
    },
} as const;

const theme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        // Primary gradient colors (from Create New Quiz button)
        primary: "#667eea",
        onPrimary: "#ffffff",
        primaryContainer: "#e8ebff", // Lighter, more muted version of primary
        onPrimaryContainer: "#1a237e", // Dark text for contrast on light container

        // Secondary colors using quiz type colors (MCQ green)
        secondary: "#2E7D32",
        onSecondary: "#ffffff",
        secondaryContainer: "#E8F5E9",
        onSecondaryContainer: "#1B5E20",

        // Tertiary colors (TOFQ blue)
        tertiary: "#1565C0",
        onTertiary: "#ffffff",
        tertiaryContainer: "#E3F2FD",
        onTertiaryContainer: "#0D47A1",

        // Error colors (DNDQ orange)
        error: "#E65100",
        onError: "#ffffff",
        errorContainer: "#FFF3E0",
        onErrorContainer: "#BF360C",

        // Surface colors (QuizCard gradient) - closer to MD3 standards
        surface: "#fefbff", // MD3 standard surface
        onSurface: "#1c1b1f", // MD3 standard onSurface
        surfaceVariant: "#e7e0ec", // MD3 standard surfaceVariant
        onSurfaceVariant: "#49454f", // MD3 standard onSurfaceVariant

        // Outline colors - MD3 standards
        outline: "#79747e", // MD3 standard outline
        outlineVariant: "#cac4d0", // MD3 standard outlineVariant

        // Custom elevation colors using your gradient palette
        elevation: {
            level0: "transparent",
            level1: "#f8fafc",
            level2: "#f1f5f9",
            level3: "#e2e8f0",
            level4: "#cbd5e1",
            level5: "#94a3b8",
        },
    },
    fonts: configureFonts({ config: fontConfig, isV3: true }),
};

export type AppTheme = typeof theme;

export type MakeStyles = (theme: AppTheme) => ReturnType<typeof StyleSheet.create>;

export const useAppTheme = () => useTheme<AppTheme>();

function ThemeProvider({ children }: { children: ReactNode }) {
    return <PaperProvider theme={theme}>{children}</PaperProvider>;
}

export default ThemeProvider;
