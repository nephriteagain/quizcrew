import { Quiz } from "@/types/review";
import { FlashList } from "@shopify/flash-list";
import React, { useCallback } from "react";
import { RefreshControl, StyleSheet, Text, View } from "react-native";
import QuizCard from "./QuizCard";

type QuizListProps = {
    quizzes: Quiz[];
    onQuizPress?: (quiz: Quiz) => void;
    onRefresh?: () => void;
    refreshing?: boolean;
    isLoading?: boolean;
    numColumns?: number;
    emptyMessage?: string;
    scrollEnabled?: boolean;
};

export default function QuizList({
    quizzes,
    onQuizPress,
    onRefresh,
    refreshing = false,
    isLoading = false,
    emptyMessage = "No quizzes available",
    scrollEnabled,
}: QuizListProps) {
    const renderQuizCard = useCallback(
        ({ item }: { item: Quiz }) => <QuizCard quiz={item} onPress={() => onQuizPress?.(item)} />,
        [onQuizPress]
    );

    const keyExtractor = useCallback((item: Quiz) => {
        // Use a combination of type, title, and createdAt as unique key
        return `${item.quiz_id}`;
    }, []);

    const getItemType = useCallback((item: Quiz) => {
        return item.type;
    }, []);

    const renderEmpty = useCallback(
        () => (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>{emptyMessage}</Text>
            </View>
        ),
        [emptyMessage]
    );

    const renderHeader = useCallback(() => <View style={styles.headerSpacer} />, []);

    const renderFooter = useCallback(() => <View style={styles.footerSpacer} />, []);

    if (isLoading && quizzes.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading quizzes...</Text>
            </View>
        );
    }

    return (
        <FlashList
            data={quizzes}
            renderItem={renderQuizCard}
            keyExtractor={keyExtractor}
            getItemType={getItemType}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmpty}
            ListHeaderComponent={renderHeader}
            ListFooterComponent={renderFooter}
            refreshControl={
                onRefresh ? (
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={["#007AFF"]}
                        tintColor="#007AFF"
                    />
                ) : undefined
            }
            // Performance optimizations
            drawDistance={400}
            extraData={quizzes.length}
            scrollEnabled={scrollEnabled}
        />
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        paddingVertical: 8,
    },
    headerSpacer: {
        height: 8,
    },
    footerSpacer: {
        height: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        color: "#999",
        textAlign: "center",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        fontSize: 16,
        color: "#666",
    },
});
