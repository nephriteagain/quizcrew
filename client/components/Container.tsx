import { ReactNode } from "react";
import { View, ViewProps } from "react-native";

export interface ContainerProps extends ViewProps {
    children: ReactNode;
}

export default function Container({ children, style, ...props }: ContainerProps) {
    return (
        <View
            style={[
                {
                    flex: 1,
                },
                style,
            ]}
            {...props}
        >
            {children}
        </View>
    );
}
