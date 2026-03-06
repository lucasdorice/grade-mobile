import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { getDatabase } from '../src/database/client';
import { useAppStore } from '../src/store/useAppStore';
import { colors } from '../src/theme';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { isOnboardingCompleted, isLoading, loadAppState } = useAppStore();
  const [dbReady, setDbReady] = useState(false);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  // Initialize database
  useEffect(() => {
    async function initDB() {
      await getDatabase();
      setDbReady(true);
    }
    initDB();
  }, []);

  // Load app state after DB is ready
  useEffect(() => {
    if (dbReady) {
      loadAppState();
    }
  }, [dbReady]);

  // Hide splash when everything is ready
  useEffect(() => {
    if (fontsLoaded && !isLoading && dbReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isLoading, dbReady]);

  // Handle navigation based on onboarding status
  useEffect(() => {
    if (isLoading || !fontsLoaded || !dbReady) return;

    const inOnboarding = segments[0] === 'onboarding';

    if (!isOnboardingCompleted && !inOnboarding) {
      router.replace('/onboarding/welcome');
    } else if (isOnboardingCompleted && inOnboarding) {
      router.replace('/(tabs)');
    }
  }, [isOnboardingCompleted, isLoading, fontsLoaded, dbReady, segments]);

  if (!fontsLoaded || isLoading || !dbReady) {
    return null;
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen
          name="session/[id]"
          options={{
            headerShown: false,
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="manage-courses"
          options={{
            headerShown: false,
            presentation: 'card',
          }}
        />
      </Stack>
    </>
  );
}
