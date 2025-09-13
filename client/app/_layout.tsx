import CreateUsernameModal from "@/components/CreateUsernameModal";
import GlobalLoadingModal from "@/components/GlobalLoadingModal";
import SettingsBottomSheet from "@/components/SettingsBottomSheet";
import AuthProvider from "@/providers/AuthProvider";
import reviewSelector from "@/store/review/review.store";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { TouchableOpacity } from "react-native";
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

    const handleSettingsPress = useCallback((quiz_id: string) => {
        bottomSheetRef.current?.expand();
        setQuizId(quiz_id);
    }, []);

    return (
        <AuthProvider>
            <GestureHandlerRootView>
                <Stack initialRouteName="(tabs)">
                    <Stack.Screen name="+not-found" options={{ headerShown: false }} />
                    <Stack.Screen
                        name="(tabs)"
                        options={{ headerShown: true, title: "QuizCraft" }}
                    />
                    <Stack.Screen
                        name="quiz-types"
                        options={{ headerTitle: "Select a Quiz Type" }}
                    />
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

                    <Stack.Screen name="create" options={{ headerTitle: "Create a Quiz" }} />
                </Stack>
                <GlobalLoadingModal />
                <SettingsBottomSheet
                    ref={bottomSheetRef}
                    reviews={reviews}
                    quizId={quizId}
                    onSheetChanges={handleSheetChanges}
                />
                <CreateUsernameModal />
            </GestureHandlerRootView>
        </AuthProvider>
    );
}
