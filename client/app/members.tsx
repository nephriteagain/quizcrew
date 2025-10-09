import Container from "@/components/Container";
import { AppTheme, useAppTheme } from "@/providers/ThemeProvider";
import { Connection, ConnectionStatus } from "@/types/user";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { SectionList, StyleSheet, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { Button, Menu, Text, TextInput } from "react-native-paper";

interface Member extends Connection {
    role: "admin" | "moderator" | "member";
    joinedDate: string;
    lastSeen?: string;
    mutualFriends?: number;
}

const mockAdmins: Member[] = [
    {
        data: {
            status: "ACTIVE",
            uid: "admin1",
            username: "Sarah Chen",
            photoURL:
                "https://images.unsplash.com/photo-1494790108755-2616b39bb30b?w=150&h=150&fit=crop&crop=face",
        },
        meta: {
            uid: "admin1",
            status: "CONNECTED",
            createdAt: { seconds: 1704067200, nanoseconds: 0 } as any,
        },
        role: "admin",
        joinedDate: "January 2024",
        mutualFriends: 12,
    },
];

const mockModerators: Member[] = [
    {
        data: {
            status: "ACTIVE",
            uid: "mod1",
            username: "Alex Johnson",
            photoURL:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        },
        meta: {
            uid: "mod1",
            status: "CONNECTED",
            createdAt: { seconds: 1706659200, nanoseconds: 0 } as any,
        },
        role: "moderator",
        joinedDate: "February 2024",
        lastSeen: "2 hours ago",
        mutualFriends: 5,
    },
];

const mockMembers: Member[] = [
    {
        data: {
            status: "ACTIVE",
            uid: "member1",
            username: "Mike Davis",
            photoURL:
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        },
        meta: {
            uid: "member1",
            status: "CONNECTED",
            createdAt: { seconds: 1709251200, nanoseconds: 0 } as any,
        },
        role: "member",
        joinedDate: "March 2024",
        lastSeen: "yesterday",
        mutualFriends: 3,
    },
    {
        data: {
            status: "ACTIVE",
            uid: "member2",
            username: "Emily Rodriguez",
            photoURL:
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        },
        meta: {
            uid: "member2",
            status: "CONNECTED",
            createdAt: { seconds: 1709251200, nanoseconds: 0 } as any,
        },
        role: "member",
        joinedDate: "March 2024",
        mutualFriends: 8,
    },
    {
        data: {
            status: "ACTIVE",
            uid: "member3",
            username: "David Park",
            photoURL:
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        },
        meta: {
            uid: "member3",
            status: "CONNECTED",
            createdAt: { seconds: 1711929600, nanoseconds: 0 } as any,
        },
        role: "member",
        joinedDate: "April 2024",
        lastSeen: "3 days ago",
        mutualFriends: 1,
    },
    {
        data: {
            status: "ACTIVE",
            uid: "member4",
            username: "Jessica Liu",
            photoURL:
                "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
        },
        meta: {
            uid: "member4",
            status: "CONNECTED",
            createdAt: { seconds: 1711929600, nanoseconds: 0 } as any,
        },
        role: "member",
        joinedDate: "April 2024",
        lastSeen: "1 hour ago",
        mutualFriends: 6,
    },
];

type SectionData = {
    title: string;
    data: Member[];
    type: "admins" | "moderators" | "members";
};

export default function Members() {
    const theme = useAppTheme();
    const styles = makeStyles(theme);
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState("");
    const [visibleMenuId, setVisibleMenuId] = useState<string | null>(null);

    const sections: SectionData[] = [
        {
            title: "Admins",
            data: mockAdmins,
            type: "admins",
        },
        {
            title: "Moderators",
            data: mockModerators,
            type: "moderators",
        },
        {
            title: "Members",
            data: mockMembers,
            type: "members",
        },
    ];

    const filteredSections = sections
        .map((section) => ({
            ...section,
            data: section.data.filter((member) =>
                member.data?.username?.toLowerCase().includes(searchQuery.toLowerCase())
            ),
        }))
        .filter((section) => section.data.length > 0);

    const totalMembers = sections.reduce((total, section) => total + section.data.length, 0);

    const getRoleColor = (role: Member["role"]) => {
        switch (role) {
            case "admin":
                return theme.colors.error;
            case "moderator":
                return theme.colors.tertiary;
            case "member":
                return theme.colors.primary;
            default:
                return theme.colors.onSurfaceVariant;
        }
    };

    const getRoleBadge = (role: Member["role"]) => {
        switch (role) {
            case "admin":
                return "👑";
            case "moderator":
                return "🛡️";
            case "member":
                return "";
            default:
                return "";
        }
    };

    const getStatusColor = (status?: ConnectionStatus, lastSeen?: string) => {
        // For simplicity, we'll derive visual status from Connection status and lastSeen
        if (status === "CONNECTED") {
            if (!lastSeen) {
                return "#4CAF50"; // online
            } else if (lastSeen.includes("hour")) {
                return "#FF9800"; // away
            } else {
                return "#9E9E9E"; // offline
            }
        }
        return "#9E9E9E"; // default
    };

    const handleProfilePress = (memberUid: string) => {
        router.push({
            pathname: "/profile/[uid]",
            params: { uid: memberUid },
        });
    };

    const handleMenuAction = (action: string, memberUid: string) => {
        setVisibleMenuId(null);
        console.log(`Action: ${action} for member: ${memberUid}`);
    };

    const renderMemberItem = ({ item }: { item: Member }) => {
        const isMenuVisible = visibleMenuId === item.data.uid;
        const displayName = item.data?.username || "Unknown User";
        const avatarUri = item.data?.photoURL;

        // Determine visual status for display
        const getDisplayStatus = () => {
            if (item.meta?.status === "CONNECTED") {
                if (!item.lastSeen) {
                    return "online";
                } else if (item.lastSeen.includes("hour")) {
                    return "away";
                } else {
                    return "offline";
                }
            }
            return "offline";
        };

        const displayStatus = getDisplayStatus();

        return (
            <TouchableOpacity
                style={styles.memberItem}
                onPress={() => handleProfilePress(item.data.uid)}
                activeOpacity={0.7}
            >
                <View style={styles.memberInfo}>
                    <View style={styles.avatarContainer}>
                        {avatarUri ? (
                            <Image source={{ uri: avatarUri }} style={styles.avatar} />
                        ) : (
                            <View
                                style={[
                                    styles.avatar,
                                    {
                                        backgroundColor: theme.colors.surfaceVariant,
                                        alignItems: "center",
                                        justifyContent: "center",
                                    },
                                ]}
                            >
                                <Ionicons
                                    name="person"
                                    size={24}
                                    color={theme.colors.onSurfaceVariant}
                                />
                            </View>
                        )}
                        <View
                            style={[
                                styles.statusIndicator,
                                {
                                    backgroundColor: getStatusColor(
                                        item.meta?.status,
                                        item.lastSeen
                                    ),
                                },
                            ]}
                        />
                    </View>

                    <View style={styles.textInfo}>
                        <View style={styles.nameRow}>
                            <Text style={styles.name}>{displayName}</Text>
                            {getRoleBadge(item.role) && (
                                <Text style={styles.roleBadge}>{getRoleBadge(item.role)}</Text>
                            )}
                        </View>

                        <Text style={[styles.role, { color: getRoleColor(item.role) }]}>
                            {item.role.charAt(0).toUpperCase() + item.role.slice(1)}
                        </Text>

                        <Text style={styles.status}>
                            {displayStatus === "online"
                                ? "Online"
                                : displayStatus === "away"
                                  ? `Away${item.lastSeen ? ` • ${item.lastSeen}` : ""}`
                                  : `Last seen ${item.lastSeen || "recently"}`}
                        </Text>

                        <Text style={styles.joinedDate}>Joined {item.joinedDate}</Text>

                        {item.mutualFriends !== undefined && (
                            <Text style={styles.mutualFriends}>
                                {item.mutualFriends} mutual connection
                                {item.mutualFriends !== 1 ? "s" : ""}
                            </Text>
                        )}
                    </View>
                </View>

                <Menu
                    visible={isMenuVisible}
                    onDismiss={() => setVisibleMenuId(null)}
                    anchor={
                        <TouchableOpacity
                            style={styles.menuButton}
                            onPress={() => setVisibleMenuId(item.data.uid)}
                        >
                            <Ionicons
                                name="ellipsis-vertical"
                                size={20}
                                color={theme.colors.onSurfaceVariant}
                            />
                        </TouchableOpacity>
                    }
                >
                    <Menu.Item
                        onPress={() => handleMenuAction("message", item.data.uid)}
                        title="Send Message"
                    />
                    <Menu.Item
                        onPress={() => handleMenuAction("profile", item.data.uid)}
                        title="View Profile"
                    />
                    {item.role === "member" && (
                        <>
                            <Menu.Item
                                onPress={() => handleMenuAction("promote", item.data.uid)}
                                title="Make Moderator"
                            />
                            <Menu.Item
                                onPress={() => handleMenuAction("remove", item.data.uid)}
                                title="Remove from Group"
                            />
                        </>
                    )}
                    {item.role === "moderator" && (
                        <>
                            <Menu.Item
                                onPress={() => handleMenuAction("demote", item.data.uid)}
                                title="Remove as Moderator"
                            />
                            <Menu.Item
                                onPress={() => handleMenuAction("remove", item.data.uid)}
                                title="Remove from Group"
                            />
                        </>
                    )}
                </Menu>
            </TouchableOpacity>
        );
    };

    return (
        <Container>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Group Members</Text>
                    <Text style={styles.subtitle}>
                        {totalMembers} member{totalMembers !== 1 ? "s" : ""} in this group
                    </Text>
                </View>

                <View style={styles.actions}>
                    <Button
                        mode="contained"
                        onPress={() => router.push("/invite-members")}
                        icon="account-plus"
                        style={styles.inviteButton}
                    >
                        Invite Members
                    </Button>
                </View>

                <TextInput
                    mode="outlined"
                    placeholder="Search members..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    left={<TextInput.Icon icon="magnify" />}
                    right={
                        searchQuery.length > 0 ? (
                            <TextInput.Icon icon="close" onPress={() => setSearchQuery("")} />
                        ) : undefined
                    }
                    style={styles.searchInput}
                />

                <SectionList
                    sections={filteredSections}
                    renderItem={renderMemberItem}
                    renderSectionHeader={({ section }) => (
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>{section.title}</Text>
                            <Text style={styles.sectionCount}>({section.data.length})</Text>
                        </View>
                    )}
                    keyExtractor={(item) => item.data.uid}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <Ionicons
                                name="people-outline"
                                size={48}
                                color={theme.colors.onSurfaceVariant}
                            />
                            <View style={styles.emptyTitleContainer}>
                                <Text style={styles.emptyTitle}>No members found</Text>
                                <Text style={styles.emptySubtitle}>
                                    Try adjusting your search or check back later
                                </Text>
                            </View>
                        </View>
                    )}
                />
            </View>
        </Container>
    );
}

const makeStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: 16,
            paddingBottom: 16,
            gap: 16,
        },
        header: {
            gap: 8,
            paddingTop: 8,
        },
        title: {
            fontSize: 24,
            fontWeight: "bold",
            color: theme.colors.onSurface,
        },
        subtitle: {
            fontSize: 16,
            color: theme.colors.onSurfaceVariant,
            lineHeight: 22,
        },
        actions: {
            flexDirection: "row",
        },
        inviteButton: {
            flex: 1,
        },
        searchInput: {
            backgroundColor: theme.colors.surface,
        },
        sectionHeader: {
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 8,
            backgroundColor: theme.colors.primary,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            columnGap: 8,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: "bold",
            color: theme.colors.surface,
        },
        sectionCount: {
            fontSize: 16,
            color: theme.colors.surface,
        },
        listContainer: {
            paddingBottom: 20,
            gap: 12,
        },
        memberItem: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
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
        },
        memberInfo: {
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
        },
        avatarContainer: {
            position: "relative",
            marginRight: 12,
        },
        avatar: {
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
        textInfo: {
            flex: 1,
            gap: 2,
        },
        nameRow: {
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
        },
        name: {
            fontSize: 16,
            fontWeight: "600",
            color: theme.colors.onSurface,
        },
        roleBadge: {
            fontSize: 14,
        },
        role: {
            fontSize: 12,
            fontWeight: "600",
            textTransform: "uppercase",
        },
        status: {
            fontSize: 13,
            color: theme.colors.onSurfaceVariant,
        },
        joinedDate: {
            fontSize: 12,
            color: theme.colors.onSurfaceVariant,
        },
        mutualFriends: {
            fontSize: 12,
            color: theme.colors.onSurfaceVariant,
        },
        menuButton: {
            padding: 8,
        },
        emptyContainer: {
            alignItems: "center",
            paddingTop: 60,
            paddingHorizontal: 32,
            gap: 16,
        },
        emptyTitleContainer: {
            gap: 8,
            alignItems: "center",
        },
        emptyTitle: {
            fontSize: 18,
            fontWeight: "600",
            color: theme.colors.onSurface,
        },
        emptySubtitle: {
            fontSize: 14,
            color: theme.colors.onSurfaceVariant,
            textAlign: "center",
            lineHeight: 20,
        },
    });
