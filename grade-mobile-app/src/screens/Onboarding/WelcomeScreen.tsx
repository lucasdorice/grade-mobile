import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import { Calendar } from 'lucide-react-native';
import { useAppStore } from '../../store/useAppStore';

export default function WelcomeScreen() {
    const navigation = useNavigation<any>();
    const completeOnboarding = useAppStore(state => state.completeOnboarding);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Calendar color={theme.colors.accent} size={64} />
                </View>
                <Text style={styles.title}>Grade</Text>
                <Text style={styles.subtitle}>
                    Sua rotina acadêmica no bolso. Anotações, código e prazos em um só lugar.
                </Text>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => navigation.navigate('NameScreen')}
                    activeOpacity={0.8}
                >
                    <Text style={styles.primaryButtonText}>Começar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => completeOnboarding()}
                >
                    <Text style={styles.secondaryButtonText}>Pular e configurar depois</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: theme.spacing.xl,
    },
    iconContainer: {
        marginBottom: theme.spacing.xl,
        padding: theme.spacing.lg,
        backgroundColor: theme.colors.accentBg,
        borderRadius: theme.borderRadius.full,
    },
    title: {
        fontFamily: theme.typography.fontFamilies.bold,
        fontSize: theme.typography.sizes.h1,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.sm,
    },
    subtitle: {
        fontFamily: theme.typography.fontFamilies.regular,
        fontSize: theme.typography.sizes.body,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
    },
    footer: {
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.xxl,
    },
    primaryButton: {
        backgroundColor: theme.colors.accent,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.full,
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    primaryButtonText: {
        fontFamily: theme.typography.fontFamilies.semiBold,
        fontSize: theme.typography.sizes.body,
        color: '#FFFFFF',
    },
    secondaryButton: {
        alignItems: 'center',
        paddingVertical: theme.spacing.sm,
    },
    secondaryButtonText: {
        fontFamily: theme.typography.fontFamilies.medium,
        fontSize: theme.typography.sizes.caption,
        color: theme.colors.textTertiary,
        textDecorationLine: 'underline',
    }
});
