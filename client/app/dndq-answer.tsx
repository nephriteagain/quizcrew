// app/DragAndDropQuiz.tsx
import { DRAG_AND_DROP } from "@/lib/data";
import React, { useCallback, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
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

export default function DragAndDropQuiz() {
    const [assigned, setAssigned] = useState<{ [key: number]: string }>({});
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [dropZones, setDropZones] = useState<DropZone[]>([]); // ✅ Changed to useState
    const containerOffset = useRef({ x: 0, y: 0 });
    const scrollViewRef = useRef<ScrollView>(null);

    // Fixed ref array initialization
    const questionRefs = useRef<(View | null)[]>([]);

    // Initialize refs array based on questions length
    const initializeRefs = useCallback(() => {
        questionRefs.current = new Array(DRAG_AND_DROP.questions.length).fill(null);
    }, []);

    // Call initialization when component mounts
    React.useEffect(() => {
        initializeRefs();
    }, [initializeRefs]);

    // measure container position in screen space
    const registerContainer = useCallback((ref: View | null) => {
        if (!ref) return;
        ref.measureInWindow((x, y) => {
            containerOffset.current = { x, y };
        });
    }, []);

    // measure each drop zone - FIXED VERSION
    // const registerDropZone = useCallback((index: number, layout: any) => {
    //     // The issue: onLayout gives coordinates relative to ScrollView,
    //     // but we need them relative to the container we measured with registerContainer

    //     // Use the ref to get proper screen coordinates, then convert to container-relative
    //     setTimeout(() => {
    //         const ref = questionRefs.current[index];
    //         if (ref && containerOffset.current.x !== 0) {
    //             ref.measureInWindow((x, y, width, height) => {
    //                 const { x: offsetX, y: offsetY } = containerOffset.current;
    //                 const relativeX = x - offsetX;
    //                 const relativeY = y - offsetY;

    //                 const newZone: DropZone = {
    //                     x: relativeX,
    //                     y: relativeY,
    //                     width,
    //                     height,
    //                     index,
    //                 };
    //                 setDropZones([...dropZones.filter((z) => z.index !== index), newZone]);
    //             });
    //         } else if (containerOffset.current.x === 0) {
    //             // Container not ready yet, try again
    //             setTimeout(() => registerDropZone(index, layout), 100);
    //         }
    //     }, 50);
    // }, []);

    // Fixed recalibration function using questionRefs array
    const recalibrateDropZones = useCallback(() => {
        const container = containerOffset.current;
        if (!container) return;

        // Don't clear existing drop zones immediately - build new array first
        const newDropZones: DropZone[] = [];
        let completedMeasurements = 0;
        const totalMeasurements = questionRefs.current.length;

        // Measure each question ref and update drop zones
        questionRefs.current.forEach((ref, index) => {
            if (ref) {
                ref.measureInWindow((x, y, width, height) => {
                    // Convert absolute coordinates to relative coordinates within the container
                    const relativeX = x - container.x;
                    const relativeY = y - container.y;

                    const newZone: DropZone = {
                        x: relativeX,
                        y: relativeY,
                        width,
                        height,
                        index,
                    };

                    // Add to new array instead of modifying current array
                    newDropZones.push(newZone);
                    completedMeasurements++;

                    // Only update the main array when all measurements are complete
                    if (completedMeasurements === totalMeasurements) {
                        setDropZones(newDropZones.sort((a, b) => a.index - b.index));
                    }
                });
            } else {
                // Handle null refs
                completedMeasurements++;
                if (completedMeasurements === totalMeasurements) {
                    setDropZones(newDropZones.sort((a, b) => a.index - b.index));
                }
            }
        });
    }, []);

    const handleDropZones = useCallback(
        (e: any) => {
            // Use setTimeout to ensure scroll has completed before recalibrating
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
    ); // ✅ Now depends on dropZones state

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
                setAssigned((prev) => ({ ...prev, [zone.index]: answer }));
            }
            setHoveredIndex(null);
        },
        [dropZones]
    ); // ✅ Now depends on dropZones state

    // Function to set individual question refs
    const setQuestionRef = useCallback(
        (index: number) => (ref: View | null) => {
            questionRefs.current[index] = ref;
        },
        []
    );

    return (
        <GestureHandlerRootView style={styles.container}>
            {/* Answers palette */}
            <View style={styles.answersRow}>
                {DRAG_AND_DROP.answers.map((ans) => (
                    <DraggableChip
                        key={ans}
                        label={ans}
                        onDrop={handleDrop}
                        onHover={handleHover}
                    />
                ))}
            </View>

            {/* Wrap ScrollView inside a View we can measure */}
            <View style={{ flex: 1 }} ref={registerContainer}>
                <ScrollView
                    onLayout={handleDropZones}
                    ref={scrollViewRef}
                    onScroll={handleDropZones}
                    scrollEventThrottle={16} // so recalibration happens smoothly
                >
                    <View style={styles.questions}>
                        {DRAG_AND_DROP.questions.map((q, idx) => (
                            <View
                                ref={setQuestionRef(idx)}
                                key={idx}
                                style={[
                                    styles.dropZone,
                                    hoveredIndex === idx && styles.dropZoneHovered,
                                ]}
                                // onLayout={(e) => registerDropZone(idx, e.nativeEvent.layout)}
                            >
                                <Text style={styles.questionText}>{q.question}</Text>
                                <Text
                                    style={[
                                        styles.answerText,
                                        assigned[idx] !== undefined && {
                                            color: "black",
                                            fontWeight: "600",
                                        },
                                    ]}
                                >
                                    {assigned[idx] ? assigned[idx] : "Drop answer here"}
                                </Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </GestureHandlerRootView>
    );
}

function DraggableChip({
    label,
    onDrop,
    onHover,
}: {
    label: string;
    onDrop: (x: number, y: number, ans: string) => void;
    onHover: (x: number, y: number) => void;
}) {
    const offsetX = useSharedValue(0);
    const offsetY = useSharedValue(0);

    const gesture = Gesture.Pan()
        .onUpdate((e) => {
            offsetX.value = e.translationX;
            offsetY.value = e.translationY;
            runOnJS(onHover)(e.absoluteX, e.absoluteY);
        })
        .onEnd((e) => {
            runOnJS(onDrop)(e.absoluteX, e.absoluteY, label);
            offsetX.value = withSpring(0);
            offsetY.value = withSpring(0);
        });

    const stylez = useAnimatedStyle(() => ({
        transform: [{ translateX: offsetX.value }, { translateY: offsetY.value }],
    }));

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View style={[styles.chip, stylez]}>
                <Text style={styles.chipText}>{label}</Text>
            </Animated.View>
        </GestureDetector>
    );
}

const styles = StyleSheet.create({
    container: { padding: 16, flex: 1 },
    answersRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 20,
    },
    chip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
        backgroundColor: "#4f46e5",
        margin: 4,
        zIndex: 10,
    },
    chipText: { color: "white", fontWeight: "600" },
    questions: { gap: 12 },
    dropZone: {
        padding: 16,
        borderWidth: 2,
        borderColor: "#d1d5db",
        borderRadius: 12,
        minHeight: 70,
        justifyContent: "center",
        backgroundColor: "white",
        marginBottom: 12,
    },
    dropZoneHovered: {
        borderColor: "#4f46e5",
        backgroundColor: "#eef2ff",
    },
    questionText: { fontSize: 16, fontWeight: "500", marginBottom: 6 },
    answerText: { fontSize: 14, color: "#6b7280" },
});
