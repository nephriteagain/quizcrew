import { useAppTheme } from "@/providers/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function Layout() {
    const theme = useAppTheme();

    return (
        <Tabs
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: theme.colors.primary,
                },
                tabBarActiveTintColor: theme.colors?.onPrimary,
                tabBarInactiveTintColor: `${theme.colors?.onPrimary}7f`,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={theme.colors?.onPrimary} />
                    ),
                }}
            />
            <Tabs.Screen
                name="connections"
                options={{
                    title: "Connections",
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="people" size={size} color={theme.colors?.onPrimary} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    headerShown: false,
                    title: "Profile",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={size} color={theme.colors?.onPrimary} />
                    ),
                }}
            />
        </Tabs>
    );
}
