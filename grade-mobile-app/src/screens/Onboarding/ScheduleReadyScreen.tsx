import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../theme';
import { useAppStore } from '../../store/useAppStore';
import { CheckCircle2, ChevronRight } from 'lucide-react-native';

export default function ScheduleReadyScreen() {
    const completeOnboarding = useAppStore(state => state.completeOnboarding);

    const handleFinish = () => {
        completeOnboarding();
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconWrap}>
                    <CheckCircle2 color={theme.colors.success || '#00B894'} size={80} />
                </View>

                <Text style={styles.title}>Tudo Pronto!</Text>
                <Text style={styles.subtitle}>
                    Sua grade semanal foi configurada com sucesso. Você já pode visualizar suas tarefas e anotações.
                </Text>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleFinish}
                    activeOpacity={0.8}
                >
                    <Text style={styles.primaryButtonText}>Ir para a Home</Text>
                    <ChevronRight color="#FFF" size={20} />
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
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    iconWrap: {
        marginBottom: 32,
    },
    title: {
        fontFamily: theme.typography.fontFamilies.bold,
        fontSize: theme.typography.sizes.h1,
        color: theme.colors.textPrimary,
        marginBottom: 16,
    },
    subtitle: {
        fontFamily: theme.typography.fontFamilies.regular,
        fontSize: theme.typography.sizes.body,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
    },
    footer: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    primaryButton: {
        backgroundColor: theme.colors.accent,
        paddingVertical: 16,
        borderRadius: theme.borderRadius.full,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryButtonText: {
        fontFamily: theme.typography.fontFamilies.semiBold,
        fontSize: theme.typography.sizes.body,
        color: '#FFFFFF',
        marginRight: 8,
    }
});
