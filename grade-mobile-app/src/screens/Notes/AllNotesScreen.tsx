import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { theme } from '../../theme';
import { ArrowLeft, NotebookPen } from 'lucide-react-native';
import { fetchAllNotes } from '../../database/queries';

export default function AllNotesScreen() {
    const navigation = useNavigation<any>();
    const [notes, setNotes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            loadNotes();
        }, [])
    );

    const loadNotes = async () => {
        setIsLoading(true);
        try {
            const data = await fetchAllNotes();
            setNotes(data);
        } catch (e) {
            console.error('Erro ao carregar anotações:', e);
            setNotes([]);
        } finally {
            setIsLoading(false);
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.noteCard}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('ClassScreen', {
                courseId: item.courseId,
                courseName: item.courseName,
                courseColor: item.courseColor,
                startTime: '',
                endTime: '',
            })}
        >
            <View style={[styles.colorBar, { backgroundColor: item.courseColor }]} />
            <View style={styles.noteContent}>
                <Text style={styles.noteCourseName}>{item.courseName}</Text>
                <Text style={styles.noteDate}>{item.date}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ArrowLeft color={theme.colors.textPrimary} size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Diário de Bordo</Text>
                <View style={{ width: 40 }} />
            </View>

            {isLoading ? (
                <ActivityIndicator size="large" color={theme.colors.accent} style={{ marginTop: 40 }} />
            ) : notes.length === 0 ? (
                <View style={styles.emptyState}>
                    <NotebookPen color={theme.colors.textTertiary} size={48} />
                    <Text style={styles.emptyText}>Nenhuma anotação ainda.</Text>
                    <Text style={styles.emptySubtext}>Clique em uma aula do dia para começar a escrever.</Text>
                </View>
            ) : (
                <FlatList
                    data={notes}
                    keyExtractor={item => item.cardId}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                />
            )}
        </View>
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
        paddingTop: 50,
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        backgroundColor: theme.colors.surface,
    },
    backBtn: {
        padding: 8,
    },
    headerTitle: {
        fontFamily: theme.typography.fontFamilies.bold,
        fontSize: theme.typography.sizes.h2,
        color: theme.colors.textPrimary,
    },
    list: {
        padding: 24,
    },
    noteCard: {
        flexDirection: 'row',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        marginBottom: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    colorBar: {
        width: 6,
    },
    noteContent: {
        flex: 1,
        padding: 16,
    },
    noteCourseName: {
        fontFamily: theme.typography.fontFamilies.semiBold,
        fontSize: theme.typography.sizes.body,
        color: theme.colors.textPrimary,
        marginBottom: 4,
    },
    noteDate: {
        fontFamily: theme.typography.fontFamilies.regular,
        fontSize: theme.typography.sizes.caption,
        color: theme.colors.textSecondary,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    emptyText: {
        fontFamily: theme.typography.fontFamilies.semiBold,
        fontSize: theme.typography.sizes.h3,
        color: theme.colors.textSecondary,
        marginTop: 20,
        marginBottom: 8,
    },
    emptySubtext: {
        fontFamily: theme.typography.fontFamilies.regular,
        fontSize: theme.typography.sizes.bodySmall,
        color: theme.colors.textTertiary,
        textAlign: 'center',
        lineHeight: 20,
    }
});
