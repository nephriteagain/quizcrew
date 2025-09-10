// app/DragAndDropQuiz.tsx
// import { DRAG_AND_DROP } from "@/lib/data";
import reviewSelector from "@/store/review/review.store";
import { DragAndDrop } from "@/types/review";
import { Link, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";

export default function DragAndDropQuiz() {
    const [showAnswer, setShowAnswer] = useState(false);
    const toggleSwitch = () => setShowAnswer((previousState) => !previousState);
    const params = useLocalSearchParams<{ quiz_id: string }>();
    const quiz_id = params.quiz_id;
    const quizzes = reviewSelector.use.quizzes();
    const selectedQuiz = quizzes.find((q) => q.quiz_id === quiz_id) as DragAndDrop | undefined;

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
        <View style={styles.container}>
            <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Show answers</Text>
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
                    {selectedQuiz.answers.map((ans) => (
                        <Chip key={ans} label={ans} />
                    ))}
                </View>
                {/* Wrap ScrollView inside a View we can measure */}
                <View style={styles.questions}>
                    {selectedQuiz.questions.map((q, idx) => (
                        <View key={idx} style={[styles.dropZone]}>
                            <Text style={styles.questionText}>{q.question}</Text>
                            {showAnswer && (
                                <Text style={[styles.answerText, styles.visibleAnswer]}>
                                    {q.answer}
                                </Text>
                            )}
                        </View>
                    ))}
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
                        <Text style={styles.quizButtonText}>
                            Take the Quiz
                        </Text>
                    </Pressable>
                </Link>
            </View>
        </View>
    );
}

function Chip({ label }: { label: string }) {
    return (
        <View style={[styles.chip]}>
            <Text style={styles.chipText}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
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
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
        backgroundColor: "#4f46e5",
        margin: 4,
        zIndex: 10,
    },
    chipText: {
        color: "white",
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
    questionText: {
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 6,
    },
    answerText: {
        fontSize: 14,
        color: "#6b7280",
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
