import Container from "@/components/Container";
import { AppTheme, useAppTheme } from "@/providers/ThemeProvider";
import { Connection } from "@/types/user";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, SectionList, StyleSheet, Text, View } from "react-native";
import { Button, Chip, TextInput } from "react-native-paper";

const mockConnections: Connection[] = [
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
        name: "Jessica Liu",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b39bb30b?w=150&h=150&fit=crop&crop=face",
        status: "online",
        mutualFriends: 0,
    },
    {
        id: "7",
        name: "Chris Wilson",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        status: "away",
        lastSeen: "5 hours ago",
        mutualFriends: 2,
    },
];

type SectionData = {
    title: string;
    data: Connection[];
    type: "connections" | "recommended";
};

export default function InviteMembers() {
    const theme = useAppTheme();
    const styles = makeStyles(theme);
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

    const sections: SectionData[] = [
        {
            title: "Your Connections",
            data: mockConnections,
            type: "connections",
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

    const totalPeople = filteredSections.reduce((total, section) => total + section.data.length, 0);

    const allConnections = [...mockConnections, ...mockRecommended];

    const handleSelectMember = (memberId: string) => {
        setSelectedMembers((prev) =>
            prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]
        );
    };

    const handleRemoveSelected = (memberId: string) => {
        setSelectedMembers((prev) => prev.filter((id) => id !== memberId));
    };

    const handleFinish = () => {
        router.back();
        router.back();
    };

    const handleSkip = () => {
        router.back();
        router.back();
    };

    const getSelectedConnection = (id: string) => {
        return allConnections.find((connection) => connection.id === id);
    };

    const renderConnectionItem = ({ item }: { item: Connection }) => {
        const isSelected = selectedMembers.includes(item.id);
        return (
            <View style={[styles.connectionItem, isSelected && styles.selectedItem]}>
                <View style={styles.connectionInfo}>
                    <Image source={{ uri: item.avatar }} style={styles.avatar} />
                    <View style={styles.textInfo}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.status}>
                            {item.status === "online"
                                ? "Online"
                                : item.status === "away"
                                  ? `Away${item.lastSeen ? ` • ${item.lastSeen}` : ""}`
                                  : `Last seen ${item.lastSeen || "recently"}`}
                        </Text>
                        {item.mutualFriends !== undefined && (
                            <Text style={styles.mutualFriends}>
                                {item.mutualFriends} mutual connection
                                {item.mutualFriends !== 1 ? "s" : ""}
                            </Text>
                        )}
                    </View>
                </View>
                <Button
                    mode={isSelected ? "outlined" : "contained"}
                    onPress={() => handleSelectMember(item.id)}
                    compact
                    style={styles.selectButton}
                >
                    {isSelected ? "Remove" : "Invite"}
                </Button>
            </View>
        );
    };

    return (
        <Container>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Invite Members</Text>
                    <Text style={styles.subtitle}>
                        Add members from your connections to join the group
                    </Text>
                </View>

                <TextInput
                    mode="outlined"
                    placeholder="Search connections..."
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

                {selectedMembers.length > 0 && (
                    <View style={styles.selectedContainer}>
                        <Text style={styles.selectedTitle}>
                            Selected Members ({selectedMembers.length})
                        </Text>
                        <ScrollView
                            contentContainerStyle={styles.chipsContainer}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        >
                            {selectedMembers.map((memberId) => {
                                const connection = getSelectedConnection(memberId);
                                return (
                                    <Chip
                                        key={memberId}
                                        onClose={() => handleRemoveSelected(memberId)}
                                        style={styles.chip}
                                    >
                                        {connection?.name}
                                    </Chip>
                                );
                            })}
                        </ScrollView>
                    </View>
                )}

                <View style={styles.listHeader}>
                    <Text style={styles.resultsCount}>{totalPeople} people found</Text>
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
                                name="people-outline"
                                size={48}
                                color={theme.colors.onSurfaceVariant}
                            />
                            <View style={styles.emptyTitleContainer}>
                                <Text style={styles.emptyTitle}>No people found</Text>
                                <Text style={styles.emptySubtitle}>
                                    Try adjusting your search or check back later
                                </Text>
                            </View>
                        </View>
                    )}
                />

                <View style={styles.actionContainer}>
                    <Button
                        mode="outlined"
                        onPress={handleSkip}
                        style={styles.skipButton}
                        contentStyle={styles.buttonContent}
                    >
                        Skip for Now
                    </Button>
                    <Button
                        mode="contained"
                        onPress={handleFinish}
                        disabled={selectedMembers.length === 0}
                        style={[
                            styles.finishButton,
                            selectedMembers.length === 0 && styles.disabledButton,
                        ]}
                        contentStyle={styles.buttonContent}
                    >
                        Invite {selectedMembers.length > 0 ? `(${selectedMembers.length})` : ""}
                    </Button>
                </View>
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
            rowGap: 16,
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
        searchInput: {
            backgroundColor: theme.colors.surface,
        },
        selectedContainer: {
            gap: 12,
        },
        selectedTitle: {
            fontSize: 16,
            fontWeight: "600",
            color: theme.colors.onSurface,
        },
        chipsContainer: {
            flexDirection: "column",
            flexWrap: "wrap",
            gap: 8,
            maxHeight: 80,
        },
        chip: {
            backgroundColor: theme.colors.primaryContainer,
        },
        listHeader: {
            gap: 4,
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
        resultsCount: {
            fontSize: 14,
            color: theme.colors.onSurfaceVariant,
            fontWeight: "500",
        },
        listContainer: {
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
        actionContainer: {
            flexDirection: "row",
            gap: 12,
            paddingTop: 8,
        },
        skipButton: {
            flex: 1,
        },
        finishButton: {
            flex: 2,
        },
        buttonContent: {
            paddingVertical: 8,
        },
        disabledButton: {
            opacity: 0.6,
        },
        connectionItem: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: theme.colors.surface,
            padding: 16,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.colors.outline,
        },
        selectedItem: {
            borderColor: theme.colors.primary,
            backgroundColor: theme.colors.primaryContainer,
        },
        connectionInfo: {
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
        },
        avatar: {
            width: 50,
            height: 50,
            borderRadius: 25,
            marginRight: 12,
        },
        textInfo: {
            flex: 1,
        },
        name: {
            fontSize: 16,
            fontWeight: "600",
            color: theme.colors.onSurface,
            marginBottom: 4,
        },
        status: {
            fontSize: 13,
            color: theme.colors.onSurfaceVariant,
            marginBottom: 2,
        },
        mutualFriends: {
            fontSize: 12,
            color: theme.colors.onSurfaceVariant,
        },
        selectButton: {
            minWidth: 80,
        },
    });
