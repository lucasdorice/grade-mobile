import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, typography, radius } from '../../src/theme';

interface DayChipProps {
    label: string;
    active: boolean;
    onToggle: () => void;
    style?: ViewStyle;
}

export default function DayChip({ label, active, onToggle, style }: DayChipProps) {
    return (
        <TouchableOpacity
            style={[styles.chip, active && styles.chipActive, style]}
            onPress={onToggle}
            activeOpacity={0.7}
        >
            <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    chip: {
        height: 40,
        minWidth: 48,
        paddingHorizontal: 12,
        borderRadius: radius.sm,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
    chipActive: {
        backgroundColor: colors.accentSoft,
        borderColor: colors.accent,
    },
    label: {
        ...typography.bodySm,
        color: colors.textSecondary,
    },
    labelActive: {
        color: colors.accent,
        fontFamily: 'Inter_600SemiBold',
    },
});
