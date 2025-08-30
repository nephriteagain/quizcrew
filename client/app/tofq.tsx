import { FlashList } from "@shopify/flash-list";
import React, { useState } from "react";
import { Pressable, Switch, Text, View } from "react-native";

import { TOF_QUESTIONS } from "@/lib/data";
import { Link } from "expo-router";

export default function TrueOrFalseQuestions() {
    const [showAnswer, setShowAnswer] = useState(false);
    const toggleSwitch = () => setShowAnswer((previousState) => !previousState);

    return (
        <View style={{ flex: 1, padding: 16, backgroundColor: "white" }}>
            {/* Sticky Header for Toggle */}
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    backgroundColor: "white",
                    zIndex: 10,
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

            {/* Questions List */}
            <FlashList
                data={TOF_QUESTIONS}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <View style={{ marginBottom: 24 }}>
                        {/* Question */}
                        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                            {index + 1}. {item.question}
                        </Text>
                        <View style={{ flexDirection: "row", width: "100%", columnGap: 12 }}>
                            {/* Choices: True / False */}
                            {["True", "False"].map((choice, cIndex) => {
                                const isCorrect =
                                    choice.toLowerCase() === String(item.answer).toLowerCase();
                                const shouldShowAnswer = showAnswer && isCorrect;

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
                                            flex: 1,
                                        }}
                                    >
                                        <Text style={{ fontSize: 14 }}>{choice}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                )}
            />

            {/* Bottom Button */}
            <View
                style={{
                    padding: 16,
                    borderTopWidth: 1,
                    borderColor: "#eee",
                    backgroundColor: "white",
                }}
            >
                <Link href={"/tofq-answer"} asChild>
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
