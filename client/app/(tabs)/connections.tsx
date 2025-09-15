import { useState } from "react";
import { SectionList, StyleSheet, Text, View } from "react-native";

import ConnectionCard from "@/components/ConnectionCard";
import Container from "@/components/Container";
import GroupCard from "@/components/GroupCard";
import { AppTheme, useAppTheme } from "@/providers/ThemeProvider";
import { Connection, Group } from "@/types/user";
import { useRouter } from "expo-router";
import { FAB } from "react-native-paper";

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

export default function Connections() {
    const theme = useAppTheme();
    const styles = makeStyles(theme);
    const router = useRouter();

    const [state, setState] = useState({ open: false });

    const onStateChange = ({ open }: { open: boolean }) => setState({ open });

    const { open } = state;

    const renderGroupItem = (item: Group) => (
        <GroupCard
            {...item}
            handlePress={() => {
                router.push({
                    pathname: "/group-profile/[gid]",
                    params: {
                        gid: item.id,
                    },
                });
            }}
        />
    );

    const renderConnectionItem = (item: Connection) => (
        <ConnectionCard
            {...item}
            handlePress={() => {
                router.push({
                    pathname: "/profile/[uid]",
                    params: {
                        uid: item.id,
                    },
                });
            }}
        />
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
            <FAB.Group
                backdropColor={"transparent"}
                open={open}
                visible
                icon={open ? "close" : "plus"}
                actions={[
                    {
                        icon: "account-plus",
                        label: "ADD CONNECTION",
                        onPress: () => router.push("/add-connections"),
                        labelTextColor: theme.colors.tertiary,
                    },
                    {
                        icon: "account-group",
                        label: "ADD GROUP",
                        onPress: () => router.push("/add-groups"),
                        labelTextColor: theme.colors.tertiary,
                    },
                ]}
                onStateChange={onStateChange}
                onPress={() => {
                    if (open) {
                        // do something if the speed dial is open
                    }
                }}
            />
        </Container>
    );
}

const makeStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {},
        listContainer: {
            padding: 16,
            gap: 12,
        },
        sectionHeader: {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 8,
            paddingHorizontal: 12,
            backgroundColor: theme.colors.primary,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            gap: 8,
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
        connectionMeta: {
            flexDirection: "column",
        },
        statusText: {
            fontSize: 13,
            color: theme.colors.onSurfaceVariant,
        },
        mutualFriends: {
            fontSize: 12,
            color: theme.colors.onSurfaceVariant,
        },
        fabContainer: {
            position: "absolute",
            bottom: 20,
            right: 20,
            alignItems: "flex-end",
        },
        fab: {
            width: 56,
            height: 56,
            borderRadius: 28,
            alignItems: "center",
            justifyContent: "center",
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
            alignItems: "flex-end",
            gap: 12,
        },
        fabOption: {
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 24,
            minWidth: 160,
            shadowColor: theme.colors.onSurface,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 4,
            gap: 8,
        },
        fabOptionText: {
            fontSize: 14,
            fontWeight: "600",
        },
        fabBackdrop: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
        },
    });
