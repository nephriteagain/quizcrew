import Container from "@/components/Container";
import { AppTheme, useAppTheme } from "@/providers/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button, Switch, TextInput } from "react-native-paper";

export default function CreateGroup() {
    const theme = useAppTheme();
    const styles = makeStyles(theme);
    const router = useRouter();

    const [groupName, setGroupName] = useState("");
    const [description, setDescription] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [groupImage, setGroupImage] = useState<string | null>(null);

    const handleCreateGroup = () => {
        router.push("/invite-members");
    };

    const handleImagePicker = () => {
        console.log("Image picker will be implemented");
    };

    const isFormValid = groupName.trim().length > 0 && description.trim().length > 0;

    return (
        <Container>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.contentContainer}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Create Your Group</Text>
                        <Text style={styles.subtitle}>
                            Set up your group and invite members to get started
                        </Text>
                    </View>

                    <TouchableOpacity style={styles.imageContainer} onPress={handleImagePicker}>
                        {groupImage ? (
                            <Image source={{ uri: groupImage }} style={styles.groupImage} />
                        ) : (
                            <View style={styles.imagePlaceholder}>
                                <Ionicons
                                    name="camera-outline"
                                    size={40}
                                    color={theme.colors.onSurfaceVariant}
                                />
                                <Text style={styles.imagePlaceholderText}>Add Group Photo</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    <View style={styles.formContainer}>
                        <TextInput
                            mode="outlined"
                            label="Group Name"
                            placeholder="Enter group name"
                            value={groupName}
                            onChangeText={setGroupName}
                            style={styles.input}
                            maxLength={50}
                            right={<TextInput.Affix text={`${groupName.length}/50`} />}
                        />

                        <TextInput
                            mode="outlined"
                            label="Description"
                            placeholder="Describe what this group is about"
                            value={description}
                            onChangeText={setDescription}
                            style={styles.input}
                            multiline
                            numberOfLines={4}
                            maxLength={200}
                            right={<TextInput.Affix text={`${description.length}/200`} />}
                        />

                        <View style={styles.privacyContainer}>
                            <View style={styles.privacyInfo}>
                                <Text style={styles.privacyTitle}>Private Group</Text>
                                <Text style={styles.privacyDescription}>
                                    {isPrivate
                                        ? "Only invited members can join and see content"
                                        : "Anyone can discover and join this group"}
                                </Text>
                            </View>
                            <Switch value={isPrivate} onValueChange={setIsPrivate} />
                        </View>

                        <View style={styles.infoCard}>
                            <Ionicons
                                name="information-circle-outline"
                                size={20}
                                color={theme.colors.primary}
                            />
                            <Text style={styles.infoText}>
                                You can invite members and customize your group settings after creation
                            </Text>
                        </View>
                    </View>

                    <Button
                        mode="contained"
                        onPress={handleCreateGroup}
                        disabled={!isFormValid}
                        style={[styles.createButton, !isFormValid && styles.disabledButton]}
                        contentStyle={styles.createButtonContent}
                    >
                        Create Group
                    </Button>
                </View>
            </ScrollView>
        </Container>
    );
}

const makeStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        contentContainer: {
            padding: 16,
            gap: 24,
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
        imageContainer: {
            alignSelf: "center",
        },
        groupImage: {
            width: 120,
            height: 120,
            borderRadius: 60,
        },
        imagePlaceholder: {
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: theme.colors.surfaceVariant,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 2,
            borderColor: theme.colors.outline,
            borderStyle: "dashed",
            gap: 8,
        },
        imagePlaceholderText: {
            fontSize: 12,
            color: theme.colors.onSurfaceVariant,
            fontWeight: "500",
        },
        formContainer: {
            gap: 16,
        },
        input: {
            backgroundColor: theme.colors.surface,
        },
        privacyContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 16,
            backgroundColor: theme.colors.surfaceVariant,
            borderRadius: 12,
            gap: 16,
        },
        privacyInfo: {
            flex: 1,
            gap: 4,
        },
        privacyTitle: {
            fontSize: 16,
            fontWeight: "600",
            color: theme.colors.onSurface,
        },
        privacyDescription: {
            fontSize: 14,
            color: theme.colors.onSurfaceVariant,
            lineHeight: 18,
        },
        infoCard: {
            flexDirection: "row",
            padding: 16,
            backgroundColor: theme.colors.primaryContainer,
            borderRadius: 12,
            gap: 12,
            alignItems: "flex-start",
        },
        infoText: {
            flex: 1,
            fontSize: 14,
            color: theme.colors.onPrimaryContainer,
            lineHeight: 20,
        },
        createButton: {
            marginTop: 8,
        },
        createButtonContent: {
            paddingVertical: 8,
        },
        disabledButton: {
            opacity: 0.6,
        },
    });
