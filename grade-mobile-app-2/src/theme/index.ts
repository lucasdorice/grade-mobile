// Design tokens from design-v2.md

export const colors = {
    // Dark Theme
    background: '#0F0F13',
    surface: '#1C1C24',
    surfaceElevated: '#262630',
    border: '#32323E',
    textPrimary: '#F2F2F7',
    textSecondary: '#8E8E93',
    textTertiary: '#56566A',

    // Accent & Status
    accent: '#7C6AF4',
    accentSoft: 'rgba(124, 106, 244, 0.15)',
    success: '#34C78B',
    warning: '#FFB84D',
    danger: '#FF5C5C',

    // Course colors palette
    coursePalette: [
        '#FF6B6B', // Coral
        '#7C6AF4', // Roxo
        '#34C78B', // Verde
        '#FFB84D', // Amarelo
        '#5B9BF5', // Azul
        '#F472B6', // Rosa
        '#2DD4BF', // Turquesa
        '#FB923C', // Laranja
        '#A78BFA', // Lavanda
        '#60A5FA', // Azul Céu
        '#F87171', // Vermelho Suave
        '#4ADE80', // Verde Lima
        '#FBBF24', // Dourado
    ] as const,
} as const;

export const typography = {
    headingXl: {
        fontSize: 28,
        fontFamily: 'Inter_700Bold',
        lineHeight: 36,
    },
    headingLg: {
        fontSize: 24,
        fontFamily: 'Inter_700Bold',
        lineHeight: 32,
    },
    headingMd: {
        fontSize: 20,
        fontFamily: 'Inter_600SemiBold',
        lineHeight: 28,
    },
    headingSm: {
        fontSize: 17,
        fontFamily: 'Inter_600SemiBold',
        lineHeight: 24,
    },
    body: {
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
        lineHeight: 24,
    },
    bodySm: {
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
        lineHeight: 20,
    },
    caption: {
        fontSize: 12,
        fontFamily: 'Inter_500Medium',
        lineHeight: 16,
    },
    button: {
        fontSize: 16,
        fontFamily: 'Inter_600SemiBold',
        lineHeight: 24,
    },
} as const;

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
} as const;

export const radius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 999,
} as const;
