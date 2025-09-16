import Container from "@/components/Container";
import QuizList from "@/components/QuizList";
import SettingsDrawer, { SettingsDrawerRef } from "@/components/SettingsDrawer";
import { DEFAULT_USER } from "@/constants/values";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { AppTheme, useAppTheme } from "@/providers/ThemeProvider";
import reviewSelector from "@/store/review/review.store";
import { deleteAccount } from "@/store/user/actions/deleteAccount";
import { logout } from "@/store/user/actions/logout";
import authSelector from "@/store/user/user.store";
import { Quiz, QUIZ_TYPE } from "@/types/review";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Link, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Button } from "react-native-paper";

export default function Profile() {
    const theme = useAppTheme();
    const styles = makeStyles(theme);
    const quizzes = reviewSelector.use.useQuizzes();
    const userData = authSelector.use.useUserData();
    const user = authSelector.use.useUser();
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
    const [
        deleteAccountFn,
        { isError: isDeleteError, isLoading: isDeleteLoading, error: deleteError },
    ] = useAsyncAction(deleteAccount, {
        onComplete: () => {},
    });
    const [logoutFn, { isError: isLogoutError, isLoading: isLogoutLoading, error: logoutError }] =
        useAsyncAction(logout, {
            onComplete: () => {},
        });

    const router = useRouter();

    const handlePress = (quiz: Quiz) => {
        if (quiz.type === QUIZ_TYPE.MCQ) {
            router.push({
                pathname: "../mcq",
                params: {
                    quiz_id: quiz.quiz_id,
                },
            });
        } else if (quiz.type === QUIZ_TYPE.TOFQ) {
            router.push({
                pathname: "../tofq",
                params: {
                    quiz_id: quiz.quiz_id,
                },
            });
        } else if (quiz.type === QUIZ_TYPE.DNDQ) {
            router.push({
                pathname: "/dndq",
                params: {
                    quiz_id: quiz.quiz_id,
                },
            });
        }
    };

    const pickImageFromLibrary = async () => {
        setIsUploadingPhoto(true);
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: "images",
                quality: 0.8,
                allowsEditing: true,
                aspect: [1, 1],
                base64: true,
            });

            if (!result.canceled && result.assets[0]) {
                const asset = result.assets[0];
                // TODO: Upload to Firebase storage and update user profile
                console.log("Selected image:", asset.uri);
                Alert.alert("Photo Selected", "Photo upload functionality will be implemented");
            }
        } catch (error) {
            console.error("Error picking image:", error);
            Alert.alert("Error", "Failed to select image");
        } finally {
            setIsUploadingPhoto(false);
        }
    };

    const takePhoto = async () => {
        const status = await ImagePicker.getCameraPermissionsAsync();
        if (!status.granted) {
            const permission = await ImagePicker.requestCameraPermissionsAsync();
            if (!permission.granted) {
                Alert.alert("Permission Required", "Camera permission is required to take photos");
                return;
            }
        }

        setIsUploadingPhoto(true);
        try {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: "images",
                quality: 0.8,
                allowsEditing: true,
                aspect: [1, 1],
                base64: true,
                cameraType: ImagePicker.CameraType.front,
            });

            if (!result.canceled && result.assets[0]) {
                const asset = result.assets[0];
                // TODO: Upload to Firebase storage and update user profile
                console.log("Captured photo:", asset.uri);
                Alert.alert("Photo Captured", "Photo upload functionality will be implemented");
            }
        } catch (error) {
            console.error("Error taking photo:", error);
            Alert.alert("Error", "Failed to take photo");
        } finally {
            setIsUploadingPhoto(false);
        }
    };

    const showPhotoOptions = () => {
        Alert.alert(
            "Update Profile Photo",
            "Choose how you'd like to update your profile picture",
            [
                {
                    text: "Camera",
                    onPress: takePhoto,
                },
                {
                    text: "Photo Library",
                    onPress: pickImageFromLibrary,
                },
                {
                    text: "Cancel",
                    style: "cancel",
                },
            ]
        );
    };

    const drawerRef = useRef<SettingsDrawerRef>(null);

    const handleDeleteAccount = () => {
        Alert.alert(
            "⚠️ Delete Account",
            "This action is permanent and cannot be undone. All your data, including quizzes, progress, and account information will be permanently deleted.\n\nAre you absolutely sure you want to delete your account?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete Forever",
                    style: "destructive",
                    onPress: () => {
                        deleteAccountFn();
                    },
                },
            ]
        );
    };

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout? You'll need to sign in again to access your account.",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Logout",
                    style: "default",
                    onPress: () => {
                        logoutFn();
                    },
                },
            ]
        );
    };

    return (
        <SettingsDrawer
            ref={drawerRef}
            renderDrawerContent={
                <View style={styles.drawerContainer}>
                    <View style={styles.drawerHeader}>
                        <Text style={styles.drawerTitle}>User Settings</Text>
                    </View>

                    <View style={styles.drawerContent}>
                        <View style={styles.actionButtonContainer}>
                            {user?.isAnonymous ? (
                                <Button
                                    onPress={handleDeleteAccount}
                                    mode="contained"
                                    buttonColor={theme.colors.error}
                                    textColor={theme.colors.onError}
                                    style={styles.actionButton}
                                    contentStyle={styles.actionButtonContent}
                                    labelStyle={styles.actionButtonLabel}
                                    loading={isDeleteLoading}
                                    disabled={isDeleteLoading}
                                >
                                    {isDeleteLoading ? "Deleting..." : "Delete Account"}
                                </Button>
                            ) : (
                                <Button
                                    onPress={handleLogout}
                                    mode="contained"
                                    buttonColor={theme.colors.primary}
                                    textColor={theme.colors.onPrimary}
                                    style={styles.actionButton}
                                    contentStyle={styles.actionButtonContent}
                                    labelStyle={styles.actionButtonLabel}
                                    loading={isLogoutLoading}
                                    disabled={isLogoutLoading}
                                >
                                    {isLogoutLoading ? "Logging out..." : "Logout"}
                                </Button>
                            )}
                        </View>

                        <View style={styles.linksContainer}>
                            <Link href={"/terms-of-service"} style={styles.linkWrapper}>
                                <View style={styles.linkItem}>
                                    <Ionicons
                                        name="document-text"
                                        size={20}
                                        color={theme.colors.onSurfaceVariant}
                                    />
                                    <Text style={styles.linkText}>Terms of Service</Text>
                                    <Ionicons
                                        name="chevron-forward"
                                        size={16}
                                        color={theme.colors.onSurfaceVariant}
                                    />
                                </View>
                            </Link>
                            <View style={styles.linkDivider} />
                            <Link href={"/privacy-policy"} style={styles.linkWrapper}>
                                <View style={styles.linkItem}>
                                    <Ionicons
                                        name="shield-checkmark"
                                        size={20}
                                        color={theme.colors.onSurfaceVariant}
                                    />
                                    <Text style={styles.linkText}>Privacy Policy</Text>
                                    <Ionicons
                                        name="chevron-forward"
                                        size={16}
                                        color={theme.colors.onSurfaceVariant}
                                    />
                                </View>
                            </Link>
                        </View>
                    </View>
                </View>
            }
        >
            <Container style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{
                                uri: userData?.photoURL ?? DEFAULT_USER,
                            }}
                            style={styles.avatar}
                        />
                        <Pressable
                            style={styles.editPhotoButton}
                            onPress={showPhotoOptions}
                            disabled={isUploadingPhoto}
                        >
                            {isUploadingPhoto ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <Ionicons name="camera" size={16} color="white" />
                            )}
                        </Pressable>
                    </View>
                    <View>
                        <Text style={styles.displayName}>{userData?.username || "Guest User"}</Text>
                        <View style={{ flexDirection: "row", columnGap: 8 }}>
                            <Link href={"/connections"}>
                                <Text style={{ color: theme.colors.onSurfaceVariant }}>
                                    <Text
                                        style={{ fontWeight: "600", color: theme.colors.onSurface }}
                                    >
                                        10{" "}
                                    </Text>
                                    connections
                                </Text>
                            </Link>
                            <Link href={"/under-construction"}>
                                <Text style={{ color: theme.colors.onSurfaceVariant }}>
                                    <Text
                                        style={{ fontWeight: "600", color: theme.colors.onSurface }}
                                    >
                                        2{" "}
                                    </Text>
                                    groups
                                </Text>
                            </Link>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            drawerRef.current?.open();
                        }}
                        style={{ alignSelf: "flex-start", marginLeft: "auto" }}
                    >
                        <View>
                            <Ionicons
                                name="settings-sharp"
                                size={24}
                                color={theme.colors.onSurface}
                            />
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.quizzesSection}>
                    <QuizList
                        onQuizPress={handlePress}
                        quizzes={quizzes}
                        ListHeaderComponent={
                            <Text style={styles.sectionTitle}>My Quizzes ({quizzes.length})</Text>
                        }
                    />
                </View>
            </Container>
        </SettingsDrawer>
    );
}

const makeStyles = (theme: AppTheme) => {
    return StyleSheet.create({
        container: {},
        header: {
            alignItems: "center",
            flexDirection: "row",
            paddingTop: 16,
            paddingHorizontal: 16,
        },
        avatarContainer: {
            position: "relative",
            marginRight: 16,
        },
        avatar: {
            width: 80,
            height: 80,
            borderRadius: 40,
        },
        editPhotoButton: {
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: theme.colors.primary,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 2,
            borderColor: theme.colors.surface,
            shadowColor: theme.colors.onSurface,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3,
            elevation: 5,
        },
        displayName: {
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 5,
            color: theme.colors.onSurface,
        },
        email: {
            fontSize: 16,
            color: theme.colors.onSurfaceVariant,
        },
        quizzesSection: {
            flex: 1,
            padding: 16,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 8,
            color: theme.colors.onSurface,
        },
        listContainer: {
            paddingBottom: 20,
        },
        quizItem: {
            backgroundColor: theme.colors.surface,
            padding: 16,
            marginBottom: 12,
            borderRadius: 8,
            shadowColor: theme.colors.onSurface,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        },
        quizTitle: {
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 8,
            color: theme.colors.onSurface,
        },
        quizDescription: {
            fontSize: 14,
            color: theme.colors.onSurfaceVariant,
            marginBottom: 8,
        },
        quizType: {
            fontSize: 12,
            fontWeight: "bold",
            color: theme.colors.primary,
            marginBottom: 4,
        },
        quizDate: {
            fontSize: 12,
            color: theme.colors.onSurfaceVariant,
            marginBottom: 8,
        },
        tagsContainer: {
            flexDirection: "row",
            flexWrap: "wrap",
        },
        tag: {
            fontSize: 12,
            color: theme.colors.primary,
            marginRight: 8,
            marginBottom: 4,
        },
        drawerContainer: {
            flex: 1,
            backgroundColor: theme.colors.surface,
        },
        drawerHeader: {},
        drawerTitle: {
            fontSize: 24,
            fontWeight: "bold",
            color: theme.colors.onSurface,
        },
        drawerContent: {
            flex: 1,
            justifyContent: "space-between",
            paddingTop: 8,
        },
        actionButtonContainer: {
            flex: 1,
            justifyContent: "center",
        },
        actionButton: {
            borderRadius: 12,
            shadowColor: theme.colors.onSurface,
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 6,
        },
        actionButtonContent: {
            paddingVertical: 8,
            paddingHorizontal: 16,
        },
        actionButtonLabel: {
            fontSize: 16,
            fontWeight: "600",
        },
        linksContainer: {
            backgroundColor: theme.colors.surfaceVariant,
            borderRadius: 16,
            overflow: "hidden",
            shadowColor: theme.colors.onSurface,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
        },
        linkWrapper: {
            textDecorationLine: "none",
        },
        linkItem: {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 16,
            paddingHorizontal: 20,
            backgroundColor: theme.colors.surface,
        },
        linkText: {
            flex: 1,
            fontSize: 16,
            color: theme.colors.onSurface,
            fontWeight: "500",
            marginLeft: 16,
        },
        linkDivider: {
            height: 1,
            backgroundColor: theme.colors.outlineVariant,
            marginLeft: 56,
        },
    });
};
