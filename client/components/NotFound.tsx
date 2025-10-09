import { useAppTheme } from "@/providers/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import Container from "./Container";

export default function NotFound() {
    const theme = useAppTheme();
    const styles = makeStyles(theme);

    return (
        <Container style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons name="help-circle" size={64} color={theme.colors.error} />
                </View>

                <Text style={styles.errorCode}>404</Text>
                <Text style={styles.title}>Page Not Found</Text>
                <Text style={styles.subtitle}>
                    Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </Text>

                <Link href="/" asChild>
                    <Pressable style={styles.button}>
                        <Ionicons name="home" size={20} color="white" style={styles.buttonIcon} />
                        <Text style={styles.buttonText}>Go Home</Text>
                    </Pressable>
                </Link>
            </View>
        </Container>
    );
}

const makeStyles = (theme: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.surface,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
        },
        content: {
            alignItems: "center",
            maxWidth: 350,
        },
        iconContainer: {
            backgroundColor: theme.colors.surface,
            borderRadius: 50,
            padding: 20,
            marginBottom: 24,
            shadowColor: theme.colors.onSurface,
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 4,
        },
        errorCode: {
            fontSize: 48,
            fontWeight: "bold",
            color: theme.colors.error,
            marginBottom: 8,
        },
        title: {
            fontSize: 24,
            fontWeight: "bold",
            color: theme.colors.onSurface,
            textAlign: "center",
            marginBottom: 12,
        },
        subtitle: {
            fontSize: 16,
            color: theme.colors.onSurfaceVariant,
            textAlign: "center",
            lineHeight: 22,
            marginBottom: 32,
        },
        button: {
            backgroundColor: theme.colors.primary,
            borderRadius: 12,
            paddingVertical: 14,
            paddingHorizontal: 24,
            flexDirection: "row",
            alignItems: "center",
            shadowColor: theme.colors.onSurface,
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        },
        buttonIcon: {
            marginRight: 8,
        },
        buttonText: {
            fontSize: 16,
            fontWeight: "600",
            color: theme.colors.onPrimary,
        },
    });
