import { useState, useCallback } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView,
    TextInput, Alert,
} from 'react-native';
import { useFocusEffect, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme/ThemeContext';
import { typography } from '../../src/theme/typography';
import { spacing } from '../../src/theme/spacing';
import * as semesterRepo from '../../src/db/repositories/semesters';
import type { Semester } from '../../src/types';

export default function SemesterScreen() {
    const { c } = useTheme();
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');

    const loadSemesters = useCallback(async () => {
        const all = await semesterRepo.getAllSemesters();
        setSemesters(all);
    }, []);

    useFocusEffect(useCallback(() => { loadSemesters(); }, [loadSemesters]));

    const handleCreate = async () => {
        if (!name.trim()) return;
        const now = new Date();
        const startDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
        const endDate = `${now.getFullYear()}-${String(now.getMonth() + 7).padStart(2, '0')}-30`;
        await semesterRepo.createSemester({ name: name.trim(), start_date: startDate, end_date: endDate });
        setName('');
        setShowForm(false);
        await loadSemesters();
    };

    const handleSetActive = async (id: number) => {
        await semesterRepo.setActiveSemester(id);
        await loadSemesters();
    };

    const handleDelete = (semester: Semester) => {
        Alert.alert(
            'Excluir semestre',
            `Excluir "${semester.name}" e todos os dados associados?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir', style: 'destructive', onPress: async () => {
                        await semesterRepo.deleteSemester(semester.id);
                        await loadSemesters();
                    }
                },
            ]
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: c.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="close" size={28} color={c.textPrimary} />
                </TouchableOpacity>
                <Text style={[typography.h2, { color: c.textPrimary, flex: 1, marginLeft: spacing.md }]}>
                    Semestres
                </Text>
                <TouchableOpacity onPress={() => setShowForm(true)}>
                    <Ionicons name="add-circle" size={28} color={c.accent} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.listContent}>
                {showForm && (
                    <View style={[styles.formCard, { backgroundColor: c.surface, borderColor: c.border }]}>
                        <TextInput
                            style={[styles.input, { backgroundColor: c.background, borderColor: c.border, color: c.textPrimary }]}
                            placeholder="Ex: 2026.1"
                            placeholderTextColor={c.textTertiary}
                            value={name}
                            onChangeText={setName}
                            autoFocus
                        />
                        <View style={styles.formActions}>
                            <TouchableOpacity
                                style={[styles.formButton, { backgroundColor: c.background }]}
                                onPress={() => setShowForm(false)}
                            >
                                <Text style={[typography.bodySmall, { color: c.textSecondary }]}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.formButton, { backgroundColor: c.accent }]}
                                onPress={handleCreate}
                            >
                                <Text style={[typography.bodySmall, { color: '#fff', fontFamily: 'Inter_600SemiBold' }]}>Criar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {semesters.map((semester) => (
                    <TouchableOpacity
                        key={semester.id}
                        style={[styles.semesterCard, { backgroundColor: c.surface, borderColor: semester.is_active ? c.accent : c.border }]}
                        onPress={() => handleSetActive(semester.id)}
                        onLongPress={() => handleDelete(semester)}
                    >
                        <View style={styles.semesterContent}>
                            <Text style={[typography.h3, { color: c.textPrimary }]}>{semester.name}</Text>
                            <Text style={[typography.caption, { color: c.textSecondary }]}>
                                {semester.start_date} → {semester.end_date}
                            </Text>
                        </View>
                        {semester.is_active ? (
                            <View style={[styles.activeBadge, { backgroundColor: c.accentBg }]}>
                                <Text style={[typography.caption, { color: c.accent }]}>Ativo</Text>
                            </View>
                        ) : (
                            <Text style={[typography.caption, { color: c.textTertiary }]}>Toque para ativar</Text>
                        )}
                    </TouchableOpacity>
                ))}

                {semesters.length === 0 && !showForm && (
                    <View style={styles.emptyState}>
                        <Ionicons name="school-outline" size={48} color={c.textTertiary} />
                        <Text style={[typography.bodySmall, { color: c.textSecondary, marginTop: spacing.md, textAlign: 'center' }]}>
                            Nenhum semestre cadastrado.{'\n'}Toque no + para criar o primeiro.
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
    formActions: { flexDirection: 'row', gap: 12, marginTop: spacing.md },
    formButton: { flex: 1, padding: spacing.sm, borderRadius: 8, alignItems: 'center' },
    semesterCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, borderWidth: 1, padding: spacing.md, marginBottom: spacing.sm },
    semesterContent: { flex: 1 },
    activeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    emptyState: { alignItems: 'center', paddingTop: 80 },
});
