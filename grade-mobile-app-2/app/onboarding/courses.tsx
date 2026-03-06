import { useState, useCallback } from 'react';
import {
    View, Text, TextInput, StyleSheet, TouchableOpacity,
    ScrollView, Modal, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../../src/theme';
import PrimaryButton from '../../src/components/PrimaryButton';
import DashedButton from '../../src/components/DashedButton';
import StepperDots from '../../src/components/StepperDots';
import DayChip from '../../src/components/DayChip';
import ColorPicker from '../../src/components/ColorPicker';
import { createCourse, createSchedule } from '../../src/database/queries';

interface TempCourse {
    name: string;
    color: string;
    days: number[];       // 0=Dom..6=Sáb
    startTime: string;
    endTime: string;
}

const DAY_LABELS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const DAY_VALUES = [1, 2, 3, 4, 5, 6]; // Dom=0, Seg=1, ..., Sáb=6

function formatDays(days: number[]): string {
    return days
        .sort()
        .map(d => DAY_LABELS[DAY_VALUES.indexOf(d)])
        .join(', ');
}

export default function CoursesScreen() {
    const router = useRouter();
    const [courses, setCourses] = useState<TempCourse[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [saving, setSaving] = useState(false);

    // Modal form state
    const [formName, setFormName] = useState('');
    const [formColor, setFormColor] = useState(colors.coursePalette[0]);
    const [formDays, setFormDays] = useState<number[]>([]);
    const [formStartTime, setFormStartTime] = useState('08:00');
    const [formEndTime, setFormEndTime] = useState('09:40');

    const resetForm = () => {
        setFormName('');
        setFormColor(colors.coursePalette[courses.length % colors.coursePalette.length]);
        setFormDays([]);
        setFormStartTime('08:00');
        setFormEndTime('09:40');
    };

    const openModal = () => {
        resetForm();
        setModalVisible(true);
    };

    const toggleDay = (day: number) => {
        setFormDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };

    const isFormValid = formName.trim() && formDays.length > 0 && formStartTime && formEndTime;

    const handleSaveCourse = () => {
        if (!isFormValid) return;
        setCourses(prev => [...prev, {
            name: formName.trim(),
            color: formColor,
            days: formDays,
            startTime: formStartTime,
            endTime: formEndTime,
        }]);
        setModalVisible(false);
    };

    const handleRemoveCourse = (index: number) => {
        setCourses(prev => prev.filter((_, i) => i !== index));
    };

    const handleNext = async () => {
        if (courses.length === 0) return;
        setSaving(true);

        try {
            // Save all courses and their schedules to DB
            for (const course of courses) {
                const courseId = await createCourse(course.name, course.color);
                for (const day of course.days) {
                    await createSchedule(courseId, day, course.startTime, course.endTime);
                }
            }
            router.push('/onboarding/ready');
        } catch (error) {
            console.error('Error saving courses:', error);
            Alert.alert('Erro', 'Não foi possível salvar as matérias. Tente novamente.');
        } finally {
            setSaving(false);
        }
    };

    // Time input formatting (simple approach: just let user type HH:MM)
    const formatTimeInput = (text: string, setter: (v: string) => void) => {
        // Remove non-numeric chars except colon
        let clean = text.replace(/[^0-9:]/g, '');
        // Auto-insert colon after 2 digits
        if (clean.length === 2 && !clean.includes(':')) {
            clean = clean + ':';
        }
        // Max length HH:MM
        if (clean.length <= 5) {
            setter(clean);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inner}>
                <View style={styles.stepperContainer}>
                    <StepperDots totalSteps={3} currentStep={2} />
                </View>

                <Text style={styles.title}>Monte sua grade</Text>
                <Text style={styles.subtitle}>Adicione suas matérias do semestre</Text>

                <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
                    {courses.map((course, index) => (
                        <View key={index} style={styles.courseCard}>
                            <View style={[styles.courseDot, { backgroundColor: course.color }]} />
                            <View style={styles.courseInfo}>
                                <Text style={styles.courseName}>{course.name}</Text>
                                <Text style={styles.courseSchedule}>
                                    {formatDays(course.days)} · {course.startTime} - {course.endTime}
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => handleRemoveCourse(index)}
                                hitSlop={8}
                            >
                                <Ionicons name="trash-outline" size={20} color={colors.danger} />
                            </TouchableOpacity>
                        </View>
                    ))}

                    <DashedButton
                        label="Adicionar matéria"
                        onPress={openModal}
                        style={{ marginTop: courses.length > 0 ? 0 : spacing.md }}
                    />
                </ScrollView>

                <View style={styles.footer}>
                    <PrimaryButton
                        label="Próximo"
                        onPress={handleNext}
                        disabled={courses.length === 0}
                        loading={saving}
                    />
                    <TouchableOpacity
                        style={styles.backBtn}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.backText}>Voltar</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Add Course Modal */}
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
                        <Text style={styles.modalTitle}>Nova matéria</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Ionicons name="close" size={24} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
                        {/* Course Name */}
                        <Text style={styles.fieldLabel}>Nome da matéria</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: Cálculo I"
                            placeholderTextColor={colors.textTertiary}
                            value={formName}
                            onChangeText={setFormName}
                            autoFocus
                        />

                        {/* Color Picker */}
                        <Text style={[styles.fieldLabel, { marginTop: spacing.lg }]}>Cor</Text>
                        <ColorPicker
                            selectedColor={formColor}
                            onSelect={setFormColor}
                        />

                        {/* Days */}
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

                        {/* Time Inputs */}
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
                            label="Salvar matéria"
                            onPress={handleSaveCourse}
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
    inner: {
        flex: 1,
        paddingHorizontal: spacing.lg,
    },
    stepperContainer: {
        paddingTop: spacing.xl,
        alignItems: 'center',
    },
    title: {
        ...typography.headingLg,
        color: colors.textPrimary,
        marginTop: spacing.xl,
    },
    subtitle: {
        ...typography.bodySm,
        color: colors.textSecondary,
        marginTop: spacing.xs,
        marginBottom: spacing.lg,
    },
    list: {
        flex: 1,
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
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    courseInfo: {
        flex: 1,
        marginLeft: 12,
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

    // Footer
    footer: {
        paddingBottom: spacing.md,
    },
    backBtn: {
        alignItems: 'center',
        paddingVertical: spacing.md,
    },
    backText: {
        ...typography.bodySm,
        color: colors.textSecondary,
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

    // Form Fields
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
