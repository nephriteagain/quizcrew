import Card from "@/components/Card";
import Container from "@/components/Container";
import { analytics } from "@/firebase";
import { useAppTheme } from "@/providers/ThemeProvider";
import { QUIZ_TYPE } from "@/types/review";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { logEvent } from "@react-native-firebase/analytics";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

const QUIZ_ARR = [
    {
        label: "Multiple Choice",
        value: QUIZ_TYPE.MCQ,
        icon: "list-outline" as const,
        description:
            "Classic quiz format with 4 answer options. Test knowledge with carefully crafted distractors and one correct answer.",
    },
    {
        label: "True or False",
        value: QUIZ_TYPE.TOFQ,
        icon: "checkmark-circle-outline" as const,
        description:
            "Binary choice questions that test factual knowledge and understanding of concepts with simple true/false responses.",
    },
    {
        label: "Matching (Drag and Drop)",
        value: QUIZ_TYPE.DNDQ,
        icon: "swap-horizontal-outline" as const,
        description:
            "Interactive drag-and-drop format where learners match answers from a pool. Perfect for vocabulary, definitions, and associations.",
    },
];

export default function QuizTypes() {
    const theme = useAppTheme();
    const styles = makeStyles(theme);
    const router = useRouter();

    const handleSelect = (type: QUIZ_TYPE) => {
        logEvent(analytics, "select_quiz_type", { quiz_type: type });
        router.push({
            pathname: "/create",
            params: { type },
        });
    };

    return (
        <Container style={styles.container}>
            <FlashList
                data={QUIZ_ARR}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <Pressable style={styles.quizTypeCard} onPress={() => handleSelect(item.value)}>
                        <Card style={styles.cardContent}>
                            <View style={styles.header}>
                                <View style={styles.iconContainer}>
                                    <Ionicons name={item.icon} size={24} color={theme.colors.primary} />
                                </View>
                                <Text style={styles.label}>{item.label}</Text>
                                <Ionicons name="chevron-forward" size={20} color={theme.colors.onSurfaceVariant} />
                            </View>
                            <Text style={styles.description}>{item.description}</Text>
                        </Card>
                    </Pressable>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </Container>
    );
}

const makeStyles = (theme: any) => StyleSheet.create({
    container: {
        padding: 16,
    },
    quizTypeCard: {
        marginBottom: 12,
    },
    selectedCard: {
        transform: [{ scale: 1.02 }],
    },
    cardContent: {
        padding: 16,
        backgroundColor: theme.colors.surface,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "transparent",
        shadowColor: theme.colors.onSurface,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        columnGap: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.primaryContainer,
        alignItems: "center",
        justifyContent: "center",
    },
    selectedIconContainer: {
        backgroundColor: theme.colors.primary,
    },
    label: {
        fontSize: 18,
        fontWeight: "bold",
        color: theme.colors.onSurface,
        flex: 1,
    },
    selectedLabel: {
        color: theme.colors.primary,
    },
    description: {
        fontSize: 14,
        color: theme.colors.onSurfaceVariant,
        lineHeight: 20,
    },
    selectedDescription: {
        color: theme.colors.onSurface,
    },
    separator: {
        height: 8,
    },
});
