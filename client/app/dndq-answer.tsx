// app/DragAndDropQuiz.tsx
import Card from "@/components/Card";
import Container from "@/components/Container";
import { QuizResultModal } from "@/components/QuizResultModal";
import { WIDTH } from "@/constants/values";
import { fontSizeScaler } from "@/lib/utils/fontSizeScaler";
import { AppTheme, useAppTheme } from "@/providers/ThemeProvider";
import reviewSelector from "@/store/review/review.store";
import { DragAndDrop } from "@/types/review";
import { AntDesign } from "@expo/vector-icons";
import { FlashList, FlashListRef } from "@shopify/flash-list";
import { useLocalSearchParams } from "expo-router";
import { cloneDeep, debounce } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
    FadeIn,
    FadeOut,
    LinearTransition,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withSpring,
    withTiming,
} from "react-native-reanimated";

type DropZone = {
    x: number;
    y: number;
    width: number;
    height: number;
    index: number;
};

export default function DragAndDropQuizAns() {
    const theme = useAppTheme();
    const styles = makeStyles(theme);
    const params = useLocalSearchParams<{ quiz_id: string }>();
    const quiz_id = params.quiz_id;
    const quizzes = reviewSelector.use.useQuizzes();
    const selectedQuiz = quizzes.find((q) => q.quiz_id === quiz_id) as DragAndDrop | undefined;

    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [dropZones, setDropZones] = useState<DropZone[]>([]);
    const [resultModalVisible, setResultModalVisible] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const DRAG_AND_DROP = selectedQuiz || {
        questions: [],
        answers: [],
    };

    /**only enable answer submission when user answers every choice */
    const isSubmitEnabled = Object.keys(answers).length === DRAG_AND_DROP.questions.length;

    const score = (() => {
        let total: number = 0;
        for (let i = 0; i < DRAG_AND_DROP.questions.length; ++i) {
            const q = DRAG_AND_DROP.questions[i];
            const correctAns = q.answer;
            const userAnswer = answers[i];
            if (correctAns === userAnswer) {
                total += 1;
            }
        }
        return total;
    })();

    const totalQuestion = DRAG_AND_DROP.questions.length;

    const containerOffset = useRef({ x: 0, y: 0 });
    const flashListRef = useRef<FlashListRef<(typeof DRAG_AND_DROP.questions)[0]>>(null);

    const questionRefs = useRef<(View | null)[]>([]);

    useEffect(() => {
        questionRefs.current = new Array(DRAG_AND_DROP.questions.length).fill(null);
    }, [DRAG_AND_DROP.questions.length]);

    const handleSubmit = () => {
        setResultModalVisible(true);
        setIsSubmitted(true);
    };

    const handleReset = () => {
        setIsSubmitted(false);
        setAnswers({});
        flashListRef.current?.scrollToIndex({ index: 0, animated: true });
    };

    const registerContainer = (ref: View | null) => {
        if (!ref) return;
        ref.measureInWindow((x, y) => {
            containerOffset.current = { x, y };
        });
    };

    const recalibrateDropZones = () => {
        const container = containerOffset.current;
        if (!container) return;

        const newDropZones: DropZone[] = [];
        let completedMeasurements = 0;
        const totalMeasurements = questionRefs.current.length;

        questionRefs.current.forEach((ref, index) => {
            if (ref) {
                ref.measureInWindow((x, y, width, height) => {
                    const relativeX = x - container.x;
                    const relativeY = y - container.y;

                    const newZone: DropZone = {
                        x: relativeX,
                        y: relativeY,
                        width,
                        height,
                        index,
                    };

                    newDropZones.push(newZone);
                    completedMeasurements++;

                    if (completedMeasurements === totalMeasurements) {
                        setDropZones(newDropZones.sort((a, b) => a.index - b.index));
                    }
                });
            } else {
                completedMeasurements++;
                if (completedMeasurements === totalMeasurements) {
                    setDropZones(newDropZones.sort((a, b) => a.index - b.index));
                }
            }
        });
    };

    const handleDropZones = (_e: any) => {
        setTimeout(() => {
            recalibrateDropZones();
        }, 100);
    };

    const handleHover = (absX: number, absY: number) => {
        const { x: offsetX, y: offsetY } = containerOffset.current;
        const localX = absX - offsetX;
        const localY = absY - offsetY;

        const zone = dropZones.find(
            (z) =>
                localX >= z.x &&
                localX <= z.x + z.width &&
                localY >= z.y &&
                localY <= z.y + z.height
        );
        setHoveredIndex(zone ? zone.index : null);
    };

    const handleDrop = (absX: number, absY: number, answer: string) => {
        const { x: offsetX, y: offsetY } = containerOffset.current;
        const localX = absX - offsetX;
        const localY = absY - offsetY;

        const zone = dropZones.find(
            (z) =>
                localX >= z.x &&
                localX <= z.x + z.width &&
                localY >= z.y &&
                localY <= z.y + z.height
        );
        if (zone) {
            setAnswers((prev) => ({ ...prev, [zone.index]: answer }));
            // ✅ auto-scroll to next question if not the last
            if (!flashListRef.current || hoveredIndex === null) return;
            const delayedScrollToIndex = debounce(flashListRef?.current?.scrollToIndex, 150);
            if (hoveredIndex < DRAG_AND_DROP.questions.length - 1) {
                delayedScrollToIndex({
                    index: hoveredIndex + 1,
                    animated: true,
                });
            }
        }
        setHoveredIndex(null);
    };

    const setQuestionRef = (index: number) => (ref: View | null) => {
        questionRefs.current[index] = ref;
    };

    const unselectedAnswers = DRAG_AND_DROP.answers.filter((ans) => {
        const isSelected = Object.values(answers).includes(ans);
        return !isSelected;
    });

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
        <>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <Container style={styles.container}>
                    {/* Answers palette */}
                    <Animated.View
                        style={[styles.answersRow, isSubmitted && { height: 0, flexGrow: 0 }]}
                        layout={LinearTransition.duration(200)}
                    >
                        {unselectedAnswers.map((ans) => {
                            // const isSelected = Object.values(answers).includes(ans);
                            return (
                                <Animated.View
                                    key={`${ans}`}
                                    layout={LinearTransition.duration(200)}
                                    entering={FadeIn.duration(150)}
                                    exiting={FadeOut.duration(150)}
                                >
                                    <DraggableChip
                                        label={ans}
                                        onDrop={handleDrop}
                                        onHover={handleHover}
                                        // isSelected={isSelected}
                                        isDisabled={isSubmitted}
                                    />
                                </Animated.View>
                            );
                        })}
                    </Animated.View>

                    {/* Container for FlashList */}
                    <View style={styles.scrollContainer} ref={registerContainer}>
                        <FlashList
                            ListFooterComponent={
                                <QuizResultModal
                                    visible={resultModalVisible}
                                    onClose={() => setResultModalVisible(false)}
                                    score={score}
                                    totalQuestion={totalQuestion}
                                />
                            }
                            ref={flashListRef}
                            data={DRAG_AND_DROP.questions}
                            horizontal={true}
                            pagingEnabled={true}
                            showsHorizontalScrollIndicator={false}
                            scrollEventThrottle={16}
                            onLayout={handleDropZones}
                            onScroll={handleDropZones}
                            // Remove conflicting style properties
                            renderItem={({ item: q, index: idx }) => (
                                <View style={styles.questionContainer} ref={setQuestionRef(idx)}>
                                    <Card
                                        key={idx}
                                        style={[
                                            styles.dropZone,
                                            hoveredIndex === idx && styles.dropZoneHovered,
                                        ]}
                                    >
                                        <Text style={styles.questionText}>{q.question}</Text>
                                        {isSubmitted ? (
                                            <View style={styles.submittedAnswerContainer}>
                                                {/* user answer */}
                                                <View
                                                    style={[
                                                        styles.userAnswerChip,
                                                        answers[idx] === q.answer
                                                            ? {
                                                                  backgroundColor:
                                                                      theme.colors.secondary,
                                                              }
                                                            : {
                                                                  backgroundColor:
                                                                      theme.colors.error,
                                                              },
                                                    ]}
                                                >
                                                    <Text
                                                        style={[
                                                            styles.answerText,
                                                            {
                                                                color:
                                                                    answers[idx] === q.answer
                                                                        ? theme.colors.onSecondary
                                                                        : theme.colors.onError,
                                                                fontWeight: "600",
                                                            },
                                                        ]}
                                                    >
                                                        {answers[idx]
                                                            ? answers[idx]
                                                            : "No answer here"}
                                                    </Text>
                                                </View>
                                                {/* correct answer */}
                                                {answers[idx] !== q.answer && (
                                                    <>
                                                        <Text
                                                            style={[
                                                                styles.correctAnswerLabel,
                                                                { color: theme.colors.onSurface },
                                                            ]}
                                                        >
                                                            Correct Answer:
                                                        </Text>
                                                        <View
                                                            style={[
                                                                styles.userAnswerChip,
                                                                styles.correctAnswerBg,
                                                            ]}
                                                        >
                                                            <Text
                                                                style={[
                                                                    styles.answerText,
                                                                    styles.whiteAnswerText,
                                                                ]}
                                                            >
                                                                {q.answer}
                                                            </Text>
                                                        </View>
                                                    </>
                                                )}
                                            </View>
                                        ) : (
                                            <View style={styles.answerInputContainer}>
                                                <View
                                                    style={[
                                                        styles.answerBox,
                                                        {
                                                            borderColor: theme.colors.outline,
                                                            backgroundColor:
                                                                theme.colors.surfaceVariant,
                                                        },
                                                        answers[idx] && {
                                                            backgroundColor: theme.colors.primary,
                                                            borderColor: "transparent",
                                                            shadowColor: theme.colors.onSurface,
                                                        },
                                                    ]}
                                                >
                                                    <Text
                                                        style={[
                                                            styles.answerText,
                                                            answers[idx] !== undefined && {
                                                                color: theme.colors.onPrimary,
                                                                fontWeight: "600",
                                                            },
                                                            !answers[idx] && {
                                                                color: theme.colors
                                                                    .onSurfaceVariant,
                                                            },
                                                        ]}
                                                    >
                                                        {answers[idx]
                                                            ? answers[idx]
                                                            : "Drop answer here"}
                                                    </Text>
                                                </View>
                                                {answers[idx] && (
                                                    <TouchableOpacity
                                                        hitSlop={10}
                                                        onPress={() => {
                                                            const copy = cloneDeep(answers);
                                                            delete copy[idx];
                                                            setAnswers(copy);
                                                        }}
                                                        style={styles.removeButton}
                                                    >
                                                        <AntDesign
                                                            name="close-square"
                                                            size={24}
                                                            color="#9e4770"
                                                        />
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        )}
                                    </Card>
                                </View>
                            )}
                        />
                    </View>
                    {/* Submit button at bottom */}
                    <View style={styles.submitContainer}>
                        {!isSubmitted && (
                            <Pressable
                                android_ripple={
                                    isSubmitEnabled ? { color: "#ccc", borderless: false } : null
                                }
                                style={[
                                    styles.submitButton,
                                    { backgroundColor: theme.colors.secondary },
                                ]}
                                onPress={handleSubmit}
                                disabled={!isSubmitEnabled}
                            >
                                <Text
                                    style={[
                                        styles.submitButtonText,
                                        {
                                            opacity: isSubmitEnabled ? 1 : 0.6,
                                            color: theme.colors.onSecondary,
                                        },
                                    ]}
                                >
                                    Submit ({Object.keys(answers).length}/
                                    {DRAG_AND_DROP.questions.length})
                                </Text>
                            </Pressable>
                        )}
                        {isSubmitted && (
                            <Pressable
                                android_ripple={
                                    isSubmitEnabled ? { color: "#631d76", borderless: false } : null
                                }
                                style={[
                                    styles.resetButton,
                                    { backgroundColor: theme.colors.primary },
                                ]}
                                onPress={handleReset}
                            >
                                <Text
                                    style={[
                                        styles.resetButtonText,
                                        { color: theme.colors.onPrimary },
                                    ]}
                                >
                                    TRY AGAIN ({score}/{DRAG_AND_DROP.questions.length})
                                </Text>
                            </Pressable>
                        )}
                    </View>
                </Container>
            </GestureHandlerRootView>
        </>
    );
}

function DraggableChip({
    label,
    onDrop,
    onHover,
    isSelected,
    isDisabled,
}: {
    label: string;
    isSelected?: boolean;
    isDisabled: boolean;
    onDrop: (x: number, y: number, ans: string) => void;
    onHover: (x: number, y: number) => void;
}) {
    const theme = useAppTheme();
    const styles = makeStyles(theme);

    const offsetX = useSharedValue(0);
    const offsetY = useSharedValue(0);
    const rotation = useSharedValue(0);
    const isDragging = useSharedValue(false);

    const gesture = Gesture.Pan()
        .enabled(!isSelected && !isDisabled) // Disable gesture when selected
        .onStart(() => {
            isDragging.value = true;
            // Start shake animation
            rotation.value = withRepeat(
                withSequence(
                    withTiming(-3, { duration: 50 }),
                    withTiming(3, { duration: 100 }),
                    withTiming(0, { duration: 50 })
                ),
                -1, // Infinite repeat
                false
            );
        })
        .onUpdate((e) => {
            offsetX.value = e.translationX;
            offsetY.value = e.translationY;
            runOnJS(onHover)(e.absoluteX, e.absoluteY);
        })
        .onEnd((e) => {
            isDragging.value = false;
            // Stop shake animation
            rotation.value = withTiming(0, { duration: 100 });

            runOnJS(onDrop)(e.absoluteX, e.absoluteY, label);

            // Animate back to position
            offsetX.value = withSpring(0);
            offsetY.value = withSpring(0);
        });

    const stylez = useAnimatedStyle(() => ({
        transform: [
            { translateX: offsetX.value },
            { translateY: offsetY.value },
            { rotate: `${rotation.value}deg` },
        ],
    }));

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View
                style={[
                    styles.chip,
                    {
                        backgroundColor: theme.colors.primary,
                        shadowColor: theme.colors.onSurface,
                    },
                    stylez,
                    isSelected && {
                        borderColor: theme.colors.primary,
                        backgroundColor: theme.colors.surface,
                    },
                ]}
            >
                <Text
                    style={[
                        styles.chipText,
                        { color: theme.colors.onPrimary },
                        isSelected && {
                            color: theme.colors.onSurface,
                            fontSize: fontSizeScaler(label),
                        },
                    ]}
                >
                    {label}
                </Text>
            </Animated.View>
        </GestureDetector>
    );
}

const makeStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {},
        answersRow: {
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
            padding: 8,
            zIndex: 10,
        },
        chip: {
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 25,
            borderWidth: 0,
            zIndex: 10,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 3,
        },
        chipText: {
            fontWeight: "600",
        },
        // New style for scroll container
        scrollContainer: {
            flex: 1,
            justifyContent: "center",
        },
        // Updated style for question container
        questionContainer: {
            width: WIDTH,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
        },
        dropZone: {
            borderWidth: 2,
            borderRadius: 12,
            minHeight: 144,
            justifyContent: "center",
            padding: 16,
        },
        dropZoneHovered: {
            borderColor: theme.colors?.tertiary,
            backgroundColor: theme.colors?.tertiaryContainer,
        },
        questionText: {
            fontSize: 16,
            fontWeight: "500",
            marginBottom: 8,
        },
        answerText: {
            fontSize: 14,
        },
        submittedAnswerContainer: {
            rowGap: 4,
            alignItems: "center",
        },
        correctAnswerLabel: {
            textAlign: "left",
            width: "100%",
            fontWeight: "600",
        },
        answerInputContainer: {
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            justifyContent: "center",
        },
        answerBox: {
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 25,
            borderWidth: 2,
            justifyContent: "center",
            alignSelf: "flex-start",
            maxWidth: "85%",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 3,
        },
        removeButton: {
            padding: 4,
        },
        submitContainer: {
            padding: 16,
        },
        submitButton: {
            padding: 16,
            borderRadius: 12,
            alignItems: "center",
        },
        submitButtonText: {
            fontWeight: "bold",
            fontSize: 16,
        },
        resetButton: {
            padding: 16,
            borderRadius: 12,
            alignItems: "center",
        },
        resetButtonText: {
            fontWeight: "bold",
            fontSize: 16,
        },
        errorContainer: {
            flex: 1,
            padding: 16,
            alignItems: "center",
            justifyContent: "center",
        },
        userAnswerChip: {
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 25,
            borderWidth: 0,
            alignSelf: "flex-start",
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 3,
        },
        correctAnswerBg: {
            backgroundColor: theme.colors?.secondary,
        },
        incorrectAnswerBg: {
            backgroundColor: theme.colors?.error,
        },
        whiteAnswerText: {
            fontWeight: "600",
            color: theme.colors?.onTertiary,
        },
    });
