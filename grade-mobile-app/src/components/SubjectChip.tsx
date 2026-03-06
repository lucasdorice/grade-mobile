import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface SubjectChipProps {
    name: string;
    colorHex?: string;
    size?: 'small' | 'medium';
}

export function SubjectChip({ name, colorHex = theme.colors.accent, size = 'medium' }: SubjectChipProps) {
    // Transforma o HEX em rgba com 20% de opacidade para o fundo
    const getBackgroundColor = (hex: string) => {
        // Tratamento básico para fallback
        if (!hex.startsWith('#')) return theme.colors.surfaceElevated;

        // Simplificando conversión HEX -> RGBA (considerando hexs de 6 caracteres)
        let r = 0, g = 0, b = 0;
        if (hex.length === 7) {
            r = parseInt(hex.substring(1, 3), 16);
            g = parseInt(hex.substring(3, 5), 16);
            b = parseInt(hex.substring(5, 7), 16);
        }
        return `rgba(${r}, ${g}, ${b}, 0.2)`;
    };

    const isSmall = size === 'small';

    return (
        <View style={[
            styles.container,
            { backgroundColor: getBackgroundColor(colorHex) },
            isSmall && styles.containerSmall
        ]}>
            <View style={[styles.dot, { backgroundColor: colorHex }, isSmall && styles.dotSmall]} />
            <Text
                style={[
                    styles.text,
                    { color: colorHex },
                    isSmall && styles.textSmall
                ]}
                numberOfLines={1}
            >
                {name}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: theme.borderRadius.full,
        alignSelf: 'flex-start',
        maxWidth: '100%',
    },
    containerSmall: {
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 6,
    },
    dotSmall: {
        width: 4,
        height: 4,
        borderRadius: 2,
        marginRight: 4,
    },
    text: {
        fontFamily: theme.typography.fontFamilies.medium,
        fontSize: theme.typography.sizes.caption,
        flexShrink: 1,
    },
    textSmall: {
        fontSize: 10,
    }
});
