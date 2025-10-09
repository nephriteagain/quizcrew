import { useAsyncAction } from "@/hooks/useAsyncAction";
import { AppTheme, useAppTheme } from "@/providers/ThemeProvider";
import { deleteAccount } from "@/store/user/actions/deleteAccount";
import { logout } from "@/store/user/actions/logout";
import authSelector from "@/store/user/user.store";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import LoadingModal from "./LoadingModal";

interface SettingsDrawerContentProps {
    onClose?: () => void;
}

export default function SettingsDrawerContent({ onClose }: SettingsDrawerContentProps) {
    const theme = useAppTheme();
    const styles = makeStyles(theme);
    const user = authSelector.use.useUser();

    const [logoutFn, { isLoading: isLoggingOut }] = useAsyncAction(logout);
    const [deleteAccountFn, { isLoading: isDeletingAccount }] = useAsyncAction(deleteAccount);

    const isAnonymous = user?.isAnonymous ?? false;

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Logout",
                    onPress: async () => {
                        try {
                            await logoutFn();
                            onClose?.();
                        } catch (error) {
                            Alert.alert("Error", "Failed to logout. Please try again.");
                        }
                    },
                    style: "destructive",
                },
            ]
        );
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            "Delete Account",
            "Are you sure you want to delete your anonymous account? This action cannot be undone and all your data will be lost.",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    onPress: async () => {
                        try {
                            await deleteAccountFn();
                            onClose?.();
                        } catch (error) {
                            Alert.alert("Error", "Failed to delete account. Please try again.");
                        }
                    },
                    style: "destructive",
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Settings</Text>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Ionicons
                        name="close-outline"
                        size={24}
                        color={theme.colors.onSurface}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                {/* Legal Links */}
                <Link href="/privacy-policy" asChild>
                    <TouchableOpacity style={styles.settingButton} onPress={onClose}>
                        <Ionicons
                            name="shield-outline"
                            size={24}
                            color={theme.colors.primary}
                        />
                        <Text style={styles.settingButtonText}>Privacy Policy</Text>
                        <Ionicons
                            name="chevron-forward-outline"
                            size={20}
                            color={theme.colors.onSurfaceVariant}
                        />
                    </TouchableOpacity>
                </Link>

                <Link href="/terms-of-service" asChild>
                    <TouchableOpacity style={styles.settingButton} onPress={onClose}>
                        <Ionicons
                            name="document-text-outline"
                            size={24}
                            color={theme.colors.primary}
                        />
                        <Text style={styles.settingButtonText}>Terms of Service</Text>
                        <Ionicons
                            name="chevron-forward-outline"
                            size={20}
                            color={theme.colors.onSurfaceVariant}
                        />
                    </TouchableOpacity>
                </Link>

                <View style={styles.separator} />

                {/* Account Actions */}
                {isAnonymous ? (
                    <TouchableOpacity style={styles.settingButton} onPress={handleDeleteAccount}>
                        <Ionicons
                            name="trash-outline"
                            size={24}
                            color={theme.colors.error}
                        />
                        <Text style={[styles.settingButtonText, { color: theme.colors.error }]}>
                            Delete Account
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.settingButton} onPress={handleLogout}>
                        <Ionicons
                            name="log-out-outline"
                            size={24}
                            color={theme.colors.error}
                        />
                        <Text style={[styles.settingButtonText, { color: theme.colors.error }]}>
                            Logout
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            <LoadingModal
                isVisible={isLoggingOut}
                loadingText="Logging out..."
            />
            <LoadingModal
                isVisible={isDeletingAccount}
                loadingText="Deleting account..."
            />
        </View>
    );
}

const makeStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.surface,
        },
        header: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
        },
        headerTitle: {
            fontSize: 20,
            fontWeight: "bold",
            color: theme.colors.onSurface,
        },
        closeButton: {
            padding: 4,
        },
        content: {
            flex: 1,
        },
        settingButton: {
            flexDirection: "row",
            alignItems: "center",
            padding: 16,
            backgroundColor: theme.colors.surfaceVariant,
            borderRadius: 12,
            marginBottom: 12,
            columnGap: 12,
        },
        settingButtonText: {
            fontSize: 16,
            fontWeight: "600",
            color: theme.colors.primary,
            flex: 1,
        },
        separator: {
            height: 1,
            backgroundColor: theme.colors.outline,
            marginVertical: 16,
            marginHorizontal: 16,
        },
    });