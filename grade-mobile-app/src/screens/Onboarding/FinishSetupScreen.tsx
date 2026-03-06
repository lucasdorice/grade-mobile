import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../theme';
import { useAppStore } from '../../store/useAppStore';

export default function FinishSetupScreen() {
    const completeOnboarding = useAppStore(state => state.completeOnboarding);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.stepperContainer}>
                    <View style={styles.stepDot} />
                    <View style={styles.stepDot} />
                    <View style={styles.stepDot} />
                    <View style={[styles.stepDot, styles.stepDotActive]} />
                </View>
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>Sua grade está pronta! 🎓</Text>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => completeOnboarding()}
                    activeOpacity={0.8}
                >
                    <Text style={styles.primaryButtonText}>Começar a usar! 🚀</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: { paddingTop: 60, paddingHorizontal: 24, alignItems: 'center' },
    stepperContainer: { flexDirection: 'row', marginBottom: 24 },
    stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.border },
    stepDotActive: { backgroundColor: theme.colors.accent, width: 24 },
    content: { flex: 1, paddingHorizontal: 24, justifyContent: 'center', alignItems: 'center' },
    title: { fontFamily: theme.typography.fontFamilies.semiBold, fontSize: theme.typography.sizes.h2, color: theme.colors.textPrimary, textAlign: 'center' },
    footer: { paddingHorizontal: 24, paddingBottom: 40 },
    primaryButton: { backgroundColor: theme.colors.accent, paddingVertical: 16, borderRadius: theme.borderRadius.full, alignItems: 'center', justifyContent: 'center' },
    primaryButtonText: { fontFamily: theme.typography.fontFamilies.semiBold, fontSize: theme.typography.sizes.body, color: '#FFFFFF' },
});
