import Container from "@/components/Container";
import { AppTheme, useAppTheme } from "@/providers/ThemeProvider";
import reviewSelector from "@/store/review/review.store";
import { TrueOrFalseQ } from "@/types/review";
import { FlashList } from "@shopify/flash-list";
import { Link, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import Animated, { FadeInLeft, FadeOutLeft, LinearTransition } from "react-native-reanimated";

export default function TrueOrFalseQuestions() {
    const theme = useAppTheme();
    const styles = makeStyles(theme);
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
    const quizzes = reviewSelector.use.useQuizzes();
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
        <Container style={styles.container}>
            <View style={styles.toggleContainer}>
                <Text style={styles.toggleText}>
                    {showAnswer ? "Hide All Answers" : "Show All Answers"}
                </Text>
                <Switch
                    trackColor={{ false: theme.colors.outline, true: theme.colors.primary }}
                    thumbColor={showAnswer ? theme.colors.onPrimary : theme.colors.surface}
                    ios_backgroundColor={theme.colors.outline}
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
                                    color: theme.colors.surfaceVariant,
                                }}
                                onPress={() => toggleIndividualAnswer(index)}
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
        </Container>
    );
}

const makeStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            padding: 16,
        },
        errorContainer: {
            flex: 1,
            padding: 16,
            backgroundColor: theme.colors.surface,
            alignItems: "center",
            justifyContent: "center",
        },
        toggleContainer: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            backgroundColor: theme.colors.surface,
            zIndex: 10,
        },
        toggleText: {
            fontWeight: "600",
            fontSize: 16,
            color: theme.colors.onSurface,
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
            color: theme.colors.onSurface,
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
            borderColor: theme.colors.secondary,
            backgroundColor: theme.colors.secondaryContainer,
        },
        answerFalse: {
            borderColor: theme.colors.error,
            backgroundColor: theme.colors.errorContainer,
        },
        choiceText: {
            fontSize: 14,
            fontWeight: "600",
            color: theme.colors.onSurface,
        },
        footerContainer: {
            padding: 16,
            borderTopWidth: 1,
            borderColor: theme.colors.outline,
            backgroundColor: theme.colors.surface,
        },
        takeQuizButton: {
            backgroundColor: theme.colors.tertiary,
            padding: 16,
            borderRadius: 12,
            alignItems: "center",
        },
        takeQuizText: {
            color: theme.colors.onTertiary,
            fontWeight: "bold",
            fontSize: 16,
        },
    });
