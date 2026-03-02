import { useState, useCallback } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView,
    TextInput, Modal, Alert,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme/ThemeContext';
import { typography } from '../../src/theme/typography';
import { spacing, radius } from '../../src/theme/spacing';
import { hexToRgba } from '../../src/utils/colors';
import { isPast, toISODate } from '../../src/utils/dates';
import * as taskRepo from '../../src/db/repositories/tasks';
import * as subjectRepo from '../../src/db/repositories/subjects';
import * as semesterRepo from '../../src/db/repositories/semesters';
import type { Subject, Task } from '../../src/types';
import DateTimePicker from '@react-native-community/datetimepicker';
import { requestNotificationPermission, scheduleTaskNotifications, cancelTaskNotifications } from '../../src/hooks/useNotifications';

type TaskWithSubject = Task & { subject_name?: string; subject_color?: string };

export default function TasksScreen() {
    const { c } = useTheme();
    const [tasks, setTasks] = useState<TaskWithSubject[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showCompleted, setShowCompleted] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
    const [dueDate, setDueDate] = useState<Date | null>(null);

    const loadTasks = useCallback(async () => {
        const allTasks = await taskRepo.getAllTasks();
        setTasks(allTasks);

        const semester = await semesterRepo.getActiveSemester();
        if (semester) {
            const subs = await subjectRepo.getSubjectsBySemester(semester.id);
            setSubjects(subs);
        }
    }, []);

    useFocusEffect(useCallback(() => { loadTasks(); }, [loadTasks]));

    const pendingTasks = tasks.filter((t) => !t.is_done);
    const completedTasks = tasks.filter((t) => t.is_done);

    const handleToggle = async (id: number) => {
        await taskRepo.toggleTask(id);
        await cancelTaskNotifications(id);
        await loadTasks();
    };

    const handleDelete = (id: number) => {
        Alert.alert('Excluir tarefa', 'Tem certeza?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Excluir', style: 'destructive', onPress: async () => {
                    await cancelTaskNotifications(id);
                    await taskRepo.deleteTask(id);
                    await loadTasks();
                }
            },
        ]);
    };

    const handleSave = async () => {
        if (!title.trim()) return;

        // Request notification permission if task has a due date
        if (dueDate) {
            await requestNotificationPermission();
        }

        const dueDateStr = dueDate ? toISODate(dueDate) : undefined;
        const taskId = await taskRepo.createTask({
            title: title.trim(),
            subject_id: selectedSubjectId ?? undefined,
            due_date: dueDateStr,
        });

        // Schedule notifications
        if (dueDateStr) {
            const subjectName = subjects.find(s => s.id === selectedSubjectId)?.name;
            await scheduleTaskNotifications(taskId, title.trim(), subjectName, dueDateStr);
        }

        setTitle('');
        setSelectedSubjectId(null);
        setDueDate(null);
        setShowModal(false);
        await loadTasks();
    };

    const getDateColor = (dateStr: string | null) => {
        if (!dateStr) return c.textTertiary;
        if (isPast(dateStr)) return c.danger;
        if (dateStr === toISODate(new Date())) return c.warning;
        return c.textSecondary;
    };

    const formatDueDate = (dateStr: string | null) => {
        if (!dateStr) return '';
        const [y, m, d] = dateStr.split('-');
        return `${d}/${m}`;
    };

    const renderTask = (task: TaskWithSubject) => (
        <TouchableOpacity
            key={task.id}
            style={[styles.taskItem, { backgroundColor: c.surface, borderColor: c.border }]}
            onLongPress={() => handleDelete(task.id)}
            activeOpacity={0.8}
        >
            <TouchableOpacity
                style={[styles.checkbox, {
                    borderColor: task.is_done ? c.success : c.border,
                    backgroundColor: task.is_done ? c.success : 'transparent',
                }]}
                onPress={() => handleToggle(task.id)}
            >
                {task.is_done && <Ionicons name="checkmark" size={14} color="#fff" />}
            </TouchableOpacity>
            <View style={styles.taskContent}>
                <Text style={[
                    typography.body,
                    { color: task.is_done ? c.textTertiary : c.textPrimary },
                    task.is_done ? styles.strikethrough : undefined,
                ]}>
                    {task.title}
                </Text>
                <View style={styles.taskMeta}>
                    {task.subject_name && task.subject_color && (
                        <View style={[styles.subjectChip, { backgroundColor: hexToRgba(task.subject_color, 0.15) }]}>
                            <View style={[styles.colorDot, { backgroundColor: task.subject_color }]} />
                            <Text style={[typography.caption, { color: task.subject_color }]}>
                                {task.subject_name}
                            </Text>
                        </View>
                    )}
                    {task.due_date && (
                        <Text style={[typography.caption, { color: getDateColor(task.due_date) }]}>
                            {isPast(task.due_date) && !task.is_done ? '⚠️ ' : ''}
                            {formatDueDate(task.due_date)}
                        </Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: c.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={[typography.h1, { color: c.textPrimary }]}>Tarefas</Text>
                {pendingTasks.length > 0 && (
                    <View style={[styles.countBadge, { backgroundColor: c.danger }]}>
                        <Text style={[typography.caption, { color: '#fff' }]}>{pendingTasks.length} pendentes</Text>
                    </View>
                )}
            </View>

            <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
                {pendingTasks.length === 0 && completedTasks.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="checkmark-done-circle-outline" size={64} color={c.textTertiary} />
                        <Text style={[typography.h3, { color: c.textSecondary, marginTop: spacing.md }]}>
                            Nenhuma tarefa pendente 🎉
                        </Text>
                        <Text style={[typography.bodySmall, { color: c.textTertiary, marginTop: spacing.sm }]}>
                            Toque no + para adicionar uma entrega
                        </Text>
                    </View>
                ) : (
                    <>
                        {pendingTasks.length > 0 && (
                            <>
                                <Text style={[typography.caption, { color: c.textSecondary, marginBottom: spacing.sm }]}>
                                    PENDENTES
                                </Text>
                                {pendingTasks.map(renderTask)}
                            </>
                        )}

                        {completedTasks.length > 0 && (
                            <>
                                <TouchableOpacity
                                    style={styles.sectionHeader}
                                    onPress={() => setShowCompleted(!showCompleted)}
                                >
                                    <Text style={[typography.caption, { color: c.textTertiary }]}>
                                        CONCLUÍDAS ({completedTasks.length})
                                    </Text>
                                    <Ionicons
                                        name={showCompleted ? 'chevron-up' : 'chevron-down'}
                                        size={16}
                                        color={c.textTertiary}
                                    />
                                </TouchableOpacity>
                                {showCompleted && completedTasks.map(renderTask)}
                            </>
                        )}
                    </>
                )}
            </ScrollView>

            {/* FAB */}
            <TouchableOpacity
                style={[styles.fab, { backgroundColor: c.accent }]}
                onPress={() => setShowModal(true)}
            >
                <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>

            {/* New Task Modal */}
            <Modal visible={showModal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: c.surfaceElevated }]}>
                        <View style={[styles.modalHandle, { backgroundColor: c.border }]} />
                        <Text style={[typography.h3, { color: c.textPrimary, marginBottom: spacing.md }]}>
                            Nova Tarefa
                        </Text>

                        <TextInput
                            style={[styles.input, { backgroundColor: c.surface, borderColor: c.border, color: c.textPrimary }]}
                            placeholder="O que precisa entregar?"
                            placeholderTextColor={c.textTertiary}
                            value={title}
                            onChangeText={setTitle}
                            autoFocus
                        />

                        {/* Subject selector */}
                        <Text style={[typography.caption, { color: c.textSecondary, marginTop: spacing.md, marginBottom: spacing.sm }]}>
                            Disciplina (opcional)
                        </Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <TouchableOpacity
                                style={[styles.chip, {
                                    backgroundColor: selectedSubjectId === null ? c.accentBg : c.surface,
                                    borderColor: selectedSubjectId === null ? c.accent : c.border,
                                }]}
                                onPress={() => setSelectedSubjectId(null)}
                            >
                                <Text style={[typography.caption, { color: selectedSubjectId === null ? c.accent : c.textSecondary }]}>
                                    Nenhuma
                                </Text>
                            </TouchableOpacity>
                            {subjects.map((s) => (
                                <TouchableOpacity
                                    key={s.id}
                                    style={[styles.chip, {
                                        backgroundColor: selectedSubjectId === s.id ? hexToRgba(s.color, 0.15) : c.surface,
                                        borderColor: selectedSubjectId === s.id ? s.color : c.border,
                                    }]}
                                    onPress={() => setSelectedSubjectId(s.id)}
                                >
                                    <View style={[styles.colorDot, { backgroundColor: s.color }]} />
                                    <Text style={[typography.caption, { color: selectedSubjectId === s.id ? s.color : c.textSecondary }]}>
                                        {s.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {/* Due date */}
                        <TouchableOpacity
                            style={[styles.dateButton, { backgroundColor: c.surface, borderColor: c.border }]}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Ionicons name="calendar-outline" size={18} color={c.textSecondary} />
                            <Text style={[typography.bodySmall, { color: dueDate ? c.textPrimary : c.textTertiary, marginLeft: spacing.sm }]}>
                                {dueDate ? `${dueDate.getDate()}/${dueDate.getMonth() + 1}/${dueDate.getFullYear()}` : 'Data de entrega (opcional)'}
                            </Text>
                            {dueDate && (
                                <TouchableOpacity onPress={() => setDueDate(null)} style={{ marginLeft: 'auto' }}>
                                    <Ionicons name="close-circle" size={18} color={c.textTertiary} />
                                </TouchableOpacity>
                            )}
                        </TouchableOpacity>

                        {showDatePicker && (
                            <DateTimePicker
                                value={dueDate || new Date()}
                                mode="date"
                                onChange={(_, selected) => {
                                    setShowDatePicker(false);
                                    if (selected) setDueDate(selected);
                                }}
                            />
                        )}

                        {/* Actions */}
                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.actionButton, { backgroundColor: c.surface }]}
                                onPress={() => { setShowModal(false); setTitle(''); setSelectedSubjectId(null); setDueDate(null); }}
                            >
                                <Text style={[typography.body, { color: c.textSecondary }]}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.actionButton, { backgroundColor: c.accent, opacity: title.trim() ? 1 : 0.5 }]}
                                onPress={handleSave}
                                disabled={!title.trim()}
                            >
                                <Text style={[typography.body, { color: '#fff', fontFamily: 'Inter_600SemiBold' }]}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: spacing.md, paddingTop: spacing.xl, paddingBottom: spacing.sm },
    countBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    list: { flex: 1 },
    listContent: { padding: spacing.md, paddingBottom: 100 },
    taskItem: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderRadius: 12, borderWidth: 1, marginBottom: spacing.sm },
    checkbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
    taskContent: { flex: 1 },
    taskMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: spacing.xs },
    subjectChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, gap: 4 },
    colorDot: { width: 8, height: 8, borderRadius: 4 },
    strikethrough: { textDecorationLine: 'line-through' },
    emptyState: { alignItems: 'center', paddingTop: 100 },
    fab: { position: 'absolute', bottom: 100, right: spacing.md, width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.lg, marginBottom: spacing.sm },
    modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: spacing.lg, paddingBottom: 40 },
    modalHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: spacing.md },
    input: { padding: spacing.md, borderRadius: 12, borderWidth: 1, fontSize: 16, fontFamily: 'Inter_400Regular' },
    chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, marginRight: 8, gap: 4 },
    dateButton: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderRadius: 12, borderWidth: 1, marginTop: spacing.md },
    modalActions: { flexDirection: 'row', gap: 12, marginTop: spacing.lg },
    actionButton: { flex: 1, padding: spacing.md, borderRadius: 12, alignItems: 'center' },
});
