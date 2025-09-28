import Container from "@/components/Container";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { AppTheme, useAppTheme } from "@/providers/ThemeProvider";
import { anonSignin } from "@/store/user/actions/anonSignin";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";

export default function SignInScreen() {
    const theme = useAppTheme();
    const styles = makeStyles(theme);
    const [rememberMe, setRememberMe] = useState(false);

    const [signInAsGuest, { isLoading }] = useAsyncAction(anonSignin, {
        onComplete: () => {
            // Navigation will be handled by AuthProvider automatically
        },
        onError: (error) => {
            Alert.alert("Sign In Failed", "We couldn't sign you in. Please try again.", [
                { text: "OK" },
            ]);
        },
    });

    const handleSignInAsGuest = () => {
        signInAsGuest();
    };

    return (
        <Container style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header Section */}
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Ionicons name="library" size={64} color={theme.colors.primary} />
                    </View>
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Sign in to continue your QuizCraft journey</Text>
                </View>

                {/* Sign In Section */}
                <View style={styles.signInSection}>
                    <Link asChild href={"/signin-email"}>
                        <Button
                            mode="contained"
                            style={styles.signInButton}
                            contentStyle={styles.signInButtonContent}
                            labelStyle={styles.signInButtonLabel}
                            disabled={isLoading}
                            buttonColor={theme.colors.primary}
                            textColor={theme.colors.onPrimary}
                        >
                            {"Sign In with Email"}
                        </Button>
                    </Link>
                    <Button
                        mode="contained"
                        onPress={handleSignInAsGuest}
                        style={styles.signInButton}
                        contentStyle={styles.signInButtonContent}
                        labelStyle={styles.signInButtonLabel}
                        loading={isLoading}
                        disabled={isLoading}
                        buttonColor={theme.colors.primary}
                        textColor={theme.colors.onPrimary}
                    >
                        {isLoading ? "Signing In..." : "Continue as Guest"}
                    </Button>

                    <Text style={styles.guestDescription}>
                        Access QuizCraft immediately without creating an account.
                    </Text>

                    <Text style={styles.guestDescription}>
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" style={styles.link}>
                            <Text style={styles.linkText}>Sign up here</Text>
                        </Link>
                    </Text>
                </View>
            </ScrollView>
        </Container>
    );
}

const makeStyles = (theme: AppTheme) => {
    return StyleSheet.create({
        container: {
            flex: 1,
        },
        scrollContent: {
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingVertical: 32,
        },
        header: {
            alignItems: "center",
            paddingBottom: 48,
        },
        logoContainer: {
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: theme.colors.primaryContainer,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 24,
            shadowColor: theme.colors.onSurface,
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 6,
        },
        title: {
            fontSize: 32,
            fontWeight: "bold",
            color: theme.colors.onSurface,
            marginBottom: 12,
            textAlign: "center",
        },
        subtitle: {
            fontSize: 16,
            color: theme.colors.onSurfaceVariant,
            textAlign: "center",
            lineHeight: 24,
            paddingHorizontal: 16,
        },
        signInSection: {
            marginBottom: 48,
        },
        sectionTitle: {
            fontSize: 24,
            fontWeight: "bold",
            color: theme.colors.onSurface,
            marginBottom: 24,
            textAlign: "center",
        },
        signInButton: {
            borderRadius: 16,
            marginBottom: 16,
            shadowColor: theme.colors.onSurface,
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 6,
        },
        signInButtonContent: {
            paddingVertical: 12,
            paddingHorizontal: 24,
        },
        signInButtonLabel: {
            fontSize: 18,
            fontWeight: "600",
        },
        guestDescription: {
            fontSize: 14,
            color: theme.colors.onSurfaceVariant,
            textAlign: "center",
            lineHeight: 20,
            paddingHorizontal: 16,
        },
        rememberSection: {
            backgroundColor: theme.colors.surfaceVariant,
            borderRadius: 16,
            padding: 20,
        },
        checkboxContainer: {
            flexDirection: "row",
            alignItems: "flex-start",
        },
        rememberTextContainer: {
            flex: 1,
            marginLeft: 8,
        },
        rememberText: {
            fontSize: 14,
            color: theme.colors.onSurface,
            lineHeight: 20,
        },
        link: {
            textDecorationLine: "none",
        },
        linkText: {
            color: theme.colors.primary,
            fontWeight: "600",
        },
    });
};
