import { FlashList } from "@shopify/flash-list";
import React, { useState } from "react";
import { Pressable, Switch, Text, View } from "react-native";

import reviewSelector from "@/store/review/review.store";
import { MultipleChoiceQ } from "@/types/review";
import { Link, useLocalSearchParams } from "expo-router";

export default function MultipleChoiceQuestions() {
    const [showAnswer, setShowAnswer] = useState(false);
    const toggleSwitch = () => setShowAnswer((previousState) => !previousState);
    const params = useLocalSearchParams<{ quiz_id: string }>();
    const quiz_id = params.quiz_id;
    const quizzes = reviewSelector.use.quizzes();
    const selectedQuiz = quizzes.find((q) => q.quiz_id === quiz_id) as MultipleChoiceQ | undefined;

    if (!quiz_id) {
        return (
            <View
                style={{
                    flex: 1,
                    padding: 16,
                    backgroundColor: "white",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Text>Invalid Quiz Id</Text>
            </View>
        );
    }

    if (!selectedQuiz) {
        return (
            <View
                style={{
                    flex: 1,
                    padding: 16,
                    backgroundColor: "white",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Text>Quiz not found.</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, padding: 16, backgroundColor: "white" }}>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    backgroundColor: "white", // 👈 important, otherwise it may look like it's not sticking
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
            <FlashList
                data={selectedQuiz.questions}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <View style={{ marginBottom: 24 }}>
                        {/* Question */}
                        <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 12 }}>
                            {index + 1}. {item.question}
                        </Text>

                        {/* Choices */}
                        {item.choices.map((choice: string, cIndex: number) => {
                            const shouldShowAnswer =
                                showAnswer && choice === selectedQuiz.questions[index].answer;
                            return (
                                <View
                                    key={cIndex}
                                    style={{
                                        padding: 12,
                                        marginVertical: 6,
                                        borderRadius: 8,
                                        borderWidth: 1,
                                        borderColor: shouldShowAnswer ? "#4CAF50" : "#ccc",
                                        backgroundColor: shouldShowAnswer ? "#E8F5E9" : "#fff",
                                    }}
                                >
                                    <Text style={{ fontSize: 14 }}>{choice}</Text>
                                </View>
                            );
                        })}
                    </View>
                )}
            />
            <View
                style={{
                    padding: 16,
                    borderTopWidth: 1,
                    borderColor: "#eee",
                    backgroundColor: "white",
                }}
            >
                <Link href={"/mcq-answer"} asChild>
                    <Pressable
                        android_ripple={{ color: "#ccc", borderless: false }}
                        style={{
                            backgroundColor: "#4CAF50",
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
