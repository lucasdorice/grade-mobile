import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { colors, typography, spacing, radius } from '../../src/theme';
import TaskItem from '../../src/components/TaskItem';
import EmptyState from '../../src/components/EmptyState';
import {
    getAllTasks, getTasksForDate, getPendingTasksCount, toggleTask, deleteTask,
} from '../../src/database/queries';
import type { TaskWithCourse } from '../../src/database/queries';
import { Alert } from 'react-native';

// Configure Portuguese locale
LocaleConfig.locales['pt-br'] = {
    monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    today: 'Hoje',
};
LocaleConfig.defaultLocale = 'pt-br';

const MONTHS_PT = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

function formatSelectedDate(dateStr: string): string {
    const date = new Date(dateStr + 'T00:00:00');
    return `${date.getDate()} de ${MONTHS_PT[date.getMonth()]}`;
}

function getTodayISO(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function TasksScreen() {
    const todayISO = getTodayISO();
    const [selectedDate, setSelectedDate] = useState(todayISO);
    const [allTasks, setAllTasks] = useState<TaskWithCourse[]>([]);
    const [dayTasks, setDayTasks] = useState<TaskWithCourse[]>([]);
    const [pendingCount, setPendingCount] = useState(0);

    const loadData = useCallback(async () => {
        try {
            const [tasks, count] = await Promise.all([
                getAllTasks(),
                getPendingTasksCount(),
            ]);
            setAllTasks(tasks);
            setPendingCount(count);

            // Load tasks for selected date
            const dt = await getTasksForDate(selectedDate);
            setDayTasks(dt);
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    }, [selectedDate]);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [loadData])
    );

    const handleDayPress = async (day: { dateString: string }) => {
        setSelectedDate(day.dateString);
        const tasks = await getTasksForDate(day.dateString);
        setDayTasks(tasks);
    };

    const handleToggle = async (taskId: number) => {
        await toggleTask(taskId);
        loadData();
    };

    const handleDelete = async (taskId: number) => {
        Alert.alert('Excluir tarefa', 'Tem certeza?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Excluir', style: 'destructive', onPress: async () => {
                    await deleteTask(taskId);
                    loadData();
                }
            },
        ]);
    };

    // Build marked dates for calendar
    const markedDates: Record<string, any> = {};

    // Mark all task dates
    for (const task of allTasks) {
        if (task.due_date) {
            const isOverdue = task.due_date < todayISO && task.is_completed === 0;
            const dotColor = task.is_completed === 1
                ? colors.success
                : isOverdue
                    ? colors.danger
                    : colors.accent;

            if (!markedDates[task.due_date]) {
                markedDates[task.due_date] = { dots: [] };
            }
            // Avoid duplicate dot colors
            const existingColors = markedDates[task.due_date].dots.map((d: any) => d.color);
            if (!existingColors.includes(dotColor)) {
                markedDates[task.due_date].dots.push({ color: dotColor });
            }
        }
    }

    // Mark selected date
    if (markedDates[selectedDate]) {
        markedDates[selectedDate] = { ...markedDates[selectedDate], selected: true };
    } else {
        markedDates[selectedDate] = { selected: true, dots: [] };
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Tarefas</Text>
                {pendingCount > 0 && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{pendingCount} pendente{pendingCount > 1 ? 's' : ''}</Text>
                    </View>
                )}
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Calendar */}
                <View style={styles.calendarWrapper}>
                    <Calendar
                        onDayPress={handleDayPress}
                        markingType="multi-dot"
                        markedDates={markedDates}
                        theme={{
                            calendarBackground: colors.surface,
                            textSectionTitleColor: colors.textTertiary,
                            selectedDayBackgroundColor: colors.accent,
                            selectedDayTextColor: '#FFFFFF',
                            todayTextColor: colors.accent,
                            dayTextColor: colors.textPrimary,
                            textDisabledColor: colors.textTertiary,
                            monthTextColor: colors.textPrimary,
                            arrowColor: colors.textSecondary,
                            textDayFontFamily: 'Inter_400Regular',
                            textMonthFontFamily: 'Inter_600SemiBold',
                            textDayHeaderFontFamily: 'Inter_500Medium',
                            textDayFontSize: 14,
                            textMonthFontSize: 17,
                            textDayHeaderFontSize: 12,
                        }}
                        style={styles.calendar}
                    />
                </View>

                {/* Tasks for selected date */}
                <View style={styles.dayTasksSection}>
                    <Text style={styles.dayLabel}>{formatSelectedDate(selectedDate)}</Text>

                    {dayTasks.length === 0 ? (
                        <Text style={styles.emptyDay}>Nenhuma tarefa neste dia</Text>
                    ) : (
                        dayTasks.map(task => (
                            <TaskItem
                                key={task.id}
                                description={task.description}
                                dueDate={task.due_date}
                                isCompleted={task.is_completed === 1}
                                courseName={task.course_name}
                                courseColor={task.course_color}
                                onToggle={() => handleToggle(task.id)}
                                onDelete={() => handleDelete(task.id)}
                            />
                        ))
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xxl,
        paddingBottom: spacing.md,
        gap: spacing.sm,
    },
    title: {
        ...typography.headingLg,
        color: colors.textPrimary,
    },
    badge: {
        backgroundColor: colors.danger,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: radius.full,
    },
    badgeText: {
        ...typography.caption,
        color: '#FFFFFF',
    },

    // Calendar
    calendarWrapper: {
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.md,
    },
    calendar: {
        borderRadius: radius.lg,
        overflow: 'hidden',
    },

    // Day Tasks
    dayTasksSection: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xl,
    },
    dayLabel: {
        ...typography.headingSm,
        color: colors.textSecondary,
        marginBottom: spacing.md,
    },
    emptyDay: {
        ...typography.bodySm,
        color: colors.textTertiary,
        textAlign: 'center',
        paddingVertical: spacing.xl,
    },
});
