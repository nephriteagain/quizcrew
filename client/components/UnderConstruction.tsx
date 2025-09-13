import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface UnderConstructionProps {
    title?: string;
    subtitle?: string;
}

export default function UnderConstruction({
    title = "Under Construction",
    subtitle = "This page is currently being built. Check back soon!",
}: UnderConstructionProps) {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons name="construct" size={64} color="#FF9500" />
                </View>

                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>

                <View style={styles.dotsContainer}>
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                </View>
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
        maxWidth: 300,
        rowGap: 20,
    },
    iconContainer: {
        backgroundColor: "white",
        borderRadius: 50,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        lineHeight: 22,
    },
    dotsContainer: {
        flexDirection: "row",
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#FF9500",
        opacity: 0.6,
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
