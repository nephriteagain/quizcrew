import Container from "@/components/Container";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { AppTheme, useAppTheme } from "@/providers/ThemeProvider";
import { signinEmail } from "@/store/user/actions/signinEmail";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Formik } from "formik";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import * as Yup from "yup";

const signinSchema = Yup.object().shape({
    email: Yup.string().email("Please enter a valid email address").required("Email is required"),
    password: Yup.string().required("Password is required"),
});

interface SigninFormValues {
    email: string;
    password: string;
}

export default function SigninEmail() {
    const theme = useAppTheme();
    const styles = makeStyles(theme);
    const [showPassword, setShowPassword] = useState(false);
    const [signinEmailFn, { isLoading }] = useAsyncAction(signinEmail);

    const initialValues: SigninFormValues = {
        email: "",
        password: "",
    };

    const handleSignIn = async (values: SigninFormValues) => {
        // TODO: Implement email signin logic
        console.log("Email signin:", values);
        const result = await signinEmailFn(values.email, values.password);
        if (result.error) {
            Alert.alert("Failed", result.error.message);
        }
    };

    return (
        <Container style={styles.container}>
            <Formik
                initialValues={initialValues}
                validationSchema={signinSchema}
                onSubmit={handleSignIn}
            >
                {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                    touched,
                    setFieldValue,
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
                                <Text style={styles.title}>Welcome Back</Text>
                                <Text style={styles.subtitle}>
                                    Sign in to your account to continue
                                </Text>
                            </View>

                            <View style={styles.formSection}>
                                <TextInput
                                    mode="outlined"
                                    label="Email"
                                    placeholder="Enter your email"
                                    value={values.email}
                                    onChangeText={handleChange("email")}
                                    onBlur={handleBlur("email")}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    style={styles.input}
                                    left={<TextInput.Icon icon="email" />}
                                    error={touched.email && !!errors.email}
                                />
                                {touched.email && errors.email && (
                                    <Text style={styles.errorText}>{errors.email}</Text>
                                )}

                                <TextInput
                                    mode="outlined"
                                    label="Password"
                                    placeholder="Enter your password"
                                    value={values.password}
                                    onChangeText={handleChange("password")}
                                    onBlur={handleBlur("password")}
                                    secureTextEntry={!showPassword}
                                    style={styles.input}
                                    left={<TextInput.Icon icon="lock" />}
                                    right={
                                        <TextInput.Icon
                                            icon={showPassword ? "eye-off" : "eye"}
                                            onPress={() => setShowPassword(!showPassword)}
                                        />
                                    }
                                    error={touched.password && !!errors.password}
                                />
                                {touched.password && errors.password && (
                                    <Text style={styles.errorText}>{errors.password}</Text>
                                )}

                                <View style={styles.optionsSection}>
                                    <Link href="/forgot-password" style={styles.link}>
                                        <Text style={styles.forgotPasswordText}>
                                            Forgot password?
                                        </Text>
                                    </Link>
                                </View>

                                <Button
                                    mode="contained"
                                    onPress={() => handleSubmit()}
                                    style={[styles.signInButton, !isValid && styles.disabledButton]}
                                    contentStyle={styles.signInButtonContent}
                                    labelStyle={styles.signInButtonLabel}
                                    disabled={!isValid || isLoading || isSubmitting}
                                    loading={isLoading || isSubmitting}
                                    buttonColor={theme.colors.primary}
                                    textColor={theme.colors.onPrimary}
                                >
                                    Sign In
                                </Button>
                                <View style={styles.signUpSection}>
                                    <Text style={styles.signUpText}>
                                        Don&apos;t have an account?{" "}
                                        <Link href="/signup" style={styles.link}>
                                            <Text style={styles.linkText}>Sign up here</Text>
                                        </Link>
                                    </Text>
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
            gap: 8,
        },
        input: {
            backgroundColor: theme.colors.surface,
        },
        optionsSection: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 8,
        },
        checkboxContainer: {
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
        },
        checkboxTextContainer: {
            marginLeft: 8,
        },
        checkboxText: {
            fontSize: 14,
            color: theme.colors.onSurface,
        },
        forgotPasswordText: {
            fontSize: 14,
            color: theme.colors.primary,
            fontWeight: "600",
        },
        link: {
            textDecorationLine: "none",
        },
        linkText: {
            color: theme.colors.primary,
            fontWeight: "600",
        },
        signInButton: {
            borderRadius: 16,
            marginTop: 24,
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
        disabledButton: {
            opacity: 0.6,
        },
        signUpSection: {
            alignItems: "center",
            marginTop: 24,
        },
        signUpText: {
            fontSize: 16,
            color: theme.colors.onSurfaceVariant,
        },
        errorText: {
            fontSize: 12,
            color: theme.colors.error,
            marginTop: 4,
            marginLeft: 12,
        },
    });
};
