import React, { useCallback, useMemo, forwardRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { theme } from '../theme';
import { BookOpen, CheckSquare, CalendarPlus, NotebookPen, X } from 'lucide-react-native';

interface AddActionSheetProps {
    onClose: () => void;
    onSelectAction: (action: 'task' | 'class' | 'calendar' | 'notes') => void;
}

export const AddActionSheet = forwardRef<BottomSheet, AddActionSheetProps>(
    ({ onClose, onSelectAction }, ref) => {
        // Snap points: O quão alto a folha deve ir.
        const snapPoints = useMemo(() => ['52%'], []);

        // Função para renderizar o fundo escurecido atrás do modal
        const renderBackdrop = useCallback(
            (props: any) => (
                <BottomSheetBackdrop
                    {...props}
                    disappearsOnIndex={-1}
                    appearsOnIndex={0}
                    opacity={0.6}
                />
            ),
            []
        );

        return (
            <BottomSheet
                ref={ref}
                index={-1} // Inicia escondido
                snapPoints={snapPoints}
                enablePanDownToClose={true}
                onClose={onClose}
                backdropComponent={renderBackdrop}
                backgroundStyle={styles.bottomSheetBackground}
                handleIndicatorStyle={styles.handleIndicator}
            >
                <BottomSheetView style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Adicionar novo</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X color={theme.colors.textSecondary} size={20} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.content}>
                        <TouchableOpacity
                            style={styles.actionItem}
                            onPress={() => onSelectAction('task')}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.iconBox, { backgroundColor: 'rgba(108, 92, 231, 0.15)' }]}>
                                <CheckSquare color={theme.colors.accent} size={24} />
                            </View>
                            <View style={styles.actionTexts}>
                                <Text style={styles.actionTitle}>Nova Tarefa</Text>
                                <Text style={styles.actionSubtitle}>Adicionar uma entrega pendente</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionItem}
                            onPress={() => onSelectAction('class')}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.iconBox, { backgroundColor: 'rgba(0, 184, 148, 0.15)' }]}>
                                <BookOpen color={theme.colors.success} size={24} />
                            </View>
                            <View style={styles.actionTexts}>
                                <Text style={styles.actionTitle}>Nova Disciplina</Text>
                                <Text style={styles.actionSubtitle}>Cadastrar matéria e horários</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionItem}
                            onPress={() => onSelectAction('calendar')}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.iconBox, { backgroundColor: 'rgba(253, 203, 110, 0.15)' }]}>
                                <CalendarPlus color={theme.colors.warning} size={24} />
                            </View>
                            <View style={styles.actionTexts}>
                                <Text style={styles.actionTitle}>Importar Calendário</Text>
                                <Text style={styles.actionSubtitle}>Sincronizar grade pendente</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionItem}
                            onPress={() => onSelectAction('notes')}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.iconBox, { backgroundColor: 'rgba(116, 185, 255, 0.15)' }]}>
                                <NotebookPen color={theme.colors.info} size={24} />
                            </View>
                            <View style={styles.actionTexts}>
                                <Text style={styles.actionTitle}>Minhas Anotações</Text>
                                <Text style={styles.actionSubtitle}>Ver diário de bordo completo</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </BottomSheetView>
            </BottomSheet>
        );
    }
);

const styles = StyleSheet.create({
    bottomSheetBackground: {
        backgroundColor: theme.colors.surfaceElevated,
        borderTopLeftRadius: theme.borderRadius.lg,
        borderTopRightRadius: theme.borderRadius.lg,
    },
    handleIndicator: {
        backgroundColor: theme.colors.border,
        width: 40,
    },
    container: {
        flex: 1,
        paddingHorizontal: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        marginTop: 8,
    },
    title: {
        fontFamily: theme.typography.fontFamilies.bold,
        fontSize: theme.typography.sizes.h2,
        color: theme.colors.textPrimary,
    },
    closeButton: {
        padding: 8,
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.full,
    },
    content: {
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
        padding: 16,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginBottom: 12,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: theme.borderRadius.sm,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    actionTexts: {
        flex: 1,
    },
    actionTitle: {
        fontFamily: theme.typography.fontFamilies.semiBold,
        fontSize: theme.typography.sizes.body,
        color: theme.colors.textPrimary,
        marginBottom: 2,
    },
    actionSubtitle: {
        fontFamily: theme.typography.fontFamilies.regular,
        fontSize: theme.typography.sizes.caption,
        color: theme.colors.textSecondary,
    }
});
