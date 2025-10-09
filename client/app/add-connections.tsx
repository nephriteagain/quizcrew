import ConnectionCard from "@/components/ConnectionCard";
import Container from "@/components/Container";
import { analytics } from "@/firebase";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { useAsyncStatus } from "@/hooks/useAsyncStatus";
import { AppTheme, useAppTheme } from "@/providers/ThemeProvider";
import { approveConnection } from "@/store/user/actions/approveConnection";
import { rejectConnection } from "@/store/user/actions/rejectConnection";
import { requestConnection } from "@/store/user/actions/requestConnection";
import { searchNewConnection } from "@/store/user/actions/searchNewConnection";
import authSelector from "@/store/user/user.store";
import { Connection } from "@/types/user";
import { Ionicons } from "@expo/vector-icons";
import { logEvent } from "@react-native-firebase/analytics";
import { useRouter } from "expo-router";
import { debounce } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SectionList, StyleSheet, View } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { Toast } from "toastify-react-native";

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
    const [loadingCards, setLoadingCards] = useState<string[]>([]);
    const [searchNewConnectionFn, isLoading] = useAsyncStatus(searchNewConnection);
    const [requestConnectionFn] = useAsyncAction(requestConnection);
    const [rejectConnectionFn] = useAsyncAction(rejectConnection);
    const [approveConnectionFn] = useAsyncAction(approveConnection);

    const connections = authSelector.use.useConnections();
    const recommendedConnections = authSelector.use.useRecommendedConnections();

    const sections: SectionData[] = useMemo(() => {
        const requestToYou = connections.filter((c) => c.meta?.status === "INVITED");
        const requestFromYou = connections.filter((c) => c.meta?.status === "REQUESTED");

        return [
            {
                title: "Requests to You",
                data: requestToYou,
                type: "requests_to_you",
            },
            {
                title: "Requests from You",
                data: requestFromYou,
                type: "requests_from_you",
            },
            {
                title: "Search Results",
                data: connectionSearch,
                type: "search_results",
            },
            {
                title: "Recommended",
                data: recommendedConnections,
                type: "recommended",
            },
        ];
    }, [connectionSearch, connections, recommendedConnections]);

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

    const handleConnect = async (uid: string) => {
        console.log({ uid });
        setLoadingCards((prev) => [...prev, uid]);
        const { error } = await requestConnectionFn(uid);
        if (error) {
            Toast.error(error?.message);
        } else {
            Toast.success("Connected requested");
        }
        setSearchQuery("");
        setConnectionSearch([]);
        setLoadingCards((prev) => prev.filter((id) => id !== uid));
    };

    const handleCancel = async (uid: string) => {
        setLoadingCards((prev) => [...prev, uid]);
        const { error } = await rejectConnectionFn(uid);
        if (error) {
            Toast.error(error?.message);
        } else {
            Toast.success("Connection request rejected");
        }
        setSearchQuery("");
        setConnectionSearch([]);
        setLoadingCards((prev) => prev.filter((id) => id !== uid));
    };
    const handleAccept = async (uid: string) => {
        setLoadingCards((prev) => [...prev, uid]);
        const { error } = await approveConnectionFn(uid);
        if (error) {
            Toast.error(error?.message);
        } else {
            Toast.success("Connection request accepted");
        }
        setSearchQuery("");
        setConnectionSearch([]);
        setLoadingCards((prev) => prev.filter((id) => id !== uid));
    };

    const renderConnectionItem = ({ item }: { item: Connection }) => {
        const handlePress = () => {
            logEvent(analytics, "view_user_profile", {
                target_user_id: item.data.uid,
                connection_status: item.meta?.status,
            });
            if (!item.data.uid) {
                Toast.error("User deleted");
                return;
            }
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
                handleAccept={handleAccept}
                handleCancel={handleCancel}
                handlePress={handlePress}
                isLoading={loadingCards.includes(item.data.uid)}
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
                extraData={{ connectionSearch, loadingCards, searchQuery }}
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
