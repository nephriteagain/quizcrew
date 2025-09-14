import { AppTheme, useAppTheme } from "@/providers/ThemeProvider";
import { Quiz } from "@/types/review";
import React from "react";
import { Pressable, PressableProps, StyleSheet, Text, View } from "react-native";

type QuizCardProps = {
    quiz: Quiz;
} & PressableProps;

export default function QuizCard({ quiz, ...props }: QuizCardProps) {
    const theme = useAppTheme();
    const styles = makeStyles(theme);

    // Format timestamp to readable date
    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    // Get total number of questions
    const getTotalQuestions = () => {
        return quiz.questions.length;
    };

    // Get quiz type display text
    const getQuizTypeText = () => {
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
    };

    // Get quiz type color
    const getQuizTypeColor = () => {
        switch (quiz.type) {
            case "MCQ":
                return {
                    bg: theme.colors.secondaryContainer,
                    text: theme.colors.secondary,
                    border: theme.colors.secondary,
                };
            case "TOFQ":
                return {
                    bg: theme.colors.tertiaryContainer,
                    text: theme.colors.tertiary,
                    border: theme.colors.tertiary,
                };
            case "DNDQ":
                return {
                    bg: theme.colors.errorContainer,
                    text: theme.colors.error,
                    border: theme.colors.error,
                };
            default:
                return {
                    bg: theme.colors.surfaceVariant,
                    text: theme.colors.onSurfaceVariant,
                    border: theme.colors.outline,
                };
        }
    };

    return (
        <Pressable
            style={[styles.pressableContainer, styles.container]}
            {...props}
            android_ripple={{ color: theme.colors.onPrimary }}
        >
            <View style={styles.header}>
                <Text style={styles.title} numberOfLines={2}>
                    {quiz.title}
                </Text>
                <View
                    style={[
                        styles.typeLabel,
                        {
                            backgroundColor: getQuizTypeColor().bg,
                            borderColor: getQuizTypeColor().border,
                        },
                    ]}
                >
                    <Text style={[styles.typeText, { color: getQuizTypeColor().text }]}>
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

const makeStyles = (theme: AppTheme) => {
    const styles = StyleSheet.create({
        pressableContainer: {
            borderRadius: 12,
            marginVertical: 6,
            shadowColor: theme.colors.onSurface,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 3,
            width: "100%",
            overflow: "hidden",
            backgroundColor: theme.colors.background,
        },
        container: {
            borderRadius: 12,
            padding: 16,
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
            color: theme.colors.onSurface,
            flex: 1,
            marginRight: 8,
            lineHeight: 20,
        },
        typeLabel: {
            backgroundColor: theme.colors.surfaceVariant,
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 8,
            borderWidth: 1.5,
            shadowColor: theme.colors.onSurface,
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
            color: theme.colors.onSurfaceVariant,
            fontWeight: "700",
            letterSpacing: 0.5,
            textTransform: "uppercase",
        },
        description: {
            fontSize: 14,
            color: theme.colors.onSurfaceVariant,
            lineHeight: 18,
            flex: 1,
        },
        footer: {
            marginTop: 8,
            flexDirection: "row",
            justifyContent: "space-between",
        },
        infoRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            columnGap: 6,
        },
        infoLabel: {
            fontSize: 12,
            color: theme.colors.onSurfaceVariant,
            fontWeight: "500",
        },
        infoValue: {
            fontSize: 12,
            color: theme.colors.onSurface,
            fontWeight: "600",
        },
    });

    return styles;
};
