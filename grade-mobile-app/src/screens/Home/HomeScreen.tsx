import React, { useRef, useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useAppStore } from '../../store/useAppStore';
import { theme } from '../../theme';
import { AulaCard } from '../../components/AulaCard';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { AddActionSheet } from '../../components/AddActionSheet';
import BottomSheet from '@gorhom/bottom-sheet';
import { fetchClassesByDay } from '../../database/queries';

export default function HomeScreen() {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const navigation = useNavigation<any>();
    const [classes, setClasses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const userName = useAppStore(state => state.userName);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    const navDateString = selectedDate.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });
    const formattedDate = navDateString.charAt(0).toUpperCase() + navDateString.slice(1);

    const isToday = new Date().toDateString() === selectedDate.toDateString();

    useFocusEffect(
        useCallback(() => {
            // Reinicia a Opacidade e Posição pro frame inicial
            fadeAnim.setValue(0);
            slideAnim.setValue(20);

            // Toca a animação simultânea nos 500ms
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                })
            ]).start();
            loadData();
        }, [selectedDate]) // Re-roda animação de reload ao trocar de dia
    );

    useEffect(() => {
        loadData();
    }, [selectedDate]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const data = await fetchClassesByDay(selectedDate.getDay());
            setClasses(data);
        } catch (error) {
            console.error("Erro ao puxar cards da home:", error);
            // Evitar trava de loading infinito
            setClasses([]);
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

    return (
        <View style={styles.container}>
            {/* Header Animado - Apenas Textos */}
            <View style={styles.header}>
                <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
                    <Text style={styles.title}>{userName ? `Olá, ${userName} 👋` : 'Olá! 👋'}</Text>
                    <Text style={styles.subtitle}>{formattedDate}</Text>
                </Animated.View>
                <TouchableOpacity style={styles.addButton} onPress={handleOpenAddSheet}>
                    <Plus color="#FFF" size={24} />
                </TouchableOpacity>
            </View>

            {/* Controle de Datas (Date Picker Horizontal Simplificado) */}
            <View style={styles.datePickerContainer}>
                <TouchableOpacity onPress={() => {
                    const prev = new Date(selectedDate);
                    prev.setDate(prev.getDate() - 1);
                    setSelectedDate(prev);
                }}>
                    <ChevronLeft color={theme.colors.textSecondary} size={28} />
                </TouchableOpacity>

                <View style={styles.dateCenterWrap}>
                    <Text style={styles.sectionTitle}>{isToday ? 'Hoje' : navDateString.split(',')[0]}</Text>
                    <Text style={styles.dateSubtext}>{selectedDate.toLocaleDateString('pt-BR')}</Text>
                </View>

                <TouchableOpacity onPress={() => {
                    const next = new Date(selectedDate);
                    next.setDate(next.getDate() + 1);
                    setSelectedDate(next);
                }}>
                    <ChevronRight color={theme.colors.textSecondary} size={28} />
                </TouchableOpacity>
            </View>

            {/* Timeline de Aulas */}
            <ScrollView
                style={styles.content}
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                {isLoading ? (
                    <ActivityIndicator size="small" color={theme.colors.accent} style={{ marginTop: 20 }} />
                ) : (
                    <>
                        {classes.map((aula, index) => (
                            <AulaCard
                                key={aula.id}
                                {...aula}
                                onPress={(id) => navigation.navigate('ClassScreen', {
                                    scheduleId: id,
                                    courseId: aula.courseId,
                                    courseName: aula.courseName,
                                    courseColor: aula.courseColor,
                                    startTime: aula.startTime,
                                    endTime: aula.endTime
                                })}
                            />
                        ))}

                        {classes.length === 0 && (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyStateEmoji}>🏖️</Text>
                                <Text style={styles.emptyStateText}>
                                    Que dia bom! Nenhuma aula hoje.
                                </Text>
                            </View>
                        )}
                    </>
                )}
            </ScrollView>

            {/* Modal Bottom Sheet Compartilhado */}
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
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    addButton: {
        backgroundColor: theme.colors.accent,
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontFamily: theme.typography.fontFamilies.bold,
        fontSize: theme.typography.sizes.h1,
        color: theme.colors.textPrimary,
    },
    subtitle: {
        fontFamily: theme.typography.fontFamilies.regular,
        fontSize: theme.typography.sizes.body,
        color: theme.colors.textSecondary,
        marginTop: 4,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    datePickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: theme.colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    dateCenterWrap: {
        alignItems: 'center',
    },
    dateSubtext: {
        fontFamily: theme.typography.fontFamilies.regular,
        fontSize: theme.typography.sizes.caption,
        color: theme.colors.textTertiary,
        marginTop: 2,
    },
    sectionTitle: {
        fontFamily: theme.typography.fontFamilies.semiBold,
        fontSize: theme.typography.sizes.h3,
        color: theme.colors.textPrimary,
        textTransform: 'capitalize',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 64,
        padding: 24,
    },
    emptyStateEmoji: {
        fontSize: 48,
        marginBottom: 16,
    },
    emptyStateText: {
        fontFamily: theme.typography.fontFamilies.medium,
        fontSize: theme.typography.sizes.body,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
    }
});
