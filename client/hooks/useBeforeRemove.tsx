import { router, useFocusEffect, useNavigation } from "expo-router";
import { useCallback, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";

import { useAppTheme } from "@/providers/ThemeProvider";

export interface UseBackButtonConfirmationOptions {
    shouldShowConfirmation: () => boolean;
    onConfirm?: () => void;
}

export interface ConfirmationModalProps {
    title?: string;
    description?: string;
    cancelText?: string;
    confirmText?: string;
}

/**
 * Custom hook for handling back button confirmation with a reusable modal
 *
 * @example
 * // Basic usage
 * const { ConfirmationModal } = useBackButtonConfirmation({
 *   shouldShowConfirmation: () => hasUnsavedChanges,
 * });
 *
 * // Custom modal props
 * const { ConfirmationModal } = useBackButtonConfirmation({
 *   shouldShowConfirmation: () => hasUnsavedChanges,
 *   modalProps: {
 *     title: "Unsaved Changes",
 *     description: "You have unsaved changes that will be lost.",
 *     cancelText: "Keep Editing",
 *     confirmText: "Discard Changes",
 *   },
 * });
 *
 * // Custom confirm action
 * const { ConfirmationModal } = useBackButtonConfirmation({
 *   shouldShowConfirmation: () => hasUnsavedChanges,
 *   onConfirm: () => saveAndExit(),
 * });
 */

export const useBeforeRemove = ({
    shouldShowConfirmation,
    onConfirm,
}: UseBackButtonConfirmationOptions) => {
    const [showExitConfirmation, setShowExitConfirmation] = useState(false);
    const theme = useAppTheme();
    const navigation = useNavigation();

    const handleExitConfirm = () => {
        setShowExitConfirmation(false);
        if (onConfirm) {
            onConfirm();
        } else {
            router.back(); // Default navigation back
        }
    };

    const handleExitCancel = () => {
        setShowExitConfirmation(false);
    };

    // Set up back button handler
    useFocusEffect(
        useCallback(() => {
            const unsubscribe = navigation.addListener("beforeRemove", (e) => {
                if (!shouldShowConfirmation()) {
                    // If we don't need confirmation, allow the action
                    return;
                }

                // Prevent default behavior of leaving the screen
                e.preventDefault();

                // Show confirmation modal
                setShowExitConfirmation(true);
            });

            return unsubscribe;
        }, [shouldShowConfirmation, navigation])
    );

    // Confirmation Modal Component
    const ConfirmationModal = (props: ConfirmationModalProps) => {
        const {
            title = "Leave Page",
            description = "Are you sure you want to leave this page?",
            cancelText = "Continue",
            confirmText = "Exit",
        } = props;
        return (
            <Modal
                visible={showExitConfirmation}
                transparent={true}
                animationType="fade"
                onRequestClose={handleExitCancel}
                statusBarTranslucent
            >
                <View
                    style={{
                        flex: 1,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 20,
                    }}
                >
                    <View
                        style={{
                            backgroundColor: theme.colors.surface,
                            borderRadius: 16,
                            padding: 24,
                            width: "100%",
                            maxWidth: 400,
                            shadowColor: theme.colors.onSurface,
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.2,
                            shadowRadius: 8,
                            elevation: 8,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: "bold",
                                color: theme.colors.onSurface,
                                textAlign: "center",
                                marginBottom: 12,
                            }}
                        >
                            {title}
                        </Text>
                        <Text
                            style={{
                                fontSize: 16,
                                color: theme.colors.onSurfaceVariant,
                                textAlign: "center",
                                lineHeight: 22,
                                marginBottom: 24,
                            }}
                        >
                            {description}
                        </Text>
                        <View
                            style={{
                                flexDirection: "row",
                                gap: 12,
                            }}
                        >
                            <Pressable
                                style={{
                                    flex: 1,
                                    padding: 16,
                                    borderRadius: 12,
                                    backgroundColor: theme.colors.surface,
                                    borderWidth: 2,
                                    borderColor: theme.colors.outline,
                                    alignItems: "center",
                                }}
                                onPress={handleExitCancel}
                                android_ripple={{ color: theme.colors.surfaceVariant }}
                            >
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: "600",
                                        color: theme.colors.onSurface,
                                    }}
                                >
                                    {cancelText}
                                </Text>
                            </Pressable>
                            <Pressable
                                style={{
                                    flex: 1,
                                    padding: 16,
                                    borderRadius: 12,
                                    backgroundColor: theme.colors.error,
                                    alignItems: "center",
                                }}
                                onPress={handleExitConfirm}
                                android_ripple={{ color: theme.colors.onError + "20" }}
                            >
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: "600",
                                        color: theme.colors.onError,
                                    }}
                                >
                                    {confirmText}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    };

    return {
        ConfirmationModal,
        showConfirmation: () => setShowExitConfirmation(true),
        hideConfirmation: () => setShowExitConfirmation(false),
    };
};
