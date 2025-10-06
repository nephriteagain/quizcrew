import { DEFAULT_USER } from "@/constants/values";
import { analytics } from "@/firebase";
import { AppTheme, useAppTheme } from "@/providers/ThemeProvider";
import { Connection, ConnectionStatus } from "@/types/user";
import { Ionicons } from "@expo/vector-icons";
import { logEvent } from "@react-native-firebase/analytics";
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";

interface ConnectionCardProps {
    connection: Connection;
    handleConnect?: (uid: string) => void;
    handleAccept?: (uid: string) => void;
    handleCancel?: (uid: string) => void;
    handlePress?: () => void;
    isLoading?: boolean;
}

export default function ConnectionCard({
    connection,
    handleConnect,
    handlePress,
    handleAccept,
    handleCancel,
    isLoading,
}: ConnectionCardProps) {
    const theme = useAppTheme();
    const styles = makeStyles(theme);

    const getStatusColor = (status?: ConnectionStatus) => {
        switch (status) {
            case "CONNECTED":
                return "#4CAF50";
            case "INVITED":
                return "#FF9800";
            case "REQUESTED":
                return "#9E9E9E";
            default:
                return "#9E9E9E";
        }
    };

    const getStatusText = (status?: ConnectionStatus) => {
        switch (status) {
            case "CONNECTED":
                return "Connected";
            case "INVITED":
                return "Invited";
            case "REQUESTED":
                return "Requested";
            default:
                return "Not Connected";
        }
    };

    const showConnectBtn = handleConnect && !connection.meta;
    const showAcceptBtn = handleAccept && connection.meta?.status === "INVITED";
    const showCancelBtn = handleCancel && connection.meta?.status === "INVITED";

    return (
        <Pressable
            style={styles.itemContainer}
            onPress={handlePress}
            android_ripple={{ color: theme.colors?.primary }}
            disabled={isLoading}
        >
            <View style={styles.avatarContainer}>
                <Image
                    source={{ uri: connection.data?.photoURL || DEFAULT_USER }}
                    style={styles.connectionAvatar}
                />
                <View
                    style={[
                        styles.statusIndicator,
                        { backgroundColor: getStatusColor(connection.meta?.status) },
                    ]}
                />
            </View>
            <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{connection.data?.username || "Unknown User"}</Text>
                <View style={styles.connectionMeta}>
                    <Text style={styles.statusText}>{getStatusText(connection.meta?.status)}</Text>
                </View>
            </View>
            <View style={styles.actionsContainer}>
                {showConnectBtn && (
                    <TouchableOpacity
                        disabled={isLoading}
                        hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
                        style={styles.connectButton}
                        onPress={() => {
                            logEvent(analytics, "send_connection_request", {
                                target_user_id: connection.data.uid,
                            });
                            console.log(connection);
                            handleConnect(connection.data.uid);
                        }}
                    >
                        <Ionicons name="person-add" size={16} color="white" />
                        <Text style={styles.connectButtonText}>Connect</Text>
                    </TouchableOpacity>
                )}
                {showAcceptBtn && (
                    <TouchableOpacity
                        disabled={isLoading}
                        hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
                        style={[styles.actionButton, styles.acceptButton]}
                        onPress={() => {
                            logEvent(analytics, "accept_connection_request", {
                                connection_user_id: connection.data.uid,
                            });
                            handleAccept(connection.data.uid);
                        }}
                    >
                        <Ionicons name="checkmark" size={14} color="white" />
                    </TouchableOpacity>
                )}
                {showCancelBtn && (
                    <TouchableOpacity
                        disabled={isLoading}
                        hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
                        style={[styles.actionButton, styles.cancelButton]}
                        onPress={() => {
                            logEvent(analytics, "reject_connection_request", {
                                connection_user_id: connection.data.uid,
                            });
                            handleCancel(connection.data.uid);
                        }}
                    >
                        <Ionicons name="close" size={14} color={theme.colors.error} />
                    </TouchableOpacity>
                )}
                {!showConnectBtn && !showAcceptBtn && !showCancelBtn && (
                    <Ionicons name="chevron-forward" size={20} color={theme.colors.outline} />
                )}
            </View>
        </Pressable>
    );
}

const makeStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {},
        listContainer: {
            paddingHorizontal: 16,
            paddingBottom: 20,
        },
        sectionHeader: {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 12,
            paddingTop: 20,
            // backgroundColor: theme.colors.surfaceVariant,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: "bold",
            color: theme.colors.onSurface,
        },
        sectionCount: {
            fontSize: 16,
            color: theme.colors.onSurfaceVariant,
            marginLeft: 8,
        },
        itemContainer: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: theme.colors.surface,
            padding: 16,
            marginBottom: 8,
            borderRadius: 12,
            shadowColor: theme.colors.onSurface,
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 2,
        },
        avatarContainer: {
            position: "relative",
            marginRight: 12,
        },
        groupAvatar: {
            width: 50,
            height: 50,
            borderRadius: 12,
        },
        connectionAvatar: {
            width: 50,
            height: 50,
            borderRadius: 25,
        },
        statusIndicator: {
            position: "absolute",
            bottom: 2,
            right: 2,
            width: 12,
            height: 12,
            borderRadius: 6,
            borderWidth: 2,
            borderColor: theme.colors.surface,
        },
        unreadBadge: {
            position: "absolute",
            top: -4,
            right: -4,
            backgroundColor: theme.colors.error,
            borderRadius: 10,
            minWidth: 20,
            height: 20,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 6,
        },
        unreadText: {
            color: theme.colors.onError,
            fontSize: 12,
            fontWeight: "bold",
        },
        itemInfo: {
            flex: 1,
        },
        itemName: {
            fontSize: 16,
            fontWeight: "600",
            color: theme.colors.onSurface,
            marginBottom: 4,
        },
        itemDescription: {
            fontSize: 14,
            color: theme.colors.onSurfaceVariant,
            marginBottom: 4,
        },
        groupMeta: {
            flexDirection: "row",
            alignItems: "center",
        },
        memberCount: {
            fontSize: 12,
            color: theme.colors.primary,
            fontWeight: "500",
        },
        lastActivity: {
            fontSize: 12,
            color: theme.colors.onSurfaceVariant,
            marginLeft: 4,
        },
        connectionMeta: {
            flexDirection: "column",
        },
        statusText: {
            fontSize: 13,
            color: theme.colors.onSurfaceVariant,
            marginBottom: 2,
        },
        mutualFriends: {
            fontSize: 12,
            color: theme.colors.onSurfaceVariant,
        },
        connectButton: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: theme.colors.primary,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 16,
            gap: 4,
        },
        connectButtonText: {
            color: "white",
            fontSize: 12,
            fontWeight: "600",
        },
        actionsContainer: {
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
        },
        actionButton: {
            width: 32,
            height: 32,
            borderRadius: 16,
            alignItems: "center",
            justifyContent: "center",
        },
        acceptButton: {
            backgroundColor: theme.colors.primary,
        },
        cancelButton: {
            backgroundColor: theme.colors.surfaceVariant,
            borderWidth: 1,
            borderColor: theme.colors.error,
        },
    });
