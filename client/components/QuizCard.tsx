import { Quiz } from "@/types/review";
import React, { useCallback } from "react";
import { Pressable, PressableProps, StyleSheet, Text, View } from "react-native";

type QuizCardProps = {
    quiz: Quiz;
} & PressableProps;

export default function QuizCard({ quiz, ...props }: QuizCardProps) {
    // Format timestamp to readable date
    const formatDate = useCallback((timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    }, []);

    // Get total number of questions
    const getTotalQuestions = useCallback(() => {
        return quiz.questions.length;
    }, [quiz]);

    // Get quiz type display text
    const getQuizTypeText = useCallback(() => {
        switch (quiz.type) {
            case "MCQ":
                return "Multiple Choice";
            case "TOFQ":
                return "True or False";
            case "DNDQ":
                return "Drag & Drop";
            default:
                return "Quiz";
        }
    }, [quiz]);

    // Get quiz type color
    const getQuizTypeColor = useCallback(() => {
        switch (quiz.type) {
            case "MCQ":
                return { bg: "#E8F5E9", text: "#2E7D32", border: "#4CAF50" };
            case "TOFQ":
                return { bg: "#E3F2FD", text: "#1565C0", border: "#2196F3" };
            case "DNDQ":
                return { bg: "#FFF3E0", text: "#E65100", border: "#FF9800" };
            default:
                return { bg: "#F5F5F5", text: "#666", border: "#CCC" };
        }
    }, [quiz]);

    return (
        <Pressable style={styles.container} {...props} android_ripple={{ color: "#fff" }}>
            <View style={styles.header}>
                <Text style={styles.title} numberOfLines={2}>
                    {quiz.title}
                </Text>
                <View style={[
                    styles.typeLabel,
                    {
                        backgroundColor: getQuizTypeColor().bg,
                        borderColor: getQuizTypeColor().border,
                    }
                ]}>
                    <Text style={[
                        styles.typeText,
                        { color: getQuizTypeColor().text }
                    ]}>
                        {getQuizTypeText()}
                    </Text>
                </View>
            </View>

            <Text style={styles.description} numberOfLines={3}>
                {quiz.description}
            </Text>

            <View style={styles.footer}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Created:</Text>
                    <Text style={styles.infoValue}>{formatDate(quiz.createdAt)}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Questions:</Text>
                    <Text style={styles.infoValue}>{getTotalQuestions()}</Text>
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#f1f5f9",
        borderRadius: 12,
        padding: 16,
        marginVertical: 6,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        aspectRatio: 1.6,
        justifyContent: "space-between",
        width: "100%",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1a1a1a",
        flex: 1,
        marginRight: 8,
        lineHeight: 20,
    },
    typeLabel: {
        backgroundColor: "#f0f0f0",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1.5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    typeText: {
        fontSize: 11,
        color: "#666",
        fontWeight: "700",
        letterSpacing: 0.5,
        textTransform: "uppercase",
    },
    description: {
        fontSize: 14,
        color: "#666",
        lineHeight: 18,
        flex: 1,
    },
    footer: {
        marginTop: 8,
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
    },
    infoLabel: {
        fontSize: 12,
        color: "#999",
        fontWeight: "500",
    },
    infoValue: {
        fontSize: 12,
        color: "#333",
        fontWeight: "600",
    },
});
