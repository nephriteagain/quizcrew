import { FlashList } from "@shopify/flash-list";
import React, { useState } from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

import Container from "@/components/Container";
import { AppTheme, useAppTheme } from "@/providers/ThemeProvider";
import reviewSelector from "@/store/review/review.store";
import { MultipleChoiceQ } from "@/types/review";
import { Ionicons } from "@expo/vector-icons";
import { Link, useLocalSearchParams } from "expo-router";
import Animated, { FadeInLeft, FadeOutLeft, LinearTransition } from "react-native-reanimated";

export default function MultipleChoiceQuestions() {
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
    const selectedQuiz = quizzes.find((q) => q.quiz_id === quiz_id) as MultipleChoiceQ | undefined;

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
            <FlashList
                showsVerticalScrollIndicator={false}
                data={selectedQuiz.questions}
                keyExtractor={(q, index) =>
                    q.answer.valueOf() + JSON.stringify(q.question) + JSON.stringify(q.choices)
                }
                renderItem={({ item, index }) => {
                    const isIndividuallyShown = individualAnswers.has(index);
                    const shouldShowAnswer = showAnswer || isIndividuallyShown;

                    return (
                        <Animated.View
                            style={styles.questionCard}
                            layout={LinearTransition.duration(200)}
                        >
                            <Pressable
                                android_ripple={{
                                    color: theme.colors.surfaceVariant + "40",
                                    borderless: false,
                                }}
                                onPress={() => toggleIndividualAnswer(index)}
                                style={styles.questionPressable}
                            >
                                <View style={styles.questionHeader}>
                                    <View style={styles.questionNumber}>
                                        <Text style={styles.questionNumberText}>{index + 1}</Text>
                                    </View>
                                    <View style={styles.questionContent}>
                                        <Text style={styles.questionText}>{item.question}</Text>
                                        <View
                                            style={[styles.tapHint, showAnswer && { opacity: 0 }]}
                                        >
                                            <Ionicons
                                                name={shouldShowAnswer ? "eye-off" : "eye"}
                                                size={14}
                                                color={theme.colors.onSurfaceVariant}
                                            />
                                            <Text style={styles.tapHintText}>
                                                Tap to {shouldShowAnswer ? "hide" : "reveal"} answer
                                            </Text>
                                        </View>
                                    </View>
                                    <Ionicons
                                        name={shouldShowAnswer ? "chevron-up" : "chevron-down"}
                                        size={20}
                                        color={theme.colors.onSurfaceVariant}
                                    />
                                </View>
                            </Pressable>

                            <Animated.View
                                style={styles.answerSection}
                                entering={FadeInLeft.duration(150).delay(
                                    showAnswer ? index * 50 : 0
                                )}
                                exiting={FadeOutLeft.duration(100)}
                            >
                                <View style={styles.answerDivider} />
                                <View style={styles.choicesContainer}>
                                    {item.choices.map((choice: string, cIndex: number) => {
                                        const isCorrectChoice =
                                            choice === selectedQuiz.questions[index].answer;
                                        return (
                                            <Animated.View
                                                key={`${choice + item.question}`}
                                                entering={FadeInLeft.delay(
                                                    showAnswer
                                                        ? index * 50 + cIndex * 25
                                                        : cIndex * 25
                                                ).duration(150)}
                                            >
                                                <Pressable
                                                    style={[
                                                        styles.choiceContainer,
                                                        shouldShowAnswer &&
                                                            isCorrectChoice &&
                                                            styles.correctChoice,
                                                    ]}
                                                    onPress={() => {
                                                        if (
                                                            isIndividuallyShown &&
                                                            shouldShowAnswer &&
                                                            isCorrectChoice
                                                        ) {
                                                            toggleIndividualAnswer(index);
                                                        }
                                                    }}
                                                    android_ripple={{
                                                        color:
                                                            shouldShowAnswer && isCorrectChoice
                                                                ? theme.colors.secondary + "20"
                                                                : theme.colors.surfaceVariant +
                                                                  "20",
                                                        borderless: false,
                                                    }}
                                                >
                                                    <View style={styles.choiceContent}>
                                                        <Text style={styles.choiceLabel}>
                                                            {String.fromCharCode(65 + cIndex)}.
                                                        </Text>
                                                        <Text
                                                            style={[
                                                                styles.choiceText,
                                                                shouldShowAnswer &&
                                                                    isCorrectChoice &&
                                                                    styles.correctChoiceText,
                                                            ]}
                                                        >
                                                            {choice}
                                                        </Text>
                                                        {shouldShowAnswer && isCorrectChoice && (
                                                            <Ionicons
                                                                name="checkmark-circle"
                                                                size={20}
                                                                color={theme.colors.secondary}
                                                                style={styles.correctIcon}
                                                            />
                                                        )}
                                                    </View>
                                                </Pressable>
                                            </Animated.View>
                                        );
                                    })}
                                </View>
                            </Animated.View>
                        </Animated.View>
                    );
                }}
                ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
                ListHeaderComponent={() => (
                    <View style={styles.headerSection}>
                        <View style={styles.quizInfo}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="list" size={24} color={theme.colors.primary} />
                            </View>
                            <View style={styles.quizDetails}>
                                <Text style={styles.quizTitle}>{selectedQuiz.title}</Text>
                                <Text style={styles.questionCount}>{selectedQuiz.description}</Text>
                            </View>
                        </View>

                        <View style={styles.toggleCard}>
                            <Ionicons
                                name={showAnswer ? "eye-off" : "eye"}
                                size={20}
                                color={theme.colors.primary}
                                style={styles.toggleIcon}
                            />
                            <Text style={styles.toggleText}>
                                {showAnswer ? "Hide Answers" : "Show Answers"}
                            </Text>
                            <Switch
                                trackColor={{
                                    false: theme.colors.outline,
                                    true: theme.colors.primary,
                                }}
                                thumbColor={
                                    showAnswer ? theme.colors.onPrimary : theme.colors.surface
                                }
                                ios_backgroundColor={theme.colors.outline}
                                onValueChange={toggleSwitch}
                                value={showAnswer}
                                style={styles.switch}
                            />
                        </View>
                    </View>
                )}
            />
            {/* Enhanced Footer */}
            <View style={styles.footerContainer}>
                <Link
                    href={{
                        pathname: "/mcq-answer",
                        params: {
                            quiz_id,
                        },
                    }}
                    asChild
                >
                    <Pressable
                        android_ripple={{
                            color: theme.colors.onSecondary + "20",
                            borderless: false,
                        }}
                        style={styles.takeQuizButton}
                    >
                        <Ionicons name="play" size={20} color={theme.colors.onSecondary} />
                        <Text style={styles.takeQuizText}>Start Quiz</Text>
                        <Ionicons name="arrow-forward" size={18} color={theme.colors.onSecondary} />
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
        // Header Section Styles
        headerSection: {
            marginBottom: 8,
        },
        quizInfo: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: theme.colors.surface,
            padding: 16,
            borderRadius: 16,
            marginBottom: 12,
            shadowColor: theme.colors.onSurface,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
        },
        iconContainer: {
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: theme.colors.primaryContainer,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 16,
        },
        quizDetails: {
            flex: 1,
        },
        quizTitle: {
            fontSize: 20,
            fontWeight: "700",
            color: theme.colors.onSurface,
            marginBottom: 4,
        },
        questionCount: {
            fontSize: 14,
            color: theme.colors.onSurfaceVariant,
            fontWeight: "500",
        },
        toggleCard: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: theme.colors.surface,
            padding: 12,
            borderRadius: 12,
            shadowColor: theme.colors.onSurface,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
        },
        toggleIcon: {
            marginRight: 8,
        },
        toggleText: {
            fontWeight: "600",
            fontSize: 16,
            color: theme.colors.onSurface,
            flex: 1,
        },
        switch: {
            marginLeft: 8,
        },
        // Question Card Styles
        questionCard: {
            backgroundColor: theme.colors.surface,
            borderRadius: 16,
            marginVertical: 6,
            shadowColor: theme.colors.onSurface,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 4,
            overflow: "hidden",
        },
        itemSeparator: {
            height: 4,
        },
        questionPressable: {
            padding: 0,
        },
        questionHeader: {
            flexDirection: "row",
            alignItems: "center",
            padding: 20,
        },
        questionNumber: {
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: theme.colors.primaryContainer,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 16,
        },
        questionNumberText: {
            fontSize: 16,
            fontWeight: "700",
            color: theme.colors.primary,
        },
        questionContent: {
            flex: 1,
        },
        questionText: {
            fontSize: 16,
            fontWeight: "600",
            color: theme.colors.onSurface,
            lineHeight: 24,
            marginBottom: 8,
        },
        tapHint: {
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
        },
        tapHintText: {
            fontSize: 12,
            color: theme.colors.onSurfaceVariant,
            fontStyle: "italic",
        },
        answerSection: {
            paddingHorizontal: 0,
        },
        answerDivider: {
            height: 1,
            backgroundColor: theme.colors.outline + "30",
            marginHorizontal: 20,
        },
        choicesContainer: {
            paddingHorizontal: 20,
            paddingVertical: 12,
            gap: 8,
        },
        choiceContainer: {
            flexDirection: "row",
            alignItems: "center",
            padding: 16,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.colors.outline + "40",
            backgroundColor: theme.colors.surface,
        },
        correctChoice: {
            borderColor: theme.colors.secondary + "60",
            backgroundColor: theme.colors.secondaryContainer + "40",
        },
        choiceContent: {
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
        },
        choiceLabel: {
            fontSize: 16,
            fontWeight: "700",
            color: theme.colors.primary,
            marginRight: 12,
            width: 24,
        },
        choiceText: {
            fontSize: 14,
            color: theme.colors.onSurface,
            flex: 1,
            lineHeight: 22,
        },
        correctChoiceText: {
            color: theme.colors.secondary,
            fontWeight: "600",
        },
        correctIcon: {
            marginLeft: 8,
        },
        // Footer Styles
        footerContainer: {
            paddingTop: 20,
            paddingBottom: 8,
        },
        footerInfo: {
            backgroundColor: theme.colors.surface,
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            shadowColor: theme.colors.onSurface,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
        },
        statsRow: {
            flexDirection: "row",
            justifyContent: "space-around",
        },
        statItem: {
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
        },
        statText: {
            fontSize: 14,
            fontWeight: "600",
            color: theme.colors.onSurfaceVariant,
        },
        takeQuizButton: {
            flexDirection: "row",
            backgroundColor: theme.colors.secondary,
            padding: 18,
            borderRadius: 16,
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            shadowColor: theme.colors.secondary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6,
        },
        takeQuizText: {
            color: theme.colors.onSecondary,
            fontWeight: "700",
            fontSize: 18,
        },
    });
