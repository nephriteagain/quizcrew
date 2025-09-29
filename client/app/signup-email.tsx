import Container from "@/components/Container";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { AppTheme, useAppTheme } from "@/providers/ThemeProvider";
import { signupEmail } from "@/store/user/actions/signupEmail";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Formik } from "formik";
import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Button, Checkbox, TextInput } from "react-native-paper";
import * as Yup from "yup";

const signupSchema = Yup.object().shape({
    email: Yup.string().email("Please enter a valid email address").required("Email is required"),
    password: Yup.string()
        .min(8, "Password must be at least 8 characters long")
        .required("Password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Please confirm your password"),
    isTermsAccepted: Yup.boolean().oneOf(
        [true],
        "You must agree to the Terms of Service and Privacy Policy"
    ),
});

interface SignupFormValues {
    email: string;
    password: string;
    confirmPassword: string;
    isTermsAccepted: boolean;
}

export default function SignupEmail() {
    const theme = useAppTheme();
    const styles = makeStyles(theme);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [signupEmailFn, { isLoading }] = useAsyncAction(signupEmail);

    const initialValues: SignupFormValues = {
        email: "",
        password: "",
        confirmPassword: "",
        isTermsAccepted: false,
    };

    const handleSignUp = async (values: SignupFormValues) => {
        // TODO: Implement email signup logic
        console.log("Email signup:", values);
        const result = await signupEmailFn(values.email, values.password);
        if (result.error) {
            Alert.alert("Signup Failed", result.error.message);
        }
    };

    return (
        <Container style={styles.container}>
            <Formik
                initialValues={initialValues}
                validationSchema={signupSchema}
                onSubmit={handleSignUp}
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
                                    <Ionicons name="mail" size={64} color={theme.colors.primary} />
                                </View>
                                <Text style={styles.title}>Create Account</Text>
                                <Text style={styles.subtitle}>
                                    Sign up with your email to get started
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

                                <TextInput
                                    mode="outlined"
                                    label="Confirm Password"
                                    placeholder="Confirm your password"
                                    value={values.confirmPassword}
                                    onChangeText={handleChange("confirmPassword")}
                                    onBlur={handleBlur("confirmPassword")}
                                    secureTextEntry={!showConfirmPassword}
                                    style={styles.input}
                                    left={<TextInput.Icon icon="lock-check" />}
                                    right={
                                        <TextInput.Icon
                                            icon={showConfirmPassword ? "eye-off" : "eye"}
                                            onPress={() =>
                                                setShowConfirmPassword(!showConfirmPassword)
                                            }
                                        />
                                    }
                                    error={touched.confirmPassword && !!errors.confirmPassword}
                                />
                                {touched.confirmPassword && errors.confirmPassword && (
                                    <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                                )}

                                <View style={styles.termsSection}>
                                    <TouchableOpacity
                                        style={styles.checkboxContainer}
                                        onPress={() =>
                                            setFieldValue(
                                                "isTermsAccepted",
                                                !values.isTermsAccepted
                                            )
                                        }
                                        activeOpacity={0.7}
                                    >
                                        <Checkbox
                                            status={
                                                values.isTermsAccepted ? "checked" : "unchecked"
                                            }
                                            onPress={() =>
                                                setFieldValue(
                                                    "isTermsAccepted",
                                                    !values.isTermsAccepted
                                                )
                                            }
                                            uncheckedColor={theme.colors.onSurfaceVariant}
                                            color={theme.colors.primary}
                                        />
                                        <View style={styles.termsTextContainer}>
                                            <Text style={styles.termsText}>
                                                I agree to the{" "}
                                                <Link href="/terms-of-service" style={styles.link}>
                                                    <Text style={styles.linkText}>
                                                        Terms of Service
                                                    </Text>
                                                </Link>{" "}
                                                and{" "}
                                                <Link href="/privacy-policy" style={styles.link}>
                                                    <Text style={styles.linkText}>
                                                        Privacy Policy
                                                    </Text>
                                                </Link>
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                    {errors.isTermsAccepted && (
                                        <Text style={styles.errorText}>
                                            {errors.isTermsAccepted}
                                        </Text>
                                    )}
                                </View>

                                <Button
                                    mode="contained"
                                    onPress={() => handleSubmit()}
                                    style={[styles.signUpButton, !isValid && styles.disabledButton]}
                                    contentStyle={styles.signUpButtonContent}
                                    labelStyle={styles.signUpButtonLabel}
                                    disabled={!isValid || isSubmitting || isLoading}
                                    loading={isSubmitting || isLoading}
                                    buttonColor={theme.colors.primary}
                                    textColor={theme.colors.onPrimary}
                                >
                                    Create Account
                                </Button>

                                <View style={styles.signInSection}>
                                    <Text style={styles.signInText}>
                                        Already have an account?{" "}
                                        <Link href="/signin" style={styles.link}>
                                            <Text style={styles.linkText}>Sign In</Text>
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
        termsSection: {
            backgroundColor: theme.colors.surfaceVariant,
            borderRadius: 16,
            padding: 20,
            marginTop: 8,
        },
        checkboxContainer: {
            flexDirection: "row",
            alignItems: "flex-start",
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
        signUpButton: {
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
        signUpButtonContent: {
            paddingVertical: 12,
            paddingHorizontal: 24,
        },
        signUpButtonLabel: {
            fontSize: 18,
            fontWeight: "600",
        },
        disabledButton: {
            opacity: 0.6,
        },
        signInSection: {
            alignItems: "center",
            marginTop: 24,
        },
        signInText: {
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
