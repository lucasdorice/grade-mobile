import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, radius } from '../../src/theme';

interface NoteCardProps {
    courseName: string;
    courseColor: string;
    date: string; // "2026-03-05"
    contentPreview: string;
    onPress: () => void;
}

function formatDate(dateStr: string): string {
    const date = new Date(dateStr + 'T00:00:00');
    const day = date.getDate();
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const month = months[date.getMonth()];
    return `${day} de ${month}`;
}

export default function NoteCard({ courseName, courseColor, date, contentPreview, onPress }: NoteCardProps) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.header}>
                <View style={[styles.dot, { backgroundColor: courseColor }]} />
                <Text style={[styles.courseName, { color: courseColor }]}>{courseName}</Text>
                <Text style={styles.separator}>·</Text>
                <Text style={styles.date}>{formatDate(date)}</Text>
            </View>
            <Text style={styles.preview} numberOfLines={3}>
                {contentPreview}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        padding: spacing.md,
        marginBottom: 12,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 6,
    },
    courseName: {
        ...typography.caption,
    },
    separator: {
        ...typography.caption,
        color: colors.textTertiary,
        marginHorizontal: 6,
    },
    date: {
        ...typography.caption,
        color: colors.textSecondary,
    },
    preview: {
        ...typography.bodySm,
        color: colors.textPrimary,
    },
});
