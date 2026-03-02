import { useState, useCallback } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView,
    TextInput, Alert, Switch,
} from 'react-native';
import { useFocusEffect, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme/ThemeContext';
import { typography } from '../../src/theme/typography';
import { spacing } from '../../src/theme/spacing';
import * as settingsRepo from '../../src/db/repositories/settings';
import * as semesterRepo from '../../src/db/repositories/semesters';
import * as subjectRepo from '../../src/db/repositories/subjects';
import type { Semester, Subject } from '../../src/types';

export default function SettingsScreen() {
    const { c, isDark, toggleTheme } = useTheme();
    const [userName, setUserName] = useState('');
    const [editingName, setEditingName] = useState(false);
    const [nameInput, setNameInput] = useState('');
    const [activeSemester, setActiveSemester] = useState<Semester | null>(null);
    const [subjects, setSubjects] = useState<Subject[]>([]);

    const loadSettings = useCallback(async () => {
        const name = await settingsRepo.getSetting('user_name');
        setUserName(name || '');

        const semester = await semesterRepo.getActiveSemester();
        setActiveSemester(semester);

        if (semester) {
            const subs = await subjectRepo.getSubjectsBySemester(semester.id);
            setSubjects(subs);
        }
    }, []);

    useFocusEffect(useCallback(() => { loadSettings(); }, [loadSettings]));

    const saveName = async () => {
        await settingsRepo.setSetting('user_name', nameInput.trim());
        setUserName(nameInput.trim());
        setEditingName(false);
    };

    const getInitials = (name: string) => {
        if (!name) return '?';
        return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: c.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={[typography.h1, { color: c.textPrimary, marginBottom: spacing.lg }]}>
                    Configurações
                </Text>

                {/* Profile Section */}
                <View style={[styles.section, { backgroundColor: c.surface, borderColor: c.border }]}>
                    <View style={styles.profileRow}>
                        <View style={[styles.avatar, { backgroundColor: c.accent }]}>
                            <Text style={[typography.h3, { color: '#fff' }]}>
                                {getInitials(userName)}
                            </Text>
                        </View>
                        {editingName ? (
                            <View style={styles.nameEditRow}>
                                <TextInput
                                    style={[styles.nameInput, { backgroundColor: c.background, borderColor: c.border, color: c.textPrimary }]}
                                    value={nameInput}
                                    onChangeText={setNameInput}
                                    autoFocus
                                    placeholder="Seu nome"
                                    placeholderTextColor={c.textTertiary}
                                    onSubmitEditing={saveName}
                                />
                                <TouchableOpacity onPress={saveName}>
                                    <Ionicons name="checkmark-circle" size={28} color={c.accent} />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={styles.nameRow}
                                onPress={() => { setNameInput(userName); setEditingName(true); }}
                            >
                                <Text style={[typography.h3, { color: c.textPrimary }]}>
                                    {userName || 'Toque para adicionar nome'}
                                </Text>
                                <Ionicons name="pencil" size={16} color={c.textTertiary} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Appearance */}
                <Text style={[typography.caption, { color: c.textSecondary, marginTop: spacing.lg, marginBottom: spacing.sm, marginLeft: spacing.xs }]}>
                    APARÊNCIA
                </Text>
                <View style={[styles.section, { backgroundColor: c.surface, borderColor: c.border }]}>
                    <View style={styles.settingRow}>
                        <View style={styles.settingLabel}>
                            <Ionicons name={isDark ? 'moon' : 'sunny'} size={20} color={c.textPrimary} />
                            <Text style={[typography.body, { color: c.textPrimary, marginLeft: spacing.sm }]}>
                                {isDark ? 'Tema Escuro' : 'Tema Claro'}
                            </Text>
                        </View>
                        <Switch
                            value={isDark}
                            onValueChange={async () => {
                                toggleTheme();
                                await settingsRepo.setSetting('theme', isDark ? 'light' : 'dark');
                            }}
                            trackColor={{ false: c.border, true: c.accent }}
                            thumbColor="#fff"
                        />
                    </View>
                </View>

                {/* Grade */}
                <Text style={[typography.caption, { color: c.textSecondary, marginTop: spacing.lg, marginBottom: spacing.sm, marginLeft: spacing.xs }]}>
                    GRADE
                </Text>
                <View style={[styles.section, { backgroundColor: c.surface, borderColor: c.border }]}>
                    <TouchableOpacity
                        style={styles.settingRow}
                        onPress={() => router.push('/semester/')}
                    >
                        <View style={styles.settingLabel}>
                            <Ionicons name="school-outline" size={20} color={c.textPrimary} />
                            <View style={{ marginLeft: spacing.sm }}>
                                <Text style={[typography.body, { color: c.textPrimary }]}>Semestres</Text>
                                {activeSemester && (
                                    <Text style={[typography.caption, { color: c.textSecondary }]}>
                                        Ativo: {activeSemester.name}
                                    </Text>
                                )}
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={c.textTertiary} />
                    </TouchableOpacity>

                    <View style={[styles.divider, { backgroundColor: c.border }]} />

                    <TouchableOpacity
                        style={styles.settingRow}
                        onPress={() => router.push('/subject/new')}
                    >
                        <View style={styles.settingLabel}>
                            <Ionicons name="book-outline" size={20} color={c.textPrimary} />
                            <View style={{ marginLeft: spacing.sm }}>
                                <Text style={[typography.body, { color: c.textPrimary }]}>Disciplinas</Text>
                                <Text style={[typography.caption, { color: c.textSecondary }]}>
                                    {subjects.length} cadastradas
                                </Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={c.textTertiary} />
                    </TouchableOpacity>
                </View>

                {/* About */}
                <Text style={[typography.caption, { color: c.textSecondary, marginTop: spacing.lg, marginBottom: spacing.sm, marginLeft: spacing.xs }]}>
                    SOBRE
                </Text>
                <View style={[styles.section, { backgroundColor: c.surface, borderColor: c.border }]}>
                    <View style={styles.settingRow}>
                        <Text style={[typography.body, { color: c.textPrimary }]}>Versão</Text>
                        <Text style={[typography.bodySmall, { color: c.textSecondary }]}>1.0.0 MVP</Text>
                    </View>
                    <View style={[styles.divider, { backgroundColor: c.border }]} />
                    <View style={styles.settingRow}>
                        <Text style={[typography.bodySmall, { color: c.textTertiary }]}>
                            Feito com 💜 por Lucas Dorice
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { padding: spacing.md, paddingTop: spacing.xl },
    section: { borderRadius: 12, borderWidth: 1, overflow: 'hidden' },
    profileRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.md },
    avatar: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
    nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginLeft: spacing.md, flex: 1 },
    nameEditRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginLeft: spacing.md, flex: 1 },
    nameInput: { flex: 1, padding: spacing.sm, borderRadius: 8, borderWidth: 1, fontSize: 16, fontFamily: 'Inter_400Regular' },
    settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.md },
    settingLabel: { flexDirection: 'row', alignItems: 'center' },
    divider: { height: 1, marginLeft: spacing.md },
});
