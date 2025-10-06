import Container from "@/components/Container";
import { AppTheme, useAppTheme } from "@/providers/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link, router } from "expo-router";
import { Formik } from "formik";
import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Button, TextInput } from "react-native-paper";
import * as Yup from "yup";

const forgotPasswordSchema = Yup.object().shape({
    email: Yup.string().email("Please enter a valid email address").required("Email is required"),
});

interface ForgotPasswordFormValues {
    email: string;
}

export default function ForgotPasswordScreen() {
    const theme = useAppTheme();
    const styles = makeStyles(theme);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const initialValues: ForgotPasswordFormValues = {
        email: "",
    };

    const handleSubmit = (values: ForgotPasswordFormValues) => {
        // TODO: Implement forgot password logic
        console.log("Forgot password request:", values);
        setIsSubmitted(true);
        Alert.alert(
            "Reset Link Sent",
            "We've sent a password reset link to your email address. Please check your inbox and follow the instructions.",
            [
                {
                    text: "OK",
                    onPress: () => router.back(),
                },
            ]
        );
    };

    return (
        <Container style={styles.container}>
            <Formik
                initialValues={initialValues}
                validationSchema={forgotPasswordSchema}
                onSubmit={handleSubmit}
            >
                {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                    touched,
                    isValid,
                    isSubmitting,
                }) => (
                    <KeyboardAvoidingView
                        style={styles.keyboardAvoidingView}
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
                    >
                        <ScrollView
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                        >
                            <View style={styles.header}>
                                <View style={styles.logoContainer}>
                                    <Image
                                        source={require("@/assets/images/quiz-crew-icon.png")}
                                        style={{ width: 144, height: 144 }}
                                    />
                                </View>
                                <Text style={styles.title}>Forgot Password?</Text>
                                <Text style={styles.subtitle}>
                                    No worries! Enter your email address and we&apos;ll send you a
                                    link to reset your password.
                                </Text>
                            </View>

                            <View style={styles.formSection}>
                                <TextInput
                                    mode="outlined"
                                    label="Email"
                                    placeholder="Enter your email address"
                                    value={values.email}
                                    onChangeText={handleChange("email")}
                                    onBlur={handleBlur("email")}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    style={styles.input}
                                    left={<TextInput.Icon icon="email" />}
                                    error={touched.email && !!errors.email}
                                    disabled={isSubmitted}
                                />
                                {touched.email && errors.email && (
                                    <Text style={styles.errorText}>{errors.email}</Text>
                                )}

                                <Button
                                    mode="contained"
                                    onPress={() => handleSubmit()}
                                    style={[
                                        styles.submitButton,
                                        (!isValid || isSubmitted) && styles.disabledButton,
                                    ]}
                                    contentStyle={styles.submitButtonContent}
                                    labelStyle={styles.submitButtonLabel}
                                    disabled={!isValid || isSubmitted}
                                    loading={isSubmitting}
                                    buttonColor={theme.colors.primary}
                                    textColor={theme.colors.onPrimary}
                                >
                                    {isSubmitting ? "Sending..." : "Send Reset Link"}
                                </Button>

                                <View style={styles.helpSection}>
                                    <Text style={styles.helpText}>
                                        Remember your password?{" "}
                                        <Link href="/signin-email" style={styles.link}>
                                            <Text style={styles.linkText}>Sign in here</Text>
                                        </Link>
                                    </Text>
                                </View>

                                <View style={styles.supportSection}>
                                    <View style={styles.supportCard}>
                                        <Ionicons
                                            name="help-circle"
                                            size={24}
                                            color={theme.colors.primary}
                                            style={styles.supportIcon}
                                        />
                                        <View style={styles.supportContent}>
                                            <Text style={styles.supportTitle}>Need help?</Text>
                                            <Text style={styles.supportText}>
                                                If you&apos;re having trouble receiving the reset
                                                email, check your spam folder or contact our support
                                                team.
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                )}
            </Formik>
        </Container>
    );
}

const makeStyles = (theme: AppTheme) => {
    return StyleSheet.create({
        container: {
            flex: 1,
        },
        keyboardAvoidingView: {
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
        formSection: {
            gap: 24,
        },
        input: {
            backgroundColor: theme.colors.surface,
        },
        submitButton: {
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
        submitButtonContent: {
            paddingVertical: 12,
            paddingHorizontal: 24,
        },
        submitButtonLabel: {
            fontSize: 18,
            fontWeight: "600",
        },
        disabledButton: {
            opacity: 0.6,
        },
        helpSection: {
            alignItems: "center",
        },
        helpText: {
            fontSize: 16,
            color: theme.colors.onSurfaceVariant,
            textAlign: "center",
        },
        supportSection: {
            marginTop: 24,
        },
        supportCard: {
            backgroundColor: theme.colors.surfaceVariant,
            borderRadius: 16,
            padding: 20,
            flexDirection: "row",
            alignItems: "flex-start",
        },
        supportIcon: {
            marginRight: 16,
            marginTop: 2,
        },
        supportContent: {
            flex: 1,
        },
        supportTitle: {
            fontSize: 16,
            fontWeight: "600",
            color: theme.colors.onSurface,
            marginBottom: 8,
        },
        supportText: {
            fontSize: 14,
            color: theme.colors.onSurfaceVariant,
            lineHeight: 20,
        },
        link: {
            textDecorationLine: "none",
        },
        linkText: {
            color: theme.colors.primary,
            fontWeight: "600",
        },
        errorText: {
            fontSize: 12,
            color: theme.colors.error,
            marginTop: 4,
            marginLeft: 12,
        },
    });
};
