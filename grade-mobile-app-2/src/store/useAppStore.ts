import { create } from 'zustand';
import { getConfig, setConfig } from '../database/queries';

interface AppState {
    // State
    studentName: string;
    isOnboardingCompleted: boolean;
    isLoading: boolean;

    // Actions
    loadAppState: () => Promise<void>;
    setStudentName: (name: string) => Promise<void>;
    completeOnboarding: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
    studentName: '',
    isOnboardingCompleted: false,
    isLoading: true,

    loadAppState: async () => {
        try {
            const name = await getConfig('student_name');
            const onboarding = await getConfig('onboarding_completed');

            set({
                studentName: name ?? '',
                isOnboardingCompleted: onboarding === 'true',
                isLoading: false,
            });
        } catch (error) {
            console.error('Error loading app state:', error);
            set({ isLoading: false });
        }
    },

    setStudentName: async (name: string) => {
        await setConfig('student_name', name);
        set({ studentName: name });
    },

    completeOnboarding: async () => {
        await setConfig('onboarding_completed', 'true');
        set({ isOnboardingCompleted: true });
    },
}));
