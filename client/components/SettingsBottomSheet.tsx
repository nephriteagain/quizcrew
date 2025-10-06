import { useAsyncAction } from "@/hooks/useAsyncAction";
import { AppTheme, useAppTheme } from "@/providers/ThemeProvider";
import { deleteQuiz } from "@/store/review/actions/deleteQuiz";
import authSelector from "@/store/user/user.store";
import { QuizDoc } from "@/types/review";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { forwardRef } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
import LoadingModal from "./LoadingModal";

interface SettingsBottomSheetProps {
    onSheetChanges: (index: number) => void;
    quiz: QuizDoc;
}

const SettingsBottomSheet = forwardRef<BottomSheet, SettingsBottomSheetProps>(
    ({ onSheetChanges, quiz }, ref) => {
        const user = authSelector.use.useUser();
        const theme = useAppTheme();
        const styles = makeStyles(theme);
        const router = useRouter();
        const onComplete = () => {
            (ref as any)?.current?.close();
            router.back();
        };

        const asyncActionOption = {
            onComplete,
        };

        const [deleteQuizFn, { isLoading }] = useAsyncAction(deleteQuiz, asyncActionOption);

        const renderBackdrop = (props: any) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                onPress={() => (ref as any)?.current?.close()}
            />
        );

        const handleEditQuiz = () => {
            console.log("edit");
            (ref as any)?.current?.close();
        };

        const handleShareQuiz = () => {
            console.log("share");
            (ref as any)?.current?.close();
        };

        const handleDeleteQuiz = () => {
            console.log("delete");
            if (!quiz) return;
            Alert.alert(
                "Delete Quiz",
                `Are you sure you want to delete quiz "${quiz.title}?\nYou cannot undo this action."`,
                [
                    {
                        text: "Cancel",
                        onPress: () => {},
                        style: "cancel",
                    },
                    {
                        text: "Delete",
                        onPress: async () => {
                            deleteQuizFn(quiz.quiz_id);
                        },
                        style: "destructive",
                    },
                ]
            );
        };

        const isOwner = user?.uid === quiz.createdBy;

        return (
            <>
                <BottomSheet
                    ref={ref}
                    onChange={onSheetChanges}
                    index={-1}
                    snapPoints={["60%"]}
                    enablePanDownToClose={true}
                    backdropComponent={renderBackdrop}
                    animationConfigs={{
                        damping: 80,
                        overshootClamping: true,
                        stiffness: 500,
                    }}
                >
                    <BottomSheetView style={styles.contentContainer}>
                        <Text style={styles.headerTitle}>Quiz Settings</Text>

                        {isOwner && (
                            <TouchableOpacity style={styles.settingButton} onPress={handleEditQuiz}>
                                <Ionicons
                                    name="create-outline"
                                    size={24}
                                    color={theme.colors.primary}
                                />
                                <Text style={styles.settingButtonText}>Edit Quiz</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity style={styles.settingButton} onPress={handleShareQuiz}>
                            <Ionicons
                                name="share-outline"
                                size={24}
                                color={theme.colors.secondary}
                            />
                            <Text
                                style={[
                                    styles.settingButtonText,
                                    { color: theme.colors.secondary },
                                ]}
                            >
                                Share Quiz
                            </Text>
                        </TouchableOpacity>

                        {isOwner && (
                            <TouchableOpacity
                                style={styles.settingButton}
                                onPress={handleDeleteQuiz}
                            >
                                <Ionicons
                                    name="trash-outline"
                                    size={24}
                                    color={theme.colors.error}
                                />
                                <Text
                                    style={[
                                        styles.settingButtonText,
                                        { color: theme.colors.error },
                                    ]}
                                >
                                    Delete Quiz
                                </Text>
                            </TouchableOpacity>
                        )}
                    </BottomSheetView>
                </BottomSheet>
                <LoadingModal isVisible={isLoading} loadingText="Deleting Quiz..." />
            </>
        );
    }
);

SettingsBottomSheet.displayName = "SettingsBottomSheet";

export default SettingsBottomSheet;

const makeStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.onSurfaceVariant,
        },
        contentContainer: {
            flex: 1,
            padding: 24,
            alignItems: "center",
        },
        headerTitle: {
            fontSize: 20,
            fontWeight: "bold",
            color: theme.colors.onSurface,
            marginBottom: 24,
        },
        settingButton: {
            flexDirection: "row",
            alignItems: "center",
            padding: 16,
            backgroundColor: theme.colors.surface,
            borderRadius: 12,
            marginBottom: 12,
            width: "100%",
            columnGap: 12,
        },
        settingButtonText: {
            fontSize: 16,
            fontWeight: "600",
            color: theme.colors.primary,
        },
    });
