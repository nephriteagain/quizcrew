import { QuizResultModal } from "@/components/QuizResultModal";
import { FlashList, FlashListRef } from "@shopify/flash-list";
import { cloneDeep, debounce } from "lodash";
import React, { useRef, useState } from "react";
import { Dimensions, Pressable, Text, TouchableOpacity, View } from "react-native";

import Card from "@/components/Card";
import Container from "@/components/Container";
import { StartQuizModal } from "@/components/StartQuizModal";
import { useBeforeRemove } from "@/hooks/useBeforeRemove";
import { useAppTheme } from "@/providers/ThemeProvider";
import reviewSelector from "@/store/review/review.store";
import { MultipleChoiceQ } from "@/types/review";
import { useLocalSearchParams } from "expo-router";

const { width } = Dimensions.get("window");

export default function MultipleChoiceQuestionsAns() {
    const theme = useAppTheme();
    const listRef = useRef<FlashListRef<any>>(null);
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    /**only enable answer submission when user answers every choice */

    const [resultModalVisible, setResultModalVisible] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const params = useLocalSearchParams<{ quiz_id: string }>();
    const quiz_id = params.quiz_id;
    const quizzes = reviewSelector.use.useQuizzes();
    const selectedQuiz = quizzes.find((q) => q.quiz_id === quiz_id) as MultipleChoiceQ | undefined;

    const MULTIPLE_CHOICE_QUESTIONS = selectedQuiz?.questions || [];

    const isSubmitEnabled = Object.keys(answers).length === MULTIPLE_CHOICE_QUESTIONS.length;

    const score = (() => {
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
    })();

    const totalQuestion = MULTIPLE_CHOICE_QUESTIONS.length;

    // Back button confirmation hook
    const { ConfirmationModal } = useBeforeRemove({
        shouldShowConfirmation: () => !isSubmitted && Object.keys(answers).length > 0,
    });

    const handleSelect = (questionIndex: number, choice: string) => {
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

    if (!quiz_id) {
        return (
            <View
                style={{
                    flex: 1,
                    padding: 16,
                    backgroundColor: theme.colors.surface,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Text style={{ color: theme.colors.onSurface }}>Invalid Quiz Id</Text>
            </View>
        );
    }

    if (!selectedQuiz) {
        return (
            <View
                style={{
                    flex: 1,
                    padding: 16,
                    backgroundColor: theme.colors.surface,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Text style={{ color: theme.colors.onSurface }}>Quiz not found.</Text>
            </View>
        );
    }

    return (
        <Container style={{ flex: 1 }}>
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
                                    color: theme.colors.onSurface,
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
                                                borderColor: selected
                                                    ? theme.colors.secondary
                                                    : theme.colors.outline,
                                                backgroundColor: selected
                                                    ? theme.colors.secondaryContainer
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
                                                    ? theme.colors.onSecondaryContainer
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

            {/* Submit button at bottom */}
            <View
                style={{
                    padding: 16,
                    borderTopWidth: 1,
                    borderColor: theme.colors.outlineVariant,
                    backgroundColor: theme.colors.surface,
                }}
            >
                {!isSubmitted && (
                    <Pressable
                        android_ripple={
                            isSubmitEnabled ? { color: "#ccc", borderless: false } : null
                        }
                        style={{
                            backgroundColor: theme.colors.secondary,
                            padding: 16,
                            borderRadius: 12,
                            alignItems: "center",
                        }}
                        onPress={handleSubmit}
                        disabled={!isSubmitEnabled}
                    >
                        <Text
                            style={{
                                color: theme.colors.onSecondary,
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
                            isSubmitEnabled ? { color: "#631d76", borderless: false } : null
                        }
                        style={{
                            backgroundColor: theme.colors.primary,
                            padding: 16,
                            borderRadius: 12,
                            alignItems: "center",
                        }}
                        onPress={handleReset}
                    >
                        <Text
                            style={{
                                color: theme.colors.onPrimary,
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

            {/* Back Button Confirmation Modal */}
            <ConfirmationModal
                title="Exit Quiz?"
                description={`You have answered ${Object.keys(answers).length} out of ${MULTIPLE_CHOICE_QUESTIONS.length} questions. Your progress will be lost if you exit.`}
                cancelText="Continue Quiz"
                confirmText="Exit Quiz"
            />
            <StartQuizModal
                title={selectedQuiz.title}
                description={selectedQuiz.description}
                totalQuestions={totalQuestion}
            />
        </Container>
    );
}
