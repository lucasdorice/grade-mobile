import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius } from '../../src/theme';
import PrimaryButton from '../../src/components/PrimaryButton';
import StepperDots from '../../src/components/StepperDots';
import { useAppStore } from '../../src/store/useAppStore';
import { getAllCourses, getSchedulesForCourse } from '../../src/database/queries';
import type { Course, Schedule } from '../../src/database/queries';

interface CourseWithSchedules extends Course {
    schedules: Schedule[];
}

const DAY_LABELS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'];
const DAY_VALUES = [1, 2, 3, 4, 5];

// Convert "HH:MM" to minutes since midnight
function timeToMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
}

export default function ReadyScreen() {
    const router = useRouter();
    const { completeOnboarding } = useAppStore();
    const [coursesData, setCoursesData] = useState<CourseWithSchedules[]>([]);

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        const allCourses = await getAllCourses();
        const withSchedules: CourseWithSchedules[] = [];
        for (const course of allCourses) {
            const schedules = await getSchedulesForCourse(course.id);
            withSchedules.push({ ...course, schedules });
        }
        setCoursesData(withSchedules);
    };

    const handleFinish = async () => {
        await completeOnboarding();
        router.replace('/(tabs)');
    };

    // Build the grid data
    // Find time range for the grid
    let minTime = 480; // 08:00
    let maxTime = 1080; // 18:00
    for (const course of coursesData) {
        for (const sched of course.schedules) {
            const start = timeToMinutes(sched.start_time);
            const end = timeToMinutes(sched.end_time);
            if (start < minTime) minTime = start;
            if (end > maxTime) maxTime = end;
        }
    }

    // Snap to full hours
    minTime = Math.floor(minTime / 60) * 60;
    maxTime = Math.ceil(maxTime / 60) * 60;

    // Generate time slots (each hour)
    const timeSlots: string[] = [];
    for (let t = minTime; t < maxTime; t += 60) {
        const h = Math.floor(t / 60);
        timeSlots.push(`${String(h).padStart(2, '0')}:00`);
    }

    const totalMinutesRange = maxTime - minTime;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inner}>
                <View style={styles.stepperContainer}>
                    <StepperDots totalSteps={3} currentStep={3} />
                </View>

                <Text style={styles.title}>Sua grade está pronta! 🎓</Text>
                <Text style={styles.subtitle}>Aqui está um resumo das suas aulas</Text>

                <ScrollView style={styles.gridScroll} showsVerticalScrollIndicator={false}>
                    <View style={styles.gridContainer}>
                        {/* Header Row */}
                        <View style={styles.gridHeader}>
                            <View style={styles.timeColumn} />
                            {DAY_LABELS.map(day => (
                                <View key={day} style={styles.dayHeaderCell}>
                                    <Text style={styles.dayHeaderText}>{day}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Grid Body */}
                        <View style={styles.gridBody}>
                            {/* Time labels */}
                            {timeSlots.map((time, i) => (
                                <Text
                                    key={time}
                                    style={[
                                        styles.timeLabel,
                                        { top: (i * 60 / totalMinutesRange) * 100 + '%' as any },
                                    ]}
                                >
                                    {time}
                                </Text>
                            ))}

                            {/* Day columns */}
                            <View style={styles.columnsContainer}>
                                {DAY_VALUES.map(dayValue => (
                                    <View key={dayValue} style={styles.dayColumn}>
                                        {/* Grid lines */}
                                        {timeSlots.map((_, i) => (
                                            <View
                                                key={i}
                                                style={[
                                                    styles.gridLine,
                                                    { top: (i * 60 / totalMinutesRange) * 100 + '%' as any },
                                                ]}
                                            />
                                        ))}

                                        {/* Course blocks */}
                                        {coursesData.map(course =>
                                            course.schedules
                                                .filter(s => s.day_of_week === dayValue)
                                                .map(sched => {
                                                    const startMin = timeToMinutes(sched.start_time) - minTime;
                                                    const endMin = timeToMinutes(sched.end_time) - minTime;
                                                    const top = (startMin / totalMinutesRange) * 100;
                                                    const height = ((endMin - startMin) / totalMinutesRange) * 100;

                                                    return (
                                                        <View
                                                            key={sched.id}
                                                            style={[
                                                                styles.courseBlock,
                                                                {
                                                                    top: top + '%' as any,
                                                                    height: height + '%' as any,
                                                                    backgroundColor: course.color + '33',
                                                                    borderLeftColor: course.color,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={[styles.courseBlockText, { color: course.color }]}
                                                                numberOfLines={2}
                                                            >
                                                                {course.name}
                                                            </Text>
                                                        </View>
                                                    );
                                                })
                                        )}
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <PrimaryButton
                        label="Começar a usar! 🚀"
                        onPress={handleFinish}
                    />
                </View>
            </View>
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
        textAlign: 'center',
        marginTop: spacing.xl,
    },
    subtitle: {
        ...typography.bodySm,
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: spacing.xs,
        marginBottom: spacing.lg,
    },
    gridScroll: {
        flex: 1,
    },

    // Grid
    gridContainer: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.md,
        minHeight: 300,
    },
    gridHeader: {
        flexDirection: 'row',
        marginBottom: spacing.sm,
    },
    timeColumn: {
        width: 40,
    },
    dayHeaderCell: {
        flex: 1,
        alignItems: 'center',
    },
    dayHeaderText: {
        ...typography.caption,
        color: colors.textSecondary,
    },
    gridBody: {
        flexDirection: 'row',
        height: 250,
        position: 'relative',
    },
    timeLabel: {
        position: 'absolute',
        left: 0,
        width: 40,
        ...typography.caption,
        color: colors.textTertiary,
        fontSize: 10,
    },
    columnsContainer: {
        flex: 1,
        flexDirection: 'row',
        marginLeft: 40,
    },
    dayColumn: {
        flex: 1,
        position: 'relative',
        marginHorizontal: 1,
    },
    gridLine: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: colors.border,
        opacity: 0.3,
    },
    courseBlock: {
        position: 'absolute',
        left: 1,
        right: 1,
        borderLeftWidth: 3,
        borderRadius: 4,
        padding: 2,
        overflow: 'hidden',
    },
    courseBlockText: {
        ...typography.caption,
        fontSize: 9,
        lineHeight: 12,
    },

    // Footer
    footer: {
        paddingBottom: spacing.xl,
        paddingTop: spacing.md,
    },
});
