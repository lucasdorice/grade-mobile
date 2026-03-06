import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Calendar, CheckSquare, Settings } from 'lucide-react-native';
import * as Font from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold
} from '@expo-google-fonts/inter';
import { JetBrainsMono_400Regular } from '@expo-google-fonts/jetbrains-mono';
import { initializeDatabase } from './src/database/schema';
import { clearDatabase } from './src/database/queries';
import { theme, applyGlobalTheme } from './src/theme';
import { useAppStore } from './src/store/useAppStore';

import HomeScreen from './src/screens/Home/HomeScreen';
import TasksScreen from './src/screens/Tasks/TasksScreen';
import SettingsScreen from './src/screens/Settings/SettingsScreen';

import WelcomeScreen from './src/screens/Onboarding/WelcomeScreen';
import NameScreen from './src/screens/Onboarding/NameScreen';
import SetupMethodScreen from './src/screens/Onboarding/SetupMethodScreen';
import ImageImportScreen from './src/screens/Onboarding/ImageImportScreen';
import AddMultipleCoursesScreen from './src/screens/Onboarding/AddMultipleCoursesScreen';
import ScheduleReadyScreen from './src/screens/Onboarding/ScheduleReadyScreen';

import CreateTaskScreen from './src/screens/Forms/CreateTaskScreen';
import CreateCourseScreen from './src/screens/Forms/CreateCourseScreen';
import ClassScreen from './src/screens/Class/ClassScreen';
import ManageCoursesScreen from './src/screens/Settings/ManageCoursesScreen';
import AllNotesScreen from './src/screens/Notes/AllNotesScreen';

const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          height: 60,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarIndicatorStyle: {
          backgroundColor: theme.colors.accent,
          height: 3,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
          position: 'absolute',
          top: 0
        },
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarShowIcon: true,
        tabBarLabelStyle: {
          fontFamily: 'Inter_500Medium',
          fontSize: 10,
          textTransform: 'none',
          marginTop: -4
        }
      }}
    >
      <Tab.Screen
        name="Hoje"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <Calendar color={color} size={24} />
        }}
      />
      <Tab.Screen
        name="Tarefas"
        component={TasksScreen}
        options={{
          tabBarIcon: ({ color }) => <CheckSquare color={color} size={24} />
        }}
      />
      <Tab.Screen
        name="Config"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color }) => <Settings color={color} size={24} />
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const hasCompletedOnboarding = useAppStore(state => state.hasCompletedOnboarding);

  useEffect(() => {
    async function prepareApp() {
      try {
        // Aplica o tema Global escolhido (Claro ou Escuro) sincronicamente antes de subir UI
        const mode = useAppStore.getState().themeMode;
        applyGlobalTheme(mode);

        await Promise.all([
          Font.loadAsync({
            Inter_400Regular,
            Inter_500Medium,
            Inter_600SemiBold,
            Inter_700Bold,
            JetBrainsMono_400Regular,
          }),
          initializeDatabase().then(() => {
            if (__DEV__) {
              // Limpa as sessões passadas para ajudar nos testes UX quando em desenvolvimento.
              clearDatabase();
              // Limpa também o estado do Zustand (nome, onboarding flag) para reset total.
              useAppStore.setState({
                hasCompletedOnboarding: false,
                userName: null,
              });
            }
          })
        ]);
      } catch (e) {
        console.error("Erro na inicialização:", e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepareApp();
  }, []);

  if (!appIsReady) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer theme={{
          ...DarkTheme,
          colors: {
            ...DarkTheme.colors,
            primary: theme.colors.accent,
            background: theme.colors.background,
            card: theme.colors.surface,
            text: theme.colors.textPrimary,
            border: theme.colors.border,
            notification: theme.colors.danger
          }
        }}>
          <StatusBar style="light" />

          {!hasCompletedOnboarding ? (
            <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
              <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
              <Stack.Screen name="NameScreen" component={NameScreen} />
              <Stack.Screen name="SetupMethodScreen" component={SetupMethodScreen} />
              <Stack.Screen name="ImageImportScreen" component={ImageImportScreen} />
              <Stack.Screen name="AddMultipleCoursesScreen" component={AddMultipleCoursesScreen} />
              <Stack.Screen name="ScheduleReadyScreen" component={ScheduleReadyScreen} />
              <Stack.Screen name="CreateCourse" component={CreateCourseScreen} options={{ presentation: 'modal' }} />
            </Stack.Navigator>
          ) : (
            <MainStack.Navigator screenOptions={{ headerShown: false }}>
              {/* Main Tabs */}
              <MainStack.Screen name="MainTabs" component={MainTabNavigator} />
              <MainStack.Screen name="ClassScreen" component={ClassScreen} />

              {/* Form Modals */}
              <MainStack.Group screenOptions={{ presentation: 'modal', animation: 'slide_from_bottom' }}>
                <MainStack.Screen name="CreateTask" component={CreateTaskScreen} />
                <MainStack.Screen name="CreateCourse" component={CreateCourseScreen} />
                <MainStack.Screen name="GerenciarDisciplinasModal" component={ManageCoursesScreen} />
                <MainStack.Screen name="AllNotes" component={AllNotesScreen} />
              </MainStack.Group>
            </MainStack.Navigator>
          )}

        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
