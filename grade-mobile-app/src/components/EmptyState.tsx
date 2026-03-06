import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { FileQuestion, Frown } from 'lucide-react-native';

interface EmptyStateProps {
    title: string;
    subtitle: string;
    icon?: 'folder' | 'frown' | 'none';
}

export function EmptyState({ title, subtitle, icon = 'none' }: EmptyStateProps) {
    return (
        <View style={styles.container}>
            {icon === 'folder' && (
                <View style={styles.iconContainer}>
                    <FileQuestion color={theme.colors.textSecondary} size={32} />
                </View>
            )}
            {icon === 'frown' && (
                <View style={styles.iconContainer}>
                    <Frown color={theme.colors.textSecondary} size={32} />
                </View>
            )}
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderStyle: 'dashed',
        borderRadius: theme.borderRadius.lg,
    },
    iconContainer: {
        marginBottom: 16,
        padding: 12,
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.full,
    },
    title: {
        fontFamily: theme.typography.fontFamilies.semiBold,
        fontSize: theme.typography.sizes.h3,
        color: theme.colors.textSecondary,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontFamily: theme.typography.fontFamilies.regular,
        fontSize: theme.typography.sizes.bodySmall,
        color: theme.colors.textTertiary,
        textAlign: 'center',
    }
});
