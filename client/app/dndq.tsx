// app/DragAndDropQuiz.tsx
import { DRAG_AND_DROP } from "@/lib/data";
import { Link } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";

export default function DragAndDropQuiz() {
    const [showAnswer, setShowAnswer] = useState(false);
    const toggleSwitch = () => setShowAnswer((previousState) => !previousState);

    return (
        <View style={styles.container}>
            {/* Answers palette */}
            <View style={styles.answersRow}>
                {DRAG_AND_DROP.answers.map((ans) => (
                    <Chip key={ans} label={ans} />
                ))}
            </View>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    zIndex: 10, // 👈 sometimes needed on Android
                }}
            >
                <Text style={{ fontWeight: "600", fontSize: 16 }}>Show answers</Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={showAnswer ? "#f5dd4b" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={showAnswer}
                />
            </View>
            {/* Wrap ScrollView inside a View we can measure */}
            <View style={{ flex: 1 }}>
                <ScrollView
                    scrollEventThrottle={16} // so recalibration happens smoothly
                >
                    <View style={styles.questions}>
                        {DRAG_AND_DROP.questions.map((q, idx) => (
                            <View
                                key={idx}
                                style={[styles.dropZone]}
                                // onLayout={(e) => registerDropZone(idx, e.nativeEvent.layout)}
                            >
                                <Text style={styles.questionText}>{q.question}</Text>
                                {showAnswer && (
                                    <Text
                                        style={[
                                            styles.answerText,
                                            {
                                                color: "black",
                                                fontWeight: "600",
                                            },
                                        ]}
                                    >
                                        {q.answer}
                                    </Text>
                                )}
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>

            {/* Bottom Button */}
            <View
                style={{
                    padding: 16,
                    borderTopWidth: 1,
                    borderColor: "#eee",
                    backgroundColor: "white",
                }}
            >
                <Link href={"/dndq-answer"} asChild>
                    <Pressable
                        android_ripple={{ color: "#ccc", borderless: false }}
                        style={{
                            backgroundColor: "#2196F3",
                            padding: 16,
                            borderRadius: 12,
                            alignItems: "center",
                        }}
                    >
                        <Text
                            style={{
                                color: "white",
                                fontWeight: "bold",
                                fontSize: 16,
                            }}
                        >
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
    container: { padding: 16, flex: 1 },
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
    chipText: { color: "white", fontWeight: "600" },
    questions: { gap: 12 },
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
    dropZoneHovered: {
        borderColor: "#4f46e5",
        backgroundColor: "#eef2ff",
    },
    questionText: { fontSize: 16, fontWeight: "500", marginBottom: 6 },
    answerText: { fontSize: 14, color: "#6b7280" },
});
