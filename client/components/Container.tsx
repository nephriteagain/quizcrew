import { useAppTheme } from "@/providers/ThemeProvider";
import { ReactNode } from "react";
import { View, ViewProps } from "react-native";

export interface ContainerProps extends ViewProps {
    children: ReactNode;
}

export default function Container({ children, style, ...props }: ContainerProps) {
    const theme = useAppTheme();
    return (
        <View
            style={[
                {
                    flex: 1,
                    backgroundColor: theme.colors.surfaceVariant,
                },
                style,
            ]}
            {...props}
        >
            {children}
        </View>
    );
}
