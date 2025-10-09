import Container from "@/components/Container";
import GoogleSignupBtn from "@/components/GoogleSignupBtn";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { AppTheme, useAppTheme } from "@/providers/ThemeProvider";
import { anonSignin } from "@/store/user/actions/anonSignin";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Checkbox, Text } from "react-native-paper";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming,
} from "react-native-reanimated";

export default function SignUpScreen() {
    const theme = useAppTheme();
    const styles = makeStyles(theme);
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const [googleSigninLoading, setGoogleSigninLoading] = useState(false);

    // Shake animation
    const shakeTranslateX = useSharedValue(0);

    const shakeAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: shakeTranslateX.value }],
        };
    });

    const triggerShake = () => {
        shakeTranslateX.value = withSequence(
            withTiming(-10, { duration: 50 }),
            withTiming(10, { duration: 50 }),
            withTiming(-10, { duration: 50 }),
            withTiming(10, { duration: 50 }),
            withTiming(0, { duration: 50 })
        );
    };

    const [signUpAsGuest, { isLoading }] = useAsyncAction(anonSignin, {
        onComplete: () => {
            // Navigation will be handled by AuthProvider automatically
        },
        onError: (error) => {
            Alert.alert(
                "Sign Up Failed",
                "We couldn't create your guest account. Please try again.",
                [{ text: "OK" }]
            );
        },
    });

    const handleSignUpAsGuest = () => {
        if (!isTermsAccepted) {
            triggerShake();
            Alert.alert(
                "Terms Required",
                "You must agree to the Terms of Service and Privacy Policy to continue.",
                [{ text: "OK" }]
            );
            return;
        }

        signUpAsGuest();
    };

    const hasLoading = isLoading || googleSigninLoading;

    return (
        <Container style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header Section */}
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={require("@/assets/images/quiz-crew-icon.png")}
                            style={{ width: 144, height: 144 }}
                        />
                    </View>
                    <Text style={styles.title}>Welcome to QuizCrew</Text>
                    <Text style={styles.subtitle}>
                        Create, share, and take quizzes with friends and colleagues
                    </Text>
                </View>

                {/* Sign Up Section */}
                <View style={styles.signUpSection}>
                    <Text style={styles.sectionTitle}>Get Started</Text>
                    <Link asChild href={"/signup-email"} disabled={hasLoading}>
                        <Button
                            mode="contained"
                            style={styles.signUpButton}
                            contentStyle={styles.signUpButtonContent}
                            labelStyle={styles.signUpButtonLabel}
                            disabled={hasLoading}
                            buttonColor={theme.colors.primary}
                            textColor={theme.colors.onPrimary}
                        >
                            {"Sign Up with Email"}
                        </Button>
                    </Link>
                    <GoogleSignupBtn
                        type="long"
                        isLoading={googleSigninLoading}
                        setIsLoading={setGoogleSigninLoading}
                        disabled={hasLoading}
                        onTermsNotAccepted={
                            !isTermsAccepted
                                ? () => {
                                      triggerShake();
                                      Alert.alert(
                                          "Terms Required",
                                          "You must agree to the Terms of Service and Privacy Policy to continue.",
                                          [{ text: "OK" }]
                                      );
                                  }
                                : undefined
                        }
                    />
                    <Button
                        mode="contained"
                        onPress={handleSignUpAsGuest}
                        style={styles.signUpButton}
                        contentStyle={styles.signUpButtonContent}
                        labelStyle={styles.signUpButtonLabel}
                        loading={isLoading}
                        disabled={hasLoading}
                        buttonColor={theme.colors.primary}
                        textColor={theme.colors.onPrimary}
                    >
                        {isLoading ? "Creating Account..." : "Sign Up as Guest"}
                    </Button>

                    <Text style={styles.guestDescription}>
                        Start using QuizCrew immediately as a guest user. You can upgrade your
                        account later.
                    </Text>

                    <Text style={styles.guestDescription}>
                        Already have an account?{" "}
                        <Link href="/signin" style={styles.link}>
                            <Text style={styles.linkText}>Sign in here</Text>
                        </Link>
                    </Text>
                </View>

                {/* Terms and Privacy Section */}
                <Animated.View style={[styles.termsSection, shakeAnimatedStyle]}>
                    <TouchableOpacity
                        style={styles.checkboxContainer}
                        onPress={() => setIsTermsAccepted(!isTermsAccepted)}
                        activeOpacity={0.7}
                    >
                        <Checkbox
                            status={isTermsAccepted ? "checked" : "unchecked"}
                            onPress={() => setIsTermsAccepted(!isTermsAccepted)}
                            uncheckedColor={theme.colors.onSurfaceVariant}
                            color={theme.colors.primary}
                        />
                        <View style={styles.termsTextContainer}>
                            <Text style={styles.termsText}>
                                I agree to the{" "}
                                <Link href="/terms-of-service" style={styles.link}>
                                    <Text style={styles.linkText}>Terms of Service</Text>
                                </Link>{" "}
                                and{" "}
                                <Link href="/privacy-policy" style={styles.link}>
                                    <Text style={styles.linkText}>Privacy Policy</Text>
                                </Link>
                            </Text>
                        </View>
                    </TouchableOpacity>
                </Animated.View>
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
            overflow: "hidden",
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
        signUpSection: {
            marginBottom: 48,
            rowGap: 12,
        },
        sectionTitle: {
            fontSize: 24,
            fontWeight: "bold",
            color: theme.colors.onSurface,
            marginBottom: 24,
            textAlign: "center",
        },
        signUpButton: {
            borderRadius: 16,
            shadowColor: theme.colors.onSurface,
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 6,
        },
        signUpButtonContent: {
            paddingVertical: 12,
            paddingHorizontal: 24,
        },
        signUpButtonLabel: {
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
        termsSection: {
            backgroundColor: theme.colors.surfaceVariant,
            borderRadius: 16,
            padding: 20,
        },
        checkboxContainer: {
            flexDirection: "row",
            alignItems: "flex-start",
            marginBottom: 24,
        },
        termsTextContainer: {
            flex: 1,
            marginLeft: 8,
        },
        termsText: {
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
        legalLinksContainer: {
            backgroundColor: theme.colors.surface,
            borderRadius: 12,
            overflow: "hidden",
            shadowColor: theme.colors.onSurface,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
        },
        legalLink: {
            textDecorationLine: "none",
        },
        legalLinkItem: {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 16,
            paddingHorizontal: 16,
            backgroundColor: theme.colors.surface,
        },
        legalLinkText: {
            flex: 1,
            fontSize: 16,
            color: theme.colors.onSurface,
            fontWeight: "500",
            marginLeft: 16,
        },
        legalLinkDivider: {
            height: 1,
            backgroundColor: theme.colors.outlineVariant,
            marginLeft: 52,
        },
    });
};
