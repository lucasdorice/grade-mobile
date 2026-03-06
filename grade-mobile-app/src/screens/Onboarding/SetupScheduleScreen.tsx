import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../theme';
import { ChevronRight } from 'lucide-react-native';

export default function SetupScheduleScreen() {
    const navigation = useNavigation<any>();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.stepperContainer}>
                    <View style={styles.stepDot} />
                    <View style={styles.stepDot} />
                    <View style={[styles.stepDot, styles.stepDotActive]} />
                    <View style={styles.stepDot} />
                </View>
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>Monte sua grade</Text>
                <Text style={styles.subtitle}>Adicione suas disciplinas do semestre</Text>

                {/* Futuralmente será a lista de matérias com o botão de adicionar e o fluxo import */}
                <View style={styles.emptyCard}>
                    <Text style={styles.emptyText}>Nenhuma disciplina ainda.</Text>
                </View>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => navigation.navigate('FinishSetupScreen')}
                    activeOpacity={0.8}
                >
                    <Text style={styles.primaryButtonText}>Próximo</Text>
                    <ChevronRight color="#FFF" size={20} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.secondaryButtonText}>Voltar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: { paddingTop: 60, paddingHorizontal: 24, alignItems: 'center' },
    stepperContainer: { flexDirection: 'row', marginBottom: 24 },
    stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.border },
    stepDotActive: { backgroundColor: theme.colors.accent, width: 24 },
    content: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
    title: { fontFamily: theme.typography.fontFamilies.semiBold, fontSize: theme.typography.sizes.h2, color: theme.colors.textPrimary, textAlign: 'center' },
    subtitle: { fontFamily: theme.typography.fontFamilies.regular, fontSize: theme.typography.sizes.bodySmall, color: theme.colors.textSecondary, textAlign: 'center', marginBottom: 32 },
    emptyCard: { backgroundColor: theme.colors.surface, padding: 24, borderRadius: theme.borderRadius.md, alignItems: 'center', borderWidth: 1, borderColor: theme.colors.border, borderStyle: 'dashed' },
    emptyText: { fontFamily: theme.typography.fontFamilies.medium, color: theme.colors.textTertiary },
    footer: { paddingHorizontal: 24, paddingBottom: 40 },
    primaryButton: { backgroundColor: theme.colors.accent, paddingVertical: 16, borderRadius: theme.borderRadius.full, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
    primaryButtonText: { fontFamily: theme.typography.fontFamilies.semiBold, fontSize: theme.typography.sizes.body, color: '#FFFFFF', marginRight: 8 },
    secondaryButton: { alignItems: 'center', paddingVertical: 8 },
    secondaryButtonText: { fontFamily: theme.typography.fontFamilies.medium, fontSize: theme.typography.sizes.body, color: theme.colors.textSecondary }
});
