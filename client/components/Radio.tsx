import { useAppTheme } from "@/providers/ThemeProvider";
import { useState } from "react";
import { Pressable, PressableProps, StyleSheet, View, ViewProps } from "react-native";
import { Text } from "react-native-paper";

export function Radio({ isChecked, onPress, ...props }: { isChecked: boolean } & PressableProps) {
    const theme = useAppTheme();
    const styles = makeStyles(theme);

    return (
        <Pressable
            style={[styles.radio, isChecked && styles.checked]}
            onPress={onPress}
            {...props}
        ></Pressable>
    );
}

export function RadioGroup<T>({
    data,
    onValueChange,
    style,
    ...props
}: {
    data: { label: string; value: T }[];
    onValueChange: (value: T | null) => void;
} & ViewProps) {
    const theme = useAppTheme();
    const styles = makeStyles(theme);
    const [checked, setChecked] = useState<T | null>(null);

    return (
        <View style={[{ rowGap: 10 }, style]} {...props}>
            {data.map((d, i) => (
                <View key={`${d.value}+${d.label}+${i}`} style={styles.radioContainer}>
                    <Radio
                        isChecked={checked === d.value}
                        onPress={() => {
                            if (checked === d.value) {
                                setChecked(null);
                                onValueChange(null);
                            } else {
                                setChecked(d.value);
                                onValueChange(d.value);
                            }
                        }}
                    />
                    <Text style={styles.label}>{d.label}</Text>
                </View>
            ))}
        </View>
    );
}

const makeStyles = (theme: any) => StyleSheet.create({
    radio: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: theme.colors.outline,
    },
    checked: {
        backgroundColor: theme.colors.secondary,
        borderColor: theme.colors.secondary,
    },
    radioContainer: {
        flexDirection: "row",
        columnGap: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: "500",
        color: theme.colors.onSurface,
    },
});
