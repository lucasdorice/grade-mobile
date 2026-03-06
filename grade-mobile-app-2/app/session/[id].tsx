import { useState, useEffect, useCallback, useRef } from 'react';
import {
    View, Text, TextInput, StyleSheet, TouchableOpacity,
    ScrollView, Modal, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../../src/theme';
import PrimaryButton from '../../src/components/PrimaryButton';
import DashedButton from '../../src/components/DashedButton';
import TaskItem from '../../src/components/TaskItem';
import EmptyState from '../../src/components/EmptyState';
import {
    getSessionById, updateSessionNotes,
    getTasksForSession, createTask, toggleTask, deleteTask,
} from '../../src/database/queries';
import type { ClassSessionWithCourse, Task } from '../../src/database/queries';

const MONTHS_PT = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

function formatSessionDate(dateStr: string): string {
    const date = new Date(dateStr + 'T00:00:00');
    const day = date.getDate();
    const month = MONTHS_PT[date.getMonth()];
    return `${String(day).padStart(2, '0')} de ${month}`;
}

export default function SessionScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const sessionId = parseInt(id, 10);

    const [session, setSession] = useState<ClassSessionWithCourse | null>(null);
    const [notes, setNotes] = useState('');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [activeTab, setActiveTab] = useState<'notes' | 'tasks'>('notes');
    const [taskModalVisible, setTaskModalVisible] = useState(false);
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [newTaskDueDate, setNewTaskDueDate] = useState('');
    const notesRef = useRef(notes);

    // Keep ref in sync
    useEffect(() => {
        notesRef.current = notes;
    }, [notes]);

    const loadSession = useCallback(async () => {
        try {
            const s = await getSessionById(sessionId);
            if (s) {
                setSession(s);
                setNotes(s.notes);
            }
        } catch (error) {
            console.error('Error loading session:', error);
        }
    }, [sessionId]);

    const loadTasks = useCallback(async () => {
        try {
            const t = await getTasksForSession(sessionId);
            setTasks(t);
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    }, [sessionId]);

    useEffect(() => {
        loadSession();
        loadTasks();
    }, [loadSession, loadTasks]);

    // Auto-save notes when leaving screen
    useEffect(() => {
        return () => {
            if (notesRef.current !== undefined) {
                updateSessionNotes(sessionId, notesRef.current).catch(console.error);
            }
        };
    }, [sessionId]);

    // Also save when switching tabs
    const handleTabSwitch = async (tab: 'notes' | 'tasks') => {
        if (activeTab === 'notes' && tab === 'tasks') {
            await updateSessionNotes(sessionId, notes);
        }
        setActiveTab(tab);
        if (tab === 'tasks') {
            loadTasks();
        }
    };

    const handleToggleTask = async (taskId: number) => {
        await toggleTask(taskId);
        loadTasks();
    };

    const handleDeleteTask = async (taskId: number) => {
        Alert.alert('Excluir tarefa', 'Tem certeza?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Excluir', style: 'destructive', onPress: async () => {
                    await deleteTask(taskId);
                    loadTasks();
                }
            },
        ]);
    };

    const handleCreateTask = async () => {
        if (!newTaskDescription.trim() || !session) return;

        // Parse due date: DD/MM/AAAA → YYYY-MM-DD
        let dueDateISO: string | null = null;
        if (newTaskDueDate.trim()) {
            const parts = newTaskDueDate.split('/');
            if (parts.length === 3) {
                dueDateISO = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
            }
        }

        await createTask(session.course_id, newTaskDescription.trim(), dueDateISO, sessionId);
        setNewTaskDescription('');
        setNewTaskDueDate('');
        setTaskModalVisible(false);
        loadTasks();
    };

    // Date input formatter DD/MM/AAAA
    const formatDateInput = (text: string) => {
        let clean = text.replace(/[^0-9/]/g, '');
        // Auto-insert slashes
        if (clean.length === 2 && !clean.includes('/')) clean += '/';
        if (clean.length === 5 && clean.split('/').length === 2) clean += '/';
        if (clean.length <= 10) setNewTaskDueDate(clean);
    };

    if (!session) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={{ color: colors.textTertiary, textAlign: 'center', marginTop: 100 }}>
                    Carregando...
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => {
                    updateSessionNotes(sessionId, notes);
                    router.back();
                }} hitSlop={8}>
                    <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <View style={styles.titleRow}>
                        <View style={[styles.courseDot, { backgroundColor: session.course_color }]} />
                        <Text style={styles.courseName}>{session.course_name}</Text>
                    </View>
                    <Text style={styles.sessionDate}>{formatSessionDate(session.date)}</Text>
                </View>
            </View>

            {/* Segmented Control */}
            <View style={styles.segmentContainer}>
                <View style={styles.segmentControl}>
                    <TouchableOpacity
                        style={[styles.segment, activeTab === 'notes' && styles.segmentActive]}
                        onPress={() => handleTabSwitch('notes')}
                    >
                        <Text style={[styles.segmentText, activeTab === 'notes' && styles.segmentTextActive]}>
                            Anotações
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.segment, activeTab === 'tasks' && styles.segmentActive]}
                        onPress={() => handleTabSwitch('tasks')}
                    >
                        <Text style={[styles.segmentText, activeTab === 'tasks' && styles.segmentTextActive]}>
                            Tarefas
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Content */}
            {activeTab === 'notes' ? (
                <KeyboardAvoidingView
                    style={styles.flex}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    keyboardVerticalOffset={100}
                >
                    <TextInput
                        style={styles.notesInput}
                        placeholder="O que foi discutido na aula de hoje?"
                        placeholderTextColor={colors.textTertiary}
                        value={notes}
                        onChangeText={setNotes}
                        multiline
                        textAlignVertical="top"
                        scrollEnabled
                    />
                </KeyboardAvoidingView>
            ) : (
                <ScrollView style={styles.flex} contentContainerStyle={styles.tasksContent}>
                    <DashedButton
                        label="Nova tarefa"
                        onPress={() => {
                            setNewTaskDescription('');
                            setNewTaskDueDate('');
                            setTaskModalVisible(true);
                        }}
                        style={{ marginBottom: spacing.md }}
                    />

                    {tasks.length === 0 ? (
                        <EmptyState
                            emoji="📋"
                            title="Nenhuma tarefa"
                            subtitle="Crie tarefas para não esquecer entregas"
                        />
                    ) : (
                        tasks.map((task) => (
                            <TaskItem
                                key={task.id}
                                description={task.description}
                                dueDate={task.due_date}
                                isCompleted={task.is_completed === 1}
                                onToggle={() => handleToggleTask(task.id)}
                                onDelete={() => handleDeleteTask(task.id)}
                            />
                        ))
                    )}
                </ScrollView>
            )}

            {/* New Task Modal */}
            <Modal
                visible={taskModalVisible}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setTaskModalVisible(false)}
            >
                <KeyboardAvoidingView
                    style={styles.modalContainer}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Nova tarefa</Text>
                        <TouchableOpacity onPress={() => setTaskModalVisible(false)}>
                            <Ionicons name="close" size={24} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.modalContent}>
                        <Text style={styles.fieldLabel}>Descrição</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="O que precisa entregar?"
                            placeholderTextColor={colors.textTertiary}
                            value={newTaskDescription}
                            onChangeText={setNewTaskDescription}
                            autoFocus
                        />

                        <Text style={[styles.fieldLabel, { marginTop: spacing.lg }]}>Data de entrega</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="DD/MM/AAAA"
                            placeholderTextColor={colors.textTertiary}
                            value={newTaskDueDate}
                            onChangeText={formatDateInput}
                            keyboardType="numeric"
                            maxLength={10}
                        />
                    </View>

                    <View style={styles.modalFooter}>
                        <PrimaryButton
                            label="Salvar"
                            onPress={handleCreateTask}
                            disabled={!newTaskDescription.trim()}
                        />
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    flex: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.sm,
        gap: 12,
    },
    headerInfo: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    courseDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    courseName: {
        ...typography.headingMd,
        color: colors.textPrimary,
    },
    sessionDate: {
        ...typography.caption,
        color: colors.textSecondary,
        marginTop: 2,
    },

    // Segmented Control
    segmentContainer: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
    },
    segmentControl: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        padding: 4,
    },
    segment: {
        flex: 1,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: radius.sm,
    },
    segmentActive: {
        backgroundColor: colors.accentSoft,
    },
    segmentText: {
        ...typography.bodySm,
        color: colors.textTertiary,
    },
    segmentTextActive: {
        color: colors.accent,
        fontFamily: 'Inter_600SemiBold',
    },

    // Notes
    notesInput: {
        flex: 1,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        ...typography.body,
        color: colors.textPrimary,
    },

    // Tasks
    tasksContent: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.sm,
        paddingBottom: spacing.lg,
    },

    // Modal
    modalContainer: {
        flex: 1,
        backgroundColor: colors.surfaceElevated,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: spacing.md,
    },
    modalTitle: {
        ...typography.headingMd,
        color: colors.textPrimary,
    },
    modalContent: {
        flex: 1,
        paddingHorizontal: spacing.lg,
    },
    modalFooter: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xl,
    },
    fieldLabel: {
        ...typography.bodySm,
        color: colors.textSecondary,
        marginBottom: spacing.sm,
    },
    input: {
        height: 56,
        backgroundColor: colors.surface,
        borderWidth: 1.5,
        borderColor: colors.border,
        borderRadius: radius.md,
        paddingHorizontal: spacing.md,
        ...typography.body,
        color: colors.textPrimary,
    },
});
