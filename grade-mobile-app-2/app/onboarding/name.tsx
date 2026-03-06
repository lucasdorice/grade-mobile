import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius } from '../../src/theme';
import PrimaryButton from '../../src/components/PrimaryButton';
import StepperDots from '../../src/components/StepperDots';
import { useAppStore } from '../../src/store/useAppStore';

export default function NameScreen() {
    const router = useRouter();
    const { setStudentName } = useAppStore();
    const [name, setName] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handleNext = async () => {
        const trimmed = name.trim();
        if (!trimmed) return;
        await setStudentName(trimmed);
        router.push('/onboarding/courses');
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View style={styles.stepperContainer}>
                    <StepperDots totalSteps={3} currentStep={1} />
                </View>

                <View style={styles.content}>
                    <Text style={styles.title}>Como podemos te chamar?</Text>

                    <TextInput
                        style={[styles.input, isFocused && styles.inputFocused]}
                        placeholder="Seu nome"
                        placeholderTextColor={colors.textTertiary}
                        value={name}
                        onChangeText={setName}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        autoFocus
                        returnKeyType="next"
                        onSubmitEditing={handleNext}
                    />
                </View>

                <View style={styles.footer}>
                    <PrimaryButton
                        label="Próximo"
                        onPress={handleNext}
                        disabled={!name.trim()}
                    />
                    <TouchableOpacity
                        style={styles.backBtn}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.backText}>Voltar</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    flex: {
        flex: 1,
        paddingHorizontal: spacing.lg,
    },
    stepperContainer: {
        paddingTop: spacing.xl,
        alignItems: 'center',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        ...typography.headingLg,
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    input: {
        width: '100%',
        height: 56,
        backgroundColor: colors.surface,
        borderWidth: 1.5,
        borderColor: colors.border,
        borderRadius: radius.md,
        paddingHorizontal: spacing.md,
        ...typography.body,
        color: colors.textPrimary,
    },
    inputFocused: {
        borderColor: colors.accent,
    },
    footer: {
        paddingBottom: spacing.xl,
    },
    backBtn: {
        alignItems: 'center',
        paddingVertical: spacing.md,
    },
    backText: {
        ...typography.bodySm,
        color: colors.textSecondary,
    },
});
