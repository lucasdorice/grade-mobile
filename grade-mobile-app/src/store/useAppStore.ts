import { create } from 'zustand';

interface AppState {
    hasCompletedOnboarding: boolean;
    userName: string | null;
    themeMode: 'dark' | 'light';
    semester: string;
    completeOnboarding: () => void;
    setUserName: (name: string) => void;
    toggleTheme: () => void;
    setSemester: (sem: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
    hasCompletedOnboarding: false,
    userName: null,
    themeMode: 'dark',
    semester: '1º Semestre',
    completeOnboarding: () => set({ hasCompletedOnboarding: true }),
    setUserName: (name) => set({ userName: name }),
    toggleTheme: () => set((state) => ({ themeMode: state.themeMode === 'dark' ? 'light' : 'dark' })),
    setSemester: (sem) => set({ semester: sem }),
}));
