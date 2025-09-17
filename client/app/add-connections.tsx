import ConnectionCard from "@/components/ConnectionCard";
import Container from "@/components/Container";
import { useAsyncStatus } from "@/hooks/useAsyncStatus";
import { AppTheme, useAppTheme } from "@/providers/ThemeProvider";
import { searchNewConnection } from "@/store/user/actions/searchNewConnection";
import { Connection } from "@/types/user";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { debounce } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SectionList, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-paper";

const mockRequestsToYou: Connection[] = [
    {
        data: {
            status: "ACTIVE",
            uid: "1",
            username: "Alex Johnson",
            photoURL:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        },
        meta: {
            uid: "1",
            status: "INVITED",
            createdAt: new Date() as any,
        },
    },
    {
        data: {
            status: "ACTIVE",
            uid: "2",
            username: "Sarah Chen",
            photoURL:
                "https://images.unsplash.com/photo-1494790108755-2616b39bb30b?w=150&h=150&fit=crop&crop=face",
        },
        meta: {
            uid: "2",
            status: "INVITED",
            createdAt: new Date() as any,
        },
    },
];

const mockRequestsFromYou: Connection[] = [
    {
        data: {
            status: "ACTIVE",
            uid: "3",
            username: "Mike Davis",
            photoURL:
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        },
        meta: {
            uid: "3",
            status: "REQUESTED",
            createdAt: new Date() as any,
        },
    },
];

const mockRecommended: Connection[] = [
    {
        data: {
            status: "ACTIVE",
            uid: "4",
            username: "Emily Rodriguez",
            photoURL:
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        },
        meta: {
            uid: "4",
            status: "CONNECTED",
            createdAt: new Date() as any,
        },
    },
    {
        data: {
            status: "ACTIVE",
            uid: "5",
            username: "David Park",
            photoURL:
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        },
        meta: {
            uid: "5",
            status: "CONNECTED",
            createdAt: new Date() as any,
        },
    },
    {
        data: {
            status: "ACTIVE",
            uid: "6",
            username: "Lisa Wang",
            photoURL:
                "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
        },
        meta: {
            uid: "6",
            status: "CONNECTED",
            createdAt: new Date() as any,
        },
    },
];

type SectionData = {
    title: string;
    data: Connection[];
    type: "requests_to_you" | "requests_from_you" | "recommended" | "search_results";
};

export default function AddConnections() {
    const theme = useAppTheme();
    const styles = makeStyles(theme);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();
    const [connectionSearch, setConnectionSearch] = useState<Connection[]>([]);
    const [searchNewConnectionFn, isLoading] = useAsyncStatus(searchNewConnection);

    const sections: SectionData[] = useMemo(() => {
        return [
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
            {
                title: "Search Results",
                data: connectionSearch,
                type: "search_results",
            },
        ];
    }, [connectionSearch]);

    const searchFunction = useCallback(
        async (query: string) => {
            try {
                const result = await searchNewConnectionFn(query);
                if (result) {
                    const c = result.map((r) => ({ data: r, meta: null }));
                    setConnectionSearch(c);
                }
            } catch (error) {
                console.error("Search error:", error);
                setConnectionSearch([]);
            }
        },
        [searchNewConnectionFn]
    );

    useEffect(() => {
        if (!searchQuery) {
            setConnectionSearch([]);
            return;
        }

        const debounceSearch = debounce(searchFunction, 300);
        debounceSearch(searchQuery);

        return () => {
            debounceSearch.cancel();
        };
    }, [searchQuery, searchFunction]);

    const filteredSections = sections
        .map((section) => ({
            ...section,
            data: section.data.filter((connection) =>
                connection.data?.username?.toLowerCase().includes(searchQuery.toLowerCase())
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
                    uid: item.data.uid,
                },
            });
        };
        return (
            <ConnectionCard
                connection={item}
                handleConnect={handleConnect}
                handlePress={handlePress}
            />
        );
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
                        isLoading ? (
                            <TextInput.Icon icon={"loading"} color={theme.colors.primary} />
                        ) : searchQuery.length > 0 ? (
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
                keyExtractor={(item) => item.data.uid}
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
                extraData={connectionSearch}
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
