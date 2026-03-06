import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import { colors, typography, radius } from '../../src/theme';

interface PrimaryButtonProps {
    label: string;
    onPress: () => void;
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle;
}

export default function PrimaryButton({ label, onPress, disabled = false, loading = false, style }: PrimaryButtonProps) {
    return (
        <TouchableOpacity
            style={[styles.button, disabled && styles.disabled, style]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color="#FFFFFF" />
            ) : (
                <Text style={styles.label}>{label}</Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        height: 56,
        backgroundColor: colors.accent,
        borderRadius: radius.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabled: {
        opacity: 0.4,
    },
    label: {
        ...typography.button,
        color: '#FFFFFF',
    },
});
