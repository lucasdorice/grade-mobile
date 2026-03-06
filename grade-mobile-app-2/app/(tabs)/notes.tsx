import { useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../../src/theme';
import NoteCard from '../../src/components/NoteCard';
import SubjectChip from '../../src/components/SubjectChip';
import EmptyState from '../../src/components/EmptyState';
import {
    getAllSessionsWithNotes, searchSessions, getSessionsForCourseId, getAllCourses,
} from '../../src/database/queries';
import type { ClassSessionWithCourse, Course } from '../../src/database/queries';

export default function NotesScreen() {
    const router = useRouter();
    const [notes, setNotes] = useState<ClassSessionWithCourse[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null); // null = "Todas"
    const [searchQuery, setSearchQuery] = useState('');

    const loadData = useCallback(async () => {
        try {
            const allCourses = await getAllCourses();
            setCourses(allCourses);

            let sessions: ClassSessionWithCourse[];

            if (searchQuery.trim()) {
                sessions = await searchSessions(searchQuery.trim());
            } else if (selectedCourseId !== null) {
                sessions = await getSessionsForCourseId(selectedCourseId);
                // Filter only those with notes
                sessions = sessions.filter(s => s.notes.trim() !== '');
            } else {
                sessions = await getAllSessionsWithNotes();
            }

            setNotes(sessions);
        } catch (error) {
            console.error('Error loading notes:', error);
        }
    }, [searchQuery, selectedCourseId]);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [loadData])
    );

    const handleNotePress = (sessionId: number) => {
        router.push(`/session/${sessionId}`);
    };

    const handleFilterCourse = (courseId: number | null) => {
        setSelectedCourseId(courseId);
        setSearchQuery('');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Notas</Text>

                {/* Search Bar */}
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color={colors.textTertiary} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar nas anotações..."
                        placeholderTextColor={colors.textTertiary}
                        value={searchQuery}
                        onChangeText={(text) => {
                            setSearchQuery(text);
                            if (text.trim()) setSelectedCourseId(null);
                        }}
                        returnKeyType="search"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Course Filter */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filterScroll}
                    contentContainerStyle={styles.filterContent}
                >
                    <TouchableOpacity
                        style={[
                            styles.allChip,
                            selectedCourseId === null && styles.allChipActive,
                        ]}
                        onPress={() => handleFilterCourse(null)}
                    >
                        <Text style={[
                            styles.allChipText,
                            selectedCourseId === null && styles.allChipTextActive,
                        ]}>
                            Todas
                        </Text>
                    </TouchableOpacity>

                    {courses.map(course => (
                        <SubjectChip
                            key={course.id}
                            name={course.name}
                            color={course.color}
                            active={selectedCourseId === course.id}
                            onPress={() => handleFilterCourse(course.id)}
                        />
                    ))}
                </ScrollView>
            </View>

            {notes.length === 0 ? (
                <EmptyState
                    emoji="📝"
                    title="Nenhuma anotação ainda"
                    subtitle="Suas anotações aparecerão aqui"
                />
            ) : (
                <ScrollView
                    style={styles.list}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                >
                    {notes.map(note => (
                        <NoteCard
                            key={note.id}
                            courseName={note.course_name}
                            courseColor={note.course_color}
                            date={note.date}
                            contentPreview={note.notes}
                            onPress={() => handleNotePress(note.id)}
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
    },
    title: {
        ...typography.headingLg,
        color: colors.textPrimary,
        marginBottom: spacing.md,
    },

    // Search
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        paddingHorizontal: 14,
        gap: 10,
    },
    searchInput: {
        flex: 1,
        ...typography.bodySm,
        color: colors.textPrimary,
    },

    // Filter
    filterScroll: {
        marginTop: spacing.md,
        marginBottom: spacing.md,
    },
    filterContent: {
        gap: spacing.sm,
        paddingRight: spacing.lg,
    },
    allChip: {
        height: 36,
        paddingHorizontal: 14,
        borderRadius: radius.full,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
    allChipActive: {
        backgroundColor: colors.accentSoft,
        borderColor: 'transparent',
    },
    allChipText: {
        ...typography.caption,
        color: colors.textSecondary,
    },
    allChipTextActive: {
        color: colors.accent,
    },

    // List
    list: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.lg,
    },
});
