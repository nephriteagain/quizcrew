import { useAppTheme } from "@/providers/ThemeProvider";
import { ReactNode } from "react";
import { View, ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface ContainerProps extends ViewProps {
    children: ReactNode;
}

export default function Container({ children, style, ...props }: ContainerProps) {
    const theme = useAppTheme();
    const insets = useSafeAreaInsets();
    return (
        <View
            style={[
                {
                    flex: 1,
                    backgroundColor: theme.colors.surfaceVariant,
                    paddingBottom: insets.bottom,
                },
                style,
            ]}
            {...props}
        >
            {children}
        </View>
    );
}
