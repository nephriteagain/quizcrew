// app/DragAndDropQuiz.tsx
// import { DRAG_AND_DROP } from "@/lib/data";
import Container from "@/components/Container";
import { AppTheme, useAppTheme } from "@/providers/ThemeProvider";
import reviewSelector from "@/store/review/review.store";
import { DragAndDrop } from "@/types/review";
import { Link, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import Animated, { FadeInLeft, FadeOutLeft, LinearTransition } from "react-native-reanimated";

// Color palette for matching choices and answers
const colors = [
    { bg: "#E3F2FD", border: "#2196F3", text: "#1976D2" }, // Blue
    { bg: "#E8F5E9", border: "#4CAF50", text: "#388E3C" }, // Green
    { bg: "#FFF3E0", border: "#FF9800", text: "#F57C00" }, // Orange
    { bg: "#F3E5F5", border: "#9C27B0", text: "#7B1FA2" }, // Purple
    { bg: "#FFEBEE", border: "#F44336", text: "#D32F2F" }, // Red
    { bg: "#E0F2F1", border: "#009688", text: "#00695C" }, // Teal
    { bg: "#FFF8E1", border: "#FFC107", text: "#F9A825" }, // Amber
    { bg: "#FCE4EC", border: "#E91E63", text: "#C2185B" }, // Pink
];

export default function DragAndDropQuiz() {
    const theme = useAppTheme();
    const styles = makeStyles(theme);
    const [showAnswer, setShowAnswer] = useState(false);
    const [individualAnswers, setIndividualAnswers] = useState<Set<number>>(new Set());
    const toggleSwitch = () => {
        setShowAnswer((previousState) => !previousState);
        setIndividualAnswers(new Set());
    };
    const params = useLocalSearchParams<{ quiz_id: string }>();
    const quiz_id = params.quiz_id;
    const quizzes = reviewSelector.use.useQuizzes();
    const selectedQuiz = quizzes.find((q) => q.quiz_id === quiz_id) as DragAndDrop | undefined;

    const toggleIndividualAnswer = (questionIndex: number) => {
        setIndividualAnswers((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(questionIndex)) {
                newSet.delete(questionIndex);
            } else {
                newSet.add(questionIndex);
            }
            return newSet;
        });
    };

    const getColorForAnswer = (answer: string) => {
        if (!selectedQuiz) return colors[0];
        const answerIndex = selectedQuiz.answers.indexOf(answer);
        return colors[answerIndex % colors.length];
    };

    if (!quiz_id) {
        return (
            <View style={styles.errorContainer}>
                <Text>Invalid Quiz Id</Text>
            </View>
        );
    }

    if (!selectedQuiz) {
        return (
            <View style={styles.errorContainer}>
                <Text>Quiz not found.</Text>
            </View>
        );
    }

    return (
        <Container style={styles.container}>
            <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>
                    {showAnswer ? "Hide All Answers" : "Show All Answers"}
                </Text>
                <Switch
                    trackColor={{ false: theme.colors.outline, true: theme.colors.primary }}
                    thumbColor={showAnswer ? theme.colors.onPrimary : theme.colors.surface}
                    ios_backgroundColor={theme.colors.outline}
                    onValueChange={toggleSwitch}
                    value={showAnswer}
                />
            </View>
            {/* Answers palette */}
            <ScrollView
                contentContainerStyle={styles.answersRow}
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.answersRow}>
                    {selectedQuiz.answers.map((ans, index) => {
                        const isIndividuallyShown = individualAnswers.has(index);
                        const shouldShowAnswer = showAnswer || isIndividuallyShown;
                        return (
                            <Animated.View
                                key={ans}
                                entering={
                                    shouldShowAnswer
                                        ? FadeInLeft.duration(150).delay(index * 50)
                                        : undefined
                                }
                                exiting={FadeOutLeft.duration(100)}
                                layout={LinearTransition.duration(200)}
                            >
                                <Chip
                                    label={ans}
                                    color={
                                        shouldShowAnswer ? colors[index % colors.length] : undefined
                                    }
                                />
                            </Animated.View>
                        );
                    })}
                </View>
                {/* Wrap ScrollView inside a View we can measure */}
                <View style={styles.questions}>
                    {selectedQuiz.questions.map((q, idx) => {
                        const isIndividuallyShown = individualAnswers.has(idx);
                        const shouldShowAnswer = showAnswer || isIndividuallyShown;

                        return (
                            <Animated.View
                                key={idx}
                                style={[styles.dropZone]}
                                layout={LinearTransition.duration(200)}
                            >
                                <Pressable
                                    android_ripple={{
                                        color: theme.colors.surfaceVariant,
                                    }}
                                    onPress={() => toggleIndividualAnswer(idx)}
                                    style={styles.questionPressable}
                                >
                                    <Text style={styles.questionText}>{q.question}</Text>
                                </Pressable>
                                {shouldShowAnswer && (
                                    <Pressable onPress={() => toggleIndividualAnswer(idx)}>
                                        <Animated.View
                                            style={[
                                                styles.answerContainer,
                                                {
                                                    backgroundColor: getColorForAnswer(q.answer).bg,
                                                    borderColor: getColorForAnswer(q.answer).border,
                                                },
                                            ]}
                                            entering={FadeInLeft.duration(150).delay(
                                                showAnswer ? idx * 50 : 0
                                            )}
                                            exiting={FadeOutLeft.duration(100)}
                                        >
                                            <Animated.Text
                                                style={[
                                                    styles.answerText,
                                                    styles.visibleAnswer,
                                                    { color: getColorForAnswer(q.answer).text },
                                                ]}
                                            >
                                                {q.answer}
                                            </Animated.Text>
                                        </Animated.View>
                                    </Pressable>
                                )}
                            </Animated.View>
                        );
                    })}
                </View>
            </ScrollView>

            {/* Bottom Button */}
            <View style={styles.bottomContainer}>
                <Link
                    href={{
                        pathname: "/dndq-answer",
                        params: {
                            quiz_id,
                        },
                    }}
                    asChild
                >
                    <Pressable
                        android_ripple={{ color: "#ccc", borderless: false }}
                        style={styles.quizButton}
                    >
                        <Text style={styles.quizButtonText}>Take the Quiz</Text>
                    </Pressable>
                </Link>
            </View>
        </Container>
    );
}

function Chip({
    label,
    color,
}: {
    label: string;
    color?: { bg: string; border: string; text: string };
}) {
    const theme = useAppTheme();
    const styles = makeStyles(theme);

    return (
        <Animated.View
            style={[
                styles.chip,
                color && {
                    backgroundColor: color.bg,
                    borderColor: color.border,
                    shadowColor: theme.colors.onSurface,
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.15,
                    shadowRadius: 4,
                    elevation: 3,
                },
            ]}
            layout={LinearTransition.duration(200)}
        >
            <Text style={[styles.chipText, color && { color: color.text }]}>{label}</Text>
        </Animated.View>
    );
}

const makeStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            padding: 16,
        },
        errorContainer: {
            flex: 1,
            padding: 16,
            backgroundColor: theme.colors.surface,
            alignItems: "center",
            justifyContent: "center",
        },
        switchContainer: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            zIndex: 10,
        },
        switchLabel: {
            fontWeight: "600",
            fontSize: 16,
            color: theme.colors.onSurface,
        },
        scrollView: {
            flex: 1,
        },
        answersRow: {
            flexDirection: "row",
            flexWrap: "wrap",
            marginBottom: 20,
        },
        chip: {
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 25,
            margin: 4,
            zIndex: 10,
            borderWidth: 1,
            borderColor: theme.colors.outline,
            backgroundColor: theme.colors.surface,
        },
        chipText: {
            color: theme.colors.onSurfaceVariant,
            fontWeight: "600",
        },
        questions: {
            gap: 12,
        },
        dropZone: {
            padding: 16,
            borderWidth: 2,
            borderColor: theme.colors.outline,
            borderRadius: 12,
            minHeight: 70,
            justifyContent: "center",
            backgroundColor: theme.colors.surface,
            marginBottom: 12,
        },
        questionPressable: {
            padding: 8,
            marginBottom: 8,
            borderRadius: 8,
            backgroundColor: "rgba(0,0,0,0.02)",
        },
        questionText: {
            fontSize: 16,
            fontWeight: "500",
            marginBottom: 6,
        },
        individualAnswerHint: {
            fontSize: 14,
            fontWeight: "600",
            color: theme.colors.secondary,
            marginTop: 4,
            fontStyle: "italic",
        },
        answerContainer: {
            marginTop: 8,
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 25,
            borderWidth: 0,
            shadowColor: theme.colors.onSurface,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 3,
        },
        answerText: {
            fontSize: 14,
            color: theme.colors.onSurfaceVariant,
            textAlign: "center",
        },
        visibleAnswer: {
            color: theme.colors.onSurface,
            fontWeight: "600",
        },
        bottomContainer: {
            paddingVertical: 16,
        },
        quizButton: {
            backgroundColor: theme.colors.error,
            padding: 16,
            borderRadius: 12,
            alignItems: "center",
        },
        quizButtonText: {
            color: theme.colors.onError,
            fontWeight: "bold",
            fontSize: 16,
        },
    });
