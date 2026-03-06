import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '../../src/theme';

interface StepperDotsProps {
    totalSteps: number;
    currentStep: number; // 1-indexed
}

export default function StepperDots({ totalSteps, currentStep }: StepperDotsProps) {
    return (
        <View style={styles.container}>
            {Array.from({ length: totalSteps }, (_, i) => (
                <View
                    key={i}
                    style={[
                        styles.dot,
                        i + 1 === currentStep && styles.dotActive,
                    ]}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: spacing.sm,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.border,
    },
    dotActive: {
        backgroundColor: colors.accent,
    },
});
