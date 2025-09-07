import QuizList from "@/components/QuizList";
import reviewSelector from "@/store/review/review.store";
import { Link, LinkProps } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

const routes: {
    name: LinkProps["href"];
    label: string;
}[] = [
    { name: "/mcq", label: "Multiple Choice" },
    { name: "/tofq", label: "True or False" },
    { name: "/dndq", label: "Drag and Drop" },
    { name: "/create", label: "Create Reviewer" },
];

export default function Index() {
    const reviewer = reviewSelector.use.quizzes();

    return (
        <ScrollView>
            <View style={{ flex: 1, backgroundColor: "white", padding: 10, rowGap: 10 }}>
                {routes.map((route) => (
                    <Link href={route.name} asChild key={route.label}>
                        <Pressable
                            style={{
                                width: "100%",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: 12,
                                borderRadius: 12,
                                backgroundColor: "#d81f1fff",
                            }}
                        >
                            <Text style={{ fontSize: 24, fontWeight: "700", color: "white" }}>
                                {route.label}
                            </Text>
                        </Pressable>
                    </Link>
                ))}
                <QuizList quizzes={reviewer} />
            </View>
        </ScrollView>
    );
}
