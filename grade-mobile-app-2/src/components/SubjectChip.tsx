import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, typography, radius } from '../../src/theme';

interface SubjectChipProps {
    name: string;
    color: string;
    active?: boolean;
    onPress?: () => void;
    style?: ViewStyle;
}

export default function SubjectChip({ name, color, active = false, onPress, style }: SubjectChipProps) {
    const chipBg = active ? color + '26' : colors.surface; // 26 = ~15% opacity hex
    const chipBorder = active ? 'transparent' : colors.border;
    const textColor = active ? color : colors.textSecondary;

    return (
        <TouchableOpacity
            style={[styles.chip, { backgroundColor: chipBg, borderColor: chipBorder }, style]}
            onPress={onPress}
            activeOpacity={0.7}
            disabled={!onPress}
        >
            <View style={[styles.dot, { backgroundColor: color }]} />
            <Text style={[styles.label, { color: textColor }]}>{name}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 36,
        paddingHorizontal: 14,
        borderRadius: radius.full,
        borderWidth: 1,
        gap: 6,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    label: {
        ...typography.caption,
    },
});
