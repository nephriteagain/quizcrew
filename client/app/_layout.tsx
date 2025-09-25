import CreateUsernameModal from "@/components/CreateUsernameModal";
import GlobalLoadingModal from "@/components/GlobalLoadingModal";
import SettingsBottomSheet from "@/components/SettingsBottomSheet";
import AuthProvider from "@/providers/AuthProvider";
import ThemeProvider, { useAppTheme } from "@/providers/ThemeProvider";
import reviewSelector from "@/store/review/review.store";
import authSelector from "@/store/user/user.store";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import { useRef, useState } from "react";
import { TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

function RootLayoutContent() {
    const [quizId, setQuizId] = useState<string | null>(null);
    const theme = useAppTheme();
    const bottomSheetRef = useRef<BottomSheet>(null);
    const reviews = reviewSelector.use.useQuizzes();
    const rotation = useSharedValue(0);

    const user = authSelector.use.useUser();

    // callbacks
    const handleSheetChanges = (index: number) => {
        if (index === -1) {
            // Bottom sheet is closing - spin back
            rotation.value = withTiming(0, { duration: 1_000 });
            setQuizId(null);
        } else {
            // Bottom sheet is opening - spin forward
            rotation.value = withTiming(360, { duration: 1_000 });
        }
    };

    const handleSettingsPress = (quiz_id: string) => {
        bottomSheetRef.current?.expand();
        setQuizId(quiz_id);
    };

    const animatedIconStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value}deg` }],
        };
    });

    return (
        <AuthProvider>
            <GestureHandlerRootView>
                <Stack>
                    <Stack.Protected guard={Boolean(user)}>
                        <Stack.Screen
                            name="(tabs)"
                            options={{ headerShown: true, title: "QuizCraft" }}
                        />
                        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
                        <Stack.Screen
                            name="quiz-types"
                            options={{ headerTitle: "Select a Quiz Type" }}
                        />
                        <Stack.Screen
                            name="mcq-answer"
                            options={{ headerTitle: "Multiple Choice Quiz" }}
                        />
                        <Stack.Screen
                            name="mcq"
                            options={(props) => ({
                                headerTitle: "Multiple Choice Quiz",
                                headerRight: () => (
                                    <TouchableOpacity
                                        onPress={() => {
                                            const quiz_id = (
                                                props.route.params as { quiz_id?: string }
                                            )?.quiz_id;
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
                            })}
                        />
                        <Stack.Screen
                            name="tofq"
                            options={(props) => ({
                                headerTitle: "True or False Quiz",
                                headerRight: () => (
                                    <TouchableOpacity
                                        onPress={() => {
                                            const quiz_id = (
                                                props.route.params as { quiz_id?: string }
                                            )?.quiz_id;
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
                            })}
                        />
                        <Stack.Screen
                            name="tofq-answer"
                            options={{ headerTitle: "True of False Quiz" }}
                        />
                        <Stack.Screen
                            name="dndq"
                            options={(props) => ({
                                headerTitle: "Drag and Drop Quiz",
                                headerRight: () => (
                                    <TouchableOpacity
                                        onPress={() => {
                                            const quiz_id = (
                                                props.route.params as { quiz_id?: string }
                                            )?.quiz_id;
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
                            })}
                        />
                        <Stack.Screen
                            name="dndq-answer"
                            options={{ headerTitle: "Drag and Drop Quiz" }}
                        />

                        <Stack.Screen name="create" options={{ headerTitle: "Create a Quiz" }} />
                        <Stack.Screen
                            name="add-connections"
                            options={{ headerTitle: "Find New Connections" }}
                        />
                        <Stack.Screen name="add-groups" options={{ headerTitle: "Find Groups" }} />
                        <Stack.Screen
                            name="create-group"
                            options={{ headerTitle: "Create Group" }}
                        />
                        <Stack.Screen
                            name="invite-members"
                            options={{ headerTitle: "Invite Members" }}
                        />
                        <Stack.Screen name="members" options={{ headerTitle: "Members" }} />
                        <Stack.Screen name="profile/[uid]" options={{ headerTitle: "Profile" }} />
                        <Stack.Screen
                            name="group-profile/[gid]"
                            options={{ headerTitle: "Group Profile" }}
                        />
                    </Stack.Protected>

                    {/* Authentication */}
                    <Stack.Protected guard={!user}>
                        <Stack.Screen
                            name="signup"
                            options={{ headerTitle: "Sign Up", headerShown: false }}
                        />
                        <Stack.Screen name="signup-email" options={{ headerTitle: "" }} />
                    </Stack.Protected>
                    {/* Terms of Service */}
                    <Stack.Screen
                        name="terms-of-service"
                        options={{ headerTitle: "Terms of Service" }}
                    />
                    {/* Privacy Policy */}
                    <Stack.Screen
                        name="privacy-policy"
                        options={{ headerTitle: "Privacy Policy" }}
                    />
                    <Stack.Screen
                        name="link-email"
                        options={{ headerTitle: "Link account with email" }}
                    />
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

export default function RootLayout() {
    return (
        <ThemeProvider>
            <RootLayoutContent />
        </ThemeProvider>
    );
}
