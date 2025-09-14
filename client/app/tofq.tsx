import Container from "@/components/Container";
import { AppTheme, useAppTheme } from "@/providers/ThemeProvider";
import reviewSelector from "@/store/review/review.store";
import { TrueOrFalseQ } from "@/types/review";
import { Ionicons } from "@expo/vector-icons";
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
            <FlashList
                showsVerticalScrollIndicator={false}
                data={selectedQuiz.questions}
                keyExtractor={(q) => q.answer.valueOf() + q.question.valueOf()}
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
                                        {!shouldShowAnswer && (
                                            <View style={styles.tapHint}>
                                                <Ionicons
                                                    name="eye"
                                                    size={14}
                                                    color={theme.colors.onSurfaceVariant}
                                                />
                                                <Text style={styles.tapHintText}>
                                                    Tap to reveal answer
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                    <Ionicons
                                        name={shouldShowAnswer ? "chevron-up" : "chevron-down"}
                                        size={20}
                                        color={theme.colors.onSurfaceVariant}
                                    />
                                </View>
                            </Pressable>

                            {shouldShowAnswer && (
                                <Animated.View
                                    style={styles.answerSection}
                                    entering={FadeInLeft.duration(150).delay(
                                        showAnswer ? index * 50 : 0
                                    )}
                                    exiting={FadeOutLeft.duration(100)}
                                >
                                    <View style={styles.answerDivider} />
                                    <Pressable
                                        onPress={() => {
                                            toggleIndividualAnswer(index);
                                        }}
                                        android_ripple={{
                                            color: item.answer
                                                ? theme.colors.secondary + "20"
                                                : theme.colors.error + "20",
                                            borderless: false,
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
                                                showAnswer ? index * 50 + 25 : 0
                                            ).duration(150)}
                                        >
                                            <Ionicons
                                                name={
                                                    item.answer
                                                        ? "checkmark-circle"
                                                        : "close-circle"
                                                }
                                                size={20}
                                                color={
                                                    item.answer
                                                        ? theme.colors.secondary
                                                        : theme.colors.error
                                                }
                                                style={styles.answerIcon}
                                            />
                                            <Text
                                                style={[
                                                    styles.choiceText,
                                                    {
                                                        color: item.answer
                                                            ? theme.colors.secondary
                                                            : theme.colors.error,
                                                    },
                                                ]}
                                            >
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
                ListHeaderComponent={() => (
                    <View style={styles.headerSection}>
                        <View style={styles.quizInfo}>
                            <View style={styles.iconContainer}>
                                <Ionicons
                                    name="help-circle"
                                    size={24}
                                    color={theme.colors.primary}
                                />
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
                        pathname: "/tofq-answer",
                        params: {
                            quiz_id,
                        },
                    }}
                    asChild
                >
                    <Pressable
                        android_ripple={{
                            color: theme.colors.onTertiary + "20",
                            borderless: false,
                        }}
                        style={styles.takeQuizButton}
                    >
                        <Ionicons name="play" size={20} color={theme.colors.onTertiary} />
                        <Text style={styles.takeQuizText}>Start Quiz</Text>
                        <Ionicons name="arrow-forward" size={18} color={theme.colors.onTertiary} />
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
        choiceContainer: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            marginHorizontal: 20,
            marginVertical: 12,
            borderRadius: 12,
            gap: 8,
        },
        answerIcon: {
            marginRight: 4,
        },
        answerTrue: {
            backgroundColor: theme.colors.secondaryContainer + "60",
            borderWidth: 1,
            borderColor: theme.colors.secondary + "40",
        },
        answerFalse: {
            backgroundColor: theme.colors.errorContainer + "60",
            borderWidth: 1,
            borderColor: theme.colors.error + "40",
        },
        choiceText: {
            fontSize: 16,
            fontWeight: "700",
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
            backgroundColor: theme.colors.tertiary,
            padding: 18,
            borderRadius: 16,
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            shadowColor: theme.colors.tertiary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6,
        },
        takeQuizText: {
            color: theme.colors.onTertiary,
            fontWeight: "700",
            fontSize: 18,
        },
    });
