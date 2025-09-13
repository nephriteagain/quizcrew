// app/DragAndDropQuiz.tsx
import Card from "@/components/Card";
import { QuizResultModal } from "@/components/QuizResultModal";
import { WIDTH } from "@/constants/values";
import { fontSizeScaler } from "@/lib/utils/fontSizeScaler";
import reviewSelector from "@/store/review/review.store";
import { DragAndDrop } from "@/types/review";
import { AntDesign } from "@expo/vector-icons";
import { FlashList, FlashListRef } from "@shopify/flash-list";
import { useLocalSearchParams } from "expo-router";
import { cloneDeep, debounce } from "lodash";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
    const params = useLocalSearchParams<{ quiz_id: string }>();
    const quiz_id = params.quiz_id;
    const quizzes = reviewSelector.use.quizzes();
    const selectedQuiz = quizzes.find((q) => q.quiz_id === quiz_id) as DragAndDrop | undefined;

    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [dropZones, setDropZones] = useState<DropZone[]>([]);
    const [resultModalVisible, setResultModalVisible] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const DRAG_AND_DROP = useMemo(() => {
        if (!selectedQuiz)
            return {
                questions: [],
                answers: [],
            };
        return selectedQuiz;
    }, [selectedQuiz]);

    /**only enable answer submission when user answers every choice */
    const isSubmitEnabled = useMemo(
        () => Object.keys(answers).length === DRAG_AND_DROP.questions.length,
        [answers]
    );

    const score = useMemo(() => {
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
    }, [answers]);

    const totalQuestion = useMemo(() => DRAG_AND_DROP.questions.length, [DRAG_AND_DROP.questions]);

    const containerOffset = useRef({ x: 0, y: 0 });
    const flashListRef = useRef<FlashListRef<(typeof DRAG_AND_DROP.questions)[0]>>(null);

    const questionRefs = useRef<(View | null)[]>([]);

    const initializeRefs = useCallback(() => {
        questionRefs.current = new Array(DRAG_AND_DROP.questions.length).fill(null);
    }, []);

    useEffect(() => {
        initializeRefs();
    }, [initializeRefs]);

    const handleSubmit = useCallback(() => {
        setResultModalVisible(true);
        setIsSubmitted(true);
    }, [setResultModalVisible]);

    const handleReset = useCallback(() => {
        setIsSubmitted(false);
        setAnswers({});
        flashListRef.current?.scrollToIndex({ index: 0, animated: true });
    }, [setIsSubmitted]);

    const registerContainer = useCallback((ref: View | null) => {
        if (!ref) return;
        ref.measureInWindow((x, y) => {
            containerOffset.current = { x, y };
        });
    }, []);

    const recalibrateDropZones = useCallback(() => {
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
    }, []);

    const handleDropZones = useCallback(
        (e: any) => {
            setTimeout(() => {
                recalibrateDropZones();
            }, 100);
        },
        [recalibrateDropZones]
    );

    const handleHover = useCallback(
        (absX: number, absY: number) => {
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
        },
        [dropZones]
    );

    const handleDrop = useCallback(
        (absX: number, absY: number, answer: string) => {
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
        },
        [dropZones, hoveredIndex]
    );

    const setQuestionRef = useCallback(
        (index: number) => (ref: View | null) => {
            questionRefs.current[index] = ref;
        },
        []
    );

    const unselectedAnswers = useMemo(() => {
        return DRAG_AND_DROP.answers.filter((ans) => {
            const isSelected = Object.values(answers).includes(ans);
            return !isSelected;
        });
    }, [answers]);

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
            <GestureHandlerRootView style={styles.container}>
                {/* Answers palette */}
                <Animated.View
                    style={[styles.answersRow, isSubmitted && { height: 0, flexGrow: 0 }]}
                    layout={LinearTransition.springify().damping(15).stiffness(100)}
                >
                    {unselectedAnswers.map((ans, index) => {
                        // const isSelected = Object.values(answers).includes(ans);
                        return (
                            <Animated.View
                                key={`${ans}`}
                                layout={LinearTransition.springify().damping(15).stiffness(100)}
                                entering={FadeIn.duration(300)}
                                exiting={FadeOut.duration(300)}
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
                                                        ? styles.correctAnswerBg
                                                        : styles.incorrectAnswerBg,
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        styles.answerText,
                                                        answers[idx] !== undefined && styles.whiteAnswerText,
                                                    ]}
                                                >
                                                    {answers[idx] ? answers[idx] : "No answer here"}
                                                </Text>
                                            </View>
                                            {/* correct answer */}
                                            {answers[idx] !== q.answer && (
                                                <>
                                                    <Text style={styles.correctAnswerLabel}>
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
                                                    answers[idx] && styles.answerBoxFilled,
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        styles.answerText,
                                                        answers[idx] !== undefined && {
                                                            color: "white",
                                                            fontWeight: "600",
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
                                                        name="closesquare"
                                                        size={24}
                                                        color="#ff6b6b"
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
                            style={styles.submitButton}
                            onPress={handleSubmit}
                            disabled={!isSubmitEnabled}
                        >
                            <Text
                                style={[
                                    styles.submitButtonText,
                                    { opacity: isSubmitEnabled ? 1 : 0.6 },
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
                                isSubmitEnabled ? { color: "#b8d418ff", borderless: false } : null
                            }
                            style={styles.resetButton}
                            onPress={handleReset}
                        >
                            <Text style={styles.resetButtonText}>
                                TRY AGAIN ({score}/{DRAG_AND_DROP.questions.length})
                            </Text>
                        </Pressable>
                    )}
                </View>
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
                    withTiming(-5, { duration: 100 }),
                    withTiming(5, { duration: 200 }),
                    withTiming(0, { duration: 100 })
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
            rotation.value = withTiming(0, { duration: 150 });

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
                    stylez,
                    isSelected && {
                        borderColor: "#4f46e5",
                        backgroundColor: "white",
                    },
                ]}
            >
                <Text
                    style={[
                        styles.chipText,
                        isSelected && { color: "black", fontSize: fontSizeScaler(label) },
                    ]}
                >
                    {label}
                </Text>
            </Animated.View>
        </GestureDetector>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
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
        backgroundColor: "#4f46e5",
        zIndex: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    chipText: {
        color: "white",
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
        borderColor: "#d1d5db",
        borderRadius: 12,
        minHeight: 144,
        justifyContent: "center",
        backgroundColor: "white",
        padding: 16,
    },
    dropZoneHovered: {
        borderColor: "#4f46e5",
        backgroundColor: "#eef2ff",
    },
    questionText: {
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 8,
    },
    answerText: {
        fontSize: 14,
        color: "#6b7280",
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
        borderColor: "#e5e7eb",
        justifyContent: "center",
        alignSelf: "flex-start",
        maxWidth: "85%",
        backgroundColor: "#f9fafb",
    },
    answerBoxFilled: {
        backgroundColor: "#4f46e5",
        borderColor: "transparent",
        shadowColor: "#000",
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
        borderColor: "#eee",
    },
    submitButton: {
        backgroundColor: "#4CAF50",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
    },
    submitButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
    resetButton: {
        backgroundColor: "#c58142ff",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
    },
    resetButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
    errorContainer: {
        flex: 1,
        padding: 16,
        backgroundColor: "white",
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
        backgroundColor: "green",
    },
    incorrectAnswerBg: {
        backgroundColor: "red",
    },
    whiteAnswerText: {
        color: "white",
        fontWeight: "600",
    },
});
