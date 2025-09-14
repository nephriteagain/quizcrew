import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, SectionList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from "react-native-reanimated";
import { useState } from "react";

import Container from "@/components/Container";
import { AppTheme, useAppTheme } from "@/providers/ThemeProvider";

interface Connection {
    id: string;
    name: string;
    avatar: string;
    status: "online" | "offline" | "away";
    lastSeen?: string;
    mutualFriends?: number;
}

interface Group {
    id: string;
    name: string;
    avatar: string;
    memberCount: number;
    lastActivity: string;
    unreadMessages?: number;
    description: string;
}

interface SectionData {
    title: string;
    data: (Group | Connection)[];
    type: "groups" | "connections";
}

const mockGroups: Group[] = [
    {
        id: "1",
        name: "Quiz Masters",
        avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&h=100&fit=crop&crop=faces",
        memberCount: 234,
        lastActivity: "2 hours ago",
        unreadMessages: 5,
        description: "Community for quiz enthusiasts",
    },
    {
        id: "2",
        name: "Study Group Alpha",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
        memberCount: 45,
        lastActivity: "1 day ago",
        unreadMessages: 12,
        description: "Weekly study sessions",
    },
    {
        id: "3",
        name: "Trivia Night",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b820?w=100&h=100&fit=crop&crop=faces",
        memberCount: 89,
        lastActivity: "3 days ago",
        description: "Friday night trivia challenges",
    },
];

const mockConnections: Connection[] = [
    {
        id: "1",
        name: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces",
        status: "online",
        mutualFriends: 12,
    },
    {
        id: "2",
        name: "Mike Chen",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces",
        status: "away",
        lastSeen: "30 min ago",
        mutualFriends: 8,
    },
    {
        id: "3",
        name: "Emily Davis",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces",
        status: "offline",
        lastSeen: "2 hours ago",
        mutualFriends: 15,
    },
    {
        id: "4",
        name: "Alex Rodriguez",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
        status: "online",
        mutualFriends: 6,
    },
    {
        id: "5",
        name: "Jessica Kim",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces",
        status: "away",
        lastSeen: "1 hour ago",
        mutualFriends: 9,
    },
];

export default function Connections() {
    const theme = useAppTheme();
    const styles = makeStyles(theme);
    const [fabExpanded, setFabExpanded] = useState(false);

    // Animation values
    const fabRotation = useSharedValue(0);
    const optionsOpacity = useSharedValue(0);
    const optionsScale = useSharedValue(0.5);

    const toggleFab = () => {
        const newExpanded = !fabExpanded;
        setFabExpanded(newExpanded);

        fabRotation.value = withSpring(newExpanded ? 45 : 0);
        optionsOpacity.value = withTiming(newExpanded ? 1 : 0, { duration: 200 });
        optionsScale.value = withSpring(newExpanded ? 1 : 0.5);
    };

    const handleAddConnection = () => {
        console.log('Add Connection pressed');
        setFabExpanded(false);
        fabRotation.value = withSpring(0);
        optionsOpacity.value = withTiming(0, { duration: 200 });
        optionsScale.value = withSpring(0.5);
    };

    const handleAddCircle = () => {
        console.log('Add Circle pressed');
        setFabExpanded(false);
        fabRotation.value = withSpring(0);
        optionsOpacity.value = withTiming(0, { duration: 200 });
        optionsScale.value = withSpring(0.5);
    };

    // Animated styles
    const fabAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${fabRotation.value}deg` }],
    }));

    const optionsAnimatedStyle = useAnimatedStyle(() => ({
        opacity: optionsOpacity.value,
        transform: [{ scale: optionsScale.value }],
    }));
    const sections: SectionData[] = [
        {
            title: "Circles",
            data: mockGroups,
            type: "groups",
        },
        {
            title: "Connections",
            data: mockConnections,
            type: "connections",
        },
    ];

    const getStatusColor = (status: Connection["status"]) => {
        switch (status) {
            case "online":
                return "#4CAF50";
            case "away":
                return "#FF9800";
            case "offline":
                return "#9E9E9E";
            default:
                return "#9E9E9E";
        }
    };

    const renderGroupItem = (item: Group) => (
        <TouchableOpacity style={styles.itemContainer}>
            <View style={styles.avatarContainer}>
                <Image source={{ uri: item.avatar }} style={styles.groupAvatar} />
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
                <Text style={styles.itemDescription}>{item.description}</Text>
                <View style={styles.groupMeta}>
                    <Text style={styles.memberCount}>{item.memberCount} members</Text>
                    <Text style={styles.lastActivity}>• {item.lastActivity}</Text>
                </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.outline} />
        </TouchableOpacity>
    );

    const renderConnectionItem = (item: Connection) => (
        <TouchableOpacity style={styles.itemContainer}>
            <View style={styles.avatarContainer}>
                <Image source={{ uri: item.avatar }} style={styles.connectionAvatar} />
                <View
                    style={[
                        styles.statusIndicator,
                        { backgroundColor: getStatusColor(item.status) },
                    ]}
                />
            </View>
            <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <View style={styles.connectionMeta}>
                    <Text style={styles.statusText}>
                        {item.status === "online"
                            ? "Online"
                            : item.status === "away"
                              ? `Away • ${item.lastSeen}`
                              : `Last seen ${item.lastSeen}`}
                    </Text>
                    {item.mutualFriends && (
                        <Text style={styles.mutualFriends}>
                            {item.mutualFriends} mutual friends
                        </Text>
                    )}
                </View>
            </View>
            <Ionicons name="chatbubble-outline" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
    );

    const renderItem = ({ item, section }: { item: Group | Connection; section: SectionData }) => {
        if (section.type === "groups") {
            return renderGroupItem(item as Group);
        } else {
            return renderConnectionItem(item as Connection);
        }
    };

    const renderSectionHeader = ({ section }: { section: SectionData }) => (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionCount}>({section.data.length})</Text>
        </View>
    );

    return (
        <Container style={styles.container}>
            <SectionList
                sections={sections}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                renderSectionHeader={renderSectionHeader}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
            />

            {/* Floating Action Button */}
            <View style={styles.fabContainer}>
                {/* FAB Options */}
                <Animated.View style={[styles.fabOptionsContainer, optionsAnimatedStyle]}>
                    <Pressable
                        style={[styles.fabOption, { backgroundColor: theme.colors.secondary }]}
                        onPress={handleAddConnection}
                    >
                        <Ionicons name="person-add" size={20} color={theme.colors.onSecondary} />
                        <Text style={[styles.fabOptionText, { color: theme.colors.onSecondary }]}>
                            Add Connection
                        </Text>
                    </Pressable>

                    <Pressable
                        style={[styles.fabOption, { backgroundColor: theme.colors.tertiary }]}
                        onPress={handleAddCircle}
                    >
                        <Ionicons name="people" size={20} color={theme.colors.onTertiary} />
                        <Text style={[styles.fabOptionText, { color: theme.colors.onTertiary }]}>
                            Add Circle
                        </Text>
                    </Pressable>
                </Animated.View>

                {/* Main FAB Button */}
                <Pressable
                    style={[styles.fab, { backgroundColor: theme.colors.primary }]}
                    onPress={toggleFab}
                >
                    <Animated.View style={fabAnimatedStyle}>
                        <Ionicons name="add" size={28} color={theme.colors.onPrimary} />
                    </Animated.View>
                </Pressable>
            </View>

            {/* Backdrop overlay when FAB is expanded */}
            {fabExpanded && (
                <Pressable style={styles.fabBackdrop} onPress={toggleFab} />
            )}
        </Container>
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
            backgroundColor: theme.colors.surfaceVariant,
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
        fabContainer: {
            position: 'absolute',
            bottom: 20,
            right: 20,
            alignItems: 'flex-end',
        },
        fab: {
            width: 56,
            height: 56,
            borderRadius: 28,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: theme.colors.onSurface,
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
        },
        fabOptionsContainer: {
            marginBottom: 12,
            alignItems: 'flex-end',
        },
        fabOption: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 24,
            marginBottom: 8,
            minWidth: 160,
            shadowColor: theme.colors.onSurface,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 4,
        },
        fabOptionText: {
            fontSize: 14,
            fontWeight: '600',
            marginLeft: 8,
        },
        fabBackdrop: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
        },
    });
