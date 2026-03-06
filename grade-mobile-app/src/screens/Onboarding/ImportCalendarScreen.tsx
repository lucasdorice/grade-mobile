import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../theme';
import { ChevronLeft, CloudDownload } from 'lucide-react-native';

export default function ImportCalendarScreen() {
    const navigation = useNavigation<any>();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft color={theme.colors.textPrimary} size={28} />
                </TouchableOpacity>
                <View style={styles.stepperContainer}>
                    <View style={styles.stepDot} />
                    <View style={styles.stepDot} />
                    <View style={{ ...styles.stepDotActive, width: 8, backgroundColor: theme.colors.border }} />
                    <View style={[styles.stepDot, styles.stepDotActive]} />
                </View>
                <View style={{ width: 44 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.iconWrap}>
                    <CloudDownload color={theme.colors.accent} size={64} />
                </View>

                <Text style={styles.title}>Sincronizar Calendário</Text>
                <Text style={styles.subtitle}>
                    Conecte a sua conta da faculdade ou agenda pessoal para puxarmos suas aulas automaticamente.
                </Text>

                {/* Integration Buttons Mockup */}
                <TouchableOpacity style={styles.integrationBtn}>
                    <Text style={styles.integrationText}>Conectar com Google</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.integrationBtn}>
                    <Text style={styles.integrationText}>Conectar com Outlook</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.integrationBtn}>
                    <Text style={styles.integrationText}>Importar .ICS</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: { paddingTop: 60, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    backButton: { padding: 8 },
    stepperContainer: { flexDirection: 'row', gap: 8 },
    stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.border },
    stepDotActive: { backgroundColor: theme.colors.accent, width: 24 },
    content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingBottom: 60 },
    iconWrap: { marginBottom: 32, padding: 24, backgroundColor: 'rgba(108, 92, 231, 0.1)', borderRadius: 100 },
    title: { fontFamily: theme.typography.fontFamilies.bold, fontSize: theme.typography.sizes.h2, color: theme.colors.textPrimary, marginBottom: 12 },
    subtitle: { fontFamily: theme.typography.fontFamilies.regular, fontSize: theme.typography.sizes.body, color: theme.colors.textSecondary, textAlign: 'center', lineHeight: 24, marginBottom: 40 },
    integrationBtn: { backgroundColor: theme.colors.surface, width: '100%', padding: 16, borderRadius: theme.borderRadius.md, borderWidth: 1, borderColor: theme.colors.border, marginBottom: 12, alignItems: 'center' },
    integrationText: { fontFamily: theme.typography.fontFamilies.medium, color: theme.colors.textPrimary, fontSize: theme.typography.sizes.body }
});
