import GlobalLoadingModal from "@/components/GlobalLoadingModal";
import reviewSelector from "@/store/review/review.store";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const reviews = reviewSelector.use.quizzes();

    const [quizId, setQuizId] = useState<string | null>(null);

    // callbacks
    const handleSheetChanges = useCallback((index: number) => {
        if (index == -1) {
            setQuizId(null);
        }
    }, []);

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                onPress={() => bottomSheetRef.current?.close()}
            />
        ),
        []
    );

    const handleEditQuiz = useCallback(() => {
        // Handle edit quiz logic
        bottomSheetRef.current?.close();
    }, []);

    const handleShareQuiz = useCallback(() => {
        // Handle share quiz logic
        bottomSheetRef.current?.close();
    }, []);

    const handleDeleteQuiz = useCallback(() => {
        const quiz = reviews.find((q) => q.quiz_id === quizId);
        if (!quiz) return;
        Alert.alert(
            "Delete Quiz",
            `Are you sure you want to delete quiz "${quiz.title}?\nYou cannot undo this action."`,
            [
                {
                    text: "Cancel",
                    onPress: () => {},
                    style: "cancel",
                },
                {
                    text: "Delete",
                    onPress: async () => {},
                    style: "destructive",
                },
            ]
        );
    }, [reviews, quizId]);

    const handleSettingsPress = useCallback((quiz_id: string) => {
        bottomSheetRef.current?.expand();
        setQuizId(quiz_id);
    }, []);

    return (
        <GestureHandlerRootView>
            <Stack>
                <Stack.Screen name="index" options={{ headerTitle: "Review" }} />
                <Stack.Screen
                    name="mcq-answer"
                    options={{ headerTitle: "Multiple Choice Question" }}
                />
                <Stack.Screen
                    name="mcq"
                    options={(props) => ({
                        headerTitle: "Multiple Choice Questions",
                        headerRight: () => (
                            <TouchableOpacity
                                onPress={() => {
                                    const quiz_id = (props.route.params as { quiz_id?: string })
                                        ?.quiz_id;
                                    if (quiz_id) {
                                        handleSettingsPress(quiz_id);
                                    }
                                }}
                            >
                                <Ionicons name="settings-sharp" size={24} color="black" />
                            </TouchableOpacity>
                        ),
                    })}
                />
                <Stack.Screen
                    name="tofq"
                    options={(props) => ({
                        headerTitle: "True or False Questions",
                        headerRight: () => (
                            <TouchableOpacity
                                onPress={() => {
                                    const quiz_id = (props.route.params as { quiz_id?: string })
                                        ?.quiz_id;
                                    if (quiz_id) {
                                        handleSettingsPress(quiz_id);
                                    }
                                }}
                            >
                                <Ionicons name="settings-sharp" size={24} color="black" />
                            </TouchableOpacity>
                        ),
                    })}
                />
                <Stack.Screen
                    name="tofq-answer"
                    options={{ headerTitle: "True of False Questions" }}
                />
                <Stack.Screen
                    name="dndq"
                    options={(props) => ({
                        headerTitle: "Drag and Drop Questions",
                        headerRight: () => (
                            <TouchableOpacity
                                onPress={() => {
                                    const quiz_id = (props.route.params as { quiz_id?: string })
                                        ?.quiz_id;
                                    if (quiz_id) {
                                        handleSettingsPress(quiz_id);
                                    }
                                }}
                            >
                                <Ionicons name="settings-sharp" size={24} color="black" />
                            </TouchableOpacity>
                        ),
                    })}
                />
                <Stack.Screen
                    name="dndq-answer"
                    options={{ headerTitle: "Drag and Drop Questions" }}
                />

                <Stack.Screen name="create" options={{ headerTitle: "Create a Reviewer" }} />
            </Stack>
            <GlobalLoadingModal />
            <BottomSheet
                ref={bottomSheetRef}
                onChange={handleSheetChanges}
                index={-1}
                snapPoints={["60%"]}
                enablePanDownToClose={true}
                backdropComponent={renderBackdrop}
                animationConfigs={{
                    damping: 80,
                    overshootClamping: true,
                    restDisplacementThreshold: 0.1,
                    restSpeedThreshold: 0.1,
                    stiffness: 500,
                }}
            >
                <BottomSheetView style={styles.contentContainer}>
                    <Text style={styles.headerTitle}>Quiz Settings</Text>

                    <TouchableOpacity style={styles.settingButton} onPress={handleEditQuiz}>
                        <Ionicons name="create-outline" size={24} color="#4f46e5" />
                        <Text style={styles.settingButtonText}>Edit Quiz</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingButton} onPress={handleShareQuiz}>
                        <Ionicons name="share-outline" size={24} color="#10b981" />
                        <Text style={[styles.settingButtonText, { color: "#10b981" }]}>
                            Share Quiz
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingButton} onPress={handleDeleteQuiz}>
                        <Ionicons name="trash-outline" size={24} color="#ef4444" />
                        <Text style={[styles.settingButtonText, { color: "#ef4444" }]}>
                            Delete Quiz
                        </Text>
                    </TouchableOpacity>
                </BottomSheetView>
            </BottomSheet>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "grey",
    },
    contentContainer: {
        flex: 1,
        padding: 24,
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#1f2937",
        marginBottom: 24,
    },
    settingButton: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#f9fafb",
        borderRadius: 12,
        marginBottom: 12,
        width: "100%",
        columnGap: 12,
    },
    settingButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#4f46e5",
    },
});
