import { useState, useCallback } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView,
    TextInput, Alert,
} from 'react-native';
import { useFocusEffect, router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme/ThemeContext';
import { typography } from '../../src/theme/typography';
import { spacing } from '../../src/theme/spacing';
import { hexToRgba } from '../../src/utils/colors';
import { getNextSubjectColor } from '../../src/utils/colors';
import * as subjectRepo from '../../src/db/repositories/subjects';
import * as scheduleRepo from '../../src/db/repositories/schedules';
import * as semesterRepo from '../../src/db/repositories/semesters';
import type { Subject, Schedule } from '../../src/types';

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default function SubjectScreen() {
    const { c } = useTheme();
    const [subjects, setSubjects] = useState<(Subject & { schedules: Schedule[] })[]>([]);

    // Form state
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [professor, setProfessor] = useState('');
    const [selectedDays, setSelectedDays] = useState<number[]>([]);
    const [startTime, setStartTime] = useState('08:00');
    const [endTime, setEndTime] = useState('09:40');

    const loadSubjects = useCallback(async () => {
        const semester = await semesterRepo.getActiveSemester();
        if (!semester) return;
        const subs = await subjectRepo.getSubjectsBySemester(semester.id);
        const withSchedules = await Promise.all(
            subs.map(async (s) => ({
                ...s,
                schedules: await scheduleRepo.getSchedulesBySubject(s.id),
            }))
        );
        setSubjects(withSchedules);
    }, []);

    useFocusEffect(useCallback(() => { loadSubjects(); }, [loadSubjects]));

    const toggleDay = (day: number) => {
        setSelectedDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    };

    const handleSave = async () => {
        if (!name.trim() || selectedDays.length === 0) {
            Alert.alert('Atenção', 'Preencha o nome e selecione pelo menos um dia.');
            return;
        }
        const semester = await semesterRepo.getActiveSemester();
        if (!semester) {
            Alert.alert('Erro', 'Crie um semestre primeiro.');
            return;
        }

        const color = getNextSubjectColor();
        const subjectId = await subjectRepo.createSubject({
            semester_id: semester.id,
            name: name.trim(),
            professor: professor.trim() || undefined,
            color,
        });

        for (const day of selectedDays) {
            await scheduleRepo.createSchedule({
                subject_id: subjectId,
                day_of_week: day,
                start_time: startTime,
                end_time: endTime,
            });
        }

        setName('');
        setProfessor('');
        setSelectedDays([]);
        setStartTime('08:00');
        setEndTime('09:40');
        setShowForm(false);
        await loadSubjects();
    };

    const handleDelete = (subject: Subject) => {
        Alert.alert(
            'Excluir disciplina',
            `Excluir "${subject.name}" e todos os dados associados?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir', style: 'destructive', onPress: async () => {
                        await subjectRepo.deleteSubject(subject.id);
                        await loadSubjects();
                    }
                },
            ]
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: c.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="close" size={28} color={c.textPrimary} />
                </TouchableOpacity>
                <Text style={[typography.h2, { color: c.textPrimary, flex: 1, marginLeft: spacing.md }]}>
                    Disciplinas
                </Text>
                <TouchableOpacity onPress={() => setShowForm(true)}>
                    <Ionicons name="add-circle" size={28} color={c.accent} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.listContent}>
                {/* Form */}
                {showForm && (
                    <View style={[styles.formCard, { backgroundColor: c.surface, borderColor: c.border }]}>
                        <TextInput
                            style={[styles.input, { backgroundColor: c.background, borderColor: c.border, color: c.textPrimary }]}
                            placeholder="Nome da disciplina *"
                            placeholderTextColor={c.textTertiary}
                            value={name}
                            onChangeText={setName}
                            autoFocus
                        />
                        <TextInput
                            style={[styles.input, { backgroundColor: c.background, borderColor: c.border, color: c.textPrimary, marginTop: spacing.sm }]}
                            placeholder="Professor (opcional)"
                            placeholderTextColor={c.textTertiary}
                            value={professor}
                            onChangeText={setProfessor}
                        />

                        <Text style={[typography.caption, { color: c.textSecondary, marginTop: spacing.md, marginBottom: spacing.sm }]}>
                            Dias da semana *
                        </Text>
                        <View style={styles.daysRow}>
                            {DAYS.map((label, i) => (
                                <TouchableOpacity
                                    key={i}
                                    style={[styles.dayChip, {
                                        backgroundColor: selectedDays.includes(i) ? c.accentBg : c.background,
                                        borderColor: selectedDays.includes(i) ? c.accent : c.border,
                                    }]}
                                    onPress={() => toggleDay(i)}
                                >
                                    <Text style={[typography.caption, {
                                        color: selectedDays.includes(i) ? c.accent : c.textSecondary,
                                    }]}>
                                        {label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.timeRow}>
                            <View style={styles.timeField}>
                                <Text style={[typography.caption, { color: c.textSecondary, marginBottom: 4 }]}>Início</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: c.background, borderColor: c.border, color: c.textPrimary, textAlign: 'center' }]}
                                    value={startTime}
                                    onChangeText={setStartTime}
                                    placeholder="08:00"
                                    placeholderTextColor={c.textTertiary}
                                />
                            </View>
                            <View style={styles.timeField}>
                                <Text style={[typography.caption, { color: c.textSecondary, marginBottom: 4 }]}>Fim</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: c.background, borderColor: c.border, color: c.textPrimary, textAlign: 'center' }]}
                                    value={endTime}
                                    onChangeText={setEndTime}
                                    placeholder="09:40"
                                    placeholderTextColor={c.textTertiary}
                                />
                            </View>
                        </View>

                        <View style={styles.formActions}>
                            <TouchableOpacity
                                style={[styles.formButton, { backgroundColor: c.background }]}
                                onPress={() => setShowForm(false)}
                            >
                                <Text style={[typography.bodySmall, { color: c.textSecondary }]}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.formButton, { backgroundColor: c.accent }]}
                                onPress={handleSave}
                            >
                                <Text style={[typography.bodySmall, { color: '#fff', fontFamily: 'Inter_600SemiBold' }]}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* Subject List */}
                {subjects.map((subject) => (
                    <TouchableOpacity
                        key={subject.id}
                        style={[styles.subjectCard, { backgroundColor: c.surface, borderColor: c.border }]}
                        onLongPress={() => handleDelete(subject)}
                    >
                        <View style={[styles.colorBar, { backgroundColor: subject.color }]} />
                        <View style={styles.subjectContent}>
                            <Text style={[typography.h3, { color: c.textPrimary }]}>{subject.name}</Text>
                            {subject.professor && (
                                <Text style={[typography.caption, { color: c.textTertiary }]}>{subject.professor}</Text>
                            )}
                            <Text style={[typography.caption, { color: c.textSecondary, marginTop: spacing.xs }]}>
                                {subject.schedules.map(s => `${DAYS[s.day_of_week]} ${s.start_time}-${s.end_time}`).join(' · ')}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}

                {subjects.length === 0 && !showForm && (
                    <View style={styles.emptyState}>
                        <Ionicons name="book-outline" size={48} color={c.textTertiary} />
                        <Text style={[typography.bodySmall, { color: c.textSecondary, marginTop: spacing.md, textAlign: 'center' }]}>
                            Nenhuma disciplina cadastrada.{'\n'}Toque no + para começar.
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, paddingTop: spacing.xl },
    listContent: { padding: spacing.md },
    formCard: { borderRadius: 12, borderWidth: 1, padding: spacing.md, marginBottom: spacing.md },
    input: { padding: spacing.sm, borderRadius: 8, borderWidth: 1, fontSize: 16, fontFamily: 'Inter_400Regular' },
    daysRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    dayChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1 },
    timeRow: { flexDirection: 'row', gap: 12, marginTop: spacing.md },
    timeField: { flex: 1 },
    formActions: { flexDirection: 'row', gap: 12, marginTop: spacing.md },
    formButton: { flex: 1, padding: spacing.sm, borderRadius: 8, alignItems: 'center' },
    subjectCard: { flexDirection: 'row', borderRadius: 12, borderWidth: 1, marginBottom: spacing.sm, overflow: 'hidden' },
    colorBar: { width: 4, alignSelf: 'stretch' },
    subjectContent: { flex: 1, padding: spacing.md },
    emptyState: { alignItems: 'center', paddingTop: 80 },
});
