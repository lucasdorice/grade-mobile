import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme/ThemeContext';
import { typography } from '../../src/theme/typography';
import { spacing } from '../../src/theme/spacing';
import { formatDateBR, toISODate, addDays, getDayOfWeek } from '../../src/utils/dates';
import { getActiveSemester } from '../../src/db/repositories/semesters';
import { getSchedulesByDay } from '../../src/db/repositories/schedules';
import { getCardBySubjectAndDate } from '../../src/db/repositories/cards';
import { getSetting } from '../../src/db/repositories/settings';
import { router } from 'expo-router';

interface TimelineEntry {
    scheduleId: number;
    subjectId: number;
    subjectName: string;
    subjectColor: string;
    professor: string | null;
    startTime: string;
    endTime: string;
    hasCard: boolean;
}

export default function TodayScreen() {
    const { c } = useTheme();
    const [date, setDate] = useState(new Date());
    const [userName, setUserName] = useState('');
    const [entries, setEntries] = useState<TimelineEntry[]>([]);
    const [loading, setLoading] = useState(true);

    const loadTimeline = useCallback(async () => {
        try {
            setLoading(true);
            const name = await getSetting('user_name');
            setUserName(name || '');

            const semester = await getActiveSemester();
            if (!semester) {
                setEntries([]);
                return;
            }

            const dayOfWeek = getDayOfWeek(date);
            const schedules = await getSchedulesByDay(dayOfWeek, semester.id);
            const dateStr = toISODate(date);

            const items: TimelineEntry[] = [];
            for (const s of schedules) {
                const card = await getCardBySubjectAndDate(s.subject_id, dateStr);
                items.push({
                    scheduleId: s.id,
                    subjectId: s.subject_id,
                    subjectName: s.subject_name,
                    subjectColor: s.subject_color,
                    professor: s.professor,
                    startTime: s.start_time,
                    endTime: s.end_time,
                    hasCard: card !== null && card.notes.length > 0,
                });
            }
            setEntries(items);
        } catch (e) {
            console.error('Error loading timeline:', e);
        } finally {
            setLoading(false);
        }
    }, [date]);

    useFocusEffect(
        useCallback(() => {
            loadTimeline();
        }, [loadTimeline])
    );

    const goToPreviousDay = () => setDate((d) => addDays(d, -1));
    const goToNextDay = () => setDate((d) => addDays(d, 1));
    const goToToday = () => setDate(new Date());

    const openCard = (subjectId: number) => {
        const dateStr = toISODate(date);
        router.push(`/card/${subjectId}?date=${dateStr}`);
    };

    const isCurrentDay = toISODate(date) === toISODate(new Date());

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: c.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={[typography.h2, { color: c.textPrimary }]}>
                    {userName ? `Olá, ${userName} 👋` : 'Olá! 👋'}
                </Text>
                <Text style={[typography.bodySmall, { color: c.textSecondary, marginTop: spacing.xs }]}>
                    {formatDateBR(date)}
                </Text>
            </View>

            {/* Date Navigation */}
            <View style={[styles.dateNav, { borderColor: c.border }]}>
                <TouchableOpacity onPress={goToPreviousDay} style={styles.navButton}>
                    <Ionicons name="chevron-back" size={20} color={c.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={goToToday}>
                    <Text style={[typography.bodySmall, {
                        color: isCurrentDay ? c.accent : c.textSecondary,
                        fontFamily: 'Inter_600SemiBold',
                    }]}>
                        {isCurrentDay ? 'Hoje' : 'Ir para Hoje'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={goToNextDay} style={styles.navButton}>
                    <Ionicons name="chevron-forward" size={20} color={c.textSecondary} />
                </TouchableOpacity>
            </View>

            {/* Timeline */}
            <ScrollView style={styles.timeline} contentContainerStyle={styles.timelineContent}>
                {entries.length === 0 && !loading ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="sunny-outline" size={64} color={c.textTertiary} />
                        <Text style={[typography.h3, { color: c.textSecondary, marginTop: spacing.md }]}>
                            Nenhuma aula {isCurrentDay ? 'hoje' : 'neste dia'} 🎉
                        </Text>
                        <Text style={[typography.bodySmall, { color: c.textTertiary, marginTop: spacing.sm, textAlign: 'center' }]}>
                            Aproveite para revisar ou descansar
                        </Text>
                    </View>
                ) : (
                    entries.map((entry) => (
                        <TouchableOpacity
                            key={entry.scheduleId}
                            style={[styles.aulaCard, { backgroundColor: c.surface, borderColor: c.border }]}
                            onPress={() => openCard(entry.subjectId)}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.colorBar, { backgroundColor: entry.subjectColor }]} />
                            <View style={styles.aulaContent}>
                                <Text style={[typography.h3, { color: c.textPrimary }]}>
                                    {entry.subjectName}
                                </Text>
                                {entry.professor && (
                                    <Text style={[typography.caption, { color: c.textTertiary, marginTop: 2 }]}>
                                        {entry.professor}
                                    </Text>
                                )}
                                <Text style={[typography.bodySmall, { color: c.textSecondary, marginTop: spacing.xs }]}>
                                    {entry.startTime} – {entry.endTime}
                                </Text>
                            </View>
                            <View style={styles.cardBadge}>
                                {entry.hasCard ? (
                                    <View style={[styles.badge, { backgroundColor: c.accentBg }]}>
                                        <Text style={[typography.caption, { color: c.success }]}>📝 Anotado</Text>
                                    </View>
                                ) : (
                                    <Ionicons name="chevron-forward" size={20} color={c.textTertiary} />
                                )}
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { paddingHorizontal: spacing.md, paddingTop: spacing.xl, paddingBottom: spacing.sm },
    dateNav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        marginHorizontal: spacing.md,
        borderRadius: 12,
        borderWidth: 1,
    },
    navButton: { padding: spacing.sm },
    timeline: { flex: 1 },
    timelineContent: { padding: spacing.md, paddingBottom: 100 },
    aulaCard: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: spacing.sm,
        overflow: 'hidden',
    },
    colorBar: { width: 4, alignSelf: 'stretch', borderRadius: 2 },
    aulaContent: { flex: 1, padding: spacing.md },
    cardBadge: { paddingRight: spacing.md },
    badge: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: 8 },
    emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 100 },
});
