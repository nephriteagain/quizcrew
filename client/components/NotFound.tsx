import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function NotFound() {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons name="help-circle" size={64} color="#FF6B6B" />
                </View>

                <Text style={styles.errorCode}>404</Text>
                <Text style={styles.title}>Page Not Found</Text>
                <Text style={styles.subtitle}>
                    Oops! The page you're looking for doesn't exist or has been moved.
                </Text>

                <Link href="/" asChild>
                    <Pressable style={styles.button}>
                        <Ionicons name="home" size={20} color="white" style={styles.buttonIcon} />
                        <Text style={styles.buttonText}>Go Home</Text>
                    </Pressable>
                </Link>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    content: {
        alignItems: "center",
        maxWidth: 350,
    },
    iconContainer: {
        backgroundColor: "white",
        borderRadius: 50,
        padding: 20,
        marginBottom: 24,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    errorCode: {
        fontSize: 48,
        fontWeight: "bold",
        color: "#FF6B6B",
        marginBottom: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        lineHeight: 22,
        marginBottom: 32,
    },
    button: {
        backgroundColor: "#007AFF",
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 24,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
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
        color: "white",
    },
});