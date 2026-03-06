import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { theme } from '../../theme';
import { X, Check } from 'lucide-react-native';
import { fetchCourses, insertTask, Course } from '../../database/queries';

export default function CreateTaskScreen() {
    const navigation = useNavigation();
    const route = useRoute<any>();

    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [dueTime, setDueTime] = useState('');
    const [selectedCourse, setSelectedCourse] = useState<string | null>(route.params?.courseId || null);

    const handleTimeChange = (text: string, setter: (val: string) => void) => {
        let cleaned = text.replace(/[^0-9]/g, '');
        if (cleaned.length > 2) {
            cleaned = `${cleaned.slice(0, 2)}:${cleaned.slice(2, 4)}`;
        }
        setter(cleaned);
    };

    const handleDateChange = (text: string, setter: (val: string) => void) => {
        let cleaned = text.replace(/[^0-9]/g, '');
        if (cleaned.length > 2 && cleaned.length <= 4) {
            cleaned = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
        } else if (cleaned.length > 4) {
            cleaned = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
        }
        setter(cleaned);
    };

    const [courses, setCourses] = useState<Course[]>([]);

    useEffect(() => {
        async function loadCourses() {
            const data = await fetchCourses();
            setCourses(data);
        }
        loadCourses();
    }, []);

    const handleSave = async () => {
        if (!title.trim()) return;

        const newId = `task_${Date.now()}`;

        // Concatenar String se preencheu
        let finalDate = '';
        if (dueDate.trim() || dueTime.trim()) {
            finalDate = `${dueDate.trim()} ${dueTime.trim()}`.trim();
        }

        await insertTask(newId, title, selectedCourse || undefined, finalDate || undefined);

        navigation.goBack();
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            {/* Header Modal */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                    <X color={theme.colors.textPrimary} size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Nova Tarefa</Text>
                <TouchableOpacity
                    onPress={handleSave}
                    style={[styles.iconButton, !title.trim() && { opacity: 0.5 }]}
                    disabled={!title.trim()}
                >
                    <Check color={theme.colors.accent} size={24} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Título */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>O que precisa ser feito?</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: Ler capítulo 4"
                        placeholderTextColor={theme.colors.textTertiary}
                        value={title}
                        onChangeText={setTitle}
                        autoFocus
                    />
                </View>

                {/* Data e Hora */}
                <View style={[styles.inputGroup, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                        <Text style={styles.label}>Prazo de Entrega</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="DD/MM/AAAA"
                            placeholderTextColor={theme.colors.textTertiary}
                            value={dueDate}
                            onChangeText={(txt) => handleDateChange(txt, setDueDate)}
                            keyboardType="numeric"
                            maxLength={10}
                        />
                    </View>
                    <View style={{ flex: 1, marginLeft: 8 }}>
                        <Text style={styles.label}>Horário (Opcional)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="00:00"
                            placeholderTextColor={theme.colors.textTertiary}
                            value={dueTime}
                            onChangeText={(txt) => handleTimeChange(txt, setDueTime)}
                            keyboardType="numeric"
                            maxLength={5}
                        />
                    </View>
                </View>

                {/* Matéria (Curso) */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Disciplina</Text>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.courseScroll}>
                        {courses.length === 0 ? (
                            <Text style={{ color: theme.colors.textSecondary }}>Nenhuma disciplina cadastrada ainda.</Text>
                        ) : (
                            courses.map(course => (
                                <TouchableOpacity
                                    key={course.id}
                                    style={[
                                        styles.courseChip,
                                        selectedCourse === course.id && { borderColor: course.color_hex, backgroundColor: `${course.color_hex}20` }
                                    ]}
                                    onPress={() => setSelectedCourse(course.id === selectedCourse ? null : course.id)}
                                >
                                    <View style={[styles.courseDot, { backgroundColor: course.color_hex }]} />
                                    <Text style={[
                                        styles.courseChipText,
                                        selectedCourse === course.id && { color: course.color_hex }
                                    ]}>
                                        {course.name}
                                    </Text>
                                </TouchableOpacity>
                            ))
                        )}
                    </ScrollView>
                </View>

            </ScrollView>

        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'ios' ? 60 : 20,
        paddingHorizontal: 24,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        backgroundColor: theme.colors.surface,
    },
    headerTitle: {
        fontFamily: theme.typography.fontFamilies.semiBold,
        fontSize: theme.typography.sizes.h3,
        color: theme.colors.textPrimary,
    },
    iconButton: {
        padding: 8,
    },
    content: {
        padding: 24,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontFamily: theme.typography.fontFamilies.medium,
        fontSize: theme.typography.sizes.bodySmall,
        color: theme.colors.textSecondary,
        marginBottom: 8,
    },
    input: {
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        color: theme.colors.textPrimary,
        fontFamily: theme.typography.fontFamilies.regular,
        fontSize: theme.typography.sizes.body,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    courseScroll: {
        flexDirection: 'row',
        marginTop: 8,
    },
    courseChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.full,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginRight: 12,
    },
    courseDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    courseChipText: {
        fontFamily: theme.typography.fontFamilies.medium,
        fontSize: theme.typography.sizes.bodySmall,
        color: theme.colors.textSecondary,
    }
});
