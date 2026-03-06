import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { theme } from '../../theme';
import { X, Check } from 'lucide-react-native';
import { insertCourse, insertClassSchedule, fetchCourses, Course } from '../../database/queries';

const AVAILABLE_COLORS = [
    '#6C5CE7', // Roxo
    '#00B894', // Verde
    '#0984E3', // Azul
    '#FD79A8', // Rosa
    '#FF7675', // Vermelho
    '#FDCB6E', // Amarelo
    '#E17055', // Laranja
    '#2D3436'  // Preto/Cinza Escuro
];

export default function CreateCourseScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const isOnboarding = route.params?.isOnboarding || false;

    const [name, setName] = useState('');
    const [professor, setProfessor] = useState('');
    const [selectedColor, setSelectedColor] = useState(AVAILABLE_COLORS[0]);

    // Autocomplete State
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
    const [existingCourses, setExistingCourses] = useState<Course[]>([]);

    React.useEffect(() => {
        fetchCourses().then(setExistingCourses);
    }, []);

    // Novos estados de agendamento (Grade)
    const [selectedDays, setSelectedDays] = useState<number[]>([]);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const toggleDay = (dayIndex: number) => {
        setSelectedDays(prev =>
            prev.includes(dayIndex)
                ? prev.filter(d => d !== dayIndex)
                : [...prev, dayIndex]
        );
    };

    const handleTimeChange = (text: string, setter: (val: string) => void) => {
        let cleaned = text.replace(/[^0-9]/g, '');
        if (cleaned.length > 2) {
            cleaned = `${cleaned.slice(0, 2)}:${cleaned.slice(2, 4)}`;
        }
        setter(cleaned);
    };

    const handleSelectExistingCourse = (course: Course) => {
        setSelectedCourseId(course.id);
        setName(course.name);
        setProfessor(course.professor || '');
        setSelectedColor(course.color_hex);
    };

    const handleSave = async () => {
        if (!name.trim()) return;

        try {
            // Se reaproveitamos um curso existente via Autocomplete, usamos o ID dele, senão geramos um novo.
            const courseId = selectedCourseId || `course_${Date.now()}`;
            await insertCourse(courseId, name, selectedColor, professor || undefined);

            // Se o usuário preencheu os dias e os horários, salva grade também
            if (selectedDays.length > 0 && startTime.trim() && endTime.trim()) {
                // Insere um registro na tabela para cada dia da semana marcado (grade)
                for (const day of selectedDays) {
                    const scheduleId = `sched_${courseId}_${day}`;
                    await insertClassSchedule(scheduleId, courseId, day, startTime.trim(), endTime.trim());
                }
            }

            if (isOnboarding) {
                // Durante a configuração inicial, retorna para o Hub de Múltiplas com "re-render" simulado
                navigation.navigate('AddMultipleCoursesScreen');
            } else {
                // Uso normal pela Home/Timetable   
                navigation.goBack();
            }

        } catch (error) {
            console.error("Erro ao salvar disciplina:", error);
            Alert.alert("Erro", "Não foi possível salvar a disciplina. Verifique o banco de dados.");
        }
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
                <Text style={styles.headerTitle}>Nova Disciplina</Text>
                <TouchableOpacity
                    onPress={handleSave}
                    style={[styles.iconButton, !name.trim() && { opacity: 0.5 }]}
                    disabled={!name.trim()}
                >
                    <Check color={theme.colors.accent} size={24} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Nome */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Qual o nome da matéria?</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: Engenharia de Software"
                        placeholderTextColor={theme.colors.textTertiary}
                        value={name}
                        onChangeText={(txt) => {
                            setName(txt);
                            if (selectedCourseId) setSelectedCourseId(null); // digitou difere do autocomplete
                        }}
                        autoFocus
                    />

                    {/* Autocomplete Bar */}
                    {name.trim().length > 0 && !selectedCourseId && existingCourses.filter(c => c.name.toLowerCase().includes(name.trim().toLowerCase()) && c.name.toLowerCase() !== name.trim().toLowerCase()).length > 0 && (
                        <ScrollView style={styles.autocompleteContainer} keyboardShouldPersistTaps="handled">
                            {existingCourses.filter(c => c.name.toLowerCase().includes(name.trim().toLowerCase()) && c.name.toLowerCase() !== name.trim().toLowerCase()).map(c => (
                                <TouchableOpacity
                                    key={c.id}
                                    style={styles.autocompleteItem}
                                    onPress={() => handleSelectExistingCourse(c)}
                                >
                                    <View style={[styles.autocompleteColorDot, { backgroundColor: c.color_hex }]} />
                                    <Text style={styles.autocompleteText}>{c.name}</Text>
                                    <View style={styles.autocompleteTag}><Text style={styles.autocompleteTagText}>Sugerido</Text></View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}
                </View>

                {/* Professor */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nome do Professor (Opcional)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: Dr. Alan Turing"
                        placeholderTextColor={theme.colors.textTertiary}
                        value={professor}
                        onChangeText={setProfessor}
                    />
                </View>

                {/* Dias da Semana */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Dias de Aula na Semana</Text>
                    <View style={styles.daysRow}>
                        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((dayChar, index) => {
                            const isSelected = selectedDays.includes(index);
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={[styles.dayButton, isSelected && styles.dayButtonSelected]}
                                    onPress={() => toggleDay(index)}
                                >
                                    <Text style={[styles.dayButtonText, isSelected && styles.dayButtonTextSelected]}>
                                        {dayChar}
                                    </Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </View>

                {/* Horários */}
                <View style={[styles.inputGroup, styles.timeRow]}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                        <Text style={styles.label}>Início</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: 08:30"
                            placeholderTextColor={theme.colors.textTertiary}
                            value={startTime}
                            onChangeText={(txt) => handleTimeChange(txt, setStartTime)}
                            keyboardType="numeric"
                            maxLength={5}
                        />
                    </View>
                    <View style={{ flex: 1, marginLeft: 8 }}>
                        <Text style={styles.label}>Término</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: 10:10"
                            placeholderTextColor={theme.colors.textTertiary}
                            value={endTime}
                            onChangeText={(txt) => handleTimeChange(txt, setEndTime)}
                            keyboardType="numeric"
                            maxLength={5}
                        />
                    </View>
                </View>

                {/* Cor da Disciplina */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Cor de Identificação</Text>

                    <View style={styles.colorGrid}>
                        {AVAILABLE_COLORS.map(color => (
                            <TouchableOpacity
                                key={color}
                                style={[
                                    styles.colorOption,
                                    { backgroundColor: color },
                                    selectedColor === color && styles.colorOptionSelected
                                ]}
                                onPress={() => setSelectedColor(color)}
                            >
                                {selectedColor === color && <Check color="#FFF" size={16} strokeWidth={3} />}
                            </TouchableOpacity>
                        ))}
                    </View>
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
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
    },
    colorOption: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
        marginBottom: 12,
    },
    colorOptionSelected: {
        borderWidth: 3,
        borderColor: theme.colors.surface,
        elevation: 4, // shadow for android
        shadowColor: '#000', // shadows for ios
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    daysRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    dayButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: theme.colors.surfaceElevated,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    dayButtonSelected: {
        backgroundColor: theme.colors.accent,
        borderColor: theme.colors.accent,
    },
    dayButtonText: {
        fontFamily: theme.typography.fontFamilies.medium,
        fontSize: theme.typography.sizes.bodySmall,
        color: theme.colors.textSecondary,
    },
    dayButtonTextSelected: {
        color: '#FFF',
        fontFamily: theme.typography.fontFamilies.bold,
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    autocompleteContainer: {
        marginTop: 8,
        backgroundColor: theme.colors.surfaceElevated,
        borderRadius: theme.borderRadius.sm,
        borderWidth: 1,
        borderColor: theme.colors.border,
        maxHeight: 150,
    },
    autocompleteItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    autocompleteColorDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    autocompleteText: {
        fontFamily: theme.typography.fontFamilies.medium,
        color: theme.colors.textPrimary,
        fontSize: theme.typography.sizes.body,
        flex: 1,
    },
    autocompleteTag: {
        backgroundColor: theme.colors.border,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    autocompleteTagText: {
        color: theme.colors.textSecondary,
        fontSize: 10,
        fontFamily: theme.typography.fontFamilies.regular,
    }
});
