import { useAsyncStatus } from "@/hooks/useAsyncStatus";
import { AppTheme, useAppTheme } from "@/providers/ThemeProvider";
import { ADD_USERNAME_RESULT, addUsername } from "@/store/user/actions/addUsername";
import userSelector from "@/store/user/user.store";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

interface UsernameDialogProps {
    visible: boolean;
    onClose: () => void;
    onSuccess: (username: string) => void;
}

export default function UsernameDialog({ visible, onClose, onSuccess }: UsernameDialogProps) {
    const theme = useAppTheme();
    const styles = makeStyles(theme);
    const [username, setUsername] = useState("");
    const user = userSelector.use.user();
    const [addUsernameFn, loading] = useAsyncStatus(addUsername);

    const validateUsername = (text: string) => {
        // Username validation: 3-20 characters, lowercase alphanumeric and underscores only
        const usernameRegex = /^[a-z0-9_]{3,20}$/;
        return usernameRegex.test(text);
    };

    const handleSubmit = async () => {
        if (!username.trim()) {
            Alert.alert("Error", "Please enter a username");
            return;
        }

        if (!validateUsername(username)) {
            Alert.alert(
                "Invalid Username",
                "Username must be 3-20 characters long and contain only lowercase letters, numbers, and underscores"
            );
            return;
        }

        if (!user?.uid) {
            Alert.alert("Error", "User not authenticated");
            return;
        }

        const result = await addUsernameFn(user.uid, username);

        switch (result) {
            case ADD_USERNAME_RESULT.SUCESS:
                onSuccess(username);
                setUsername("");
                onClose();
                break;
            case ADD_USERNAME_RESULT.NO_USERNAME:
                Alert.alert("Error", "Please enter a username");
                break;
            case ADD_USERNAME_RESULT.ALREADY_USED:
                Alert.alert(
                    "Username Taken",
                    "This username is already taken. Please choose another one."
                );
                break;
            case ADD_USERNAME_RESULT.UNEXPECTED:
                Alert.alert("Error", "Something went wrong. Please try again.");
                break;
            default:
                Alert.alert("Error", "Failed to create username. Please try again.");
                break;
        }
    };

    const handleCancel = () => {
        setUsername("");
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <View style={styles.dialog}>
                    <View style={styles.header}>
                        <Ionicons name="person-add" size={24} color={theme.colors.primary} />
                        <Text style={styles.title}>Create Username</Text>
                    </View>

                    <Text style={styles.description}>
                        Choose a unique username to identify yourself in the community.
                    </Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Username</Text>
                        <TextInput
                            style={styles.input}
                            value={username}
                            onChangeText={(text) => setUsername(text.toLowerCase())}
                            placeholder="Enter your username"
                            placeholderTextColor={theme.colors.onSurfaceVariant}
                            autoCapitalize="none"
                            autoCorrect={false}
                            maxLength={20}
                            editable={!loading}
                        />
                        <Text style={styles.inputHint}>
                            3-20 characters, lowercase letters, numbers, and underscores only
                        </Text>
                    </View>

                    <View style={styles.buttonContainer}>
                        <Pressable
                            style={[styles.button, styles.cancelButton]}
                            onPress={handleCancel}
                            disabled={loading}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </Pressable>

                        <Pressable
                            style={[
                                styles.button,
                                styles.submitButton,
                                (!validateUsername(username) || loading) && styles.disabledButton,
                            ]}
                            onPress={handleSubmit}
                            disabled={!validateUsername(username) || loading}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color={theme.colors.onPrimary} />
                            ) : (
                                <Text style={styles.submitButtonText}>Create</Text>
                            )}
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const makeStyles = (theme: AppTheme) => {
    return StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
        },
        dialog: {
            backgroundColor: theme.colors.surface,
            borderRadius: 16,
            padding: 24,
            width: "100%",
            maxWidth: 400,
            shadowColor: theme.colors.onSurface,
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 8,
        },
        header: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
        },
        title: {
            fontSize: 20,
            fontWeight: "bold",
            color: theme.colors.onSurface,
            marginLeft: 12,
        },
        description: {
            fontSize: 16,
            color: theme.colors.onSurfaceVariant,
            lineHeight: 22,
            marginBottom: 24,
        },
        inputContainer: {
            marginBottom: 24,
        },
        inputLabel: {
            fontSize: 16,
            fontWeight: "600",
            color: theme.colors.onSurface,
            marginBottom: 8,
        },
        input: {
            borderWidth: 1,
            borderColor: theme.colors.outline,
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
            backgroundColor: theme.colors.surfaceVariant,
            color: theme.colors.onSurface,
            marginBottom: 8,
        },
        inputHint: {
            fontSize: 12,
            color: theme.colors.onSurfaceVariant,
            fontStyle: "italic",
        },
        buttonContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 12,
        },
        button: {
            flex: 1,
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 8,
            alignItems: "center",
            justifyContent: "center",
            minHeight: 44,
        },
        cancelButton: {
            backgroundColor: theme.colors.surfaceVariant,
            borderWidth: 1,
            borderColor: theme.colors.outline,
        },
        cancelButtonText: {
            fontSize: 16,
            fontWeight: "600",
            color: theme.colors.onSurfaceVariant,
        },
        submitButton: {
            backgroundColor: theme.colors.primary,
        },
        submitButtonText: {
            fontSize: 16,
            fontWeight: "600",
            color: theme.colors.onPrimary,
        },
        disabledButton: {
            backgroundColor: theme.colors.surfaceVariant,
            opacity: 0.6,
        },
    });
};
