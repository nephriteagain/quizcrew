// app/DragAndDropQuiz.tsx
import Card from "@/components/Card";
import { QuizResultModal } from "@/components/QuizResultModal";
import { WIDTH } from "@/constants/values";
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
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
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

    if (!quiz_id) {
        return (
            <View
                style={{
                    flex: 1,
                    padding: 16,
                    backgroundColor: "white",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Text>Invalid Quiz Id</Text>
            </View>
        );
    }

    if (!selectedQuiz) {
        return (
            <View
                style={{
                    flex: 1,
                    padding: 16,
                    backgroundColor: "white",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Text>Quiz not found.</Text>
            </View>
        );
    }

    return (
        <>
            <GestureHandlerRootView style={styles.container}>
                {/* Answers palette */}
                <View style={styles.answersRow}>
                    {DRAG_AND_DROP.answers.map((ans, index) => {
                        const isSelected = Object.values(answers).includes(ans);
                        return (
                            <DraggableChip
                                key={`${ans}-${index}`}
                                label={ans}
                                onDrop={handleDrop}
                                onHover={handleHover}
                                isSelected={isSelected}
                                isDisabled={isSubmitted}
                            />
                        );
                    })}
                </View>

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
                                        <View
                                            style={{
                                                rowGap: 4,
                                                alignItems: "center",
                                            }}
                                        >
                                            {/* user answer */}
                                            <View
                                                style={[
                                                    {
                                                        paddingHorizontal: 12,
                                                        paddingVertical: 8,
                                                        borderRadius: 16,
                                                        borderWidth: 2,
                                                        alignSelf: "flex-start",
                                                        borderColor: "transparent",
                                                    },
                                                    answers[idx] === q.answer
                                                        ? {
                                                              backgroundColor: "green",
                                                          }
                                                        : {
                                                              backgroundColor: "red",
                                                          },
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        styles.answerText,
                                                        answers[idx] !== undefined
                                                            ? {
                                                                  color: "white",
                                                                  fontWeight: "600",
                                                              }
                                                            : {},
                                                    ]}
                                                >
                                                    {answers[idx] ? answers[idx] : "No answer here"}
                                                </Text>
                                            </View>
                                            {/* correct answer */}
                                            {answers[idx] !== q.answer && (
                                                <>
                                                    <Text
                                                        style={{
                                                            textAlign: "left",
                                                            width: "100%",
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        Correct Answer:
                                                    </Text>
                                                    <View
                                                        style={[
                                                            {
                                                                paddingHorizontal: 12,
                                                                paddingVertical: 8,
                                                                borderRadius: 16,
                                                                borderWidth: 2,
                                                                alignSelf: "flex-start",
                                                                borderColor: "transparent",
                                                            },
                                                            {
                                                                backgroundColor: "green",
                                                            },
                                                        ]}
                                                    >
                                                        <Text
                                                            style={[
                                                                styles.answerText,
                                                                {
                                                                    color: "white",
                                                                    fontWeight: "600",
                                                                },
                                                            ]}
                                                        >
                                                            {q.answer}
                                                        </Text>
                                                    </View>
                                                </>
                                            )}
                                        </View>
                                    ) : (
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                columnGap: 4,
                                                alignItems: "center",
                                            }}
                                        >
                                            <View
                                                style={[
                                                    {
                                                        paddingHorizontal: 12,
                                                        paddingVertical: 8,
                                                        borderRadius: 16,
                                                        borderWidth: 2,
                                                        alignSelf: "flex-start",
                                                        borderColor: "transparent",
                                                    },
                                                    answers[idx] && {
                                                        backgroundColor: "#4f46e5",
                                                    },
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
                                                    activeOpacity={0.8}
                                                    onPress={() => {
                                                        const copy = cloneDeep(answers);
                                                        delete copy[idx];
                                                        setAnswers(copy);
                                                    }}
                                                >
                                                    <AntDesign
                                                        name="closesquare"
                                                        size={30}
                                                        color="red"
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
    isSelected: boolean;
    isDisabled: boolean;
    onDrop: (x: number, y: number, ans: string) => void;
    onHover: (x: number, y: number) => void;
}) {
    const offsetX = useSharedValue(0);
    const offsetY = useSharedValue(0);
    const opacity = useSharedValue(1);

    const gesture = Gesture.Pan()
        .enabled(!isSelected && !isDisabled) // Disable gesture when selected
        .onUpdate((e) => {
            offsetX.value = e.translationX;
            offsetY.value = e.translationY;
            runOnJS(onHover)(e.absoluteX, e.absoluteY);
        })
        .onEnd((e) => {
            // Set opacity to 0 immediately when dropping
            opacity.value = 0;

            runOnJS(onDrop)(e.absoluteX, e.absoluteY, label);

            // Animate back to position
            offsetX.value = withSpring(0, {}, () => {
                // When spring animation completes, fade back in
                opacity.value = withSpring(1);
            });
            offsetY.value = withSpring(0);
        });

    const stylez = useAnimatedStyle(() => ({
        transform: [{ translateX: offsetX.value }, { translateY: offsetY.value }],
        opacity: opacity.value,
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
                <Text style={[styles.chipText, isSelected && { color: "black" }]}>{label}</Text>
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
    },
    chip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: "transparent",
        backgroundColor: "#4f46e5",
        zIndex: 10,
    },
    chipText: {
        color: "white",
        fontWeight: "600",
    },
    // New style for scroll container
    scrollContainer: {
        flex: 1,
    },
    // Updated style for question container
    questionContainer: {
        width: WIDTH,
        justifyContent: "center",
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
});
