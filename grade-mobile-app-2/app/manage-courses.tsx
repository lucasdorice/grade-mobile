import { useState, useCallback } from 'react';
import {
    View, Text, TextInput, StyleSheet, TouchableOpacity,
    ScrollView, Modal, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../src/theme';
import PrimaryButton from '../src/components/PrimaryButton';
import DashedButton from '../src/components/DashedButton';
import DayChip from '../src/components/DayChip';
import ColorPicker from '../src/components/ColorPicker';
import {
    getAllCourses, getSchedulesForCourse, createCourse, createSchedule,
    updateCourse, deleteCourse, deleteSchedulesForCourse,
} from '../src/database/queries';
import type { Course, Schedule } from '../src/database/queries';

interface CourseWithSchedules extends Course {
    schedules: Schedule[];
}

const DAY_LABELS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const DAY_VALUES = [1, 2, 3, 4, 5, 6];

function formatDays(schedules: Schedule[]): string {
    const days = [...new Set(schedules.map(s => s.day_of_week))].sort();
    return days.map(d => DAY_LABELS[DAY_VALUES.indexOf(d)]).join(', ');
}

function formatTime(schedules: Schedule[]): string {
    if (schedules.length === 0) return '';
    return `${schedules[0].start_time} - ${schedules[0].end_time}`;
}

export default function ManageCoursesScreen() {
    const router = useRouter();
    const [courses, setCourses] = useState<CourseWithSchedules[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingCourse, setEditingCourse] = useState<CourseWithSchedules | null>(null);

    // Form state
    const [formName, setFormName] = useState('');
    const [formColor, setFormColor] = useState(colors.coursePalette[0]);
    const [formDays, setFormDays] = useState<number[]>([]);
    const [formStartTime, setFormStartTime] = useState('08:00');
    const [formEndTime, setFormEndTime] = useState('09:40');

    const loadCourses = useCallback(async () => {
        const allCourses = await getAllCourses();
        const withSchedules: CourseWithSchedules[] = [];
        for (const course of allCourses) {
            const schedules = await getSchedulesForCourse(course.id);
            withSchedules.push({ ...course, schedules });
        }
        setCourses(withSchedules);
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadCourses();
        }, [loadCourses])
    );

    const resetForm = () => {
        setFormName('');
        setFormColor(colors.coursePalette[0]);
        setFormDays([]);
        setFormStartTime('08:00');
        setFormEndTime('09:40');
        setEditingCourse(null);
    };

    const openAddModal = () => {
        resetForm();
        setModalVisible(true);
    };

    const openEditModal = (course: CourseWithSchedules) => {
        setEditingCourse(course);
        setFormName(course.name);
        setFormColor(course.color);
        setFormDays([...new Set(course.schedules.map(s => s.day_of_week))]);
        if (course.schedules.length > 0) {
            setFormStartTime(course.schedules[0].start_time);
            setFormEndTime(course.schedules[0].end_time);
        }
        setModalVisible(true);
    };

    const toggleDay = (day: number) => {
        setFormDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };

    const isFormValid = formName.trim() && formDays.length > 0 && formStartTime && formEndTime;

    const handleSave = async () => {
        if (!isFormValid) return;

        try {
            if (editingCourse) {
                // Update existing course
                await updateCourse(editingCourse.id, formName.trim(), formColor);
                // Replace schedules
                await deleteSchedulesForCourse(editingCourse.id);
                for (const day of formDays) {
                    await createSchedule(editingCourse.id, day, formStartTime, formEndTime);
                }
            } else {
                // Create new course
                const courseId = await createCourse(formName.trim(), formColor);
                for (const day of formDays) {
                    await createSchedule(courseId, day, formStartTime, formEndTime);
                }
            }

            setModalVisible(false);
            loadCourses();
        } catch (error) {
            console.error('Error saving course:', error);
            Alert.alert('Erro', 'Não foi possível salvar a matéria.');
        }
    };

    const handleDelete = (course: CourseWithSchedules) => {
        Alert.alert(
            'Excluir matéria',
            `Tem certeza que deseja excluir "${course.name}"? Todas as anotações e tarefas serão removidas.`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir', style: 'destructive', onPress: async () => {
                        await deleteCourse(course.id);
                        loadCourses();
                    }
                },
            ]
        );
    };

    const formatTimeInput = (text: string, setter: (v: string) => void) => {
        let clean = text.replace(/[^0-9:]/g, '');
        if (clean.length === 2 && !clean.includes(':')) clean += ':';
        if (clean.length <= 5) setter(clean);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
                    <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Matérias</Text>
            </View>

            <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
                {courses.map(course => (
                    <View key={course.id} style={styles.courseCard}>
                        <View style={[styles.courseDot, { backgroundColor: course.color }]} />
                        <View style={styles.courseInfo}>
                            <Text style={styles.courseName}>{course.name}</Text>
                            <Text style={styles.courseSchedule}>
                                {formatDays(course.schedules)} · {formatTime(course.schedules)}
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => openEditModal(course)}
                            hitSlop={8}
                            style={styles.iconBtn}
                        >
                            <Ionicons name="pencil" size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleDelete(course)}
                            hitSlop={8}
                            style={styles.iconBtn}
                        >
                            <Ionicons name="trash-outline" size={20} color={colors.danger} />
                        </TouchableOpacity>
                    </View>
                ))}

                <DashedButton label="Adicionar matéria" onPress={openAddModal} />
            </ScrollView>

            {/* Add/Edit Modal */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setModalVisible(false)}
            >
                <KeyboardAvoidingView
                    style={styles.modalContainer}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>
                            {editingCourse ? 'Editar matéria' : 'Nova matéria'}
                        </Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Ionicons name="close" size={24} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
                        <Text style={styles.fieldLabel}>Nome da matéria</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: Cálculo I"
                            placeholderTextColor={colors.textTertiary}
                            value={formName}
                            onChangeText={setFormName}
                            autoFocus
                        />

                        <Text style={[styles.fieldLabel, { marginTop: spacing.lg }]}>Cor</Text>
                        <ColorPicker selectedColor={formColor} onSelect={setFormColor} />

                        <Text style={[styles.fieldLabel, { marginTop: spacing.lg }]}>Dias</Text>
                        <View style={styles.daysRow}>
                            {DAY_LABELS.map((label, i) => (
                                <DayChip
                                    key={label}
                                    label={label}
                                    active={formDays.includes(DAY_VALUES[i])}
                                    onToggle={() => toggleDay(DAY_VALUES[i])}
                                />
                            ))}
                        </View>

                        <Text style={[styles.fieldLabel, { marginTop: spacing.lg }]}>Horário</Text>
                        <View style={styles.timeRow}>
                            <TextInput
                                style={styles.timeInput}
                                placeholder="08:00"
                                placeholderTextColor={colors.textTertiary}
                                value={formStartTime}
                                onChangeText={(t) => formatTimeInput(t, setFormStartTime)}
                                keyboardType="numeric"
                                maxLength={5}
                            />
                            <Text style={styles.timeSeparator}>até</Text>
                            <TextInput
                                style={styles.timeInput}
                                placeholder="09:40"
                                placeholderTextColor={colors.textTertiary}
                                value={formEndTime}
                                onChangeText={(t) => formatTimeInput(t, setFormEndTime)}
                                keyboardType="numeric"
                                maxLength={5}
                            />
                        </View>
                    </ScrollView>

                    <View style={styles.modalFooter}>
                        <PrimaryButton
                            label={editingCourse ? 'Salvar alterações' : 'Salvar matéria'}
                            onPress={handleSave}
                            disabled={!isFormValid}
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.md,
    },
    headerTitle: {
        ...typography.headingLg,
        color: colors.textPrimary,
    },

    list: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xl,
    },

    // Course Card
    courseCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        padding: spacing.md,
        marginBottom: 12,
    },
    courseDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
    },
    courseInfo: {
        flex: 1,
        marginLeft: 14,
    },
    courseName: {
        ...typography.headingSm,
        color: colors.textPrimary,
    },
    courseSchedule: {
        ...typography.bodySm,
        color: colors.textSecondary,
        marginTop: 2,
    },
    iconBtn: {
        padding: 8,
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
    daysRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    timeInput: {
        flex: 1,
        height: 48,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.sm,
        paddingHorizontal: spacing.md,
        ...typography.body,
        color: colors.textPrimary,
        textAlign: 'center',
    },
    timeSeparator: {
        ...typography.bodySm,
        color: colors.textTertiary,
    },
});
