import { StyleSheet } from 'react-native';

export const typography = StyleSheet.create({
    h1: {
        fontSize: 28,
        fontFamily: 'Inter_700Bold',
        lineHeight: 34,
    },
    h2: {
        fontSize: 22,
        fontFamily: 'Inter_600SemiBold',
        lineHeight: 28,
    },
    h3: {
        fontSize: 18,
        fontFamily: 'Inter_600SemiBold',
        lineHeight: 24,
    },
    body: {
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
        lineHeight: 22,
    },
    bodySmall: {
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
        lineHeight: 20,
    },
    caption: {
        fontSize: 12,
        fontFamily: 'Inter_500Medium',
        lineHeight: 16,
    },
    code: {
        fontSize: 14,
        fontFamily: 'JetBrainsMono_400Regular',
        lineHeight: 20,
    },
});
