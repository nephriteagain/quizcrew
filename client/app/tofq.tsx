import reviewSelector from "@/store/review/review.store";
import { TrueOrFalseQ } from "@/types/review";
import { FlashList } from "@shopify/flash-list";
import { Link, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import Animated, { FadeInLeft, FadeOutLeft, LinearTransition } from "react-native-reanimated";

export default function TrueOrFalseQuestions() {
    const [showAnswer, setShowAnswer] = useState(false);
    const [individualAnswers, setIndividualAnswers] = useState<Set<number>>(new Set());
    const toggleSwitch = () => {
        setShowAnswer((previousState) => !previousState);
        setIndividualAnswers(new Set());
    };

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
    const params = useLocalSearchParams<{ quiz_id: string }>();
    const quiz_id = params.quiz_id;
    const quizzes = reviewSelector.use.quizzes();
    const selectedQuiz = quizzes.find((q) => q.quiz_id === quiz_id) as TrueOrFalseQ | undefined;

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
            <View style={styles.toggleContainer}>
                <Text style={styles.toggleText}>Show All Answers</Text>
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
                keyExtractor={(q) => q.answer.valueOf() + q.question.valueOf()}
                renderItem={({ item, index }) => {
                    const isIndividuallyShown = individualAnswers.has(index);
                    const shouldShowAnswer = showAnswer || isIndividuallyShown;

                    return (
                        <Animated.View
                            style={styles.questionContainer}
                            layout={LinearTransition.springify().damping(15).stiffness(100)}
                        >
                            <Pressable
                                android_ripple={{
                                    color: "#f0f0f0",
                                }}
                                onLongPress={() => toggleIndividualAnswer(index)}
                                style={styles.questionPressable}
                            >
                                <Text style={styles.questionText}>
                                    {index + 1}. {item.question}
                                </Text>
                            </Pressable>
                            {shouldShowAnswer && (
                                <Animated.View
                                    style={styles.choicesRow}
                                    entering={FadeInLeft.duration(300)
                                        .springify()
                                        .delay(showAnswer ? index * 150 : 0)}
                                    exiting={FadeOutLeft.duration(200)}
                                >
                                    <Pressable
                                        onPress={() => {
                                            toggleIndividualAnswer(index);
                                        }}
                                    >
                                        <Animated.View
                                            style={[
                                                styles.choiceContainer,
                                                item.answer
                                                    ? styles.answerTrue
                                                    : styles.answerFalse,
                                            ]}
                                            entering={FadeInLeft.delay(
                                                showAnswer ? index * 150 + 150 : 0
                                            ).duration(300)}
                                        >
                                            <Text style={styles.choiceText}>
                                                {item.answer ? "True" : "False"}
                                            </Text>
                                        </Animated.View>
                                    </Pressable>
                                </Animated.View>
                            )}
                        </Animated.View>
                    );
                }}
                ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
            />

            <View style={styles.footerContainer}>
                <Link
                    href={{
                        pathname: "/tofq-answer",
                        params: {
                            quiz_id,
                        },
                    }}
                    asChild
                >
                    <Pressable
                        android_ripple={{ color: "#ccc", borderless: false }}
                        style={styles.takeQuizButton}
                    >
                        <Text style={styles.takeQuizText}>Take the Quiz</Text>
                    </Pressable>
                </Link>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "white",
    },
    errorContainer: {
        flex: 1,
        padding: 16,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
    },
    toggleContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        backgroundColor: "white",
        zIndex: 10,
    },
    toggleText: {
        fontWeight: "600",
        fontSize: 16,
    },
    questionContainer: {},
    itemSeparator: {
        height: 8,
    },
    questionPressable: {
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: "rgba(0,0,0,0.02)",
        marginBottom: 4,
    },
    questionText: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 0,
    },
    choicesRow: {
        flexDirection: "row",
        width: "100%",
    },
    choiceContainer: {
        padding: 8,
        marginVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        width: 100,
        alignItems: "center",
        marginLeft: 14,
    },
    answerTrue: {
        borderColor: "#4CAF50",
        backgroundColor: "#E8F5E9",
    },
    answerFalse: {
        borderColor: "#F44336",
        backgroundColor: "#FFEBEE",
    },
    choiceText: {
        fontSize: 14,
        fontWeight: "600",
    },
    footerContainer: {
        padding: 16,
        borderTopWidth: 1,
        borderColor: "#eee",
        backgroundColor: "white",
    },
    takeQuizButton: {
        backgroundColor: "#2196F3",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
    },
    takeQuizText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
});
