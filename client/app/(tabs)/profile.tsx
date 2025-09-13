import reviewSelector from "@/store/review/review.store";
import userSelector from "@/store/user/user.store";
import { QuizDoc } from "@/types/review";
import { FlashList } from "@shopify/flash-list";
import { Image, StyleSheet, Text, View } from "react-native";

export default function Profile() {
    const user = userSelector.use.user();
    const quizzes = reviewSelector.use.quizzes();

    const renderQuizItem = ({ item }: { item: QuizDoc }) => (
        <View style={styles.quizItem}>
            <Text style={styles.quizTitle}>{item.title}</Text>
            <Text style={styles.quizDescription}>{item.description}</Text>
            <Text style={styles.quizType}>{item.type}</Text>
            <Text style={styles.quizDate}>
                Created: {new Date(item.createdAt).toLocaleDateString()}
            </Text>
            {item.tags && item.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                    {item.tags.map((tag, index) => (
                        <Text key={index} style={styles.tag}>
                            #{tag}
                        </Text>
                    ))}
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {user?.photoURL && <Image source={{ uri: user.photoURL }} style={styles.avatar} />}
                <Text style={styles.displayName}>{user?.displayName || "Anonymous User"}</Text>
                <Text style={styles.email}>{user?.email}</Text>
            </View>

            <View style={styles.quizzesSection}>
                <Text style={styles.sectionTitle}>My Quizzes ({quizzes.length})</Text>
                <FlashList
                    data={quizzes}
                    renderItem={renderQuizItem}
                    keyExtractor={(item) => item.quiz_id}
                    contentContainerStyle={styles.listContainer}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    header: {
        alignItems: "center",
        padding: 20,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
    },
    displayName: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 5,
    },
    email: {
        fontSize: 16,
        color: "#666",
    },
    quizzesSection: {
        flex: 1,
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 16,
        color: "#333",
    },
    listContainer: {
        paddingBottom: 20,
    },
    quizItem: {
        backgroundColor: "#fff",
        padding: 16,
        marginBottom: 12,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    quizTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#333",
    },
    quizDescription: {
        fontSize: 14,
        color: "#666",
        marginBottom: 8,
    },
    quizType: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#007AFF",
        marginBottom: 4,
    },
    quizDate: {
        fontSize: 12,
        color: "#999",
        marginBottom: 8,
    },
    tagsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    tag: {
        fontSize: 12,
        color: "#007AFF",
        marginRight: 8,
        marginBottom: 4,
    },
});
