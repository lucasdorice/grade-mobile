import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../../src/theme';

interface AulaCardProps {
    courseName: string;
    courseColor: string;
    startTime: string;
    endTime: string;
    hasNotes: boolean;
    onPress: () => void;
}

export default function AulaCard({ courseName, courseColor, startTime, endTime, hasNotes, onPress }: AulaCardProps) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
            <View style={[styles.colorBar, { backgroundColor: courseColor }]} />
            <View style={styles.content}>
                <Text style={styles.courseName}>{courseName}</Text>
                <View style={styles.timeRow}>
                    <Ionicons name="time-outline" size={16} color={colors.textTertiary} />
                    <Text style={styles.time}>{startTime} – {endTime}</Text>
                </View>
                <View style={[styles.badge, hasNotes ? styles.badgeActive : styles.badgeInactive]}>
                    <Text style={[styles.badgeText, { color: hasNotes ? colors.success : colors.textTertiary }]}>
                        {hasNotes ? '📝 Anotado' : 'Sem anotação'}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        padding: spacing.md,
        marginBottom: 12,
    },
    colorBar: {
        width: 4,
        borderRadius: radius.full,
        marginRight: 14,
    },
    content: {
        flex: 1,
    },
    courseName: {
        ...typography.headingMd,
        color: colors.textPrimary,
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: spacing.xs,
    },
    time: {
        ...typography.bodySm,
        color: colors.textSecondary,
    },
    badge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: radius.full,
        marginTop: spacing.sm,
    },
    badgeActive: {
        backgroundColor: 'rgba(52, 199, 139, 0.15)',
    },
    badgeInactive: {
        backgroundColor: colors.surfaceElevated,
    },
    badgeText: {
        ...typography.caption,
    },
});
