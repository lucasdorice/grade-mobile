import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import { colors, type ThemeColors } from './colors';

type ThemeMode = 'dark' | 'light';

interface ThemeContextType {
    theme: ThemeMode;
    c: ThemeColors;
    toggleTheme: () => void;
    setTheme: (mode: ThemeMode) => void;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'dark',
    c: colors.dark,
    toggleTheme: () => { },
    setTheme: () => { },
    isDark: true,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<ThemeMode>('dark');

    const c = theme === 'dark' ? colors.dark : colors.light;
    const isDark = theme === 'dark';

    const toggleTheme = useCallback(() => {
        setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
    }, []);

    const setTheme = useCallback((mode: ThemeMode) => {
        setThemeState(mode);
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, c, toggleTheme, setTheme, isDark }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
