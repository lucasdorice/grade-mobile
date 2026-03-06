import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../theme';
import { Image as ImageIcon, Plus, ChevronLeft } from 'lucide-react-native';

export default function SetupMethodScreen() {
    const navigation = useNavigation<any>();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <ChevronLeft color={theme.colors.textPrimary} size={28} />
                </TouchableOpacity>
                <View style={styles.stepperContainer}>
                    <View style={styles.stepDot} />
                    <View style={styles.stepDot} />
                    <View style={[styles.stepDot, styles.stepDotActive]} />
                    <View style={styles.stepDot} />
                </View>
                <View style={{ width: 44 }} /> {/* Espaçador */}
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>Como quer adicionar suas aulas?</Text>
                <Text style={styles.subtitle}>
                    Você pode sincronizar um calendário existente ou adicionar cada matéria manualmente.
                </Text>

                <View style={styles.optionsContainer}>
                    {/* Opção 1: Importar Foto da Grade */}
                    <TouchableOpacity
                        style={styles.optionCard}
                        onPress={() => navigation.navigate('ImageImportScreen')}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.iconWrap, { backgroundColor: 'rgba(108, 92, 231, 0.1)' }]}>
                            <ImageIcon color={theme.colors.accent} size={28} />
                        </View>
                        <View style={styles.optionTextContainer}>
                            <Text style={styles.optionTitle}>Importar foto da grade</Text>
                            <Text style={styles.optionSubtitle}>Envie uma imagem da sua tabela de horários.</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Opção 2: Adicionar Manualmente (Loop) */}
                    <TouchableOpacity
                        style={styles.optionCard}
                        onPress={() => navigation.navigate('AddMultipleCoursesScreen')}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.iconWrap, { backgroundColor: 'rgba(0, 184, 148, 0.1)' }]}>
                            <Plus color={theme.colors.success || '#00B894'} size={28} />
                        </View>
                        <View style={styles.optionTextContainer}>
                            <Text style={styles.optionTitle}>Adicionar manualmente</Text>
                            <Text style={styles.optionSubtitle}>Crie do zero escolhendo cores e horários.</Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backButton: {
        padding: 8,
    },
    stepperContainer: {
        flexDirection: 'row',
    },
    stepDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.colors.border,
    },
    stepDotActive: {
        backgroundColor: theme.colors.accent,
        width: 24,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
    },
    title: {
        fontFamily: theme.typography.fontFamilies.bold,
        fontSize: theme.typography.sizes.h2,
        color: theme.colors.textPrimary,
        marginBottom: 12,
    },
    subtitle: {
        fontFamily: theme.typography.fontFamilies.regular,
        fontSize: theme.typography.sizes.body,
        color: theme.colors.textSecondary,
        lineHeight: 24,
        marginBottom: 40,
    },
    optionsContainer: {
    },
    optionCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginBottom: 16,
    },
    iconWrap: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    optionTextContainer: {
        flex: 1,
    },
    optionTitle: {
        fontFamily: theme.typography.fontFamilies.semiBold,
        fontSize: theme.typography.sizes.body,
        color: theme.colors.textPrimary,
        marginBottom: 4,
    },
    optionSubtitle: {
        fontFamily: theme.typography.fontFamilies.regular,
        fontSize: theme.typography.sizes.bodySmall,
        color: theme.colors.textSecondary,
        lineHeight: 20,
    }
});
