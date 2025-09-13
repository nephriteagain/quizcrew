// app/DragAndDropQuiz.tsx
// import { DRAG_AND_DROP } from "@/lib/data";
import Container from "@/components/Container";
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
    const [showAnswer, setShowAnswer] = useState(false);
    const [individualAnswers, setIndividualAnswers] = useState<Set<number>>(new Set());
    const toggleSwitch = () => {
        setShowAnswer((previousState) => !previousState);
        setIndividualAnswers(new Set());
    };
    const params = useLocalSearchParams<{ quiz_id: string }>();
    const quiz_id = params.quiz_id;
    const quizzes = reviewSelector.use.quizzes();
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
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={showAnswer ? "#f5dd4b" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
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
                                        ? FadeInLeft.duration(300)
                                              .springify()
                                              .delay(index * 100)
                                        : undefined
                                }
                                exiting={FadeOutLeft.duration(200)}
                                layout={LinearTransition.springify().damping(15).stiffness(100)}
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
                                layout={LinearTransition.springify().damping(15).stiffness(100)}
                            >
                                <Pressable
                                    android_ripple={{
                                        color: "#f0f0f0",
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
                                            entering={FadeInLeft.duration(300)
                                                .springify()
                                                .delay(showAnswer ? idx * 100 : 0)}
                                            exiting={FadeOutLeft.duration(200)}
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
    return (
        <Animated.View
            style={[
                styles.chip,
                color && {
                    backgroundColor: color.bg,
                    borderColor: color.border,
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.15,
                    shadowRadius: 4,
                    elevation: 3,
                },
            ]}
            layout={LinearTransition.springify().damping(15).stiffness(100)}
        >
            <Text style={[styles.chipText, color && { color: color.text }]}>{label}</Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    errorContainer: {
        flex: 1,
        padding: 16,
        backgroundColor: "white",
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
        borderColor: "#00000040",
        backgroundColor: "white",
    },
    chipText: {
        color: "#000000bf",
        fontWeight: "600",
    },
    questions: {
        gap: 12,
    },
    dropZone: {
        padding: 16,
        borderWidth: 2,
        borderColor: "#d1d5db",
        borderRadius: 12,
        minHeight: 70,
        justifyContent: "center",
        backgroundColor: "white",
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
        color: "#4CAF50",
        marginTop: 4,
        fontStyle: "italic",
    },
    answerContainer: {
        marginTop: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 25,
        borderWidth: 0,
        shadowColor: "#000",
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
        color: "#6b7280",
        textAlign: "center",
    },
    visibleAnswer: {
        color: "black",
        fontWeight: "600",
    },
    bottomContainer: {
        padding: 16,
        borderTopWidth: 1,
        borderColor: "#eee",
        backgroundColor: "white",
    },
    quizButton: {
        backgroundColor: "#2196F3",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
    },
    quizButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
});
