import { ReactNode } from "react";
import { StyleSheet } from "react-native";
import { MD3LightTheme, PaperProvider, useTheme } from "react-native-paper";

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
};

export type AppTheme = typeof theme;

export type MakeStyles = (theme: AppTheme) => ReturnType<typeof StyleSheet.create>;

export const useAppTheme = () => useTheme<AppTheme>();

function ThemeProvider({ children }: { children: ReactNode }) {
    return <PaperProvider theme={theme}>{children}</PaperProvider>;
}

export default ThemeProvider;
