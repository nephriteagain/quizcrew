import { QuizResultModal } from "@/components/QuizResultModal";
import { FlashList, FlashListRef } from "@shopify/flash-list";
import { cloneDeep, debounce } from "lodash";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Dimensions, Pressable, Text, TouchableOpacity, View } from "react-native";

import Card from "@/components/Card";
import reviewSelector from "@/store/review/review.store";
import { MultipleChoiceQ } from "@/types/review";
import { useLocalSearchParams } from "expo-router";

const { width } = Dimensions.get("window");

export default function MultipleChoiceQuestionsAns() {
    const listRef = useRef<FlashListRef<any>>(null);
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    /**only enable answer submission when user answers every choice */

    const [resultModalVisible, setResultModalVisible] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const params = useLocalSearchParams<{ quiz_id: string }>();
    const quiz_id = params.quiz_id;
    const quizzes = reviewSelector.use.quizzes();
    const selectedQuiz = quizzes.find((q) => q.quiz_id === quiz_id) as MultipleChoiceQ | undefined;

    const MULTIPLE_CHOICE_QUESTIONS = useMemo(() => {
        if (!selectedQuiz) return [];
        return selectedQuiz.questions;
    }, [selectedQuiz]);

    const isSubmitEnabled = useMemo(
        () => Object.keys(answers).length === MULTIPLE_CHOICE_QUESTIONS.length,
        [answers]
    );

    const score = useMemo(() => {
        let total: number = 0;
        for (let i = 0; i < MULTIPLE_CHOICE_QUESTIONS.length; ++i) {
            const q = MULTIPLE_CHOICE_QUESTIONS[i];
            const correctAns = q.answer;
            const userAnswer = answers[i];
            if (correctAns === userAnswer) {
                total += 1;
            }
        }
        return total;
    }, [answers]);

    const totalQuestion = useMemo(
        () => MULTIPLE_CHOICE_QUESTIONS.length,
        [MULTIPLE_CHOICE_QUESTIONS]
    );

    const handleSelect = useCallback(
        (questionIndex: number, choice: string) => {
            const prevAnswer = answers[questionIndex];
            if (prevAnswer === choice) {
                const clone = cloneDeep(answers);
                // unset previouse choice
                delete clone[questionIndex];
                setAnswers(clone);
            } else {
                setAnswers((prev) => ({
                    ...prev,
                    [questionIndex]: choice,
                }));

                // ✅ auto-scroll to next question if not the last
                if (!listRef.current) return;
                const delayedScrollToIndex = debounce(listRef?.current?.scrollToIndex, 100);
                if (questionIndex < MULTIPLE_CHOICE_QUESTIONS.length - 1) {
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
    }, [setResultModalVisible]);

    const handleReset = useCallback(() => {
        setIsSubmitted(false);
        setAnswers({});
        listRef.current?.scrollToIndex({ index: 0, animated: true });
    }, [setIsSubmitted]);

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            {/* MULTIPLE_CHOICE_QUESTIONS list */}
            <FlashList
                ref={listRef}
                style={{ flex: 1 }}
                key={"horizontal"}
                data={MULTIPLE_CHOICE_QUESTIONS}
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
                        {/* Flashcard container */}
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

                            {/* Choices */}
                            {item.choices.map((choice: string, cIndex: number) => {
                                const selected = answers[index] === choice;
                                const isIncorrect =
                                    isSubmitted &&
                                    choice !== answers[index] &&
                                    MULTIPLE_CHOICE_QUESTIONS[index].answer === choice;
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
                                                borderColor: selected ? "#4CAF50" : "#ddd",
                                                backgroundColor: selected ? "#E8F5E9" : "#fff",
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

            {/* Submit button at bottom */}
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
                            backgroundColor: "#4CAF50",
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
                            Submit ({Object.keys(answers).length}/{MULTIPLE_CHOICE_QUESTIONS.length}
                            )
                        </Text>
                    </Pressable>
                )}
                {isSubmitted && (
                    <Pressable
                        android_ripple={
                            isSubmitEnabled ? { color: "#b8d418ff", borderless: false } : null
                        }
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
                            TRY AGAIN ({score}/{MULTIPLE_CHOICE_QUESTIONS.length})
                        </Text>
                    </Pressable>
                )}
            </View>
            <QuizResultModal
                visible={resultModalVisible}
                onClose={() => setResultModalVisible(false)}
                score={score}
                totalQuestion={totalQuestion}
            />
        </View>
    );
}
