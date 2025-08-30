import { QuizResultModal } from "@/components/QuizResultModal";
import { FlashList, FlashListRef } from "@shopify/flash-list";
import { cloneDeep, debounce } from "lodash";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Dimensions, Pressable, Text, TouchableOpacity, View } from "react-native";

import Card from "@/components/Card";
import { TOF_QUESTIONS } from "@/lib/data";

const { width } = Dimensions.get("window");

export default function TrueOrFalseQuestionsAns() {
    const listRef = useRef<FlashListRef<any>>(null);
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [resultModalVisible, setResultModalVisible] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    /** only enable submission when all questions are answered */
    const isSubmitEnabled = useMemo(
        () => Object.keys(answers).length === TOF_QUESTIONS.length,
        [answers]
    );

    const score = useMemo(() => {
        let total = 0;
        for (let i = 0; i < TOF_QUESTIONS.length; ++i) {
            const q = TOF_QUESTIONS[i];
            const correctAns = q.answer ? "True" : "False";
            const userAnswer = answers[i];
            if (correctAns === userAnswer) {
                total += 1;
            }
        }
        return total;
    }, [answers]);

    const totalQuestion = useMemo(() => TOF_QUESTIONS.length, []);

    const handleSelect = useCallback(
        (questionIndex: number, choice: string) => {
            const prevAnswer = answers[questionIndex];
            if (prevAnswer === choice) {
                const clone = cloneDeep(answers);
                delete clone[questionIndex];
                setAnswers(clone);
            } else {
                setAnswers((prev) => ({
                    ...prev,
                    [questionIndex]: choice,
                }));

                // ✅ auto-scroll to next question if not last
                if (!listRef.current) return;
                const delayedScrollToIndex = debounce(listRef?.current?.scrollToIndex, 100);
                if (questionIndex < TOF_QUESTIONS.length - 1) {
                    delayedScrollToIndex({
                        index: questionIndex + 1,
                        animated: true,
                    });
                }
            }
        },
        [setAnswers, answers]
    );

    const handleSubmit = useCallback(() => {
        setResultModalVisible(true);
        setIsSubmitted(true);
    }, []);

    const handleReset = useCallback(() => {
        setIsSubmitted(false);
        setAnswers({});
        listRef.current?.scrollToIndex({ index: 0, animated: true });
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            {/* TOF QUESTIONS list */}
            <FlashList
                ref={listRef}
                style={{ flex: 1 }}
                key={"horizontal"}
                data={TOF_QUESTIONS}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <View
                        style={{
                            width: width,
                            justifyContent: "center",
                            padding: 20,
                        }}
                    >
                        <Card>
                            {/* Question */}
                            <Text
                                style={{
                                    fontSize: 20,
                                    fontWeight: "bold",
                                    marginBottom: 20,
                                    textAlign: "center",
                                }}
                            >
                                {index + 1}. {item.question}
                            </Text>

                            {/* Choices: True / False */}
                            {["True", "False"].map((choice, cIndex) => {
                                const selected = answers[index] === choice;
                                const correctAnswer = item.answer ? "True" : "False";
                                const isIncorrect =
                                    isSubmitted &&
                                    choice === correctAnswer &&
                                    answers[index] !== correctAnswer;

                                return (
                                    <TouchableOpacity
                                        disabled={isSubmitted}
                                        key={cIndex}
                                        onPress={() => handleSelect(index, choice)}
                                        style={[
                                            {
                                                padding: 16,
                                                marginVertical: 8,
                                                borderRadius: 12,
                                                borderWidth: 2,
                                                borderColor: selected ? "#2196F3" : "#ddd",
                                                backgroundColor: selected ? "#E3F2FD" : "#fff",
                                            },
                                            isIncorrect && {
                                                borderColor: "#b44422ff",
                                                backgroundColor: "#e0c2b5ff",
                                            },
                                        ]}
                                    >
                                        <Text style={{ fontSize: 16, textAlign: "center" }}>
                                            {choice}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </Card>
                    </View>
                )}
            />

            {/* Submit button */}
            <View
                style={{
                    padding: 16,
                    borderTopWidth: 1,
                    borderColor: "#eee",
                    backgroundColor: "white",
                }}
            >
                {!isSubmitted && (
                    <Pressable
                        android_ripple={
                            isSubmitEnabled ? { color: "#ccc", borderless: false } : null
                        }
                        style={{
                            backgroundColor: "#2196F3",
                            padding: 16,
                            borderRadius: 12,
                            alignItems: "center",
                        }}
                        onPress={handleSubmit}
                        disabled={!isSubmitEnabled}
                    >
                        <Text
                            style={{
                                color: "white",
                                fontWeight: "bold",
                                fontSize: 16,
                                opacity: isSubmitEnabled ? 1 : 0.6,
                            }}
                        >
                            Submit ({Object.keys(answers).length}/{TOF_QUESTIONS.length})
                        </Text>
                    </Pressable>
                )}
                {isSubmitted && (
                    <Pressable
                        android_ripple={{ color: "#b8d418ff", borderless: false }}
                        style={{
                            backgroundColor: "#c58142ff",
                            padding: 16,
                            borderRadius: 12,
                            alignItems: "center",
                        }}
                        onPress={handleReset}
                    >
                        <Text
                            style={{
                                color: "white",
                                fontWeight: "bold",
                                fontSize: 16,
                            }}
                        >
                            TRY AGAIN ({score}/{TOF_QUESTIONS.length})
                        </Text>
                    </Pressable>
                )}
            </View>

            {/* Results modal */}
            <QuizResultModal
                visible={resultModalVisible}
                onClose={() => setResultModalVisible(false)}
                score={score}
                totalQuestion={totalQuestion}
            />
        </View>
    );
}
