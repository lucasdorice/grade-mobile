import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme/ThemeContext';

export default function TabLayout() {
    const { c } = useTheme();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: c.accent,
                tabBarInactiveTintColor: c.textTertiary,
                tabBarStyle: {
                    backgroundColor: c.tabBarBackground,
                    borderTopColor: c.tabBarBorder,
                    borderTopWidth: 1,
                    height: 85,
                    paddingBottom: 28,
                    paddingTop: 8,
                },
                tabBarLabelStyle: {
                    fontFamily: 'Inter_500Medium',
                    fontSize: 11,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Hoje',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? 'calendar' : 'calendar-outline'}
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="tasks"
                options={{
                    title: 'Tarefas',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? 'checkbox' : 'checkbox-outline'}
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Config',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? 'settings' : 'settings-outline'}
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
