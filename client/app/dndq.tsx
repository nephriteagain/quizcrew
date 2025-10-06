import Container from "@/components/Container";
import SettingsBottomSheet from "@/components/SettingsBottomSheet";
import { AppTheme, useAppTheme } from "@/providers/ThemeProvider";
import reviewSelector from "@/store/review/review.store";
import { DragAndDropDoc } from "@/types/review";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { Link, useFocusEffect, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, {
    FadeInLeft,
    FadeOutLeft,
    LinearTransition,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

// Color palette for matching choices and answers
const colors = [
    { bg: "#E3F2FD", border: "#2196F3", text: "#1976D2" }, // Blue
    { bg: "#E8F5E9", border: "#4CAF50", text: "#388E3C" }, // Green
    { bg: "#FFF3E0", border: "#FF9800", text: "#F57C00" }, // Orange
    { bg: "#F3E5F5", border: "#9C27B0", text: "#7B1FA2" }, // Purple
    { bg: "#FFEBEE", border: "#F44336", text: "#D32F2F" }, // Red
    { bg: "#E0F2F1", border: "#009688", text: "#00695C" }, // Teal
    { bg: "#FFF8E1", border: "#FFC107", text: "#F9A825" }, // Amber
    { bg: "#FCE4EC", border: "#E91E63", text: "#C2185B" }, // Pink
];

export default function DragAndDropQuiz() {
    const theme = useAppTheme();
    const styles = makeStyles(theme);
    const navigation = useNavigation();

    const [showAnswer, setShowAnswer] = useState(false);
    const [individualAnswers, setIndividualAnswers] = useState<Set<number>>(new Set());
    const toggleSwitch = () => {
        setShowAnswer((previousState) => !previousState);
        setIndividualAnswers(new Set());
    };
    const params = useLocalSearchParams<{ quiz_id: string; quiz: string }>();
    const quiz_id = params.quiz_id;
    const quiz = params.quiz;
    const quizzes = reviewSelector.use.useQuizzes();
    const selectedQuiz = (quizzes.find((q) => q.quiz_id === quiz_id) || JSON.parse(quiz)) as
        | DragAndDropDoc
        | undefined;

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

    const getColorForAnswer = (answer: string) => {
        if (!selectedQuiz) return colors[0];
        const answerIndex = selectedQuiz.answers.indexOf(answer);
        return colors[answerIndex % colors.length];
    };

    const bottomSheetRef = useRef<BottomSheet>(null);
    const rotation = useSharedValue(0);
    // callbacks
    const handleSheetChanges = (index: number) => {
        if (index === -1) {
            // Bottom sheet is closing - spin back
            rotation.value = withTiming(0, { duration: 1_000 });
            // setQuizId(null);
        } else {
            // Bottom sheet is opening - spin forward
            rotation.value = withTiming(360, { duration: 1_000 });
        }
    };

    const handleSettingsPress = (quiz_id: string) => {
        bottomSheetRef.current?.expand();
    };

    const animatedIconStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value}deg` }],
        };
    });

    useFocusEffect(
        useCallback(() => {
            navigation.setOptions({
                headerRight: () => (
                    <TouchableOpacity
                        onPress={() => {
                            if (quiz_id) {
                                handleSettingsPress(quiz_id);
                            }
                        }}
                    >
                        <Animated.View style={animatedIconStyle}>
                            <Ionicons
                                name="settings-sharp"
                                size={24}
                                color={theme.colors.onSurface}
                            />
                        </Animated.View>
                    </TouchableOpacity>
                ),
            });
            return () => {
                navigation.setOptions({
                    headerRight: () => (
                        <TouchableOpacity>
                            <Animated.View style={animatedIconStyle}>
                                <Ionicons
                                    name="settings-sharp"
                                    size={24}
                                    color={theme.colors.onSurface}
                                />
                            </Animated.View>
                        </TouchableOpacity>
                    ),
                });
            };
        }, [navigation, theme, animatedIconStyle, quiz_id])
    );

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
            {/* Enhanced Questions Section */}
            <ScrollView
                style={styles.questionsScrollView}
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Enhanced Header Section */}
                <View style={styles.headerSection}>
                    <View style={styles.quizInfo}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="layers" size={24} color={theme.colors.primary} />
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
                            thumbColor={showAnswer ? theme.colors.onPrimary : theme.colors.surface}
                            ios_backgroundColor={theme.colors.outline}
                            onValueChange={toggleSwitch}
                            value={showAnswer}
                            style={styles.switch}
                        />
                    </View>
                </View>
                {/* Enhanced Answers Palette */}
                <View style={styles.answersSection}>
                    <View style={styles.answersSectionHeader}>
                        <Ionicons name="color-palette" size={20} color={theme.colors.primary} />
                        <Text style={styles.answersSectionTitle}>Answer Options</Text>
                    </View>
                    <View style={styles.answersScrollView}>
                        <View style={styles.answersRow}>
                            {selectedQuiz.answers.map((ans, index) => {
                                const isIndividuallyShown = individualAnswers.has(index);
                                const shouldShowAnswer = showAnswer || isIndividuallyShown;
                                return (
                                    <Animated.View
                                        key={ans}
                                        entering={
                                            shouldShowAnswer
                                                ? FadeInLeft.duration(150).delay(index * 50)
                                                : undefined
                                        }
                                        exiting={FadeOutLeft.duration(100)}
                                        layout={LinearTransition.duration(200)}
                                    >
                                        <Chip
                                            label={ans}
                                            color={
                                                shouldShowAnswer
                                                    ? colors[index % colors.length]
                                                    : undefined
                                            }
                                        />
                                    </Animated.View>
                                );
                            })}
                        </View>
                    </View>
                </View>

                <View style={styles.questions}>
                    {selectedQuiz.questions.map((q, idx) => {
                        const isIndividuallyShown = individualAnswers.has(idx);
                        const shouldShowAnswer = showAnswer || isIndividuallyShown;

                        return (
                            <Animated.View
                                key={idx}
                                style={styles.questionCard}
                                layout={LinearTransition.duration(200)}
                            >
                                <Pressable
                                    android_ripple={{
                                        color: theme.colors.surfaceVariant + "40",
                                        borderless: false,
                                    }}
                                    onPress={() => toggleIndividualAnswer(idx)}
                                    style={styles.questionPressable}
                                >
                                    <View style={styles.questionHeader}>
                                        <View style={styles.questionNumber}>
                                            <Text style={styles.questionNumberText}>{idx + 1}</Text>
                                        </View>
                                        <View style={styles.questionContent}>
                                            <Text style={styles.questionText}>{q.question}</Text>

                                            <View
                                                style={[
                                                    styles.tapHint,
                                                    showAnswer && { opacity: 0 },
                                                ]}
                                            >
                                                <Ionicons
                                                    name={shouldShowAnswer ? "eye-off" : "eye"}
                                                    size={14}
                                                    color={theme.colors.onSurfaceVariant}
                                                />
                                                <Text style={styles.tapHintText}>
                                                    Tap to {shouldShowAnswer ? "hide" : "reveal"}{" "}
                                                    answer
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

                                {shouldShowAnswer && (
                                    <Animated.View
                                        style={styles.answerSection}
                                        entering={FadeInLeft.duration(150).delay(
                                            showAnswer ? idx * 50 : 0
                                        )}
                                        exiting={FadeOutLeft.duration(100)}
                                    >
                                        <View style={styles.answerDivider} />
                                        <Pressable
                                            onPress={() => toggleIndividualAnswer(idx)}
                                            android_ripple={{
                                                color: getColorForAnswer(q.answer).border + "20",
                                                borderless: false,
                                            }}
                                        >
                                            <Animated.View
                                                style={[
                                                    styles.answerChip,
                                                    {
                                                        backgroundColor: getColorForAnswer(q.answer)
                                                            .bg,
                                                        borderColor: getColorForAnswer(q.answer)
                                                            .border,
                                                    },
                                                ]}
                                                entering={FadeInLeft.delay(
                                                    showAnswer ? idx * 50 + 25 : 0
                                                ).duration(150)}
                                            >
                                                <Text
                                                    style={[
                                                        styles.answerChipText,
                                                        { color: getColorForAnswer(q.answer).text },
                                                    ]}
                                                >
                                                    {q.answer}
                                                </Text>
                                            </Animated.View>
                                        </Pressable>
                                    </Animated.View>
                                )}
                            </Animated.View>
                        );
                    })}
                </View>
            </ScrollView>

            {/* Enhanced Footer */}
            <View style={styles.footerContainer}>
                <Link
                    href={{
                        pathname: "/dndq-answer",
                        params: {
                            quiz_id,
                            quiz: JSON.stringify(selectedQuiz),
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
            <SettingsBottomSheet
                ref={bottomSheetRef}
                quiz={selectedQuiz}
                onSheetChanges={handleSheetChanges}
            />
        </Container>
    );
}

function Chip({
    label,
    color,
}: {
    label: string;
    color?: { bg: string; border: string; text: string };
}) {
    const theme = useAppTheme();
    const styles = makeStyles(theme);

    return (
        <Animated.View
            style={[
                styles.chip,
                color && {
                    backgroundColor: color.bg,
                    borderColor: color.border,
                    shadowColor: theme.colors.onSurface,
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.15,
                    shadowRadius: 4,
                    elevation: 3,
                },
            ]}
            layout={LinearTransition.duration(200)}
        >
            <Text style={[styles.chipText, color && { color: color.text }]}>{label}</Text>
        </Animated.View>
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
            gap: 12,
        },
        quizInfo: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: theme.colors.surface,
            padding: 16,
            borderRadius: 16,
            shadowColor: theme.colors.onSurface,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
            gap: 16,
        },
        iconContainer: {
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: theme.colors.primaryContainer,
            alignItems: "center",
            justifyContent: "center",
        },
        quizDetails: {
            flex: 1,
            gap: 4,
        },
        quizTitle: {
            fontSize: 20,
            fontWeight: "700",
            color: theme.colors.onSurface,
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
            gap: 8,
        },
        toggleIcon: {},
        toggleText: {
            fontWeight: "600",
            fontSize: 16,
            color: theme.colors.onSurface,
            flex: 1,
        },
        switch: {},
        // Answers Section Styles
        answersSection: {
            backgroundColor: theme.colors.surface,
            borderRadius: 16,
            padding: 16,
            shadowColor: theme.colors.onSurface,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
            gap: 12,
        },
        answersSectionHeader: {
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
        },
        answersSectionTitle: {
            fontSize: 16,
            fontWeight: "600",
            color: theme.colors.onSurface,
        },
        answersContainer: {
            flexGrow: 1,
        },
        answersScrollView: {},
        answersRow: {
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
        },
        chip: {
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 25,
            borderWidth: 1,
            borderColor: theme.colors.outline,
            backgroundColor: theme.colors.surface,
        },
        chipText: {
            color: theme.colors.onSurfaceVariant,
            fontWeight: "600",
        },
        // Questions Section Styles
        questionsScrollView: {
            flex: 1,
        },
        scrollContainer: {
            gap: 16,
        },
        questions: {
            gap: 12,
        },
        questionCard: {
            backgroundColor: theme.colors.surface,
            borderRadius: 16,
            shadowColor: theme.colors.onSurface,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 4,
            overflow: "hidden",
        },
        questionPressable: {
            padding: 0,
        },
        questionHeader: {
            flexDirection: "row",
            alignItems: "center",
            padding: 20,
            gap: 16,
        },
        questionNumber: {
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: theme.colors.primaryContainer,
            alignItems: "center",
            justifyContent: "center",
        },
        questionNumberText: {
            fontSize: 16,
            fontWeight: "700",
            color: theme.colors.primary,
        },
        questionContent: {
            flex: 1,
            gap: 8,
        },
        questionText: {
            fontSize: 16,
            fontWeight: "600",
            color: theme.colors.onSurface,
            lineHeight: 24,
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
            rowGap: 12,
            paddingBottom: 12,
        },
        answerDivider: {
            height: 1,
            backgroundColor: theme.colors.outline + "30",
            marginHorizontal: 20,
        },
        answerChip: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            marginHorizontal: 20,
            borderRadius: 25,
            borderWidth: 1,
            shadowColor: theme.colors.onSurface,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 3,
        },
        answerChipText: {
            fontSize: 16,
            fontWeight: "700",
            textAlign: "center",
        },
        // Footer Styles
        footerContainer: {
            paddingTop: 20,
            paddingBottom: 8,
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
