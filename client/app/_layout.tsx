import GlobalLoadingModal from "@/components/GlobalLoadingModal";
import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <>
            <Stack>
                <Stack.Screen name="index" options={{ headerTitle: "Review" }} />
                <Stack.Screen
                    name="mcq-answer"
                    options={{ headerTitle: "Multiple Choice Question" }}
                />
                <Stack.Screen name="mcq" options={{ headerTitle: "Multiple Choice Questions" }} />
                <Stack.Screen name="tofq" options={{ headerTitle: "True or False Questions" }} />
                <Stack.Screen
                    name="tofq-answer"
                    options={{ headerTitle: "True of False Questions" }}
                />
                <Stack.Screen name="dndq" options={{ headerTitle: "Drag and Drop Questions" }} />
                <Stack.Screen
                    name="dndq-answer"
                    options={{ headerTitle: "Drag and Drop Questions" }}
                />

                <Stack.Screen name="create" options={{ headerTitle: "Create a Reviewer" }} />
            </Stack>
            <GlobalLoadingModal />
        </>
    );
}
