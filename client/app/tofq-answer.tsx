import { QuizResultModal } from "@/components/QuizResultModal";
import { FlashList, FlashListRef } from "@shopify/flash-list";
import { cloneDeep, debounce } from "lodash";
import React, { useRef, useState } from "react";
import { Dimensions, Pressable, Text, TouchableOpacity, View } from "react-native";

import Card from "@/components/Card";
import Container from "@/components/Container";
import { StartQuizModal } from "@/components/StartQuizModal";
import { useAppTheme } from "@/providers/ThemeProvider";
import reviewSelector from "@/store/review/review.store";
import { TrueOrFalseQ } from "@/types/review";
import { useLocalSearchParams } from "expo-router";

const { width } = Dimensions.get("window");

export default function TrueOrFalseQuestionsAns() {
    const theme = useAppTheme();
    const listRef = useRef<FlashListRef<any>>(null);
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [resultModalVisible, setResultModalVisible] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const params = useLocalSearchParams<{ quiz_id: string }>();
    const quiz_id = params.quiz_id;
    const quizzes = reviewSelector.use.useQuizzes();
    const selectedQuiz = quizzes.find((q) => q.quiz_id === quiz_id) as TrueOrFalseQ | undefined;

    const TOF_QUESTIONS = selectedQuiz?.questions || [];

    /** only enable submission when all questions are answered */
    const isSubmitEnabled = Object.keys(answers).length === TOF_QUESTIONS.length;

    const score = (() => {
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
    })();

    const totalQuestion = TOF_QUESTIONS.length;

    const handleSelect = (questionIndex: number, choice: string) => {
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
    };

    const handleSubmit = () => {
        setResultModalVisible(true);
        setIsSubmitted(true);
    };

    const handleReset = () => {
        setIsSubmitted(false);
        setAnswers({});
        listRef.current?.scrollToIndex({ index: 0, animated: true });
    };

    return (
        <Container style={{ flex: 1 }}>
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
                                    color: theme.colors.onSurface,
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
                                                borderColor: selected
                                                    ? theme.colors.tertiary
                                                    : theme.colors.outline,
                                                backgroundColor: selected
                                                    ? theme.colors.tertiaryContainer
                                                    : theme.colors.surface,
                                            },
                                            isIncorrect && {
                                                borderColor: theme.colors.error,
                                                backgroundColor: theme.colors.errorContainer,
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                textAlign: "center",
                                                color: selected
                                                    ? theme.colors.onTertiaryContainer
                                                    : theme.colors.onSurface,
                                            }}
                                        >
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
                }}
            >
                {!isSubmitted && (
                    <Pressable
                        android_ripple={
                            isSubmitEnabled ? { color: "#ccc", borderless: false } : null
                        }
                        style={{
                            backgroundColor: theme.colors.tertiary,
                            padding: 16,
                            borderRadius: 12,
                            alignItems: "center",
                        }}
                        onPress={handleSubmit}
                        disabled={!isSubmitEnabled}
                    >
                        <Text
                            style={{
                                color: theme.colors.onTertiary,
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
                        android_ripple={{ color: "#631d76", borderless: false }}
                        style={{
                            backgroundColor: theme.colors.secondary,
                            padding: 16,
                            borderRadius: 12,
                            alignItems: "center",
                        }}
                        onPress={handleReset}
                    >
                        <Text
                            style={{
                                color: theme.colors.onSecondary,
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
            <StartQuizModal
                title={selectedQuiz?.title ?? ""}
                description={selectedQuiz?.description ?? ""}
                totalQuestions={totalQuestion}
            />
        </Container>
    );
}
