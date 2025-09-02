import LoadingModal from "@/components/LoadingModal";
import { RadioGroup } from "@/components/Radio";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { createReviewer } from "@/store/review/actions/createReviewer";
import { QUIZ_TYPE } from "@/types/review";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Dimensions, Pressable, StyleSheet, Text, View } from "react-native";

const { width } = Dimensions.get("window");
const imageSize = (width - 48) / 2; // 2 columns with padding

const QUIZ_RADIO_ARR = [
    {
        label: "Multiple Choice",
        value: QUIZ_TYPE.MCQ,
    },
    {
        label: "True or False",
        value: QUIZ_TYPE.TOFQ,
    },
    {
        label: "Matching",
        value: QUIZ_TYPE.DNDQ,
    },
];

export default function CreateQuiz() {
    /** note: format in base64 */
    const [assets, setAssets] = useState<ImagePicker.ImagePickerAsset[]>([]);
    const [quizType, setQuizType] = useState<QUIZ_TYPE | null>(null);
    const router = useRouter();

    const pickImage = useCallback(async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            quality: 1,
            allowsMultipleSelection: true,
        });

        if (!result.canceled) {
            setAssets((prev) => [...prev, ...result.assets]);
        }
    }, []);

    const takePhoto = useCallback(async () => {
        const status = await ImagePicker.getCameraPermissionsAsync();
        if (!status.granted) {
            const permission = await ImagePicker.requestCameraPermissionsAsync();
            if (!permission.granted) {
                console.log("permission not granted");
                return;
            }
        }
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: "images",
            quality: 1,
            allowsEditing: true,
            base64: true,
            cameraType: ImagePicker.CameraType.back,
        });
        if (result.canceled) {
            console.log("take photo cancelled");
            return;
        }
        const a = result.assets[0];
        if (!a) {
            console.log("invalid uri");
            return;
        }
        setAssets((prev) => [...prev, a]);
    }, []);

    const removeImage = useCallback((indexToRemove: number) => {
        setAssets((prev) => prev.filter((_, index) => index !== indexToRemove));
    }, []);

    const [handleCreateQuizReviewer, { isLoading: isSubmitting }] = useAsyncAction(createReviewer, {
        onComplete: () => {
            router.back();
        },
    });

    const onCreateQuizReviewer = useCallback(() => {
        Alert.alert("Create reviewer", "Create a quiz based on this assets.", [
            {
                text: "Cancel",
                onPress: () => {},
                style: "cancel",
            },
            {
                text: "Confirm",
                onPress: async () => {
                    if (!quizType) {
                        Alert.alert("Invalid quiz type");
                        return;
                    }
                    if (assets.length === 0) {
                        Alert.alert("Select atleast 1 image first.");
                        return;
                    }
                    const imagesBase64 = assets
                        .map((a) => a.base64)
                        .filter((s) => typeof s === "string");
                    const result = await handleCreateQuizReviewer(quizType, imagesBase64);
                    if (!result) {
                        Alert.alert("Server error.");
                        return;
                    }
                    Alert.alert("Reviewer created.");
                },
                style: "default",
            },
        ]);
    }, [quizType, assets]);

    return (
        <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <Text style={styles.title}>Create Quiz</Text>
                <Text style={styles.subtitle}>Upload your study materials to get started</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
                <Pressable
                    onPress={pickImage}
                    style={({ pressed }) => [
                        styles.button,
                        styles.primaryButton,
                        pressed && styles.buttonPressed,
                    ]}
                >
                    <Text style={styles.buttonIcon}>📁</Text>
                    <Text style={styles.primaryButtonText}>Select from Gallery</Text>
                </Pressable>

                <Pressable
                    onPress={takePhoto}
                    style={({ pressed }) => [
                        styles.button,
                        styles.secondaryButton,
                        pressed && styles.buttonPressed,
                    ]}
                >
                    <Text style={styles.buttonIcon}>📷</Text>
                    <Text style={styles.secondaryButtonText}>Take Photo</Text>
                </Pressable>
            </View>

            <RadioGroup
                data={QUIZ_RADIO_ARR}
                onValueChange={setQuizType}
                style={{ paddingHorizontal: 20, flexDirection: "row", gap: 12, flexWrap: "wrap" }}
            />
            {/* Save Buttons */}
            {assets.length > 0 && (
                <>
                    <View style={styles.buttonContainer}>
                        <Pressable
                            disabled={!Boolean(quizType) || isSubmitting}
                            onPress={onCreateQuizReviewer}
                            style={({ pressed }) => [
                                styles.button,
                                styles.primaryButton,
                                pressed && styles.buttonPressed,
                                !Boolean(quizType) && { opacity: 0.6 },
                            ]}
                        >
                            <Text style={styles.buttonIcon}>💡</Text>
                            <Text style={styles.primaryButtonText}>
                                {isSubmitting ? "Creating Reviewer..." : "Create Reviewer"}
                            </Text>
                        </Pressable>
                    </View>
                </>
            )}

            {/* Images Section */}
            <View style={styles.imagesSection}>
                <View style={styles.imagesSectionHeader}>
                    <Text style={styles.imagesSectionTitle}>
                        Review Materials ({assets.length})
                    </Text>
                    {assets.length > 0 && (
                        <Pressable onPress={() => setAssets([])}>
                            <Text style={styles.clearAllText}>Clear All</Text>
                        </Pressable>
                    )}
                </View>

                <FlashList
                    data={assets}
                    numColumns={2}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateIcon}>📚</Text>
                            <Text style={styles.emptyStateTitle}>No materials uploaded yet</Text>
                            <Text style={styles.emptyStateText}>
                                Upload images of your notes, textbooks, or study materials to create
                                a quiz
                            </Text>
                        </View>
                    )}
                    ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
                    renderItem={({ item, index }) => (
                        <View style={styles.imageContainer}>
                            <Image
                                source={{ uri: item.uri }}
                                style={styles.image}
                                contentFit="cover"
                            />
                            <Pressable
                                style={styles.removeButton}
                                onPress={() => removeImage(index)}
                            >
                                <Text style={styles.removeButtonText}>×</Text>
                            </Pressable>
                        </View>
                    )}
                />
            </View>
            <LoadingModal
                isVisible={isSubmitting}
                loadingText="Creating reviewer, please don't close the app..."
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
        rowGap: 12,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
        backgroundColor: "white",
        borderBottomWidth: 1,
        borderBottomColor: "#e9ecef",
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#212529",
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: "#6c757d",
        fontWeight: "400",
    },
    buttonContainer: {
        paddingHorizontal: 20,
        columnGap: 12,
        flexDirection: "row",
        width: "100%",
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        flexGrow: 1,
    },
    primaryButton: {
        backgroundColor: "#007bff",
    },
    secondaryButton: {
        backgroundColor: "white",
        borderWidth: 2,
        borderColor: "#007bff",
    },
    buttonPressed: {
        transform: [{ scale: 0.98 }],
        opacity: 0.9,
    },
    buttonIcon: {
        fontSize: 20,
        marginRight: 12,
    },
    primaryButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    secondaryButtonText: {
        color: "#007bff",
        fontSize: 16,
        fontWeight: "600",
    },
    imagesSection: {
        flex: 1,
        padding: 20,
    },
    imagesSectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    imagesSectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#212529",
    },
    clearAllText: {
        color: "#dc3545",
        fontSize: 14,
        fontWeight: "500",
    },
    listContainer: {
        paddingBottom: 20,
    },
    emptyState: {
        alignItems: "center",
        paddingVertical: 60,
        paddingHorizontal: 40,
    },
    emptyStateIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    emptyStateTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: "#495057",
        marginBottom: 8,
        textAlign: "center",
    },
    emptyStateText: {
        fontSize: 16,
        color: "#6c757d",
        textAlign: "center",
        lineHeight: 24,
    },
    imageContainer: {
        marginHorizontal: 8,
        marginBottom: 16,
        paddingTop: 8,
        paddingRight: 8,
    },
    image: {
        width: imageSize,
        height: imageSize,
        borderRadius: 12,
        backgroundColor: "#e9ecef",
    },
    removeButton: {
        position: "absolute",
        top: 0,
        right: 0,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "#dc3545",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 5,
    },
    removeButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
        lineHeight: 16,
    },
});
