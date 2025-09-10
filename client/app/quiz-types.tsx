import Card from "@/components/Card";
import { QUIZ_TYPE } from "@/types/review";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
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
    const router = useRouter();

    const handleSelect = (type: QUIZ_TYPE) => {
        router.push({
            pathname: "/create",
            params: { type },
        });
    };

    return (
        <View style={styles.container}>
            <FlashList
                data={QUIZ_ARR}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <Pressable style={styles.quizTypeCard} onPress={() => handleSelect(item.value)}>
                        <Card style={styles.cardContent}>
                            <View style={styles.header}>
                                <View style={styles.iconContainer}>
                                    <Ionicons name={item.icon} size={24} color="#4f46e5" />
                                </View>
                                <Text style={styles.label}>{item.label}</Text>
                                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                            </View>
                            <Text style={styles.description}>{item.description}</Text>
                        </Card>
                    </Pressable>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f9fafb",
    },
    quizTypeCard: {
        marginBottom: 12,
    },
    selectedCard: {
        transform: [{ scale: 1.02 }],
    },
    cardContent: {
        padding: 16,
        backgroundColor: "white",
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "transparent",
        shadowColor: "#000",
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
        backgroundColor: "#eef2ff",
        alignItems: "center",
        justifyContent: "center",
    },
    selectedIconContainer: {
        backgroundColor: "#4f46e5",
    },
    label: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1f2937",
        flex: 1,
    },
    selectedLabel: {
        color: "#4f46e5",
    },
    description: {
        fontSize: 14,
        color: "#6b7280",
        lineHeight: 20,
    },
    selectedDescription: {
        color: "#374151",
    },
    separator: {
        height: 8,
    },
});
