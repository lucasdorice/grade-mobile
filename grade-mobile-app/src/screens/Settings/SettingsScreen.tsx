import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { theme } from '../../theme';
import { clearDatabase } from '../../database/queries';
import { Trash2, Moon, Sun, BookCopy, CalendarDays, Edit2, Check } from 'lucide-react-native';
import { useAppStore } from '../../store/useAppStore';
import { useNavigation } from '@react-navigation/native';

export default function SettingsScreen() {
    const navigation = useNavigation<any>();
    const { themeMode, toggleTheme, semester, setSemester } = useAppStore();

    const [isEditingSem, setIsEditingSem] = React.useState(false);
    const [tempSem, setTempSem] = React.useState(semester);

    const handleToggleTheme = () => {
        toggleTheme();
        Alert.alert(
            "Reinício Necessário",
            "Foi alternado para o modo " + (themeMode === 'dark' ? 'CLARO' : 'ESCURO') + ". Por favor, feche e abra o aplicativo para recarregar com as novas cores.",
            [{ text: "Entendi", style: "default" }]
        );
    };

    const handleSaveSemester = () => {
        setSemester(tempSem);
        setIsEditingSem(false);
    };
    const handleReset = () => {
        Alert.alert(
            "Limpar Dados",
            "Tem certeza que deseja apagar todas as matérias, tarefas e grade? Isso não pode ser desfeito.",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Sim, limpar tudo",
                    style: "destructive",
                    onPress: async () => {
                        await clearDatabase();
                        Alert.alert("Sucesso", "Banco de dados zerado. Reinicie o aplicativo.");
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Configurações</Text>
            </View>

            {/* Opções de Conta */}
            <View style={styles.content}>
                <Text style={styles.sectionTitle}>Preferências</Text>

                {/* Semestre */}
                <View style={styles.card}>
                    <View style={styles.cardHeaderFlex}>
                        <View style={styles.cardIconBox}>
                            <CalendarDays color={theme.colors.accent} size={20} />
                        </View>
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={styles.cardTitle}>Semestre Atual</Text>
                            {isEditingSem ? (
                                <View style={styles.inlineEditBox}>
                                    <TextInput
                                        style={styles.inlineInput}
                                        value={tempSem}
                                        onChangeText={setTempSem}
                                        autoFocus
                                    />
                                    <TouchableOpacity onPress={handleSaveSemester}>
                                        <Check color={theme.colors.success} size={20} />
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <Text style={styles.cardSubTitle}>{semester}</Text>
                            )}
                        </View>
                        {!isEditingSem && (
                            <TouchableOpacity onPress={() => setIsEditingSem(true)}>
                                <Edit2 color={theme.colors.textSecondary} size={18} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Tema */}
                <View style={styles.card}>
                    <View style={styles.cardHeaderFlex}>
                        <View style={[styles.cardIconBox, { backgroundColor: 'rgba(253, 203, 110, 0.2)' }]}>
                            {themeMode === 'dark' ? (
                                <Moon color="#FDCB6E" size={20} />
                            ) : (
                                <Sun color="#FDCB6E" size={20} />
                            )}
                        </View>
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={styles.cardTitle}>Aparência</Text>
                            <Text style={styles.cardSubTitle}>Modo {themeMode === 'dark' ? 'Escuro' : 'Claro'} Ativo</Text>
                        </View>
                        <TouchableOpacity style={styles.toggleBtn} onPress={handleToggleTheme}>
                            <Text style={styles.toggleBtnText}>Alterar</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Gestão Escolar</Text>

                <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('GerenciarDisciplinasModal' as any)}>
                    <View style={styles.cardHeaderFlex}>
                        <View style={[styles.cardIconBox, { backgroundColor: 'rgba(116, 185, 255, 0.2)' }]}>
                            <BookCopy color="#74B9FF" size={20} />
                        </View>
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={styles.cardTitle}>Gerenciar Disciplinas</Text>
                            <Text style={styles.cardSubTitle}>Ver, editar ou deletar matérias</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Zona de Perigo */}
                <Text style={styles.sectionTitle}>Zona de Perigo</Text>

                <TouchableOpacity style={styles.dangerButton} onPress={handleReset}>
                    <Trash2 color="#FF7675" size={20} style={{ marginRight: 12 }} />
                    <View>
                        <Text style={styles.dangerTitle}>Apagar todos os dados</Text>
                        <Text style={styles.dangerSubtitle}>Remove matérias, tarefas e anotações</Text>
                    </View>
                </TouchableOpacity>
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
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    title: {
        fontFamily: theme.typography.fontFamilies.bold,
        fontSize: theme.typography.sizes.h1,
        color: theme.colors.textPrimary,
    },
    content: {
        paddingHorizontal: 24,
    },
    card: {
        backgroundColor: theme.colors.surface,
        padding: 16,
        borderRadius: theme.borderRadius.md,
    },
    cardTitle: {
        fontFamily: theme.typography.fontFamilies.semiBold,
        fontSize: theme.typography.sizes.body,
        color: theme.colors.textPrimary,
        marginBottom: 4,
    },
    cardSubTitle: {
        fontFamily: theme.typography.fontFamilies.regular,
        fontSize: theme.typography.sizes.bodySmall,
        color: theme.colors.textSecondary,
    },
    sectionTitle: {
        fontFamily: theme.typography.fontFamilies.semiBold,
        fontSize: theme.typography.sizes.body,
        color: theme.colors.textSecondary,
        marginTop: 24,
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    cardHeaderFlex: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardIconBox: {
        width: 40,
        height: 40,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.accentBg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    inlineEditBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    inlineInput: {
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.accent,
        color: theme.colors.textPrimary,
        fontFamily: theme.typography.fontFamilies.medium,
        fontSize: theme.typography.sizes.bodySmall,
        paddingVertical: 2,
        marginRight: 10,
    },
    toggleBtn: {
        backgroundColor: theme.colors.surfaceElevated,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    toggleBtnText: {
        fontFamily: theme.typography.fontFamilies.medium,
        fontSize: 12,
        color: theme.colors.textPrimary,
    },
    dangerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        padding: 16,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: 'rgba(255, 118, 117, 0.3)',
    },
    dangerTitle: {
        fontFamily: theme.typography.fontFamilies.medium,
        fontSize: theme.typography.sizes.body,
        color: '#FF7675',
    },
    dangerSubtitle: {
        fontFamily: theme.typography.fontFamilies.regular,
        fontSize: theme.typography.sizes.caption,
        color: theme.colors.textTertiary || '#888',
        marginTop: 2,
    }
});
