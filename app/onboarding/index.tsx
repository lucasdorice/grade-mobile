import { useState, useCallback } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, SafeAreaView,
    TextInput, ScrollView, Dimensions, Animated,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme/ThemeContext';
import { typography } from '../../src/theme/typography';
import { spacing } from '../../src/theme/spacing';
import { getNextSubjectColor } from '../../src/utils/colors';
import * as settingsRepo from '../../src/db/repositories/settings';
import * as semesterRepo from '../../src/db/repositories/semesters';
import * as subjectRepo from '../../src/db/repositories/subjects';
import * as scheduleRepo from '../../src/db/repositories/schedules';
import type { Subject, Schedule } from '../../src/types';

const { width } = Dimensions.get('window');
const DAYS_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const WEEKDAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'];

interface SubjectDraft {
    name: string;
    professor: string;
    days: number[];
    startTime: string;
    endTime: string;
    color: string;
}

export default function OnboardingScreen() {
    const { c } = useTheme();
    const [step, setStep] = useState(0);
    const [userName, setUserName] = useState('');

    // Subject drafts
    const [drafts, setDrafts] = useState<SubjectDraft[]>([]);
    const [showSubjectForm, setShowSubjectForm] = useState(false);
    const [subName, setSubName] = useState('');
    const [subProf, setSubProf] = useState('');
    const [subDays, setSubDays] = useState<number[]>([]);
    const [subStart, setSubStart] = useState('08:00');
    const [subEnd, setSubEnd] = useState('09:40');

    const totalSteps = 4;

    const handleNext = () => {
        if (step < totalSteps - 1) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 0) setStep(step - 1);
    };

    const handleSkip = async () => {
        await settingsRepo.setSetting('onboarding_done', 'true');
        router.replace('/(tabs)');
    };

    const handleAddSubject = () => {
        if (!subName.trim() || subDays.length === 0) return;
        setDrafts([...drafts, {
            name: subName.trim(),
            professor: subProf.trim(),
            days: [...subDays],
            startTime: subStart,
            endTime: subEnd,
            color: getNextSubjectColor(),
        }]);
        setSubName('');
        setSubProf('');
        setSubDays([]);
        setSubStart('08:00');
        setSubEnd('09:40');
        setShowSubjectForm(false);
    };

    const handleRemoveDraft = (index: number) => {
        setDrafts(drafts.filter((_, i) => i !== index));
    };

    const handleFinish = async () => {
        // Save user name
        if (userName.trim()) {
            await settingsRepo.setSetting('user_name', userName.trim());
        }

        // Create semester if we have subjects
        if (drafts.length > 0) {
            const now = new Date();
            const semesterId = await semesterRepo.createSemester({
                name: `${now.getFullYear()}.${now.getMonth() < 6 ? 1 : 2}`,
                start_date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`,
                end_date: `${now.getFullYear()}-${String(now.getMonth() + 7 > 12 ? 12 : now.getMonth() + 7).padStart(2, '0')}-30`,
            });

            // Create subjects and schedules
            for (const draft of drafts) {
                const subjectId = await subjectRepo.createSubject({
                    semester_id: semesterId,
                    name: draft.name,
                    professor: draft.professor || undefined,
                    color: draft.color,
                });
                for (const day of draft.days) {
                    await scheduleRepo.createSchedule({
                        subject_id: subjectId,
                        day_of_week: day,
                        start_time: draft.startTime,
                        end_time: draft.endTime,
                    });
                }
            }
        }

        await settingsRepo.setSetting('onboarding_done', 'true');
        router.replace('/(tabs)');
    };

    // Build weekly grid for preview
    const buildGrid = () => {
        const grid: Record<number, SubjectDraft[]> = {};
        for (let d = 1; d <= 5; d++) grid[d] = [];
        for (const draft of drafts) {
            for (const day of draft.days) {
                if (grid[day]) grid[day].push(draft);
            }
        }
        return grid;
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: c.background }]}>
            {/* Progress Dots */}
            <View style={styles.dotsRow}>
                {Array.from({ length: totalSteps }).map((_, i) => (
                    <View
                        key={i}
                        style={[styles.dot, {
                            backgroundColor: i === step ? c.accent : c.border,
                            width: i === step ? 24 : 8,
                        }]}
                    />
                ))}
            </View>

            {/* STEP 0: Welcome */}
            {step === 0 && (
                <View style={styles.centered}>
                    <View style={[styles.iconCircle, { backgroundColor: c.accentBg }]}>
                        <Ionicons name="school" size={64} color={c.accent} />
                    </View>
                    <Text style={[typography.h1, { color: c.textPrimary, marginTop: spacing.lg, textAlign: 'center' }]}>
                        Grade
                    </Text>
                    <Text style={[typography.body, { color: c.textSecondary, marginTop: spacing.sm, textAlign: 'center', paddingHorizontal: spacing.xl }]}>
                        Sua rotina acadêmica no bolso.{'\n'}Anotações, código e prazos em um só lugar.
                    </Text>
                    <TouchableOpacity
                        style={[styles.primaryButton, { backgroundColor: c.accent }]}
                        onPress={handleNext}
                    >
                        <Text style={[typography.body, { color: '#fff', fontFamily: 'Inter_600SemiBold' }]}>
                            Começar
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                        <Text style={[typography.caption, { color: c.textTertiary, textDecorationLine: 'underline' }]}>
                            Pular e configurar depois
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* STEP 1: Name */}
            {step === 1 && (
                <View style={styles.stepContent}>
                    <Text style={[typography.h2, { color: c.textPrimary, textAlign: 'center' }]}>
                        Como podemos te chamar?
                    </Text>
                    <TextInput
                        style={[styles.bigInput, { backgroundColor: c.surface, borderColor: c.border, color: c.textPrimary }]}
                        placeholder="Seu nome"
                        placeholderTextColor={c.textTertiary}
                        value={userName}
                        onChangeText={setUserName}
                        autoFocus
                        returnKeyType="next"
                        onSubmitEditing={handleNext}
                    />
                    <View style={styles.navRow}>
                        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={20} color={c.textSecondary} />
                            <Text style={[typography.bodySmall, { color: c.textSecondary, marginLeft: 4 }]}>Voltar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.nextButton, { backgroundColor: c.accent, opacity: userName.trim() ? 1 : 0.5 }]}
                            onPress={handleNext}
                            disabled={!userName.trim()}
                        >
                            <Text style={[typography.body, { color: '#fff', fontFamily: 'Inter_600SemiBold' }]}>Próximo</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* STEP 2: Build Schedule */}
            {step === 2 && (
                <View style={styles.stepContent}>
                    <Text style={[typography.h2, { color: c.textPrimary, textAlign: 'center' }]}>
                        Monte sua grade 📚
                    </Text>
                    <Text style={[typography.bodySmall, { color: c.textSecondary, textAlign: 'center', marginTop: spacing.xs }]}>
                        Adicione suas disciplinas do semestre
                    </Text>

                    <ScrollView style={styles.draftList} showsVerticalScrollIndicator={false}>
                        {drafts.map((draft, i) => (
                            <View key={i} style={[styles.draftCard, { backgroundColor: c.surface, borderColor: c.border }]}>
                                <View style={[styles.draftColorBar, { backgroundColor: draft.color }]} />
                                <View style={styles.draftContent}>
                                    <Text style={[typography.body, { color: c.textPrimary, fontFamily: 'Inter_600SemiBold' }]}>{draft.name}</Text>
                                    <Text style={[typography.caption, { color: c.textSecondary }]}>
                                        {draft.days.map(d => DAYS_LABELS[d]).join(', ')} · {draft.startTime}-{draft.endTime}
                                    </Text>
                                </View>
                                <TouchableOpacity onPress={() => handleRemoveDraft(i)}>
                                    <Ionicons name="close-circle" size={22} color={c.textTertiary} />
                                </TouchableOpacity>
                            </View>
                        ))}

                        {showSubjectForm ? (
                            <View style={[styles.formCard, { backgroundColor: c.surface, borderColor: c.border }]}>
                                <TextInput
                                    style={[styles.input, { backgroundColor: c.background, borderColor: c.border, color: c.textPrimary }]}
                                    placeholder="Nome da disciplina *"
                                    placeholderTextColor={c.textTertiary}
                                    value={subName}
                                    onChangeText={setSubName}
                                    autoFocus
                                />
                                <TextInput
                                    style={[styles.input, { backgroundColor: c.background, borderColor: c.border, color: c.textPrimary, marginTop: spacing.sm }]}
                                    placeholder="Professor (opcional)"
                                    placeholderTextColor={c.textTertiary}
                                    value={subProf}
                                    onChangeText={setSubProf}
                                />
                                <Text style={[typography.caption, { color: c.textSecondary, marginTop: spacing.md, marginBottom: spacing.xs }]}>Dias *</Text>
                                <View style={styles.daysChips}>
                                    {DAYS_LABELS.map((label, i) => (
                                        <TouchableOpacity
                                            key={i}
                                            style={[styles.dayChip, {
                                                backgroundColor: subDays.includes(i) ? c.accentBg : c.background,
                                                borderColor: subDays.includes(i) ? c.accent : c.border,
                                            }]}
                                            onPress={() => setSubDays(prev => prev.includes(i) ? prev.filter(d => d !== i) : [...prev, i])}
                                        >
                                            <Text style={[typography.caption, { color: subDays.includes(i) ? c.accent : c.textSecondary }]}>{label}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                <View style={styles.timeRow}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[typography.caption, { color: c.textSecondary, marginBottom: 4 }]}>Início</Text>
                                        <TextInput
                                            style={[styles.input, { backgroundColor: c.background, borderColor: c.border, color: c.textPrimary, textAlign: 'center' }]}
                                            value={subStart} onChangeText={setSubStart} placeholder="08:00" placeholderTextColor={c.textTertiary}
                                        />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[typography.caption, { color: c.textSecondary, marginBottom: 4 }]}>Fim</Text>
                                        <TextInput
                                            style={[styles.input, { backgroundColor: c.background, borderColor: c.border, color: c.textPrimary, textAlign: 'center' }]}
                                            value={subEnd} onChangeText={setSubEnd} placeholder="09:40" placeholderTextColor={c.textTertiary}
                                        />
                                    </View>
                                </View>
                                <View style={styles.formRow}>
                                    <TouchableOpacity style={[styles.smallBtn, { backgroundColor: c.background }]} onPress={() => setShowSubjectForm(false)}>
                                        <Text style={[typography.bodySmall, { color: c.textSecondary }]}>Cancelar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.smallBtn, { backgroundColor: c.accent }]} onPress={handleAddSubject}>
                                        <Text style={[typography.bodySmall, { color: '#fff', fontFamily: 'Inter_600SemiBold' }]}>Adicionar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={[styles.addCard, { borderColor: c.textTertiary }]}
                                onPress={() => setShowSubjectForm(true)}
                            >
                                <Ionicons name="add" size={24} color={c.textTertiary} />
                                <Text style={[typography.bodySmall, { color: c.textTertiary, marginLeft: spacing.sm }]}>
                                    Adicionar disciplina
                                </Text>
                            </TouchableOpacity>
                        )}
                    </ScrollView>

                    <View style={styles.navRow}>
                        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={20} color={c.textSecondary} />
                            <Text style={[typography.bodySmall, { color: c.textSecondary, marginLeft: 4 }]}>Voltar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.nextButton, { backgroundColor: c.accent }]}
                            onPress={handleNext}
                        >
                            <Text style={[typography.body, { color: '#fff', fontFamily: 'Inter_600SemiBold' }]}>Próximo</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* STEP 3: Preview + Finish */}
            {step === 3 && (
                <View style={styles.stepContent}>
                    <Text style={[typography.h2, { color: c.textPrimary, textAlign: 'center' }]}>
                        Sua grade está pronta! 🎓
                    </Text>

                    {drafts.length > 0 ? (
                        <View style={[styles.previewGrid, { backgroundColor: c.surface, borderColor: c.border }]}>
                            {/* Header Row */}
                            <View style={styles.gridRow}>
                                <View style={styles.gridTimeCol} />
                                {WEEKDAYS.map((day) => (
                                    <View key={day} style={styles.gridDayCol}>
                                        <Text style={[typography.caption, { color: c.textSecondary, textAlign: 'center' }]}>{day}</Text>
                                    </View>
                                ))}
                            </View>
                            {/* Content */}
                            {[1, 2, 3, 4, 5].map((dayNum) => {
                                const dayDrafts = drafts.filter(d => d.days.includes(dayNum));
                                return (
                                    <View key={dayNum} style={styles.gridRow}>
                                        <View style={styles.gridTimeCol}>
                                            {dayDrafts.length > 0 && (
                                                <Text style={[typography.caption, { color: c.textTertiary, fontSize: 10 }]}>
                                                    {dayDrafts[0]?.startTime}
                                                </Text>
                                            )}
                                        </View>
                                        <View style={styles.gridDayCol}>
                                            {dayDrafts.map((d, i) => (
                                                <View key={i} style={[styles.gridBlock, { backgroundColor: d.color + '30' }]}>
                                                    <Text style={[typography.caption, { color: d.color, fontSize: 10 }]} numberOfLines={1}>
                                                        {d.name.slice(0, 8)}
                                                    </Text>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    ) : (
                        <View style={{ alignItems: 'center', paddingVertical: spacing.xl }}>
                            <Ionicons name="calendar-outline" size={48} color={c.textTertiary} />
                            <Text style={[typography.bodySmall, { color: c.textTertiary, marginTop: spacing.sm }]}>
                                Nenhuma disciplina adicionada (você pode fazer depois)
                            </Text>
                        </View>
                    )}

                    <View style={styles.navRow}>
                        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={20} color={c.textSecondary} />
                            <Text style={[typography.bodySmall, { color: c.textSecondary, marginLeft: 4 }]}>Voltar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.finishButton, { backgroundColor: c.accent }]}
                            onPress={handleFinish}
                        >
                            <Text style={[typography.body, { color: '#fff', fontFamily: 'Inter_600SemiBold' }]}>
                                Começar a usar! 🚀
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    dotsRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, paddingTop: spacing.xl, paddingBottom: spacing.md },
    dot: { height: 8, borderRadius: 4 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing.lg },
    iconCircle: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center' },
    primaryButton: { marginTop: spacing.xl, paddingVertical: spacing.md, paddingHorizontal: spacing['2xl'], borderRadius: 28, width: '100%', alignItems: 'center' },
    skipButton: { marginTop: spacing.md, padding: spacing.sm },
    stepContent: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.md },
    bigInput: { marginTop: spacing.xl, padding: spacing.md, borderRadius: 12, borderWidth: 1, fontSize: 18, fontFamily: 'Inter_400Regular', textAlign: 'center' },
    navRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.lg },
    backButton: { flexDirection: 'row', alignItems: 'center', padding: spacing.sm },
    nextButton: { paddingVertical: spacing.sm, paddingHorizontal: spacing.xl, borderRadius: 12 },
    finishButton: { flex: 1, marginLeft: spacing.md, paddingVertical: spacing.md, borderRadius: 12, alignItems: 'center' },
    draftList: { flex: 1, marginTop: spacing.md },
    draftCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, borderWidth: 1, marginBottom: spacing.sm, overflow: 'hidden' },
    draftColorBar: { width: 4, alignSelf: 'stretch' },
    draftContent: { flex: 1, padding: spacing.md },
    addCard: { borderWidth: 1, borderStyle: 'dashed', borderRadius: 12, padding: spacing.lg, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    formCard: { borderRadius: 12, borderWidth: 1, padding: spacing.md, marginBottom: spacing.sm },
    input: { padding: spacing.sm, borderRadius: 8, borderWidth: 1, fontSize: 14, fontFamily: 'Inter_400Regular' },
    daysChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    dayChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1 },
    timeRow: { flexDirection: 'row', gap: 12, marginTop: spacing.md },
    formRow: { flexDirection: 'row', gap: 12, marginTop: spacing.md },
    smallBtn: { flex: 1, padding: spacing.sm, borderRadius: 8, alignItems: 'center' },
    previewGrid: { marginTop: spacing.lg, borderRadius: 12, borderWidth: 1, padding: spacing.sm },
    gridRow: { flexDirection: 'row', minHeight: 40, alignItems: 'center' },
    gridTimeCol: { width: 40, alignItems: 'center' },
    gridDayCol: { flex: 1, padding: 2 },
    gridBlock: { borderRadius: 4, padding: 4, marginBottom: 2 },
});
