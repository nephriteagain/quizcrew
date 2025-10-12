import { DEFAULT_GROUP } from "@/constants/values";
import { AppTheme, useAppTheme } from "@/providers/ThemeProvider";
import { Group } from "@/types/user";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

export interface GroupCardProps extends Group {
    handlePress?: () => void;
    lastActivity?: string;
    unreadMessages?: number;
}

export default function GroupCard({ handlePress, ...item }: GroupCardProps) {
    const theme = useAppTheme();
    const styles = makeStyles(theme);

    return (
        <Pressable
            style={styles.itemContainer}
            android_ripple={{ color: theme.colors?.primary }}
            onPress={handlePress}
        >
            <View style={styles.avatarContainer}>
                <Image source={{ uri: item.avatar ?? DEFAULT_GROUP }} style={styles.groupAvatar} />
                {item.unreadMessages && item.unreadMessages > 0 && (
                    <View style={styles.unreadBadge}>
                        <Text style={styles.unreadText}>
                            {item.unreadMessages > 99 ? "99+" : item.unreadMessages}
                        </Text>
                    </View>
                )}
            </View>
            <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text numberOfLines={3} style={styles.itemDescription}>
                    {item.description}
                </Text>
                <View style={styles.groupMeta}>
                    <Text style={styles.memberCount}>
                        {item.memberCount} member{item.memberCount > 1 ? "s" : ""}
                    </Text>
                    <Text style={styles.lastActivity}>• {item.lastActivity}</Text>
                </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.outline} />
        </Pressable>
    );
}

const makeStyles = (theme: AppTheme) =>
    StyleSheet.create({
        itemContainer: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: theme.colors.surface,
            padding: 16,
            borderRadius: 12,
            shadowColor: theme.colors.onSurface,
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 2,
            gap: 12,
        },
        avatarContainer: {
            position: "relative",
        },
        groupAvatar: {
            width: 50,
            height: 50,
            borderRadius: 12,
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
            gap: 4,
        },
        itemName: {
            fontSize: 16,
            fontWeight: "600",
            color: theme.colors.onSurface,
        },
        itemDescription: {
            fontSize: 14,
            color: theme.colors.onSurfaceVariant,
        },
        groupMeta: {
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
        },
        memberCount: {
            fontSize: 12,
            color: theme.colors.primary,
            fontWeight: "500",
        },
        lastActivity: {
            fontSize: 12,
            color: theme.colors.onSurfaceVariant,
        },
    });
