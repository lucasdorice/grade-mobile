import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { colors, typography, spacing } from '../../src/theme';
import { useAppStore } from '../../src/store/useAppStore';
import AulaCard from '../../src/components/AulaCard';
import EmptyState from '../../src/components/EmptyState';
import { getSchedulesForDay, getOrCreateSession, sessionHasNotes } from '../../src/database/queries';

interface TodayClass {
  scheduleId: number;
  courseId: number;
  courseName: string;
  courseColor: string;
  startTime: string;
  endTime: string;
  hasNotes: boolean;
}

const DAYS_PT = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const MONTHS_PT = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

function formatDate(date: Date): string {
  return `${DAYS_PT[date.getDay()]}, ${date.getDate()} de ${MONTHS_PT[date.getMonth()]}`;
}

function formatDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function TodayScreen() {
  const router = useRouter();
  const { studentName } = useAppStore();
  const [classes, setClasses] = useState<TodayClass[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const todayISO = formatDateISO(today);
  const dayOfWeek = today.getDay(); // 0=Dom..6=Sáb

  const loadTodayClasses = useCallback(async () => {
    setLoading(true);
    try {
      const schedules = await getSchedulesForDay(dayOfWeek);
      const classesWithNotes: TodayClass[] = [];

      for (const sched of schedules) {
        const hasNotes = await sessionHasNotes(sched.course_id, todayISO);
        classesWithNotes.push({
          scheduleId: sched.id,
          courseId: sched.course_id,
          courseName: sched.course_name,
          courseColor: sched.course_color,
          startTime: sched.start_time,
          endTime: sched.end_time,
          hasNotes,
        });
      }

      setClasses(classesWithNotes);
    } catch (error) {
      console.error('Error loading classes:', error);
    } finally {
      setLoading(false);
    }
  }, [dayOfWeek, todayISO]);

  // Reload when screen comes into focus (e.g. after writing notes)
  useFocusEffect(
    useCallback(() => {
      loadTodayClasses();
    }, [loadTodayClasses])
  );

  const handleClassPress = async (courseId: number) => {
    try {
      const session = await getOrCreateSession(courseId, todayISO);
      router.push(`/session/${session.id}`);
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, {studentName} 👋</Text>
        <Text style={styles.date}>{formatDate(today)}</Text>
      </View>

      {!loading && classes.length === 0 ? (
        <EmptyState
          emoji="🎉"
          title="Nenhuma aula hoje!"
          subtitle="Aproveite para revisar ou descansar"
        />
      ) : (
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {classes.map((cls) => (
            <AulaCard
              key={`${cls.courseId}-${cls.scheduleId}`}
              courseName={cls.courseName}
              courseColor={cls.courseColor}
              startTime={cls.startTime}
              endTime={cls.endTime}
              hasNotes={cls.hasNotes}
              onPress={() => handleClassPress(cls.courseId)}
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
  },
  greeting: {
    ...typography.headingXl,
    color: colors.textPrimary,
  },
  date: {
    ...typography.bodySm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
});
