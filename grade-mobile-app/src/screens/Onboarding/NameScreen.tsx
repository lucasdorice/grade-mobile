import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../theme';
import { useAppStore } from '../../store/useAppStore';
import { ChevronRight } from 'lucide-react-native';

export default function NameScreen() {
    const navigation = useNavigation<any>();
    const [name, setName] = useState('');
    const setUserName = useAppStore(state => state.setUserName);
    const completeOnboarding = useAppStore(state => state.completeOnboarding);

    const handleNext = () => {
        if (name.trim()) {
            setUserName(name.trim());
            // Ao invés de concluir, guiamos o usuário adiante na escolha de Aulas
            navigation.navigate('SetupMethodScreen');
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.header}>
                {/* Stepper */}
                <View style={styles.stepperContainer}>
                    <View style={[styles.stepDot, { marginRight: 8 }]} />
                    <View style={[styles.stepDot, styles.stepDotActive, { marginRight: 8 }]} />
                    <View style={[styles.stepDot, { marginRight: 8 }]} />
                    <View style={styles.stepDot} />
                </View>
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>Como podemos te chamar?</Text>
                <TextInput
                    style={[styles.input, name.length > 0 && styles.inputActive]}
                    placeholder="Seu nome"
                    placeholderTextColor={theme.colors.textTertiary}
                    value={name}
                    onChangeText={setName}
                    autoFocus
                    selectionColor={theme.colors.accent}
                />
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.primaryButton, !name.trim() && styles.primaryButtonDisabled]}
                    onPress={handleNext}
                    disabled={!name.trim()}
                    activeOpacity={0.8}
                >
                    <Text style={styles.primaryButtonText}>Próximo</Text>
                    <ChevronRight color="#FFF" size={20} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.secondaryButtonText}>Voltar</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
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
        alignItems: 'center',
    },
    stepperContainer: {
        flexDirection: 'row',
        marginBottom: 40,
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
        justifyContent: 'center',
    },
    title: {
        fontFamily: theme.typography.fontFamilies.semiBold,
        fontSize: theme.typography.sizes.h2,
        color: theme.colors.textPrimary,
        textAlign: 'center',
        marginBottom: 32,
    },
    input: {
        height: 60,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        paddingHorizontal: 20,
        fontSize: theme.typography.sizes.h3,
        fontFamily: theme.typography.fontFamilies.medium,
        color: theme.colors.textPrimary,
        textAlign: 'center',
    },
    inputActive: {
        borderColor: theme.colors.accent,
        backgroundColor: theme.colors.surfaceElevated,
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
        marginBottom: 16,
    },
    primaryButtonDisabled: {
        opacity: 0.5,
    },
    primaryButtonText: {
        fontFamily: theme.typography.fontFamilies.semiBold,
        fontSize: theme.typography.sizes.body,
        color: '#FFFFFF',
        marginRight: 8,
    },
    secondaryButton: {
        alignItems: 'center',
        paddingVertical: 8,
    },
    secondaryButtonText: {
        fontFamily: theme.typography.fontFamilies.medium,
        fontSize: theme.typography.sizes.body,
        color: theme.colors.textSecondary,
    }
});
