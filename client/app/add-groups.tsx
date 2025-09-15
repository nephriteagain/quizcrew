import Container from "@/components/Container";
import GroupCard from "@/components/GroupCard";
import { AppTheme, useAppTheme } from "@/providers/ThemeProvider";
import { Group } from "@/types/user";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { SectionList, StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";

const mockInvitesFromGroups: Group[] = [
    {
        id: "1",
        name: "React Native Developers",
        avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&h=150&fit=crop",
        memberCount: 1250,
        lastActivity: "2 hours ago",
        description: "A community for React Native developers to share knowledge and experiences",
    },
    {
        id: "2",
        name: "Design Systems Guild",
        avatar: "https://images.unsplash.com/photo-1541462608143-67571c6738dd?w=150&h=150&fit=crop",
        memberCount: 840,
        lastActivity: "5 hours ago",
        description: "Discussing best practices in design systems and component libraries",
    },
];

const mockRequestedGroups: Group[] = [
    {
        id: "3",
        name: "TypeScript Enthusiasts",
        avatar: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=150&h=150&fit=crop",
        memberCount: 2100,
        lastActivity: "1 day ago",
        description: "All things TypeScript - tips, tricks, and best practices",
    },
];

const mockRecommendedGroups: Group[] = [
    {
        id: "4",
        name: "Mobile UI/UX Designers",
        avatar: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=150&h=150&fit=crop",
        memberCount: 675,
        lastActivity: "3 hours ago",
        description: "Mobile design patterns and user experience discussions",
    },
    {
        id: "5",
        name: "JavaScript Weekly",
        avatar: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=150&h=150&fit=crop",
        memberCount: 3200,
        lastActivity: "30 minutes ago",
        description: "Weekly discussions about JavaScript trends and updates",
    },
    {
        id: "6",
        name: "Startup Founders Network",
        avatar: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=150&h=150&fit=crop",
        memberCount: 445,
        lastActivity: "1 hour ago",
        description: "Connect with fellow entrepreneurs and startup founders",
    },
];

type SectionData = {
    title: string;
    data: Group[];
    type: "invites_from_groups" | "requested_groups" | "recommended";
};

export default function AddGroups() {
    const theme = useAppTheme();
    const styles = makeStyles(theme);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    const sections: SectionData[] = [
        {
            title: "Group Invites",
            data: mockInvitesFromGroups,
            type: "invites_from_groups",
        },
        {
            title: "Requested to Join",
            data: mockRequestedGroups,
            type: "requested_groups",
        },
        {
            title: "Recommended",
            data: mockRecommendedGroups,
            type: "recommended",
        },
    ];

    const filteredSections = sections
        .map((section) => ({
            ...section,
            data: section.data.filter((group) =>
                group.name.toLowerCase().includes(searchQuery.toLowerCase())
            ),
        }))
        .filter((section) => section.data.length > 0);

    const totalGroups = filteredSections.reduce((total, section) => total + section.data.length, 0);

    const handleCreateGroup = () => {
        router.push("/create-group");
    };

    const renderGroupItem = ({ item }: { item: Group }) => {
        const handlePress = () => {
            router.push({
                pathname: "/group-profile/[gid]",
                params: {
                    gid: item.id,
                },
            });
        };
        return <GroupCard {...item} handlePress={handlePress} />;
    };

    useEffect(() => {
        router.prefetch("/create-group");
    }, [router]);

    return (
        <Container>
            <View style={styles.contentContainer}>
                <View style={styles.header}>
                    <Text style={styles.subtitle}>Discover and join groups that interest you</Text>
                </View>

                <Button
                    mode="contained"
                    onPress={handleCreateGroup}
                    icon="plus"
                    style={styles.createButton}
                >
                    Create Group
                </Button>

                <TextInput
                    mode="outlined"
                    placeholder="Search groups..."
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

                <Text style={styles.resultsCount}>{totalGroups} groups found</Text>
            </View>

            <SectionList
                sections={filteredSections}
                renderItem={renderGroupItem}
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
                            name="people-outline"
                            size={48}
                            color={theme.colors.onSurfaceVariant}
                        />
                        <View style={styles.emptyTitleContainer}>
                            <Text style={styles.emptyTitle}>No groups found</Text>
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
        createButton: {
            alignSelf: "flex-start",
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
