import QuizList from "@/components/QuizList";
import reviewSelector from "@/store/review/review.store";
import userSelector from "@/store/user/user.store";
import { Quiz, QUIZ_TYPE } from "@/types/review";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function Profile() {
    const user = userSelector.use.user();
    const quizzes = reviewSelector.use.quizzes();

    const router = useRouter();

    const handlePress = useCallback(
        (quiz: Quiz) => {
            if (quiz.type === QUIZ_TYPE.MCQ) {
                router.push({
                    pathname: "../mcq",
                    params: {
                        quiz_id: quiz.quiz_id,
                    },
                });
            } else if (quiz.type === QUIZ_TYPE.TOFQ) {
                router.push({
                    pathname: "../tofq",
                    params: {
                        quiz_id: quiz.quiz_id,
                    },
                });
            } else if (quiz.type === QUIZ_TYPE.DNDQ) {
                router.push({
                    pathname: "/dndq",
                    params: {
                        quiz_id: quiz.quiz_id,
                    },
                });
            }
        },
        [router]
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {user?.photoURL && <Image source={{ uri: user.photoURL }} style={styles.avatar} />}
                <Text style={styles.displayName}>{user?.displayName || "Anonymous User"}</Text>
                <Text style={styles.email}>{user?.email}</Text>
            </View>

            <View style={styles.quizzesSection}>
                <QuizList
                    onQuizPress={handlePress}
                    quizzes={quizzes}
                    ListHeaderComponent={
                        <Text style={styles.sectionTitle}>My Quizzes ({quizzes.length})</Text>
                    }
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
        marginBottom: 8,
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
