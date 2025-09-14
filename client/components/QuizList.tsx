import { useAppTheme } from "@/providers/ThemeProvider";
import { Quiz } from "@/types/review";
import { FlashList, FlashListProps } from "@shopify/flash-list";
import React from "react";
import { RefreshControl, StyleSheet, Text, View } from "react-native";
import QuizCard from "./QuizCard";

type FlashListPropsFiltered = Omit<
    FlashListProps<Quiz>,
    | "data"
    | "renderItem"
    | "keyExtractor"
    | "getItemType"
    | "showsVerticalScrollIndicator"
    | "ListEmptyComponent"
    | "refreshControl"
    | "drawResistance"
    | "extraData"
>;

type QuizListProps = {
    quizzes: Quiz[];
    onQuizPress?: (quiz: Quiz) => void;
    emptyMessage?: string;
    isLoading?: boolean;
} & FlashListPropsFiltered;

export default function QuizList({
    quizzes,
    onQuizPress,
    onRefresh,
    refreshing = false,
    isLoading = false,
    emptyMessage = "No quizzes available",
    contentContainerStyle,
    ...rest
}: Omit<
    QuizListProps,
    | "data"
    | "renderItem"
    | "keyExtractor"
    | "getItemType"
    | "showsVerticalScrollIndicator"
    | "ListEmptyComponent"
    | "refreshControl"
    | "drawResistance"
    | "extraData"
>) {
    const theme = useAppTheme();
    const styles = makeStyles(theme);
    const renderQuizCard = ({ item }: { item: Quiz }) => (
        <QuizCard quiz={item} onPress={() => onQuizPress?.(item)} />
    );

    const keyExtractor = (item: Quiz) => {
        // Use a combination of type, title, and createdAt as unique key
        return `${item.quiz_id}`;
    };

    const getItemType = (item: Quiz) => {
        return item.type;
    };

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{emptyMessage}</Text>
        </View>
    );

    if (isLoading && (!quizzes || quizzes.length === 0)) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading quizzes...</Text>
            </View>
        );
    }

    return (
        <FlashList
            data={quizzes || []}
            renderItem={renderQuizCard}
            keyExtractor={keyExtractor}
            getItemType={getItemType}
            contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmpty}
            refreshControl={
                onRefresh ? (
                    <RefreshControl
                        refreshing={Boolean(refreshing)}
                        onRefresh={onRefresh}
                        colors={[theme.colors.primary]}
                        tintColor={theme.colors.primary}
                    />
                ) : undefined
            }
            // Performance optimizations
            drawDistance={400}
            extraData={quizzes?.length || 0}
            {...rest}
        />
    );
}

const makeStyles = (theme: any) =>
    StyleSheet.create({
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
            color: theme.colors.onSurfaceVariant,
            textAlign: "center",
        },
        loadingContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },
        loadingText: {
            fontSize: 16,
            color: theme.colors.onSurfaceVariant,
        },
    });
