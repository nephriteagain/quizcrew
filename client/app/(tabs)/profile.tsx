import QuizList from "@/components/QuizList";
import { DEFAULT_USER } from "@/constants/values";
import reviewSelector from "@/store/review/review.store";
import userSelector from "@/store/user/user.store";
import { Quiz, QUIZ_TYPE } from "@/types/review";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Link, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function Profile() {
    const quizzes = reviewSelector.use.quizzes();
    const userData = userSelector.use.userData();
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

    const router = useRouter();

    const handlePress = useCallback(
        (quiz: Quiz) => {
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
        },
        [router]
    );

    const pickImageFromLibrary = useCallback(async () => {
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
    }, []);

    const takePhoto = useCallback(async () => {
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
    }, []);

    const showPhotoOptions = useCallback(() => {
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
    }, [takePhoto, pickImageFromLibrary]);

    return (
        <View style={styles.container}>
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
                            <Text style={{ color: "#000000bf" }}>
                                <Text style={{ fontWeight: "600", color: "black" }}>10 </Text>
                                connections
                            </Text>
                        </Link>
                        <Link href={"/under-construction"}>
                            <Text style={{ color: "#000000bf" }}>
                                <Text style={{ fontWeight: "600", color: "black" }}>2 </Text>
                                groups
                            </Text>
                        </Link>
                    </View>
                </View>
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    header: {
        alignItems: "center",
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
        flexDirection: "row",
        paddingTop: 32,
        paddingHorizontal: 16,
        paddingBottom: 16,
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
        backgroundColor: "#007AFF",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "white",
        shadowColor: "#000",
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
    },
    email: {
        fontSize: 16,
        color: "#666",
    },
    quizzesSection: {
        flex: 1,
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#333",
    },
    listContainer: {
        paddingBottom: 20,
    },
    quizItem: {
        backgroundColor: "#fff",
        padding: 16,
        marginBottom: 12,
        borderRadius: 8,
        shadowColor: "#000",
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
        color: "#333",
    },
    quizDescription: {
        fontSize: 14,
        color: "#666",
        marginBottom: 8,
    },
    quizType: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#007AFF",
        marginBottom: 4,
    },
    quizDate: {
        fontSize: 12,
        color: "#999",
        marginBottom: 8,
    },
    tagsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    tag: {
        fontSize: 12,
        color: "#007AFF",
        marginRight: 8,
        marginBottom: 4,
    },
});
