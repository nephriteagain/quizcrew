import Container from "@/components/Container";
import CreateUsernameModal from "@/components/CreateUsernameModal";
import GlobalLoadingModal from "@/components/GlobalLoadingModal";
import VerifyEmailModal from "@/components/VerifyEmailModal";
import { crashlytics } from "@/firebase";
import { useLogScreen } from "@/hooks/useLogScreen";
import AuthProvider from "@/providers/AuthProvider";
import ThemeProvider, { useAppTheme } from "@/providers/ThemeProvider";
import authSelector from "@/store/user/user.store";
import { Ionicons } from "@expo/vector-icons";
import { recordError } from "@react-native-firebase/crashlytics";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as Updates from "expo-updates";
import { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Avatar, Text } from "react-native-paper";
import ToastManager from "toastify-react-native";

SplashScreen.preventAutoHideAsync();

function RootLayoutContent() {
    useLogScreen();

    const theme = useAppTheme();

    const user = authSelector.use.useUser();
    const [isUpdating, setIsUpdating] = useState(false);

    const onFetchUpdateAsync = async () => {
        try {
            if (__DEV__) {
                SplashScreen.hide();
                return;
            }
            const update = await Updates.checkForUpdateAsync();

            if (update.isAvailable) {
                setIsUpdating(true);
                SplashScreen.hide();
                await Updates.fetchUpdateAsync();
                await Updates.reloadAsync();
            }
        } catch (error) {
            SplashScreen.hide();
            if (error instanceof Error) {
                recordError(crashlytics, error, "expo_update_error");
            }
        } finally {
            setIsUpdating(false);
        }
    };

    useEffect(() => {
        onFetchUpdateAsync();
    }, []);

    if (isUpdating) {
        return (
            <Container style={{ justifyContent: "center", alignItems: "center" }}>
                <Avatar.Image source={require("@/assets/images/quiz-crew-icon.png")} size={200} />
                <Text variant="headlineMedium" style={{ marginTop: 24 }}>
                    Updating QuizCrew...
                </Text>
                <Text variant="bodyMedium" style={{ marginTop: 8, opacity: 0.7 }}>
                    Please wait while we update the app
                </Text>
            </Container>
        );
    }

    return (
        <AuthProvider>
            <GestureHandlerRootView>
                <Stack>
                    <Stack.Protected guard={Boolean(user)}>
                        <Stack.Screen
                            name="(tabs)"
                            options={{
                                headerShown: true,
                                title: "QuizCrew",
                                headerTitle: () => (
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            columnGap: 8,
                                        }}
                                    >
                                        <Avatar.Image
                                            source={require("@/assets/images/quiz-crew-icon.png")}
                                            size={32}
                                        />
                                        <Text style={{ fontWeight: "bold" }} variant="titleLarge">
                                            QuizCrew
                                        </Text>
                                    </View>
                                ),
                            }}
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
                            options={() => ({
                                headerTitle: "Multiple Choice Quiz",
                                headerRight: () => (
                                    <TouchableOpacity>
                                        <View>
                                            <Ionicons
                                                name="settings-sharp"
                                                size={24}
                                                color={theme.colors.onSurface}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                ),
                            })}
                        />
                        <Stack.Screen
                            name="tofq"
                            options={(props) => ({
                                headerTitle: "True or False Quiz",
                                headerRight: () => (
                                    <TouchableOpacity>
                                        <View>
                                            <Ionicons
                                                name="settings-sharp"
                                                size={24}
                                                color={theme.colors.onSurface}
                                            />
                                        </View>
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
                                    <TouchableOpacity>
                                        <View>
                                            <Ionicons
                                                name="settings-sharp"
                                                size={24}
                                                color={theme.colors.onSurface}
                                            />
                                        </View>
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
                            name="signin"
                            options={{ headerTitle: "", headerShown: false }}
                        />
                        <Stack.Screen
                            name="signup"
                            options={{ headerTitle: "", headerShown: false }}
                        />
                        <Stack.Screen name="signup-email" options={{ headerTitle: "" }} />
                        <Stack.Screen name="signin-email" options={{ headerTitle: "" }} />
                        <Stack.Screen name="forgot-password" options={{ headerTitle: "" }} />
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
                    <Stack.Screen
                        name="link-google"
                        options={{ headerTitle: "Link account with Google" }}
                    />
                </Stack>
                <GlobalLoadingModal />
                <CreateUsernameModal />
                <VerifyEmailModal />
                <ToastManager />
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
