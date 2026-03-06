const darkColors = {
    background: '#0D0D0F',
    surface: '#1A1A1F',
    surfaceElevated: '#242429',
    border: '#2E2E35',
    textPrimary: '#F5F5F7',
    textSecondary: '#8E8E93',
    textTertiary: '#636366',
    accent: '#6C5CE7',
    accentLight: '#A29BFE',
    accentBg: 'rgba(108, 92, 231, 0.2)',
    success: '#00B894',
    warning: '#FDCB6E',
    danger: '#FF6B6B',
    info: '#74B9FF',
};

const lightColors = {
    background: '#F0F2F5',
    surface: '#FFFFFF',
    surfaceElevated: '#F9FAFB',
    border: '#E5E7EB',
    textPrimary: '#111827',
    textSecondary: '#4B5563',
    textTertiary: '#9CA3AF',
    accent: '#6C5CE7',
    accentLight: '#A29BFE',
    accentBg: 'rgba(108, 92, 231, 0.1)',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',
};

export const theme = {
    colors: { ...darkColors },

    // Paleta de Cores de Disciplinas (Atribuída Aleatoriamente/Sequencialmente)
    subjectColors: [
        '#FF6B6B', // Vermelho Coral
        '#6C5CE7', // Roxo
        '#00B894', // Verde Esmeralda
        '#FDCB6E', // Amarelo
        '#74B9FF', // Azul Claro
        '#FD79A8', // Rosa
        '#55E6C1', // Turquesa
        '#F19066', // Laranja
    ],

    typography: {
        fontFamilies: {
            regular: 'Inter-Regular',
            medium: 'Inter-Medium',
            semiBold: 'Inter-SemiBold',
            bold: 'Inter-Bold',
            code: 'JetBrainsMono-Regular',
        },
        sizes: {
            h1: 28,
            h2: 22,
            h3: 18,
            body: 16,
            bodySmall: 14,
            caption: 12,
        }
    },

    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },

    borderRadius: {
        sm: 12,
        md: 20, // Curved Premium Look
        lg: 28,
        full: 999,
    },
    shadows: {
        card: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.1,
            shadowRadius: 24,
            elevation: 8,
        }
    }
};

export const applyGlobalTheme = (mode: 'dark' | 'light') => {
    Object.assign(theme.colors, mode === 'light' ? lightColors : darkColors);
};
