import React, { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { theme } from '../../theme';
import { TaskItem } from '../../components/TaskItem';
import { Plus } from 'lucide-react-native';
import { AddActionSheet } from '../../components/AddActionSheet';
import BottomSheet from '@gorhom/bottom-sheet';
import { fetchTasks, toggleTaskCompletion, TaskWithCourse } from '../../database/queries';

export default function TasksScreen() {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const navigation = useNavigation<any>();
    const [tasks, setTasks] = useState<TaskWithCourse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const loadData = async () => {
        setIsLoading(true);
        try {
            const data = await fetchTasks();
            setTasks(data);
        } catch (error) {
            console.error("Erro ao puxar tarefas:", error);
            setTasks([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenAddSheet = () => {
        bottomSheetRef.current?.expand();
    };

    const handleCloseAddSheet = () => {
        bottomSheetRef.current?.close();
    };

    const handleSelectAction = (action: 'task' | 'class' | 'calendar' | 'notes') => {
        handleCloseAddSheet();
        setTimeout(() => {
            if (action === 'task') {
                navigation.navigate('CreateTask');
            } else if (action === 'class') {
                navigation.navigate('CreateCourse');
            } else if (action === 'notes') {
                navigation.navigate('AllNotes');
            }
        }, 150);
    };

    const handleToggleTask = async (id: string, newStatus: boolean) => {
        // UI Optimistic update
        setTasks(current =>
            current.map(task =>
                task.id === id ? { ...task, is_completed: newStatus } : task
            )
        );
        try {
            await toggleTaskCompletion(id, newStatus);
        } catch (e) {
            console.error("Erro update db:", e);
        }
    };

    const pendingCount = tasks.filter(t => !t.is_completed).length;

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Tarefas</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{pendingCount} pendentes</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.addButton} onPress={handleOpenAddSheet}>
                    <Plus color="#FFF" size={24} />
                </TouchableOpacity>
            </View>

            {/* Lista de Tarefas */}
            <ScrollView
                style={styles.content}
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                {isLoading ? (
                    <ActivityIndicator size="small" color={theme.colors.accent} style={{ marginTop: 20 }} />
                ) : (
                    <>
                        {tasks.filter(t => !t.is_completed).map(task => (
                            <TaskItem
                                key={task.id}
                                id={task.id}
                                title={task.title}
                                courseName={task.courseName}
                                courseColor={task.courseColor}
                                dueDate={task.due_date}
                                isCompleted={task.is_completed}
                                onToggle={handleToggleTask}
                            />
                        ))}

                        {tasks.filter(t => t.is_completed).length > 0 && (
                            <>
                                <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Concluídas</Text>
                                {tasks.filter(t => t.is_completed).map(task => (
                                    <TaskItem
                                        key={task.id}
                                        id={task.id}
                                        title={task.title}
                                        courseName={task.courseName}
                                        courseColor={task.courseColor}
                                        dueDate={task.due_date}
                                        isCompleted={task.is_completed}
                                        onToggle={handleToggleTask}
                                    />
                                ))}
                            </>
                        )}

                        {tasks.length === 0 && (
                            <Text style={{ color: theme.colors.textTertiary, textAlign: 'center', marginTop: 32 }}>
                                Nenhuma tarefa por agora. 🎉
                            </Text>
                        )}
                    </>
                )}
            </ScrollView>

            {/* Modal Bottom Sheet */}
            <AddActionSheet
                ref={bottomSheetRef}
                onClose={handleCloseAddSheet}
                onSelectAction={handleSelectAction}
            />
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    title: {
        fontFamily: theme.typography.fontFamilies.bold,
        fontSize: theme.typography.sizes.h1,
        color: theme.colors.textPrimary,
        marginBottom: 8,
    },
    badge: {
        backgroundColor: theme.colors.danger,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: theme.borderRadius.full,
        alignSelf: 'flex-start',
    },
    badgeText: {
        fontFamily: theme.typography.fontFamilies.bold,
        fontSize: 12,
        color: '#FFF',
    },
    addButton: {
        backgroundColor: theme.colors.accent,
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 24,
    },
    sectionTitle: {
        fontFamily: theme.typography.fontFamilies.semiBold,
        fontSize: theme.typography.sizes.h3,
        color: theme.colors.textPrimary,
        marginBottom: 16,
    }
});
