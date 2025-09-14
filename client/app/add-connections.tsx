import ConnectionCard from "@/components/ConnectionCard";
import Container from "@/components/Container";
import { AppTheme, useAppTheme } from "@/providers/ThemeProvider";
import { Connection } from "@/types/user";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { SectionList, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-paper";

const mockRequestsToYou: Connection[] = [
    {
        id: "1",
        name: "Alex Johnson",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        status: "online",
        mutualFriends: 5,
    },
    {
        id: "2",
        name: "Sarah Chen",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b39bb30b?w=150&h=150&fit=crop&crop=face",
        status: "away",
        lastSeen: "2 hours ago",
        mutualFriends: 12,
    },
];

const mockRequestsFromYou: Connection[] = [
    {
        id: "3",
        name: "Mike Davis",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        status: "offline",
        lastSeen: "yesterday",
        mutualFriends: 3,
    },
];

const mockRecommended: Connection[] = [
    {
        id: "4",
        name: "Emily Rodriguez",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        status: "online",
        mutualFriends: 8,
    },
    {
        id: "5",
        name: "David Park",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        status: "offline",
        lastSeen: "3 days ago",
        mutualFriends: 1,
    },
    {
        id: "6",
        name: "Lisa Wang",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
        status: "away",
        lastSeen: "1 hour ago",
        mutualFriends: 15,
    },
];

type SectionData = {
    title: string;
    data: Connection[];
    type: "requests_to_you" | "requests_from_you" | "recommended";
};

export default function AddConnections() {
    const theme = useAppTheme();
    const styles = makeStyles(theme);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    const sections: SectionData[] = [
        {
            title: "Requests to You",
            data: mockRequestsToYou,
            type: "requests_to_you",
        },
        {
            title: "Requests from You",
            data: mockRequestsFromYou,
            type: "requests_from_you",
        },
        {
            title: "Recommended",
            data: mockRecommended,
            type: "recommended",
        },
    ];

    const filteredSections = sections
        .map((section) => ({
            ...section,
            data: section.data.filter((connection) =>
                connection.name.toLowerCase().includes(searchQuery.toLowerCase())
            ),
        }))
        .filter((section) => section.data.length > 0);

    const totalConnections = filteredSections.reduce(
        (total, section) => total + section.data.length,
        0
    );

    const handleConnect = (_connectionId: string) => {
        console.log("connected");
    };

    const renderConnectionItem = ({ item }: { item: Connection }) => {
        const handlePress = () => {
            router.push({
                pathname: "/profile/[uid]",
                params: {
                    uid: item.id,
                },
            });
        };
        return <ConnectionCard {...item} handleConnect={handleConnect} handlePress={handlePress} />;
    };

    return (
        <Container>
            <View style={styles.contentContainer}>
                <View style={styles.header}>
                    <Text style={styles.subtitle}>Discover and connect with new people</Text>
                </View>

                <TextInput
                    mode="outlined"
                    placeholder="Search by name..."
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

                <Text style={styles.resultsCount}>{totalConnections} people found</Text>
            </View>

            <SectionList
                sections={filteredSections}
                renderItem={renderConnectionItem}
                renderSectionHeader={({ section }) => (
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        <Text style={styles.sectionCount}>({section.data.length})</Text>
                    </View>
                )}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Ionicons
                            name="person-add-outline"
                            size={48}
                            color={theme.colors.onSurfaceVariant}
                        />
                        <View style={styles.emptyTitleContainer}>
                            <Text style={styles.emptyTitle}>No connections found</Text>
                            <Text style={styles.emptySubtitle}>
                                Try adjusting your search or check back later
                            </Text>
                        </View>
                    </View>
                )}
            />
        </Container>
    );
}

const makeStyles = (theme: AppTheme) =>
    StyleSheet.create({
        contentContainer: {
            padding: 16,
            paddingTop: 0,
            rowGap: 16,
        },
        header: {
            paddingTop: 10,
        },
        title: {
            fontSize: 24,
            fontWeight: "bold",
            color: theme.colors.onSurface,
        },
        subtitle: {
            fontSize: 16,
            color: theme.colors.onSurfaceVariant,
        },
        searchInput: {
            backgroundColor: theme.colors.surface,
        },
        resultsCount: {
            fontSize: 14,
            color: theme.colors.onSurfaceVariant,
            fontWeight: "500",
        },
        listContainer: {
            paddingHorizontal: 16,
            paddingBottom: 20,
            gap: 12,
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
    });
