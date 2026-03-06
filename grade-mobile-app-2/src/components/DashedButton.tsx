import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius } from '../../src/theme';

interface DashedButtonProps {
    label: string;
    onPress: () => void;
    style?: ViewStyle;
}

export default function DashedButton({ label, onPress, style }: DashedButtonProps) {
    return (
        <TouchableOpacity
            style={[styles.button, style]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Ionicons name="add" size={20} color={colors.textTertiary} />
            <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        height: 56,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: colors.border,
        borderRadius: radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    label: {
        ...typography.bodySm,
        color: colors.textTertiary,
    },
});
