import { useEffect, useState } from 'react';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import {
    useFonts,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
} from '@expo-google-fonts/inter';
import { JetBrainsMono_400Regular } from '@expo-google-fonts/jetbrains-mono';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider, useTheme } from '../src/theme/ThemeContext';
import { getDatabase } from '../src/db/database';
import { getSetting } from '../src/db/repositories/settings';
import { useNotificationListener } from '../src/hooks/useNotifications';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
    const { c, isDark, setTheme } = useTheme();
    const [ready, setReady] = useState(false);

    // Listen for notification taps
    useNotificationListener();

    useEffect(() => {
        async function checkOnboarding() {
            const onboardingDone = await getSetting('onboarding_done');
            const savedTheme = await getSetting('theme');

            if (savedTheme === 'light' || savedTheme === 'dark') {
                setTheme(savedTheme);
            }

            setReady(true);

            if (onboardingDone !== 'true') {
                router.replace('/onboarding');
            }
        }
        checkOnboarding();
    }, []);

    if (!ready) return null;

    return (
        <>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: c.background },
                    animation: 'slide_from_right',
                }}
            >
                <Stack.Screen name="(tabs)" />
                <Stack.Screen
                    name="onboarding/index"
                    options={{ animation: 'fade', gestureEnabled: false }}
                />
                <Stack.Screen name="card/[id]" />
                <Stack.Screen name="subject/new" options={{ presentation: 'modal' }} />
                <Stack.Screen name="semester/index" options={{ presentation: 'modal' }} />
            </Stack>
        </>
    );
}

export default function RootLayout() {
    const [dbReady, setDbReady] = useState(false);

    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
        JetBrainsMono_400Regular,
    });

    useEffect(() => {
        async function init() {
            try {
                await getDatabase();
                setDbReady(true);
            } catch (e) {
                console.error('Failed to initialize database:', e);
            }
        }
        init();
    }, []);

    useEffect(() => {
        if (fontsLoaded && dbReady) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, dbReady]);

    if (!fontsLoaded || !dbReady) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#6C5CE7" />
            </View>
        );
    }

    return (
        <ThemeProvider>
            <RootLayoutNav />
        </ThemeProvider>
    );
}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0D0D0F',
    },
});
