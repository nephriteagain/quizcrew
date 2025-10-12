import Container from "@/components/Container";
import LoadingModal from "@/components/LoadingModal";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { useImagePicker } from "@/hooks/useImagePicker";
import { AppTheme, useAppTheme } from "@/providers/ThemeProvider";
import { addGroupProfilePic } from "@/store/group/actions/addGroupProfilePic";
import { createGroup } from "@/store/group/actions/createGroup";
import authSelector from "@/store/user/user.store";
import { GroupForm } from "@/types/user";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Switch, Text, TextInput } from "react-native-paper";
import { Toast } from "toastify-react-native";
import * as Yup from "yup";

const INITIAL_VALUES: GroupForm = {
    name: "",
    description: "",
    avatar: "",
    isPrivate: false,
};

const createGroupSchema = Yup.object().shape({
    name: Yup.string()
        .min(1, "Group name is required")
        .max(50, "Group name must be 50 characters or less")
        .required("Group name is required"),
    description: Yup.string()
        .min(1, "Description is required")
        .max(200, "Description must be 200 characters or less")
        .required("Description is required"),
    avatar: Yup.string().required(),
    isPrivate: Yup.boolean(),
});

export default function CreateGroup() {
    const theme = useAppTheme();
    const styles = makeStyles(theme);
    const router = useRouter();
    const { pickImage } = useImagePicker();

    const handleCreate = async (values: GroupForm) => {
        if (!user) {
            Toast.error("User not logged in");
            return;
        }
        const url = await addGroupProfilePic(values.avatar!);
        if (!url) {
            Toast.error("Failed to upload group avatar.");
        }
        const result = await createGroup({ ...values, avatar: url ?? null }, user.uid);
        if (!result) {
            Toast.error("Failed to create group.");
            return;
        }

        Toast.success("Group created.");
        router.push({
            pathname: "/invite-members",
            params: { gid: result, groupName: values.name },
        });
    };

    const [handleCreateFn, status] = useAsyncAction(handleCreate);
    const user = authSelector.use.useUser();

    const handleSubmit = async (values: GroupForm) => {
        console.log(JSON.stringify(values, null, 2));
        Alert.alert(
            `Create Group`,
            `Name: "${values.name}"\nPrivacy: ${values.isPrivate ? "PRIVATE" : "PUBLIC"}\nDescription: ${values.description}`,
            [
                {
                    text: "Cancel",
                    onPress: () => {},
                    style: "cancel",
                },
                {
                    text: "Continue",
                    onPress: () => handleCreateFn(values),
                },
            ]
        );
    };

    return (
        <Container>
            <Formik
                initialValues={INITIAL_VALUES}
                validationSchema={createGroupSchema}
                onSubmit={handleSubmit}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    setFieldValue,
                    isValid,
                }) => (
                    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                        <View style={styles.contentContainer}>
                            <View style={styles.header}>
                                <Text style={styles.title}>Create Your Group</Text>
                                <Text style={styles.subtitle}>
                                    Set up your group and invite members to get started
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={styles.imageContainer}
                                onPress={async () => {
                                    const assets = await pickImage({
                                        mediaTypes: "images",
                                        quality: 0.8,
                                        allowsEditing: true,
                                        aspect: [1, 1],
                                    });
                                    if (assets && assets[0]) {
                                        setFieldValue("avatar", assets[0].uri);
                                    }
                                }}
                            >
                                {values.avatar ? (
                                    <Image
                                        source={{ uri: values.avatar }}
                                        style={styles.groupImage}
                                    />
                                ) : (
                                    <View style={styles.imagePlaceholder}>
                                        <Ionicons
                                            name="camera-outline"
                                            size={40}
                                            color={theme.colors.onSurfaceVariant}
                                        />
                                        <Text style={styles.imagePlaceholderText}>
                                            Add Group Photo
                                        </Text>
                                    </View>
                                )}
                            </TouchableOpacity>

                            <View style={styles.formContainer}>
                                <TextInput
                                    mode="outlined"
                                    label="Group Name"
                                    placeholder="Enter group name"
                                    onChangeText={handleChange("name")}
                                    onBlur={handleBlur("name")}
                                    style={styles.input}
                                    maxLength={50}
                                    error={touched.name && !!errors.name}
                                    right={<TextInput.Affix text={`${values.name.length}/50`} />}
                                />
                                {touched.name && errors.name && (
                                    <Text style={styles.errorText}>{errors.name}</Text>
                                )}

                                <TextInput
                                    mode="outlined"
                                    label="Description"
                                    placeholder="Describe what this group is about"
                                    onChangeText={handleChange("description")}
                                    onBlur={handleBlur("description")}
                                    style={styles.input}
                                    multiline
                                    numberOfLines={4}
                                    maxLength={200}
                                    error={touched.description && !!errors.description}
                                    right={
                                        <TextInput.Affix
                                            text={`${values.description.length}/200`}
                                        />
                                    }
                                />
                                {touched.description && errors.description && (
                                    <Text style={styles.errorText}>{errors.description}</Text>
                                )}

                                <View style={styles.privacyContainer}>
                                    <View style={styles.privacyInfo}>
                                        <Text style={styles.privacyTitle}>Private Group</Text>
                                        <Text style={styles.privacyDescription}>
                                            {values.isPrivate
                                                ? "Only invited members can join and see content"
                                                : "Anyone can discover and join this group"}
                                        </Text>
                                    </View>
                                    <Switch
                                        style={{ alignSelf: "flex-start" }}
                                        value={values.isPrivate}
                                        onValueChange={(value) => {
                                            setFieldValue("isPrivate", value);
                                        }}
                                    />
                                </View>

                                <View style={styles.infoCard}>
                                    <Ionicons
                                        name="information-circle-outline"
                                        size={20}
                                        color={theme.colors.primary}
                                    />
                                    <Text style={styles.infoText}>
                                        You can invite members and customize your group settings
                                        after creation
                                    </Text>
                                </View>
                            </View>

                            <Button
                                mode="contained"
                                onPress={() => handleSubmit()}
                                disabled={!isValid}
                                style={[styles.createButton, !isValid && styles.disabledButton]}
                                contentStyle={styles.createButtonContent}
                            >
                                Create Group
                            </Button>
                        </View>
                    </ScrollView>
                )}
            </Formik>
            <LoadingModal
                isVisible={status.isLoading}
                loadingText="Creating group, please wait..."
            />
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
            fontSize: 10,
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
        errorText: {
            fontSize: 12,
            color: theme.colors.error,
            marginTop: -12,
        },
    });
