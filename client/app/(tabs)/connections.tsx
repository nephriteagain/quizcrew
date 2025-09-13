import { Ionicons } from "@expo/vector-icons";
import { Image, SectionList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
    const sections: SectionData[] = [
        {
            title: "Groups",
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
    });
