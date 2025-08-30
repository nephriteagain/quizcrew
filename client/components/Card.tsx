import { ReactNode } from "react";
import { View, ViewProps } from "react-native";

export interface CardProps extends ViewProps {
    children: ReactNode;
}

export default function Card({ children, style, ...props }: CardProps) {
    return (
        <View
            style={[
                {
                    flex: 1,
                    borderRadius: 16,
                    padding: 20,
                    backgroundColor: "#f9f9f9",
                    shadowColor: "#000",
                    shadowOpacity: 0.1,
                    shadowRadius: 6,
                    elevation: 4,
                    justifyContent: "center",
                },
                style,
            ]}
            {...props}
        >
            {children}
        </View>
    );
}
