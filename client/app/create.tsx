import Container from "@/components/Container";
import LoadingModal from "@/components/LoadingModal";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { AppTheme, useAppTheme } from "@/providers/ThemeProvider";
import { createReviewer } from "@/store/review/actions/createReviewer";
import { QUIZ_TYPE } from "@/types/review";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Dimensions, Pressable, StyleSheet, Text, View } from "react-native";

const { width } = Dimensions.get("window");
const imageSize = (width - 48) / 2; // 2 columns with padding

const QUIZ_LABEL = {
    [QUIZ_TYPE.MCQ]: "Multiple Choice",
    [QUIZ_TYPE.TOFQ]: "True or False",
    [QUIZ_TYPE.DNDQ]: "Matching (Drag and Drop)",
};

export default function CreateQuiz() {
    const theme = useAppTheme();
    const styles = makeStyles(theme);
    /** note: format in base64 */
    const [assets, setAssets] = useState<ImagePicker.ImagePickerAsset[]>([]);
    const router = useRouter();
    const params = useLocalSearchParams<{ type: QUIZ_TYPE }>();
    const quizType = params.type;

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            quality: 1,
            allowsMultipleSelection: true,
            base64: true,
        });

        if (!result.canceled) {
            setAssets((prev) => [...prev, ...result.assets]);
        }
    };

    const takePhoto = async () => {
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
    };

    const removeImage = (indexToRemove: number) => {
        setAssets((prev) => prev.filter((_, index) => index !== indexToRemove));
    };

    const asyncActionOptions = {
        onComplete: () => {
            router.back();
            router.back();
            router.back();
        },
    };

    const [handleCreateQuizReviewer, { isLoading: isSubmitting }] = useAsyncAction(
        createReviewer,
        asyncActionOptions
    );

    const onCreateQuizReviewer = () => {
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
                    console.log(`sending ${imagesBase64.length} images...`);
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
    };

    return (
        <Container style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <Text style={styles.title}>Create {QUIZ_LABEL[quizType]} Quiz</Text>
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
        </Container>
    );
}

const makeStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            rowGap: 12,
        },
        header: {
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 16,
            backgroundColor: theme.colors.surface,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.outline,
        },
        title: {
            fontSize: 28,
            fontWeight: "700",
            color: theme.colors.onSurface,
            marginBottom: 4,
        },
        subtitle: {
            fontSize: 16,
            color: theme.colors.onSurfaceVariant,
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
            shadowColor: theme.colors.onSurface,
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
            backgroundColor: theme.colors.primary,
        },
        secondaryButton: {
            backgroundColor: theme.colors.surface,
            borderWidth: 2,
            borderColor: theme.colors.primary,
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
            color: theme.colors.onPrimary,
            fontSize: 16,
            fontWeight: "600",
        },
        secondaryButtonText: {
            color: theme.colors.primary,
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
            color: theme.colors.onSurface,
        },
        clearAllText: {
            color: theme.colors.error,
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
            color: theme.colors.onSurface,
            marginBottom: 8,
            textAlign: "center",
        },
        emptyStateText: {
            fontSize: 16,
            color: theme.colors.onSurfaceVariant,
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
            backgroundColor: theme.colors.surfaceVariant,
        },
        removeButton: {
            position: "absolute",
            top: 0,
            right: 0,
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: theme.colors.error,
            justifyContent: "center",
            alignItems: "center",
            shadowColor: theme.colors.onSurface,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3,
            elevation: 5,
        },
        removeButtonText: {
            color: theme.colors.onError,
            fontSize: 16,
            fontWeight: "600",
            lineHeight: 16,
        },
    });
