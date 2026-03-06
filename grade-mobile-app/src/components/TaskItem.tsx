import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme';
import { Check, Calendar as CalendarIcon, Clock } from 'lucide-react-native';

interface TaskItemProps {
    id: string;
    title: string;
    courseName?: string;
    courseColor?: string;
    dueDate?: string; // Formato amigável ex: "Amanhã, 14:00" ou "22 Out"
    isCompleted: boolean;
    isOverdue?: boolean;
    onToggle: (id: string, newStatus: boolean) => void;
    onPress?: (id: string) => void;
}

export function TaskItem({
    id,
    title,
    courseName,
    courseColor = theme.colors.accent,
    dueDate,
    isCompleted,
    isOverdue = false,
    onToggle,
    onPress
}: TaskItemProps) {

    return (
        <TouchableOpacity
            style={[
                styles.container,
                isCompleted && styles.containerCompleted,
                isOverdue && !isCompleted && styles.containerDanger
            ]}
            onPress={() => onPress && onPress(id)}
            activeOpacity={0.8}
        >
            <TouchableOpacity
                style={[
                    styles.checkbox,
                    isCompleted && styles.checkboxCompleted,
                    isOverdue && !isCompleted && styles.checkboxDanger
                ]}
                onPress={() => onToggle(id, !isCompleted)}
                activeOpacity={0.6}
            >
                {isCompleted && <Check color="#FFF" size={14} strokeWidth={3} />}
            </TouchableOpacity>

            <View style={styles.content}>
                <Text style={[
                    styles.title,
                    isCompleted && styles.titleCompleted
                ]}>
                    {title}
                </Text>

                <View style={styles.meta}>
                    {courseName && (
                        <View style={styles.badgeRow}>
                            <View style={[styles.courseDot, { backgroundColor: courseColor }]} />
                            <Text style={styles.courseText}>{courseName}</Text>
                        </View>
                    )}

                    {dueDate && (
                        <View style={[
                            styles.badgeRow,
                            styles.dateBadge,
                            isOverdue && !isCompleted && styles.dateBadgeDanger
                        ]}>
                            <CalendarIcon
                                color={isOverdue && !isCompleted ? theme.colors.danger : theme.colors.textSecondary}
                                size={12}
                            />
                            <Text style={[
                                styles.dateText,
                                isOverdue && !isCompleted && styles.dateTextDanger
                            ]}>
                                {dueDate}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: theme.colors.surface,
        padding: 16,
        borderRadius: theme.borderRadius.lg,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    containerCompleted: {
        opacity: 0.6,
    },
    containerDanger: {
        borderColor: 'rgba(255, 107, 107, 0.3)',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: theme.colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
        marginTop: 2,
    },
    checkboxCompleted: {
        backgroundColor: theme.colors.success,
        borderColor: theme.colors.success,
    },
    checkboxDanger: {
        borderColor: theme.colors.danger,
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
    },
    content: {
        flex: 1,
    },
    title: {
        fontFamily: theme.typography.fontFamilies.medium,
        fontSize: theme.typography.sizes.body,
        color: theme.colors.textPrimary,
        lineHeight: 22,
        marginBottom: 8,
    },
    titleCompleted: {
        textDecorationLine: 'line-through',
        color: theme.colors.textSecondary,
    },
    meta: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    badgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
    },
    courseDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    courseText: {
        fontFamily: theme.typography.fontFamilies.regular,
        fontSize: theme.typography.sizes.caption,
        color: theme.colors.textSecondary,
    },
    dateBadge: {
        backgroundColor: theme.colors.background,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: theme.borderRadius.sm,
    },
    dateBadgeDanger: {
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
    },
    dateText: {
        fontFamily: theme.typography.fontFamilies.medium,
        fontSize: 10,
        color: theme.colors.textSecondary,
    },
    dateTextDanger: {
        color: theme.colors.danger,
    }
});
