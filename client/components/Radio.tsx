import { useState } from "react";
import { Pressable, PressableProps, StyleSheet, Text, View, ViewProps } from "react-native";

export function Radio({ isChecked, onPress, ...props }: { isChecked: boolean } & PressableProps) {
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
    const [checked, setChecked] = useState<T | null>(null);

    return (
        <View style={[{ rowGap: 10 }, style]} {...props}>
            {data.map((d, i) => (
                <View key={`${d.value}+${d.label}+${i}`} style={styles.radioContainer}>
                    <Radio
                        isChecked={checked == d.value}
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

const styles = StyleSheet.create({
    radio: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: "gray",
    },
    checked: {
        backgroundColor: "#308630ff",
        borderColor: "green",
    },
    radioContainer: {
        flexDirection: "row",
        columnGap: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: "500",
    },
});
