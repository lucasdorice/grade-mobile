import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../../src/theme';

interface TaskItemProps {
    description: string;
    dueDate: string | null;
    isCompleted: boolean;
    courseName?: string;
    courseColor?: string;
    onToggle: () => void;
    onDelete?: () => void;
}

function getDateStatus(dueDate: string | null): { color: string; label: string } {
    if (!dueDate) return { color: colors.textSecondary, label: '' };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate + 'T00:00:00');

    const diffDays = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { color: colors.danger, label: `Atrasada` };
    if (diffDays === 0) return { color: colors.warning, label: 'Entrega hoje' };

    // Format date to "DD de Mês"
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const day = due.getDate();
    const month = months[due.getMonth()];
    return { color: colors.textSecondary, label: `Entrega: ${day} de ${month}` };
}

export default function TaskItem({ description, dueDate, isCompleted, courseName, courseColor, onToggle, onDelete }: TaskItemProps) {
    const dateStatus = getDateStatus(dueDate);

    return (
        <View style={styles.card}>
            <TouchableOpacity style={styles.checkbox} onPress={onToggle} activeOpacity={0.7}>
                {isCompleted ? (
                    <View style={styles.checkboxChecked}>
                        <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                    </View>
                ) : (
                    <View style={styles.checkboxEmpty} />
                )}
            </TouchableOpacity>

            <View style={styles.content}>
                <Text style={[styles.description, isCompleted && styles.descriptionCompleted]}>
                    {description}
                </Text>
                <View style={styles.metaRow}>
                    {courseName && courseColor && (
                        <View style={[styles.courseChip, { backgroundColor: courseColor + '26' }]}>
                            <View style={[styles.courseDot, { backgroundColor: courseColor }]} />
                            <Text style={[styles.courseLabel, { color: courseColor }]}>{courseName}</Text>
                        </View>
                    )}
                    {dueDate && dateStatus.label !== '' && (
                        <Text style={[styles.dateText, { color: dateStatus.color }]}>
                            {dateStatus.label}
                        </Text>
                    )}
                </View>
            </View>

            {onDelete && (
                <TouchableOpacity onPress={onDelete} hitSlop={8} style={styles.deleteBtn}>
                    <Ionicons name="trash-outline" size={18} color={colors.textTertiary} />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        padding: 14,
        paddingHorizontal: spacing.md,
        marginBottom: 8,
    },
    checkbox: {
        marginRight: 12,
    },
    checkboxEmpty: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: colors.border,
    },
    checkboxChecked: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: colors.success,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
    },
    description: {
        ...typography.body,
        color: colors.textPrimary,
    },
    descriptionCompleted: {
        textDecorationLine: 'line-through',
        color: colors.textTertiary,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 4,
    },
    courseChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: radius.full,
        gap: 4,
    },
    courseDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    courseLabel: {
        ...typography.caption,
    },
    dateText: {
        ...typography.caption,
    },
    deleteBtn: {
        marginLeft: 8,
        padding: 4,
    },
});
