import Container from "@/components/Container";
import { useAsyncStatus } from "@/hooks/useAsyncStatus";
import { AppTheme, useAppTheme } from "@/providers/ThemeProvider";
import { linkEmail } from "@/store/user/actions/linkEmail";
import { Ionicons } from "@expo/vector-icons";
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

const linkEmailSchema = Yup.object().shape({
    email: Yup.string().email("Please enter a valid email address").required("Email is required"),
    password: Yup.string()
        .min(8, "Password must be at least 8 characters long")
        .required("Password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Please confirm your password"),
});

interface LinkEmailFormValues {
    email: string;
    password: string;
    confirmPassword: string;
}

export default function LinkEmail() {
    const theme = useAppTheme();
    const styles = makeStyles(theme);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [linkEmailFn, isLoading] = useAsyncStatus(linkEmail);

    const initialValues: LinkEmailFormValues = {
        email: "",
        password: "",
        confirmPassword: "",
    };

    const handleLinkEmail = (values: LinkEmailFormValues) => {
        Alert.alert("Confirm Email", `Please confirm that ${values.email} is correct.`, [
            {
                text: "Cancel",
                style: "cancel",
            },
            {
                text: "Confirm",
                onPress: async () => {
                    // TODO: Implement email linking logic
                    console.log("Link email:", values);
                    const result = await linkEmailFn(values.email, values.password);
                    if (result) {
                        Alert.alert("Success", "Account linked successfully!");
                    } else {
                        Alert.alert("Failed", "Failed link email!");
                    }
                },
            },
        ]);
    };

    return (
        <Container style={styles.container}>
            <Formik
                initialValues={initialValues}
                validationSchema={linkEmailSchema}
                onSubmit={handleLinkEmail}
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
                                    <Ionicons name="mail" size={64} color={theme.colors.primary} />
                                </View>
                                <Text style={styles.title}>Link Account</Text>
                                <Text style={styles.subtitle}>
                                    Enter your email and desired password to complete the linking
                                    process.
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
                                <Button
                                    mode="contained"
                                    onPress={() => handleSubmit()}
                                    style={[styles.signUpButton, !isValid && styles.disabledButton]}
                                    contentStyle={styles.signUpButtonContent}
                                    labelStyle={styles.signUpButtonLabel}
                                    disabled={!isValid || isLoading}
                                    loading={isLoading}
                                    buttonColor={theme.colors.primary}
                                    textColor={theme.colors.onPrimary}
                                >
                                    Link Account
                                </Button>
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
            gap: 16,
        },
        input: {
            backgroundColor: theme.colors.surface,
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
        errorText: {
            fontSize: 12,
            color: theme.colors.error,
            marginTop: 4,
            marginLeft: 12,
        },
    });
};
