import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { theme } from '../../theme';
import { ChevronRight, ChevronLeft, Plus, Check } from 'lucide-react-native';
import { fetchCourses, Course } from '../../database/queries';

export default function AddMultipleCoursesScreen() {
    const navigation = useNavigation<any>();
    const [courses, setCourses] = useState<Course[]>([]);

    // Cada vez que a tela recebe foco (ex: ao voltar do modal CreateCourse), recarrega
    useFocusEffect(
        useCallback(() => {
            fetchCourses().then(setCourses);
        }, [])
    );

    const handleFinish = () => {
        navigation.navigate('ScheduleReadyScreen');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ChevronLeft color={theme.colors.textPrimary} size={24} />
                </TouchableOpacity>

                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{courses.length} adicionada{courses.length !== 1 ? 's' : ''}</Text>
                </View>

                <TouchableOpacity
                    style={[styles.finishBtn, courses.length === 0 && { opacity: 0.4 }]}
                    onPress={handleFinish}
                    disabled={courses.length === 0}
                >
                    <Text style={styles.finishBtnText}>Concluir</Text>
                    <ChevronRight color="#FFF" size={16} />
                </TouchableOpacity>
            </View>

            <View style={styles.titleSection}>
                <Text style={styles.title}>Suas disciplinas</Text>
                <Text style={styles.subtitle}>
                    Adicione todas as matérias do seu semestre. Ao salvar, você pode adicionar outra.
                </Text>
            </View>

            {/* Lista de disciplinas já adicionadas */}
            {courses.length > 0 && (
                <FlatList
                    data={courses}
                    keyExtractor={item => item.id}
                    style={styles.courseList}
                    renderItem={({ item }) => (
                        <View style={styles.courseItem}>
                            <View style={[styles.colorDot, { backgroundColor: item.color_hex }]} />
                            <Text style={styles.courseName}>{item.name}</Text>
                            <Check color={theme.colors.success} size={16} />
                        </View>
                    )}
                />
            )}

            {/* Botão de adicionar */}
            <View style={styles.bottomArea}>
                <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => navigation.navigate('CreateCourse', { isOnboarding: true })}
                    activeOpacity={0.8}
                >
                    <Plus color="#FFF" size={22} />
                    <Text style={styles.addBtnText}>Adicionar Matéria</Text>
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
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backBtn: {
        padding: 8,
    },
    badge: {
        backgroundColor: theme.colors.surfaceElevated,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    badgeText: {
        fontFamily: theme.typography.fontFamilies.medium,
        color: theme.colors.textPrimary,
        fontSize: 13,
    },
    finishBtn: {
        backgroundColor: theme.colors.accent,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },
    finishBtnText: {
        fontFamily: theme.typography.fontFamilies.semiBold,
        color: '#FFF',
        fontSize: 14,
        marginRight: 4,
    },
    titleSection: {
        paddingHorizontal: 24,
        marginTop: 32,
        marginBottom: 24,
    },
    title: {
        fontFamily: theme.typography.fontFamilies.bold,
        fontSize: theme.typography.sizes.h2,
        color: theme.colors.textPrimary,
        marginBottom: 8,
    },
    subtitle: {
        fontFamily: theme.typography.fontFamilies.regular,
        fontSize: theme.typography.sizes.bodySmall,
        color: theme.colors.textSecondary,
        lineHeight: 20,
    },
    courseList: {
        paddingHorizontal: 24,
        maxHeight: 260,
    },
    courseItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        padding: 16,
        borderRadius: theme.borderRadius.sm,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    colorDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 14,
    },
    courseName: {
        flex: 1,
        fontFamily: theme.typography.fontFamilies.medium,
        fontSize: theme.typography.sizes.body,
        color: theme.colors.textPrimary,
    },
    bottomArea: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    addBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.accent,
        paddingVertical: 16,
        borderRadius: theme.borderRadius.full,
    },
    addBtnText: {
        fontFamily: theme.typography.fontFamilies.semiBold,
        color: '#FFF',
        fontSize: theme.typography.sizes.body,
        marginLeft: 10,
    },
});
