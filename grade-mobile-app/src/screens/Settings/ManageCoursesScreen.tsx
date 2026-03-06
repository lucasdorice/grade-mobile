import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../theme';
import { X, Trash2 } from 'lucide-react-native';
import { fetchCourses, deleteCourse, Course } from '../../database/queries';

export default function ManageCoursesScreen() {
    const navigation = useNavigation();
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const data = await fetchCourses();
            setCourses(data);
        } catch (error) {
            console.error("Erro ao carregar matérias:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = (courseId: string, courseName: string) => {
        Alert.alert(
            "Excluir Disciplina",
            `Tem certeza que deseja apagar '${courseName}'? Isso apagará a grade de horários e as anotações associadas.`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        await deleteCourse(courseId);
                        loadData();
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }: { item: Course }) => (
        <View style={styles.courseItem}>
            <View style={styles.courseInfoContainer}>
                <View style={[styles.colorIndicator, { backgroundColor: item.color_hex }]} />
                <View style={{ flex: 1 }}>
                    <Text style={styles.courseName}>{item.name}</Text>
                    {!!item.professor && <Text style={styles.courseProfessor}>{item.professor}</Text>}
                </View>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.id, item.name)} style={styles.deleteButton}>
                <Trash2 color="#FF7675" size={20} />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Gerenciar Disciplinas</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                    <X color={theme.colors.textPrimary} size={24} />
                </TouchableOpacity>
            </View>

            {isLoading ? (
                <ActivityIndicator size="large" color={theme.colors.accent} style={{ marginTop: 40 }} />
            ) : (
                <FlatList
                    data={courses}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>Nenhuma disciplina cadastrada ainda.</Text>
                    }
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
        paddingTop: 24,
        paddingHorizontal: 24,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        backgroundColor: theme.colors.surface,
    },
    headerTitle: {
        fontFamily: theme.typography.fontFamilies.bold,
        fontSize: theme.typography.sizes.h2,
        color: theme.colors.textPrimary,
    },
    closeButton: {
        padding: 4,
        backgroundColor: theme.colors.surfaceElevated,
        borderRadius: 20,
    },
    listContent: {
        padding: 24,
    },
    courseItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.surface,
        padding: 16,
        borderRadius: theme.borderRadius.md,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    courseInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    colorIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 16,
    },
    courseName: {
        fontFamily: theme.typography.fontFamilies.semiBold,
        fontSize: theme.typography.sizes.body,
        color: theme.colors.textPrimary,
    },
    courseProfessor: {
        fontFamily: theme.typography.fontFamilies.regular,
        fontSize: theme.typography.sizes.caption,
        color: theme.colors.textSecondary,
        marginTop: 2,
    },
    deleteButton: {
        padding: 8,
    },
    emptyText: {
        textAlign: 'center',
        fontFamily: theme.typography.fontFamilies.medium,
        color: theme.colors.textTertiary,
        marginTop: 40,
    }
});
