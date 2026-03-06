import { useState, useCallback } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Modal, TextInput,
    KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../../src/theme';
import PrimaryButton from '../../src/components/PrimaryButton';
import { useAppStore } from '../../src/store/useAppStore';

export default function SettingsScreen() {
    const router = useRouter();
    const { studentName, setStudentName } = useAppStore();
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editName, setEditName] = useState(studentName);

    useFocusEffect(
        useCallback(() => {
            setEditName(studentName);
        }, [studentName])
    );

    const handleSaveName = async () => {
        const trimmed = editName.trim();
        if (!trimmed) return;
        await setStudentName(trimmed);
        setEditModalVisible(false);
    };

    // Get initials
    const initials = studentName
        .split(' ')
        .map(w => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Configurações</Text>

                {/* Profile Section */}
                <TouchableOpacity
                    style={styles.profileCard}
                    onPress={() => {
                        setEditName(studentName);
                        setEditModalVisible(true);
                    }}
                    activeOpacity={0.7}
                >
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{initials}</Text>
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>{studentName}</Text>
                        <Text style={styles.profileHint}>Toque para editar</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
                </TouchableOpacity>

                {/* Grade Section */}
                <Text style={styles.sectionLabel}>GRADE</Text>
                <View style={styles.sectionCard}>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => router.push('/manage-courses')}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="book" size={20} color={colors.accent} />
                        <Text style={styles.menuItemText}>Gerenciar matérias</Text>
                        <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
                    </TouchableOpacity>
                </View>

                {/* About Section */}
                <Text style={styles.sectionLabel}>SOBRE</Text>
                <View style={styles.sectionCard}>
                    <View style={styles.menuItem}>
                        <Text style={styles.menuItemText}>Versão</Text>
                        <Text style={styles.menuItemValue}>1.0.0 MVP</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.menuItem}>
                        <Text style={styles.menuItemValue}>Feito com 💜 por Lucas Dorice</Text>
                    </View>
                </View>
            </View>

            {/* Edit Name Modal */}
            <Modal
                visible={editModalVisible}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setEditModalVisible(false)}
            >
                <KeyboardAvoidingView
                    style={styles.modalContainer}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Editar nome</Text>
                        <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                            <Ionicons name="close" size={24} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.modalContent}>
                        <Text style={styles.fieldLabel}>Nome</Text>
                        <TextInput
                            style={styles.input}
                            value={editName}
                            onChangeText={setEditName}
                            autoFocus
                            placeholder="Seu nome"
                            placeholderTextColor={colors.textTertiary}
                        />
                    </View>

                    <View style={styles.modalFooter}>
                        <PrimaryButton
                            label="Salvar"
                            onPress={handleSaveName}
                            disabled={!editName.trim()}
                        />
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: spacing.lg,
    },
    title: {
        ...typography.headingLg,
        color: colors.textPrimary,
        paddingTop: spacing.xxl,
        marginBottom: spacing.lg,
    },

    // Profile
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: 20,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        ...typography.headingSm,
        color: '#FFFFFF',
    },
    profileInfo: {
        flex: 1,
        marginLeft: spacing.md,
    },
    profileName: {
        ...typography.headingMd,
        color: colors.textPrimary,
    },
    profileHint: {
        ...typography.caption,
        color: colors.textTertiary,
        marginTop: 2,
    },

    // Sections
    sectionLabel: {
        ...typography.caption,
        color: colors.textTertiary,
        letterSpacing: 1,
        marginTop: spacing.lg,
        marginBottom: spacing.sm,
        marginLeft: spacing.xs,
    },
    sectionCard: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 56,
        paddingHorizontal: spacing.md,
        gap: 12,
    },
    menuItemText: {
        ...typography.body,
        color: colors.textPrimary,
        flex: 1,
    },
    menuItemValue: {
        ...typography.bodySm,
        color: colors.textSecondary,
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginHorizontal: spacing.md,
    },

    // Modal
    modalContainer: {
        flex: 1,
        backgroundColor: colors.surfaceElevated,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: spacing.md,
    },
    modalTitle: {
        ...typography.headingMd,
        color: colors.textPrimary,
    },
    modalContent: {
        flex: 1,
        paddingHorizontal: spacing.lg,
    },
    modalFooter: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xl,
    },
    fieldLabel: {
        ...typography.bodySm,
        color: colors.textSecondary,
        marginBottom: spacing.sm,
    },
    input: {
        height: 56,
        backgroundColor: colors.surface,
        borderWidth: 1.5,
        borderColor: colors.border,
        borderRadius: radius.md,
        paddingHorizontal: spacing.md,
        ...typography.body,
        color: colors.textPrimary,
    },
});
